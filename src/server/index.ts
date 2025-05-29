import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import type { ApiKey } from '../lib/supabase';

interface RequestWithUser extends express.Request {
  user?: {
    email: string;
    stripeCustomerId: string;
  };
}

const app = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'API Access',
              description: 'Unlimited API access',
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/get-api-access`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook handler
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.VITE_STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const customerId = session.customer;
      
      if (customerEmail && customerId) {
        // Check if user already has an API key
        const { data: existingKey } = await supabase
          .from('api_keys')
          .select()
          .eq('email', customerEmail)
          .single();

        if (!existingKey) {
          // Create new API key
          const apiKey = uuidv4();
          const { error } = await supabase
            .from('api_keys')
            .insert({
              email: customerEmail,
              stripe_customer_id: customerId,
              api_key: apiKey,
              revoked: false
            });

          if (error) {
            throw new Error('Failed to create API key');
          }
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Get API key
app.get('/api/get-api-key', async (req: express.Request, res: express.Response) => {
  try {
    const sessionId = req.query.session_id as string;
    if (!sessionId) {
      return res.status(400).json({ error: 'No session ID provided' });
    }

    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      return res.status(404).json({ error: 'Customer email not found' });
    }

    // Get API key from Supabase
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('email', customerEmail)
      .eq('revoked', false)
      .single();

    if (error || !keyData) {
      return res.status(404).json({ error: 'No API key found for this session' });
    }

    res.json({ apiKey: keyData.api_key });
  } catch (error) {
    console.error('Error retrieving API key:', error);
    res.status(500).json({ error: 'Failed to retrieve API key' });
  }
});

// Middleware to validate API key
export async function validateApiKey(
  req: RequestWithUser,
  res: express.Response,
  next: express.NextFunction
) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(401).json({ error: 'API key is required' });
  }

  try {
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select()
      .eq('api_key', apiKey)
      .eq('revoked', false)
      .single();

    if (error || !keyData) {
      return res.status(403).json({ error: 'Invalid or revoked API key' });
    }

    // Add user data to request for use in route handlers
    req.user = {
      email: keyData.email,
      stripeCustomerId: keyData.stripe_customer_id
    };

    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    return res.status(500).json({ error: 'Failed to validate API key' });
  }
}

// Protected endpoint example
app.get('/api/filter', validateApiKey, (req: RequestWithUser, res: express.Response) => {
  // Your protected API logic here
  res.json({ message: 'This is a protected endpoint', user: req.user });
});

export default app;
