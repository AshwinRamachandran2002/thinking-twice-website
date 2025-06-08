#!/usr/bin/env bash
set -euo pipefail

echo "🔐 ContextFort container booting…"

###############################################################################
# 0. Helper: clean shutdown
###############################################################################
cleanup() {
  echo "🛑 Shutting down background processes…"
  kill "${PROXY_PID:-0}" "${STATE_MANAGER_PID:-0}" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

###############################################################################
# 1. Activate venv
###############################################################################
source /opt/venv/bin/activate
export PATH="/opt/venv/bin:${PATH}"

###############################################################################
# 2. Generate + trust mitmproxy CA (first-run only)
###############################################################################
if [[ ! -f /root/.mitmproxy/mitmproxy-ca-cert.pem ]]; then
  echo "🔑 Generating mitmproxy certificates…"
  mitmdump --listen-port 8000 >/tmp/mitmproxy-boot.log 2>&1 &
  TEMP_PID=$!
  sleep 5
  kill "$TEMP_PID" 2>/dev/null || true

  cp /root/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy-ca.crt
  update-ca-certificates

  cat /etc/ssl/certs/ca-certificates.crt /root/.mitmproxy/mitmproxy-ca-cert.pem \
      > /combined-ca-bundle.pem
fi

###############################################################################
# 3. Start proxy-side helpers (as root)
###############################################################################
echo "🚀 Starting proxy state manager…"
python3 /opt/contextfort/proxy_state_manager.py >/tmp/proxy_state_manager.log 2>&1 &
STATE_MANAGER_PID=$!

echo "🚀 Starting mitmdump proxy on :8000…"
export SSL_CERT_FILE=/usr/local/share/ca-certificates/mitmproxy-ca.crt
export ELECTRON_TRUST_ENV_CA=1
mitmdump -s /opt/contextfort/copilot_proxy.py --listen-port 8000 \
         >/tmp/mitmdump.log 2>&1 &
PROXY_PID=$!

sleep 2
if ! ps -p "$PROXY_PID" >/dev/null; then
  echo "❌ mitmdump failed to start – logs follow:"
  cat /tmp/mitmdump.log
  exit 1
fi

###############################################################################
# 4. One-shot MCP server registration (optional)
###############################################################################
echo "🔧 Installing MCP server endpoints in VS Code user settings…"
xdg-open "vscode:mcp/install?%7B%22mcp%22%3A%7B%22servers%22%3A%7B%22Github%22%3A%7B%22url%22%3A%22https%3A%2F%2Fmcp.pipedream.net%2F51335cca-89b0-4530-94ea-e6edc8c26879%2Fgithub%22%7D%7D%7D%7D" || true
xdg-open "vscode:mcp/install?%7B%22mcp%22%3A%7B%22servers%22%3A%7B%22Airtable%22%3A%7B%22url%22%3A%22https%3A%2F%2Fmcp.pipedream.net%2F51335cca-89b0-4530-94ea-e6edc8c26879%2Fairtable_oauth%22%7D%7D%7D%7D" || true

###############################################################################
# 5. Launch code-server as unprivileged “coder”
###############################################################################
echo "🖥️  Launching code-server on :8080 (user: coder)…"
exec gosu coder bash -c '
  export NODE_EXTRA_CA_CERTS="/usr/local/share/ca-certificates/mitmproxy-ca.crt"
  export HTTP_PROXY="http://127.0.0.1:8000"
  export HTTPS_PROXY="http://127.0.0.1:8000"
  export NO_PROXY="localhost,127.0.0.1,::1,api.openai.com,openai.com,oai.openai.com,auth0.openai.com"
  code-server --auth password --bind-addr 0.0.0.0:8080
'
