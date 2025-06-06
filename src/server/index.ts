import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { supabase, sandboxSessionService } from './supabase-server';
import type { ApiKey } from './supabase-server';
import { flyDeploymentService } from '../lib/deploymentService';

interface RequestWithUser extends express.Request {
  user?: {
    email: string;
    stripeCustomerId: string;
  };
}

const app = express();
app.use(express.json());
app.use(cors());

// const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-05-28.basil',
// });

// Create checkout session
// app.post('/api/create-checkout-session', async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'API Access',
//               description: 'Unlimited API access',
//             },
//             unit_amount: 500, // $5.00
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${req.headers.origin}/get-api-access`,
//     });

//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).json({ error: 'Failed to create checkout session' });
//   }
// });

// // Webhook handler
// app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
  
//   try {
//     const event = stripe.webhooks.constructEvent(
//       req.body,
//       sig!,
//       process.env.VITE_STRIPE_WEBHOOK_SECRET!
//     );

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;
//       const customerEmail = session.customer_details?.email;
//       const customerId = session.customer;
      
//       if (customerEmail && customerId) {
//         // Check if user already has an API key
//         const { data: existingKey } = await supabase
//           .from('api_keys')
//           .select()
//           .eq('email', customerEmail)
//           .single();

//         if (!existingKey) {
//           // Create new API key
//           const apiKey = uuidv4();
//           const { error } = await supabase
//             .from('api_keys')
//             .insert({
//               email: customerEmail,
//               stripe_customer_id: customerId,
//               api_key: apiKey,
//               revoked: false
//             });

//           if (error) {
//             throw new Error('Failed to create API key');
//           }
//         }
//       }
//     }

//     res.json({ received: true });
//   } catch (error) {
//     console.error('Webhook error:', error);
//     res.status(400).json({ error: 'Webhook error' });
//   }
// });

// // Get API key
// app.get('/api/get-api-key', async (req: express.Request, res: express.Response) => {
//   try {
//     const sessionId = req.query.session_id as string;
//     if (!sessionId) {
//       return res.status(400).json({ error: 'No session ID provided' });
//     }

//     // Get session details from Stripe
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     const customerEmail = session.customer_details?.email;

//     if (!customerEmail) {
//       return res.status(404).json({ error: 'Customer email not found' });
//     }

//     // Get API key from Supabase
//     const { data: keyData, error } = await supabase
//       .from('api_keys')
//       .select('api_key')
//       .eq('email', customerEmail)
//       .eq('revoked', false)
//       .single();

//     if (error || !keyData) {
//       return res.status(404).json({ error: 'No API key found for this session' });
//     }

//     res.json({ apiKey: keyData.api_key });
//   } catch (error) {
//     console.error('Error retrieving API key:', error);
//     res.status(500).json({ error: 'Failed to retrieve API key' });
//   }
// });

// // Middleware to validate API key
// export async function validateApiKey(
//   req: RequestWithUser,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   const apiKey = req.headers['x-api-key'];

//   if (!apiKey || typeof apiKey !== 'string') {
//     return res.status(401).json({ error: 'API key is required' });
//   }

//   try {
//     const { data: keyData, error } = await supabase
//       .from('api_keys')
//       .select()
//       .eq('api_key', apiKey)
//       .eq('revoked', false)
//       .single();

//     if (error || !keyData) {
//       return res.status(403).json({ error: 'Invalid or revoked API key' });
//     }

//     // Add user data to request for use in route handlers
//     req.user = {
//       email: keyData.email,
//       stripeCustomerId: keyData.stripe_customer_id
//     };

//     next();
//   } catch (error) {
//     console.error('Error validating API key:', error);
//     return res.status(500).json({ error: 'Failed to validate API key' });
//   }
// }

// // Protected endpoint example
// app.get('/api/filter', validateApiKey, (req: RequestWithUser, res: express.Response) => {
//   // Your protected API logic here
//   res.json({ message: 'This is a protected endpoint', user: req.user });
// });

// // Test endpoint for security validation
// app.post('/api/test-security', validateApiKey, (req: RequestWithUser, res: express.Response) => {
//   try {
//     // Simple test response
//     res.json({ 
//       success: true,
//       message: 'Security validation successful',
//       userInfo: {
//         email: req.user?.email,
//         timestamp: new Date().toISOString()
//       }
//     });
//   } catch (error) {
//     console.error('Error in security test:', error);
//     res.status(500).json({ error: 'Internal server error during security test' });
//   }
// });

// Deploy sandbox server
app.post('/api/deploy-sandbox', async (req: express.Request, res: express.Response) => {
  try {
    const { userId, appName, password } = req.body;

    if (!userId || !appName || !password) {
      return res.status(400).json({ error: 'Missing required fields: userId, appName, password' });
    }

    // Create session record with pending status
    const session = await sandboxSessionService.createSession(
      userId,
      appName,
      `https://${appName}.fly.dev`,
      password,
      30
    );

    // Start deployment process asynchronously
    deployServer(session.id, appName, password);

    res.json({ 
      success: true, 
      sessionId: session.id,
      appName,
      status: 'deploying'
    });
  } catch (error) {
    console.error('Error deploying sandbox:', error);
    res.status(500).json({ error: 'Failed to deploy sandbox' });
  }
});

// Get deployment status
app.get('/api/deployment-status/:sessionId', async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId } = req.params;
    
    const { data: session, error } = await supabase
      .from('user_sandbox_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.id,
      appName: session.app_name,
      url: session.sandbox_url,
      status: session.deployment_status,
      timeRemaining: sandboxSessionService.getRemainingTime(session)
    });
  } catch (error) {
    console.error('Error getting deployment status:', error);
    res.status(500).json({ error: 'Failed to get deployment status' });
  }
});

// Destroy sandbox server
app.post('/api/destroy-sandbox', async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    const session = await sandboxSessionService.getSessionByAppName(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update status to destroying
    await sandboxSessionService.updateDeploymentStatus(session.id, 'destroying');

    // Destroy server asynchronously
    destroyServer(session.app_name, session.id);

    res.json({ success: true, message: 'Server destruction initiated' });
  } catch (error) {
    console.error('Error destroying sandbox:', error);
    res.status(500).json({ error: 'Failed to destroy sandbox' });
  }
});

// Async function to deploy server
async function deployServer(sessionId: string, appName: string, password: string) {
  try {
    await sandboxSessionService.updateDeploymentStatus(sessionId, 'deploying');
    
    const result = await flyDeploymentService.createServer({
      appName,
      region: 'sjc',
      password
    });

    await sandboxSessionService.updateDeploymentStatus(sessionId, 'running');
    
    // Schedule destruction after 30 minutes
    flyDeploymentService.scheduleDestruction(appName, 30 * 60 * 1000);
    
    console.log(`✅ Server deployed successfully: ${result.url}`);
  } catch (error) {
    console.error(`❌ Failed to deploy server ${appName}:`, error);
    await sandboxSessionService.updateDeploymentStatus(sessionId, 'failed');
  }
}

// Async function to destroy server
async function destroyServer(appName: string, sessionId: string) {
  try {
    await flyDeploymentService.destroyServer(appName);
    await sandboxSessionService.expireSession(sessionId);
    console.log(`✅ Server destroyed successfully: ${appName}`);
  } catch (error) {
    console.error(`❌ Failed to destroy server ${appName}:`, error);
  }
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
