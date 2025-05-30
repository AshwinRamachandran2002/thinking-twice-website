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

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. You will receive your API key via email shortly.
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
