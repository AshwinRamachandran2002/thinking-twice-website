"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const config_1 = require("./config");
function activate(context) {
    // Initialize the proxy configuration
    config_1.ProxyConfig.initialize(context);
    // Register the startup command
    const startupCommand = vscode.commands.registerCommand('contextfort.startup', () => {
        const panel = vscode.window.createWebviewPanel('contextfortInstructions', '🚀 ContextFort Startup', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = getWebviewContent(config_1.ProxyConfig.isProxyEnabled());
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
            console.log('Received message from webview:', message);
            switch (message.command) {
                case 'toggleProxy':
                    console.log('Toggle command received from UI');
                    const newState = config_1.ProxyConfig.toggle();
                    console.log(`New proxy state after toggle: ${newState}`);
                    vscode.window.showInformationMessage(`Proxy filtering ${newState ? 'enabled' : 'disabled'}`);
                    // Update the webview with the new state
                    panel.webview.html = getWebviewContent(newState);
                    return;
            }
        }, undefined, context.subscriptions);
    });
    // Register the toggle proxy command
    const toggleCommand = vscode.commands.registerCommand('contextfort.toggleProxy', () => {
        const newState = config_1.ProxyConfig.toggle();
        vscode.window.showInformationMessage(`Proxy filtering ${newState ? 'enabled' : 'disabled'}`);
    });
    context.subscriptions.push(startupCommand, toggleCommand);
    // 🔥 Trigger the command on startup
    vscode.commands.executeCommand('contextfort.startup');
}
function deactivate() {
    // Clean up resources
}
function getWebviewContent(proxyEnabled = true) {
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
          
          // Add click handler to the entire toggle container for better UX
          document.querySelector('.toggle-container').addEventListener('click', function(e) {
            // Don't trigger if clicking on the checkbox directly (it will handle itself)
            if (e.target.id !== 'proxyToggle') {
              const checkbox = document.getElementById('proxyToggle');
              checkbox.checked = !checkbox.checked;
              
              // Manually dispatch message to VS Code
              vscode.postMessage({
                command: 'toggleProxy'
              });
            }
          });
          
          // Original checkbox change handler
          document.getElementById('proxyToggle').addEventListener('change', function(e) {
            console.log('Toggle checkbox changed:', e.target.checked);
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
//# sourceMappingURL=extension.js.map