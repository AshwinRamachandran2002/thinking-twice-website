import { loadStripe } from '@stripe/stripe-js';
import { apiKeyService } from './supabase';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePriceId = import.meta.env.VITE_STRIPE_PRICE_ID;

export const getStripe = async () => {
  if (!stripePublicKey) {
    throw new Error('Stripe public key is missing');
  }
  
  return await loadStripe(stripePublicKey);
};

export const createCheckoutSession = async (userId: string, userEmail: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userEmail,
        priceId: stripePriceId || 'price_1234567890',
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancelUrl: `${window.location.origin}/dashboard`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Get Stripe instance
    const stripe = await getStripe();
    
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    
    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Handle successful checkout and update API key payment status
export const handleCheckoutSuccess = async (sessionId: string, userId: string) => {
  try {
    // Validate the checkout session with your backend
    const response = await fetch(`/api/verify-checkout-session?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify checkout session');
    }

    const { success, error } = await response.json();
    
    if (!success) {
      throw new Error(error || 'Payment verification failed');
    }
    
    // Update the API key payment status
    await apiKeyService.updatePaymentStatus(userId, 'paid');
    
    return true;
  } catch (error) {
    console.error('Error handling checkout success:', error);
    throw error;
  }
};
