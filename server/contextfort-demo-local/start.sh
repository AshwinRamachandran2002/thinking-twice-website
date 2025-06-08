LOCAL=/Users/harshwardhanaggarwal/Desktop/project/thinking-twice-website/server/contextfort-demo-local

# python3 $LOCAL/proxy_state_manager.py > $LOCAL/proxy_state_manager.log 2>&1 &
# STATE_MANAGER_PID=$!

export SSL_CERT_FILE=/usr/local/share/ca-certificates/mitmproxy-ca.crt
export ELECTRON_TRUST_ENV_CA=1

mitmdump -s $LOCAL/copilot_proxy.py --listen-port 8000 > $LOCAL/mitmdump.log 2>&1 &
PROXY_PID=$!

sleep 2
if ! ps -p $PROXY_PID > /dev/null; then
    echo "❌ mitmdump failed to start. Logs:"
    cat $LOCAL/mitmdump.log
    exit 1
fi

trap "echo '🛑 Shutting down all processes...'; kill $PROXY_PID; kill $STATE_MANAGER_PID; exit" INT TERM

# Create a dedicated user for running code-server
NODE_EXTRA_CA_CERTS="$HOME/combined-ca-bundle.pem" \
HTTP_PROXY="http://127.0.0.1:8000" \
HTTPS_PROXY="http://127.0.0.1:8000" \
NO_PROXY="localhost,127.0.0.1,::1,api.openai.com,openai.com,oai.openai.com,auth0.openai.com" \
code

wait

kill $PROXY_PID
kill $STATE_MANAGER_PID
unset HTTP_PROXY HTTPS_PROXY NO_PROXY NODE_EXTRA_CA_CERTS
