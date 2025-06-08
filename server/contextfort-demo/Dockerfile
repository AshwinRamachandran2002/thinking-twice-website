###############################################################################
# ContextFort code-server + mitmproxy image (for Fly.io)                      #
###############################################################################
FROM codercom/code-server:latest

#--------------------------------------------------------------------
# 0. Run as root during build so we can install packages and set perms
#--------------------------------------------------------------------
USER root

#--------------------------------------------------------------------
# 1. Base OS packages
#--------------------------------------------------------------------
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3-venv python3-pip \
        xdg-utils gosu curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

#--------------------------------------------------------------------
# 2. Python virtual environment + tools
#--------------------------------------------------------------------
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:${PATH}"
RUN pip install --upgrade pip && \
    pip install mitmproxy openai watchdog python-dotenv

#--------------------------------------------------------------------
# 3. Non-interactive app code (kept out of the user’s HOME)
#--------------------------------------------------------------------
WORKDIR /opt/contextfort
COPY start.sh \
     check.py \
     copilot_proxy.py \
     proxy_state_manager.py \
     ./
RUN chmod 700 start.sh && chmod 600 *.py

#--------------------------------------------------------------------
# 4. Pre-load VSIX extensions into coder’s extension dir
#--------------------------------------------------------------------
ARG EXT_DIR=/home/coder/.local/share/code-server/extensions
COPY copilot-chat-0.27.2.vsix copilotproxy-0.0.1.vsix /tmp/
RUN mkdir -p "${EXT_DIR}" && chown -R coder:coder /home/coder/.local && \
    HOME=/home/coder su -c "code-server --install-extension /tmp/copilot-chat-0.27.2.vsix" coder && \
    HOME=/home/coder su -c "code-server --install-extension /tmp/copilotproxy-0.0.1.vsix" coder && \
    rm /tmp/*.vsix

#--------------------------------------------------------------------
# 5. Optional VS Code user settings (owned by coder)
#--------------------------------------------------------------------
COPY mcp_config.json /home/coder/.local/share/code-server/User/settings.json
RUN chown -R coder:coder /home/coder/.local/share/code-server/User

#--------------------------------------------------------------------
# 6. Entrypoint
#--------------------------------------------------------------------
ENTRYPOINT ["/opt/contextfort/start.sh"]
CMD []
