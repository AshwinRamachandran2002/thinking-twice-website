// Configuration for the ContextFort proxy
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ProxyConfig {
  private static readonly CONFIG_KEY = 'contextfort.proxyEnabled';
  private static readonly CONFIG_FILE_NAME = 'proxy_config.json';
  private static configFilePath: string;

  static initialize(context: vscode.ExtensionContext) {
    this.configFilePath = path.join(context.extensionPath, this.CONFIG_FILE_NAME);
    this.ensureConfigFileExists();
  }

  private static ensureConfigFileExists() {
    if (!fs.existsSync(this.configFilePath)) {
      fs.writeFileSync(this.configFilePath, JSON.stringify({ enabled: true }, null, 2));
    }
  }

  static isProxyEnabled(): boolean {
    try {
      const configContent = fs.readFileSync(this.configFilePath, 'utf8');
      const config = JSON.parse(configContent);
      return config.enabled === true;
    } catch (error) {
      console.error('Error reading proxy config:', error);
      return true; // Default to enabled if there's an error
    }
  }

  static setProxyEnabled(enabled: boolean): void {
    try {
      fs.writeFileSync(this.configFilePath, JSON.stringify({ enabled }, null, 2));
      // Notify Python script about the change
      this.notifyProxyStateChange(enabled);
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

  private static notifyProxyStateChange(enabled: boolean) {
    // This would ideally communicate with the Python proxy script
    // For now, we'll just write to a file that the Python script can watch
    const stateFilePath = path.join(path.dirname(this.configFilePath), 'proxy_state.json');
    fs.writeFileSync(stateFilePath, JSON.stringify({ 
      enabled,
      timestamp: new Date().toISOString()
    }, null, 2));
  }
}
