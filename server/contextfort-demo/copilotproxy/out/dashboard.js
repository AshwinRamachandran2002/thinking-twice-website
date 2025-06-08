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
exports.SecurityDashboard = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Path to the security decisions folder
const SECURITY_LOGS_PATH = '/tmp/contextfort_logs/security_decisions';
class SecurityDashboard {
    panel;
    fileWatcher;
    context;
    securityLogs = [];
    autoRefreshEnabled = true;
    refreshInterval;
    constructor(context) {
        this.context = context;
    }
    open() {
        // If we already have a panel, show it
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
            return;
        }
        // Create a new panel
        this.panel = vscode.window.createWebviewPanel('securityDashboard', 'ContextFort Security Dashboard', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'media'))]
        });
        // Set up a file watcher to monitor for new security decisions
        this.setupFileWatcher();
        // Load initial security logs
        this.loadSecurityLogs();
        // Update the webview content
        this.updateWebview();
        // Register message handler
        this.panel.webview.onDidReceiveMessage(message => this.handleMessage(message), undefined, this.context.subscriptions);
        // Start auto-refresh
        this.startAutoRefresh();
        // Handle panel disposal
        this.panel.onDidDispose(() => {
            this.panel = undefined;
            if (this.fileWatcher) {
                this.fileWatcher.dispose();
                this.fileWatcher = undefined;
            }
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = undefined;
            }
        }, null, this.context.subscriptions);
    }
    setupFileWatcher() {
        // Watch for new files in the security decisions folder
        this.fileWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(SECURITY_LOGS_PATH, '*.json'));
        // When a new file is created, load it and update the webview
        this.fileWatcher.onDidCreate(uri => {
            this.loadSecurityLogs();
            this.updateWebview();
        });
        // When a file is changed, reload logs and update the webview
        this.fileWatcher.onDidChange(uri => {
            this.loadSecurityLogs();
            this.updateWebview();
        });
    }
    loadSecurityLogs() {
        try {
            // Make sure the directory exists
            if (!fs.existsSync(SECURITY_LOGS_PATH)) {
                fs.mkdirSync(SECURITY_LOGS_PATH, { recursive: true });
                return;
            }
            // Get all JSON files in the directory
            const files = fs.readdirSync(SECURITY_LOGS_PATH)
                .filter(file => file.endsWith('.json'))
                .sort()
                .reverse(); // Show newest first
            // Limit to last 50 logs to avoid performance issues
            const recentFiles = files.slice(0, 50);
            // Load each file and parse the JSON
            this.securityLogs = recentFiles.map(file => {
                const filePath = path.join(SECURITY_LOGS_PATH, file);
                const content = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(content);
            });
        }
        catch (error) {
            console.error('Error loading security logs:', error);
            vscode.window.showErrorMessage('Failed to load security logs');
        }
    }
    updateWebview() {
        if (!this.panel) {
            return;
        }
        // Update the webview content
        this.panel.webview.html = this.getWebviewContent();
    }
    getWebviewContent() {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ContextFort Security Dashboard</title>
            <style>
                body {
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    padding: 20px;
                    line-height: 1.6;
                    color: var(--vscode-editor-foreground);
                    background-color: var(--vscode-editor-background);
                }
                h1 {
                    color: var(--vscode-editor-foreground);
                    border-bottom: 1px solid var(--vscode-panel-border);
                    padding-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .dashboard-stats {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .stat-card {
                    background-color: var(--vscode-editor-inactiveSelectionBackground);
                    padding: 15px;
                    border-radius: 6px;
                    flex: 1;
                    min-width: 120px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .stat-card h3 {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    opacity: 0.8;
                }
                .stat-card p {
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                }
                .log-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 14px;
                }
                .log-table th, .log-table td {
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid var(--vscode-panel-border);
                }
                .log-table th {
                    background-color: var(--vscode-editor-inactiveSelectionBackground);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .log-table tr:hover {
                    background-color: var(--vscode-list-hoverBackground);
                }
                .decision-allowed {
                    color: #4caf50;
                    font-weight: bold;
                }
                .decision-blocked {
                    color: #f44336;
                    font-weight: bold;
                }
                .tool-call-details {
                    background-color: var(--vscode-textCodeBlock-background);
                    padding: 10px;
                    border-radius: 4px;
                    margin-top: 8px;
                    font-family: monospace;
                    font-size: 12px;
                    overflow-x: auto;
                    white-space: pre-wrap;
                }
                .log-row.expanded .tool-call-details {
                    display: block;
                }
                .log-row .tool-call-details {
                    display: none;
                }
                .expand-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--vscode-button-foreground);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    background-color: var(--vscode-button-background);
                }
                .expand-btn:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                .refresh-button {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .refresh-button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                .no-logs {
                    text-align: center;
                    padding: 40px;
                    font-style: italic;
                    color: var(--vscode-descriptionForeground);
                }
                .tool-call-badge {
                    display: inline-block;
                    background-color: var(--vscode-badge-background);
                    color: var(--vscode-badge-foreground);
                    border-radius: 12px;
                    padding: 2px 8px;
                    font-size: 11px;
                    margin-right: 5px;
                }
                .timestamp-badge {
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                }
                .auto-refresh {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-left: 20px;
                }
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
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
                    border-radius: 20px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 14px;
                    width: 14px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: var(--vscode-button-background);
                }
                input:checked + .slider:before {
                    transform: translateX(20px);
                }
                .time-taken {
                    font-family: monospace;
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="dashboard-header">
                <h1>🛡️ ContextFort Security Dashboard</h1>
                <div style="display: flex; align-items: center;">
                    <button id="refresh-btn" class="refresh-button">Refresh</button>
                    <div class="auto-refresh">
                        <label class="toggle-switch">
                            <input type="checkbox" id="auto-refresh" checked>
                            <span class="slider"></span>
                        </label>
                        <span>Auto-refresh</span>
                    </div>
                </div>
            </div>

            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Decisions</h3>
                    <p id="total-count">${this.securityLogs.length}</p>
                </div>
                <div class="stat-card">
                    <h3>Allowed</h3>
                    <p id="allowed-count">${this.securityLogs.filter(log => log.decision === 'allowed').length}</p>
                </div>
                <div class="stat-card">
                    <h3>Blocked</h3>
                    <p id="blocked-count">${this.securityLogs.filter(log => log.decision === 'blocked').length}</p>
                </div>
                <div class="stat-card">
                    <h3>Avg Time (sec)</h3>
                    <p id="avg-time">${this.calculateAverageTime()}</p>
                </div>
            </div>

            ${this.securityLogs.length === 0 ? `
                <div class="no-logs">
                    <p>No security decisions have been logged yet.</p>
                    <p>They will appear here automatically when Copilot makes tool calls.</p>
                </div>
            ` : `
                <table class="log-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Decision</th>
                            <th>Tool Calls</th>
                            <th>Time Taken</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.securityLogs.map((log, index) => `
                            <tr class="log-row" id="log-row-${index}">
                                <td>
                                    <div>${this.formatTimestamp(log.timestamp)}</div>
                                    <div class="timestamp-badge">${log.timestamp}</div>
                                </td>
                                <td class="decision-${log.decision}">${log.decision.toUpperCase()}</td>
                                <td>
                                    ${log.tool_calls.map(tool => `
                                        <div class="tool-call-badge">${tool.function.name}</div>
                                    `).join('')}
                                </td>
                                <td class="time-taken">${log.time_taken_seconds !== undefined ? `${log.time_taken_seconds.toFixed(2)}s` : 'N/A'}</td>
                                <td>
                                    <button class="expand-btn" onclick="toggleDetails(${index})">Details</button>
                                </td>
                            </tr>
                            <tr class="log-row-details" id="log-details-${index}" style="display: none;">
                                <td colspan="5">
                                    <div class="tool-call-details">
                                        <div><strong>URL:</strong> ${log.request_url}</div>
                                        <div><strong>Reason:</strong> ${log.reason || 'No reason provided'}</div>
                                        <div><strong>Time Taken:</strong> ${log.time_taken_seconds !== undefined ? `${log.time_taken_seconds.toFixed(2)} seconds` : 'Not available'}</div>
                                        <div><strong>Tool Calls:</strong></div>
                                        ${log.tool_calls.map(tool => `
                                            <div style="margin-top: 8px; padding-left: 16px;">
                                                <div><strong>Name:</strong> ${tool.function.name}</div>
                                                <div><strong>Arguments:</strong></div>
                                                <pre style="margin: 5px 0 0 0;">${this.formatJSON(tool.function.arguments)}</pre>
                                            </div>
                                        `).join('')}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `}

            <script>
                const vscode = acquireVsCodeApi();

                // Toggle details view
                function toggleDetails(index) {
                    const detailsRow = document.getElementById('log-details-' + index);
                    const currentDisplay = detailsRow.style.display;
                    detailsRow.style.display = currentDisplay === 'none' ? 'table-row' : 'none';
                }

                // Setup refresh button
                document.getElementById('refresh-btn').addEventListener('click', () => {
                    vscode.postMessage({ command: 'refresh' });
                });

                // Setup auto-refresh toggle
                const autoRefreshToggle = document.getElementById('auto-refresh');
                autoRefreshToggle.addEventListener('change', (e) => {
                    vscode.postMessage({ 
                        command: 'setAutoRefresh', 
                        enabled: e.target.checked 
                    });
                });

                // Set up auto-refresh (every 5 seconds)
                let refreshInterval;
                
                function startAutoRefresh() {
                    refreshInterval = setInterval(() => {
                        if (autoRefreshToggle.checked) {
                            vscode.postMessage({ command: 'refresh' });
                        }
                    }, 5000);
                }

                startAutoRefresh();
            </script>
        </body>
        </html>
        `;
    }
    formatTimestamp(timestamp) {
        // Convert timestamp like "2025-06-07_18-32-04" to a more readable format
        try {
            const [date, time] = timestamp.split('_');
            const [year, month, day] = date.split('-');
            const [hour, minute, second] = time.split('-');
            const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
            return formattedDate.toLocaleTimeString();
        }
        catch (e) {
            return timestamp;
        }
    }
    formatJSON(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            return JSON.stringify(obj, null, 2);
        }
        catch (e) {
            return jsonString;
        }
    }
    // Handle messages from the webview
    handleMessage(message) {
        switch (message.command) {
            case 'refresh':
                this.loadSecurityLogs();
                this.updateWebview();
                break;
            case 'setAutoRefresh':
                this.autoRefreshEnabled = message.enabled;
                if (message.enabled) {
                    this.startAutoRefresh();
                }
                else if (this.refreshInterval) {
                    clearInterval(this.refreshInterval);
                    this.refreshInterval = undefined;
                }
                break;
            case 'exportLogs':
                this.exportLogs();
                break;
            case 'clearLogs':
                this.clearLogs();
                break;
        }
    }
    // Register the message handler
    registerMessageHandler() {
        if (this.panel) {
            this.panel.webview.onDidReceiveMessage(message => this.handleMessage(message), undefined, this.context.subscriptions);
        }
    }
    // Start auto-refresh
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.refreshInterval = setInterval(() => {
            if (this.autoRefreshEnabled && this.panel) {
                this.loadSecurityLogs();
                this.updateWebview();
            }
        }, 5000); // Refresh every 5 seconds
    }
    // Calculate average time taken for security decisions
    calculateAverageTime() {
        if (this.securityLogs.length === 0) {
            return "N/A";
        }
        // Filter logs that have the time_taken_seconds field
        const logsWithTime = this.securityLogs.filter(log => log.time_taken_seconds !== undefined);
        if (logsWithTime.length === 0) {
            return "N/A";
        }
        // Calculate the average
        const totalTime = logsWithTime.reduce((sum, log) => sum + (log.time_taken_seconds || 0), 0);
        const avgTime = totalTime / logsWithTime.length;
        return avgTime.toFixed(2);
    }
    // Export logs to a file
    exportLogs() {
        try {
            const exportPath = path.join(this.context.globalStorageUri.fsPath, 'security-logs-export.json');
            fs.writeFileSync(exportPath, JSON.stringify(this.securityLogs, null, 2), 'utf8');
            vscode.window.showInformationMessage(`Security logs exported to ${exportPath}`);
        }
        catch (error) {
            console.error('Error exporting logs:', error);
            vscode.window.showErrorMessage('Failed to export security logs');
        }
    }
    // Clear logs (this only clears the UI display, not the actual log files)
    clearLogs() {
        this.securityLogs = [];
        this.updateWebview();
        vscode.window.showInformationMessage('Security logs cleared from dashboard');
    }
}
exports.SecurityDashboard = SecurityDashboard;
//# sourceMappingURL=dashboard.js.map