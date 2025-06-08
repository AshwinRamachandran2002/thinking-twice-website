#!/bin/bash
set -e

echo "🔐 Setting up ContextFort..."

# Source the Python virtual environment
source /opt/venv/bin/activate
export PATH=/opt/venv/bin:$PATH

# First check if we need to set up mitmproxy certs (this must run as root)
if [ ! -f /root/.mitmproxy/mitmproxy-ca-cert.pem ]; then
    echo "🔑 Setting up mitmproxy certificates..."
    /opt/venv/bin/mitmdump --listen-port 8000 > /tmp/mitmproxy-boot.log 2>&1 &
    TEMP_PID=$!
    sleep 5
    kill $TEMP_PID 2>/dev/null || true

    # Trust the mitmproxy CA cert
    cp /root/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy-ca.crt
    update-ca-certificates

    # Create combined CA bundle
    cat /etc/ssl/certs/ca-certificates.crt > /combined-ca-bundle.pem
    cat /root/.mitmproxy/mitmproxy-ca-cert.pem >> /combined-ca-bundle.pem
fi

echo "🚀 Starting proxy state manager..."
/opt/venv/bin/python3 /proxy_state_manager.py > /tmp/proxy_state_manager.log 2>&1 &
STATE_MANAGER_PID=$!

echo "🚀 Starting mitmdump proxy..."
export SSL_CERT_FILE=/usr/local/share/ca-certificates/mitmproxy-ca.crt
export ELECTRON_TRUST_ENV_CA=1

# Start mitmdump with a timeout
/opt/venv/bin/mitmdump -s /copilot_proxy.py --listen-port 8000 > /tmp/mitmdump.log 2>&1 &
PROXY_PID=$!

sleep 2
if ! ps -p $PROXY_PID > /dev/null; then
    echo "❌ mitmdump failed to start. Logs:"
    cat /tmp/mitmdump.log
    exit 1
fi

trap "echo '🛑 Shutting down all processes...'; kill $PROXY_PID; kill $STATE_MANAGER_PID; kill $HEALTH_PID; exit" INT TERM

echo "🖥️ Starting code-server on 0.0.0.0:8080..."

# Create a dedicated user for running code-server
NODE_EXTRA_CA_CERTS="/usr/local/share/ca-certificates/mitmproxy-ca.crt" \
HTTP_PROXY="http://127.0.0.1:8000" \
HTTPS_PROXY="http://127.0.0.1:8000" \
NO_PROXY="localhost,127.0.0.1,::1" \
code-server --auth password --bind-addr 0.0.0.0:8080
# su -c "code-server --auth password --bind-addr 0.0.0.0:8080" coder

echo "🔧 Setting up MCP server configuration..."
xdg-open "vscode:mcp/install?%7B%22mcp%22%3A%7B%22servers%22%3A%7B%22Github%22%3A%7B%22url%22%3A%22https%3A%2F%2Fmcp.pipedream.net%2F51335cca-89b0-4530-94ea-e6edc8c26879%2Fgithub%22%7D%7D%7D%7D"
xdg-open "vscode:mcp/install?%7B%22mcp%22%3A%7B%22servers%22%3A%7B%22Airtable%22%3A%7B%22url%22%3A%22https%3A%2F%2Fmcp.pipedream.net%2F51335cca-89b0-4530-94ea-e6edc8c26879%2Fairtable_oauth%22%7D%7D%7D%7D"

wait

kill $PROXY_PID
kill $STATE_MANAGER_PID
unset HTTP_PROXY HTTPS_PROXY NO_PROXY NODE_EXTRA_CA_CERTS
