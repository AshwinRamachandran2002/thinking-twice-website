import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '../components/ui/button';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function GetApiAccess() {
  const [loading, setLoading] = useState(false);

  const handleBuyClick = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const { sessionId } = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Get API Access</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">API Access Package</h2>
        <p className="mb-4">Get unlimited access to our API for just $5</p>
        <ul className="list-disc list-inside mb-6">
          <li>Unlimited API calls</li>
          <li>24/7 Support</li>
          <li>Real-time access</li>
        </ul>
        <Button 
          onClick={handleBuyClick} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Buy API Access'}
        </Button>
      </div>
    </div>
  );
}
