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
exports.ProxyConfig = void 0;
// Configuration for the ContextFort proxy
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ProxyConfig {
    static STATE_FILE_PATH = '/tmp/contextfort_proxy_state.json';
    static initialize(context) {
        // Check if the state directory exists
        try {
            const stateDir = path.dirname(this.STATE_FILE_PATH);
            if (!fs.existsSync(stateDir)) {
                fs.mkdirSync(stateDir, { recursive: true });
            }
            // Ensure state file exists with default settings
            this.ensureStateFileExists();
        }
        catch (error) {
            console.error('Error initializing proxy config:', error);
            vscode.window.showErrorMessage('Failed to initialize proxy configuration');
        }
    }
    static ensureStateFileExists() {
        if (!fs.existsSync(this.STATE_FILE_PATH)) {
            fs.writeFileSync(this.STATE_FILE_PATH, JSON.stringify({
                enabled: true,
                timestamp: new Date().toISOString()
            }, null, 2));
        }
    }
    static isProxyEnabled() {
        try {
            const configContent = fs.readFileSync(this.STATE_FILE_PATH, 'utf8');
            const config = JSON.parse(configContent);
            // Explicitly check the boolean value to avoid type coercion issues
            const isEnabled = config.enabled === true;
            console.log(`Current proxy state read from file: ${isEnabled}`);
            return isEnabled;
        }
        catch (error) {
            console.error('Error reading proxy config:', error);
            return true; // Default to enabled if there's an error
        }
    }
    static setProxyEnabled(enabled) {
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
            }
            catch (permError) {
                console.error('Warning: Could not set file permissions:', permError);
            }
            // Verify the file was written correctly
            console.log(`Proxy state updated to: ${boolEnabled ? 'enabled' : 'disabled'}`);
        }
        catch (error) {
            console.error('Error updating proxy config:', error);
            vscode.window.showErrorMessage('Failed to update proxy configuration');
        }
    }
    static toggle() {
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
exports.ProxyConfig = ProxyConfig;
//# sourceMappingURL=config.js.map