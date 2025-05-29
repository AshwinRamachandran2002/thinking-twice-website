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
