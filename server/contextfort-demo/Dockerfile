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
    /opt/venv/bin/pip install mitmproxy openai watchdog dotenv

# https://guhaogao.com/posts/2024-11-14/coder_copilot
# Environment variable will be injected by Fly.io secrets
ENV OPENAI_API_KEY=""

# Copy custom script and proxy logic
COPY start.sh /start.sh
COPY check.py /check.py
COPY copilot_proxy.py /copilot_proxy.py
COPY proxy_state_manager.py /proxy_state_manager.py
COPY copilot-chat-0.27.2.vsix /copilot-chat-0.27.2.vsix
COPY copilotproxy-0.0.1.vsix /copilotproxy-0.0.1.vsix
COPY .env /.env

# Install the extensions
# First, ensure the extension directory exists for the coder user
# RUN mkdir -p /home/coder/.local/share/code-server/extensions
# RUN chown -R coder:coder /home/coder/.local

# Install extensions as the coder user
# USER coder
RUN code-server --install-extension /copilot-chat-0.27.2.vsix
RUN code-server --install-extension /copilotproxy-0.0.1.vsix

# Switch back to root for further configuration
# USER root

# For MCP servers setup
RUN apt-get update && \
    apt-get install -y xdg-utils && \
    rm -rf /var/lib/apt/lists/* # Clean up apt cache
COPY mcp_config.json /home/coder/.local/share/code-server/User/settings.json

RUN chmod +x /start.sh

ENTRYPOINT []

CMD ["/start.sh"]
