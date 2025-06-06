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
function activate(context) {
    const disposable = vscode.commands.registerCommand('contextfort.startup', () => {
        const panel = vscode.window.createWebviewPanel('contextfortInstructions', '🚀 ContextFort Startup', vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(disposable);
    // 🔥 Trigger the command on startup
    vscode.commands.executeCommand('contextfort.startup');
}
function deactivate() { }
function getWebviewContent() {
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
//# sourceMappingURL=extension.js.map