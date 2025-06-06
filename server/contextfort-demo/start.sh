#!/bin/bash
set -e

echo "🔐 Setting up mitmproxy CA..."

source /opt/venv/bin/activate

export PATH=/opt/venv/bin:$PATH

if [ ! -f /root/.mitmproxy/mitmproxy-ca-cert.pem ]; then
    /opt/venv/bin/mitmdump --listen-port 8000 > /tmp/mitmproxy-boot.log 2>&1 &
    TEMP_PID=$!
    sleep 5
    kill $TEMP_PID 2>/dev/null || true
fi

# Trust the mitmproxy CA cert
cp /root/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy-ca.crt
update-ca-certificates

# Optional: create combined CA bundle
cat /etc/ssl/certs/ca-certificates.crt > /root/combined-ca-bundle.pem
cat /root/.mitmproxy/mitmproxy-ca-cert.pem >> /root/combined-ca-bundle.pem

echo "🚀 Starting mitmdump proxy..."
export SSL_CERT_FILE=/root/.mitmproxy/mitmproxy-ca-cert.pem
export ELECTRON_TRUST_ENV_CA=1

/opt/venv/bin/mitmdump -s /copilot_proxy.py --listen-port 8000 > /tmp/mitmdump.log 2>&1 &
PROXY_PID=$!

sleep 2
if ! ps -p $PROXY_PID > /dev/null; then
    echo "❌ mitmdump failed to start. Logs:"
    cat /tmp/mitmdump.log
    exit 1
fi

trap "echo '🛑 Shutting down Copilot Proxy...'; kill $PROXY_PID; exit" INT TERM

echo "🖥️ Starting code-server on 0.0.0.0:8080..."

NODE_EXTRA_CA_CERTS="/root/.mitmproxy/mitmproxy-ca-cert.pem" \
HTTP_PROXY="http://127.0.0.1:8000" \
HTTPS_PROXY="http://127.0.0.1:8000" \
NO_PROXY="localhost,127.0.0.1,::1" \
code-server --auth password --bind-addr 0.0.0.0:8080

wait
kill $PROXY_PID
unset HTTP_PROXY HTTPS_PROXY NO_PROXY NODE_EXTRA_CA_CERTS
