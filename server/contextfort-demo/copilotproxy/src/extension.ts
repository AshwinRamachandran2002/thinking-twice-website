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

export function deactivate() {}

function getWebviewContent(proxyEnabled: boolean = true): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: sans-serif;
          padding: 20px;
          line-height: 1.5;
          max-width: 800px;
          margin: 0 auto;
        }
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
        .toggle-container {
          display: flex;
          align-items: center;
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
          margin-right: 15px;
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
          background-color: #ccc;
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
          background-color: #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        button {
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <h2>Welcome to ContextFort</h2>
      
      <div class="toggle-container">
        <label class="toggle-switch">
          <input type="checkbox" id="proxyToggle" ${proxyEnabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <div>
          <strong>Proxy Filtering: ${proxyEnabled ? 'Enabled' : 'Disabled'}</strong>
          <p>Toggle to ${proxyEnabled ? 'disable' : 'enable'} security filtering of Copilot responses</p>
        </div>
      </div>
      
      <p>Here are your setup instructions:</p>
      <pre><code>git clone https://github.com/ContextFort/demo.git
cd demo
bash start.sh</code></pre>
      <button onclick="navigator.clipboard.writeText('git clone https://github.com/ContextFort/demo.git\\ncd demo\\nbash start.sh')">
        📋 Copy to Clipboard
      </button>

      <script>
        (function() {
          const vscode = acquireVsCodeApi();
          document.getElementById('proxyToggle').addEventListener('change', function(e) {
            vscode.postMessage({
              command: 'toggleProxy'
            });
          });
        })();
      </script>
    </body>
    </html>
  `;
}
}
