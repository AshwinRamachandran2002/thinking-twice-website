import * as vscode from 'vscode';
import { ProxyConfig } from './config';

export function activate(context: vscode.ExtensionContext) {
  // Initialize the proxy configuration
  ProxyConfig.initialize(context);

  // Register the startup command
  const startupCommand = vscode.commands.registerCommand('contextfort.startup', () => {
    const panel = vscode.window.createWebviewPanel(
      'contextfortInstructions',
      '🚀 ContextFort Startup',
      vscode.ViewColumn.One,
      { 
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    panel.webview.html = getWebviewContent(ProxyConfig.isProxyEnabled());

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'toggleProxy':
            const newState = ProxyConfig.toggle();
            vscode.window.showInformationMessage(`Proxy filtering ${newState ? 'enabled' : 'disabled'}`);
            // Update the webview with the new state
            panel.webview.html = getWebviewContent(newState);
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  // Register the toggle proxy command
  const toggleCommand = vscode.commands.registerCommand('contextfort.toggleProxy', () => {
    const newState = ProxyConfig.toggle();
    vscode.window.showInformationMessage(`Proxy filtering ${newState ? 'enabled' : 'disabled'}`);
  });

  context.subscriptions.push(startupCommand, toggleCommand);

  // 🔥 Trigger the command on startup
  vscode.commands.executeCommand('contextfort.startup');
}

export function deactivate() {
  // Clean up resources
}

function getWebviewContent(proxyEnabled: boolean = true): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 20px;
          line-height: 1.6;
          color: var(--vscode-editor-foreground);
          background-color: var(--vscode-editor-background);
        }
        h2 {
          color: var(--vscode-editor-foreground);
          border-bottom: 1px solid var(--vscode-panel-border);
          padding-bottom: 10px;
        }
        pre {
          background-color: var(--vscode-textBlockQuote-background);
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 16px 0;
        }
        code {
          font-family: var(--vscode-editor-font-family);
          font-size: var(--vscode-editor-font-size);
        }
        .toggle-container {
          display: flex;
          align-items: center;
          margin: 20px 0;
          padding: 16px;
          border: 1px solid var(--vscode-panel-border);
          border-radius: 8px;
          background-color: var(--vscode-editor-background);
        }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
          margin-right: 16px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--vscode-button-secondaryBackground);
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: var(--vscode-button-background);
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .toggle-text {
          flex: 1;
        }
        .toggle-text strong {
          display: block;
          margin-bottom: 4px;
          font-size: 16px;
        }
        .toggle-text p {
          margin: 0;
          opacity: 0.8;
        }
        .status-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
          background-color: ${proxyEnabled ? 'green' : 'red'};
        }
        button {
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border: none;
          padding: 8px 16px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 8px;
        }
        button:hover {
          background-color: var(--vscode-button-hoverBackground);
        }
        .button-row {
          display: flex;
          margin-top: 16px;
        }
        .security-note {
          margin-top: 20px;
          padding: 12px;
          background-color: var(--vscode-inputValidation-infoBackground);
          border-left: 4px solid var(--vscode-inputValidation-infoBorder);
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <h2>🛡️ ContextFort Security Proxy</h2>
      
      <div class="toggle-container">
        <label class="toggle-switch">
          <input type="checkbox" id="proxyToggle" ${proxyEnabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <div class="toggle-text">
          <strong>
            <span class="status-indicator"></span>
            Security Filtering: ${proxyEnabled ? 'Enabled' : 'Disabled'}
          </strong>
          <p>When enabled, all Copilot API calls will be inspected for potentially harmful content</p>
        </div>
      </div>
      
      <div class="security-note">
        <strong>Note:</strong> Disabling security filtering allows all GitHub Copilot responses through without any security checks. Use with caution.
      </div>
      
      <h3>Setup Instructions</h3>
      <pre><code>git clone https://github.com/ContextFort/demo.git
cd demo
bash start.sh</code></pre>
      <div class="button-row">
        <button onclick="navigator.clipboard.writeText('git clone https://github.com/ContextFort/demo.git\\ncd demo\\nbash start.sh')">
          📋 Copy to Clipboard
        </button>
      </div>

      <script>
        (function() {
          const vscode = acquireVsCodeApi();
          
          document.getElementById('proxyToggle').addEventListener('change', function(e) {
            vscode.postMessage({
              command: 'toggleProxy'
            });
          });
        })();
        })();
      </script>
    </body>
    </html>
  `;
}
