import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function ApiDocs() {
  const copyScript = () => {
    const script = `
    #!/bin/bash
set -e

echo "🔍 Detecting platform..."
PLATFORM="$(uname)"

# 1. Ensure mitmproxy certificate is ready
if [ ! -f ~/.mitmproxy/mitmproxy-ca-cert.pem ]; then
  echo "🔧 Generating mitmproxy CA certificate..."
  mitmdump --version >/dev/null 2>&1 || { echo "❌ mitmproxy not installed. Run: pip install mitmproxy"; exit 1; }
  mitmdump --listen-port 0 & TEMP_PID=$!; sleep 2; kill $TEMP_PID
fi

# 2. Trust certificate
echo "🔐 Installing certificate..."
if [ "$PLATFORM" == "Darwin" ]; then
  if ! security find-certificate -c "mitmproxy" /Library/Keychains/System.keychain >/dev/null 2>&1; then
    sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ~/.mitmproxy/mitmproxy-ca-cert.pem
  fi
elif [ "$PLATFORM" == "Linux" ]; then
  sudo cp ~/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy-ca.crt
  sudo update-ca-certificates
else
  echo "❌ Unsupported platform: $PLATFORM"; exit 1
fi

# 3. Start the proxy
echo "🚦 Starting Copilot proxy..."
mitmdump -s copilot_proxy.py --listen-port 8080 &
PROXY_PID=$!

trap "echo '🛑 Stopping proxy...'; kill $PROXY_PID; exit" INT TERM

# 4. Launch VS Code with proxy settings
echo "🚀 Launching VS Code..."
NODE_EXTRA_CA_CERTS="$HOME/.mitmproxy/mitmproxy-ca-cert.pem" \
HTTP_PROXY="http://127.0.0.1:8080" \
HTTPS_PROXY="http://127.0.0.1:8080" \
NO_PROXY="localhost,127.0.0.1,::1" \
code .

wait

# 5. Cleanup
echo "🧼 Cleaning up..."
kill $PROXY_PID
unset HTTP_PROXY HTTPS_PROXY NO_PROXY NODE_EXTRA_CA_CERTS
echo "✅ Done."
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
            To use our Copilot Filtering Proxy, follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Purchase access from the <Link to="/get-api-access" className="underline text-blue-600">API Access Page</Link></li>
            <li>Receive your API key via email or the success page</li>
            <li>Run the proxy script with your API key to start filtering</li>
          </ol>
          <Link to="/get-api-access">
            <Button className="mt-2">Get API Access</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Start the Filtering Proxy</h2>
          <p className="mb-4">
            Use the following script to launch the Copilot Filtering Proxy:
          </p>
          <div className="bg-gray-800 text-gray-200 p-4 rounded-lg mb-4">
            <pre className="whitespace-pre-wrap text-sm">
              {`# Set your API key and start the proxy
export API_KEY="your_api_key_here"
./start_copilot_proxy.sh`}
            </pre>
          </div>
          <Button onClick={copyScript}>Copy Launch Script</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>The script launches <code>mitmdump</code> with our custom filter logic</li>
            <li>Intercepts and inspects GitHub Copilot API calls</li>
            <li>Sends them to our hosted API for validation</li>
            <li>Blocks or allows based on AI model output</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">API Endpoint (For Advanced Users)</h2>
          <div className="space-y-2">
            <p><strong>POST</strong> <code>/filter</code></p>
            <p>Used internally by the proxy to validate Copilot traffic. Accepts request metadata and returns <code>{"{ action: 'allow' | 'block' }"}</code>.</p>
            <p>You must include a valid <code>X-API-Key</code> header.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
