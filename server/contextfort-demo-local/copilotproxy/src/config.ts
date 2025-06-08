// Configuration for the ContextFort proxy
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ProxyConfig {
  private static readonly STATE_FILE_PATH = '/home/ashwin/Desktop/thinking-twice-website/server/contextfort-demo-local/contextfort_proxy_state.json';

  static initialize(context: vscode.ExtensionContext) {
    // Check if the state directory exists
    try {
      const stateDir = path.dirname(this.STATE_FILE_PATH);
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }
      
      // Ensure state file exists with default settings
      this.ensureStateFileExists();
    } catch (error) {
      console.error('Error initializing proxy config:', error);
      vscode.window.showErrorMessage('Failed to initialize proxy configuration');
    }
  }

  private static ensureStateFileExists() {
    if (!fs.existsSync(this.STATE_FILE_PATH)) {
      fs.writeFileSync(this.STATE_FILE_PATH, JSON.stringify({ 
        enabled: true,
        timestamp: new Date().toISOString()
      }, null, 2));
    }
  }

  static isProxyEnabled(): boolean {
    try {
      const configContent = fs.readFileSync(this.STATE_FILE_PATH, 'utf8');
      const config = JSON.parse(configContent);
      return config.enabled === true;
    } catch (error) {
      console.error('Error reading proxy config:', error);
      return true; // Default to enabled if there's an error
    }
  }

  static setProxyEnabled(enabled: boolean): void {
    try {
      fs.writeFileSync(this.STATE_FILE_PATH, JSON.stringify({ 
        enabled,
        timestamp: new Date().toISOString()
      }, null, 2));
    } catch (error) {
      console.error('Error updating proxy config:', error);
      vscode.window.showErrorMessage('Failed to update proxy configuration');
    }
  }

  static toggle(): boolean {
    const currentState = this.isProxyEnabled();
    this.setProxyEnabled(!currentState);
    return !currentState;
  }
}
