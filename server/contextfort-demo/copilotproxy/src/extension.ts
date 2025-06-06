import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('contextfort.startup', () => {
    const panel = vscode.window.createWebviewPanel(
      'contextfortInstructions',
      '🚀 ContextFort Startup',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getWebviewContent();
  });

  context.subscriptions.push(disposable);

  // 🔥 Trigger the command on startup
  vscode.commands.executeCommand('contextfort.startup');
}

export function deactivate() {}

function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <body style="font-family: sans-serif; padding: 20px;">
      <h2>Welcome to ContextFort</h2>
      <p>Here are your setup instructions:</p>
      <pre><code>git clone https://github.com/ContextFort/demo.git
cd demo
bash start.sh</code></pre>
      <button onclick="navigator.clipboard.writeText('git clone https://github.com/ContextFort/demo.git\\ncd demo\\nbash start.sh')">
        📋 Copy to Clipboard
      </button>
    </body>
    </html>
  `;
}
