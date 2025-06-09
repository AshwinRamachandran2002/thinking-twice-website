import * as vscode from 'vscode';
import { ProxyConfig } from './config';
import { SecurityDashboard } from './dashboard';

export async function activate(context: vscode.ExtensionContext) {
  // Initialize the proxy configuration
  ProxyConfig.initialize(context);
  
  // Create the security dashboard
  const securityDashboard = new SecurityDashboard(context);

  // Register the startupcopilot command to open GitHub Copilot
  vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');


  // Register the startup command
  const startupCommand = vscode.commands.registerCommand('contextfort.startup', () => {
    const panel = vscode.window.createWebviewPanel(
      'contextfortInstructions',
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
        console.log('Received message from webview:', message);
        switch (message.command) {
          case 'toggleProxy':
            console.log('Toggle command received from UI');
            const newState = ProxyConfig.toggle();
            console.log(`New proxy state after toggle: ${newState}`);
            vscode.window.showInformationMessage(`Proxy filtering ${newState ? 'enabled' : 'disabled'}`);
            // Update the webview with the new state
            panel.webview.html = getWebviewContent(newState);
            return;
          case 'openDashboard':
            vscode.commands.executeCommand('contextfort.openDashboard');
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
  
  // Register the security dashboard command
  const dashboardCommand = vscode.commands.registerCommand('contextfort.openDashboard', () => {
    securityDashboard.open();
  });

  // Register webview message handler
  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer('securityDashboard', {
      async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        webviewPanel.webview.html = 'Loading...';
        securityDashboard.open();
      }
    })
  );

  // Register the message handler for the security dashboard
  securityDashboard.registerMessageHandler();

  context.subscriptions.push(startupCommand, toggleCommand, dashboardCommand);

  // When the extension activates on fly.io deployment:
  // 1. Open ContextFort instructions and dashboard
  await vscode.commands.executeCommand('contextfort.openDashboard');
  
  await vscode.commands.executeCommand('workbench.action.openSettingsJson');
  await vscode.commands.executeCommand('contextfort.startup');

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
        .card {
          margin-top: 20px;
          padding: 16px;
          border: 1px solid var(--vscode-panel-border);
          border-radius: 8px;
          background-color: var(--vscode-editor-inactiveSelectionBackground);
        }
        .card h3 {
          margin-top: 0;
          margin-bottom: 12px;
        }
        .card-actions {
          margin-top: 12px;
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
      
      <div class="card">
        <h3>📊 Security Dashboard</h3>
        <p>View detailed information about security decisions made by the proxy.</p>
        <div class="card-actions">
          <button id="openDashboardBtn">Open Dashboard</button>
        </div>
      </div>
      
      <div class="security-note">
        <strong>Note:</strong> Disabling security filtering allows all GitHub Copilot responses through without any security checks. Use with caution.
      </div>
      
      <h3>🚀 Quick Setup Guide</h3>
      <div class="setup-card">
        <div class="setup-step">
          <span class="step-number">1</span>
          <div class="step-content">
            <h4>Configure GitHub Copilot</h4>
            <p>Login to GitHub Copilot </p> 
            <p>Switch to agent mode and select Claude 3.5 Sonnet </p>
            <p>Your personal access tokens are encrypted by vscode.</p>
          </div>
        </div>

        <div class="setup-step">
          <span class="step-number">2</span>
          <div class="step-content">
            <h4>Start the MCP Server</h4>
            <p>Click the "Start" button in the settings.json file that's currently open. This will initialize the Model Context Protocol server.</p>
          </div>
        </div>
        
        <div class="setup-step">
          <span class="step-number">3</span>
          <div class="step-content">
            <h4>Try this Sample Prompt</h4>
            <pre><code>use github mcp tool to get latest issue summary from https://github.com/johnriley9123/sample/issues/1</code></pre>
          </div>
        </div>

        <div class="setup-step">
          <span class="step-number">3</span>
          <div class="step-content">
            <h4>Use the toggle to turn on/off the proxy</h4>
            <h4>Check the dashboard to view security decisions</h4>
            <h4>If the tool call is blocked, copilot will throw an error message</h4>
          </div>
        </div>
      </div>
      
      <div class="button-row">
        <button onclick="navigator.clipboard.writeText('use github mcp tool to get latest issue summary from https://github.com/johnriley9123/sample/issues/1')">
          📋 Copy Sample Prompt
        </button>
      </div>
      
      <style>
        .setup-card {
          background-color: var(--vscode-editor-inactiveSelectionBackground);
          border-radius: 8px;
          padding: 20px;
          margin: 16px 0;
          border: 1px solid var(--vscode-panel-border);
        }
        .setup-step {
          display: flex;
          margin-bottom: 20px;
          align-items: flex-start;
        }
        .setup-step:last-child {
          margin-bottom: 0;
        }
        .step-number {
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .step-content {
          flex: 1;
        }
        .step-content h4 {
          margin: 0 0 8px 0;
          color: var(--vscode-editor-foreground);
        }
        .step-content p {
          margin: 0;
          opacity: 0.9;
        }
        .step-content pre {
          margin-top: 10px;
          background-color: var(--vscode-textBlockQuote-background);
          padding: 12px;
          border-radius: 4px;
        }
      </style>

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

          // Dashboard button click handler
          document.getElementById('openDashboardBtn').addEventListener('click', function() {
            vscode.postMessage({
              command: 'openDashboard'
            });
          });
        })();
      </script>
    </body>
    </html>
  `;
}
