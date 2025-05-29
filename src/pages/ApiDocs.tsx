import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function ApiDocs() {
  const copyScript = () => {
    const script = `
# Example Python script to test the API
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:5173'  # Change this to your production URL

# Test the security endpoint
response = requests.post(
    f'{BASE_URL}/api/test-security',
    headers={'x-api-key': API_KEY}
)

print('Security Test Response:', response.json())

# Example of using the filter endpoint
filter_response = requests.get(
    f'{BASE_URL}/api/filter',
    headers={'x-api-key': API_KEY}
)

print('Filter Endpoint Response:', filter_response.json())
`
    navigator.clipboard.writeText(script)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">API Documentation</h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            To access our proprietary LLM API, you'll need to obtain an API key. Follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Visit our API access page</li>
            <li>Complete the payment process</li>
            <li>Receive your API key via email</li>
          </ol>
          <Link to="/get-api-access">
            <Button className="mt-2">Get API Access</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Test Your API Key</h2>
          <p className="mb-4">
            Once you have your API key, you can use this sample script to test the security layer:
          </p>
          <div className="bg-gray-800 text-gray-200 p-4 rounded-lg mb-4">
            <pre className="whitespace-pre-wrap">
              {`import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:5173'  # Change this to your production URL

response = requests.post(
    f'{BASE_URL}/api/test-security',
    headers={'x-api-key': API_KEY}
)

print('Response:', response.json())`}
            </pre>
          </div>
          <Button onClick={copyScript}>Copy Test Script</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Security Test</h3>
              <p className="text-gray-600">POST /api/test-security</p>
              <p className="mt-2">Validates your API key and returns user information.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Filter Endpoint</h3>
              <p className="text-gray-600">GET /api/filter</p>
              <p className="mt-2">Example protected endpoint that requires API key authentication.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
