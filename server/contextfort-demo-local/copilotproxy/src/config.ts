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
      
      // Explicitly check the boolean value to avoid type coercion issues
      const isEnabled = config.enabled === true;
      console.log(`Current proxy state read from file: ${isEnabled}`);
      
      return isEnabled;
    } catch (error) {
      console.error('Error reading proxy config:', error);
      return true; // Default to enabled if there's an error
    }
  }

  static setProxyEnabled(enabled: boolean): void {
    try {
      // Force boolean conversion to ensure correct type
      const boolEnabled = Boolean(enabled);
      
      // Make sure we're writing the correct boolean value
      const configData = {
        enabled: boolEnabled,
        timestamp: new Date().toISOString()
      };
      
      // Write to temporary file first
      const tempFilePath = `${this.STATE_FILE_PATH}.tmp`;
      fs.writeFileSync(tempFilePath, JSON.stringify(configData, null, 2));
      
      // Rename the temp file to the actual file for atomic write
      fs.renameSync(tempFilePath, this.STATE_FILE_PATH);
      
      // Set permissions to ensure it's readable by everyone
      try {
        fs.chmodSync(this.STATE_FILE_PATH, 0o644);
      } catch (permError) {
        console.error('Warning: Could not set file permissions:', permError);
      }
      
      // Verify the file was written correctly
      console.log(`Proxy state updated to: ${boolEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating proxy config:', error);
      vscode.window.showErrorMessage('Failed to update proxy configuration');
    }
  }

  static toggle(): boolean {
    const currentState = this.isProxyEnabled();
    const newState = !currentState;
    
    // Set the new state and ensure it's written correctly
    this.setProxyEnabled(newState);
    
    // Verify the change was applied
    const updatedState = this.isProxyEnabled();
    if (updatedState !== newState) {
      console.error(`Failed to toggle proxy state. Expected: ${newState}, Got: ${updatedState}`);
    }
    
    return newState;
  }
}
