FROM codercom/code-server:latest

USER root

# Install mitmproxy and Python packages
RUN apt-get update && \
    apt-get install -y python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/* # Clean up apt cache

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Install openai inside it
RUN /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install mitmproxy openai watchdog

# Environment variable will be injected by Fly.io secrets
ENV OPENAI_API_KEY=""

# Copy custom script and proxy logic
COPY start.sh /start.sh
COPY check.py /check.py
COPY copilot_proxy.py /copilot_proxy.py
COPY proxy_state_manager.py /proxy_state_manager.py
COPY copilot-chat-0.27.2.vsix /copilot-chat-0.27.2.vsix

# Install the Copilot Chat extension
RUN code-server --install-extension /copilot-chat-0.27.2.vsix

# Authenticate copilot and add mcp servers to settings file

COPY mcp_config.json /root/.local/share/code-server/User/settings.json
RUN chmod +x /start.sh

ENTRYPOINT []

CMD ["/start.sh"]

# change the user to coder
USER coder
