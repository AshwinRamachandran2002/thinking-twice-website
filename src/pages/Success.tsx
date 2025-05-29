<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your message has been successfully sent. Our founders will personally review and respond within 24-48 hours.
          </p>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="font-semibold text-lg text-blue-800 mb-3">What happens next?</h2>
              <ul className="text-blue-700 space-y-2">
                <li>→ Our team will analyze your security needs</li>
                <li>→ We'll schedule a personalized demo</li>
                <li>→ You'll receive a detailed security assessment</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="font-semibold text-lg text-gray-800 mb-3">Meanwhile, explore our research</h2>
              <div className="space-y-3">
                <a
                  href="https://arxiv.org/abs/2312.02119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-700"
                >
                  Read our TAP Algorithm Paper →
                </a>
                <a
                  href="https://storage.googleapis.com/deepmind-media/Security%20and%20Privacy/Gemini_Security_Paper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-700"
                >
                  Learn about agent security best practices →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
=======
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/ui/card';

export default function Success() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      fetch(`/api/get-api-key?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setApiKey(data.apiKey);
          }
        })
        .catch(err => {
          setError('Failed to retrieve API key. Please contact support.');
          console.error('Error:', err);
        });
    }
  }, [location]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6 bg-red-50">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-red-700">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
        {apiKey ? (
          <>
            <p className="mb-4">Your API key is:</p>
            <div className="bg-gray-100 p-4 rounded-md break-all font-mono">
              {apiKey}
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Please save this key somewhere safe. You won't be able to see it again.
            </p>
          </>
        ) : (
          <p>Loading your API key...</p>
        )}
      </Card>
    </div>
  );
}
>>>>>>> recover-branch
