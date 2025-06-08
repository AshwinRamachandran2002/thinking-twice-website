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
    static STATE_FILE_PATH = '/home/ashwin/Desktop/thinking-twice-website/server/contextfort-demo-local/contextfort_proxy_state.json';
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
            return config.enabled === true;
        }
        catch (error) {
            console.error('Error reading proxy config:', error);
            return true; // Default to enabled if there's an error
        }
    }
    static setProxyEnabled(enabled) {
        try {
            fs.writeFileSync(this.STATE_FILE_PATH, JSON.stringify({
                enabled,
                timestamp: new Date().toISOString()
            }, null, 2));
        }
        catch (error) {
            console.error('Error updating proxy config:', error);
            vscode.window.showErrorMessage('Failed to update proxy configuration');
        }
    }
    static toggle() {
        const currentState = this.isProxyEnabled();
        this.setProxyEnabled(!currentState);
        return !currentState;
    }
}
exports.ProxyConfig = ProxyConfig;
//# sourceMappingURL=config.js.map