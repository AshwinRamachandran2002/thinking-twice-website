import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface DeploymentConfig {
  appName: string;
  region: string;
  password: string;
}

export class FlyDeploymentService {
  private contextfortDemoPath: string;

  constructor() {
    // Path to the contextfort-demo directory
    this.contextfortDemoPath = path.join(process.cwd(), 'contextfort-demo');
  }

  /**
   * Creates and deploys a new Fly.io instance
   */
  async createServer(config: DeploymentConfig): Promise<{ url: string; appName: string }> {
    try {
      console.log(`🚀 Creating server: ${config.appName}`);
      
      // Change to contextfort-demo directory
      process.chdir(this.contextfortDemoPath);

      // Create temporary fly.toml with the new app name
      await this.createFlyToml(config.appName, config.region);

      // Launch the app without deploying first
      console.log(`📦 Launching app: ${config.appName}`);
      await execAsync(`flyctl launch --name ${config.appName} --region ${config.region} --no-deploy --copy-config`);

      // Set the password secret
      console.log(`🔐 Setting password for: ${config.appName}`);
      await execAsync(`flyctl secrets set PASSWORD=${config.password} --app ${config.appName}`);

      // Deploy the app
      console.log(`🚀 Deploying app: ${config.appName}`);
      await execAsync(`flyctl deploy --app ${config.appName}`);

      const url = `https://${config.appName}.fly.dev`;
      console.log(`✅ Server deployed successfully: ${url}`);

      return { url, appName: config.appName };
    } catch (error) {
      console.error(`❌ Failed to create server ${config.appName}:`, error);
      throw new Error(`Failed to deploy server: ${error}`);
    }
  }

  /**
   * Destroys a Fly.io instance
   */
  async destroyServer(appName: string): Promise<void> {
    try {
      console.log(`🗑️ Destroying server: ${appName}`);
      
      // Destroy the app
      await execAsync(`flyctl apps destroy ${appName} --yes`);
      
      console.log(`✅ Server destroyed successfully: ${appName}`);
    } catch (error) {
      console.error(`❌ Failed to destroy server ${appName}:`, error);
      throw new Error(`Failed to destroy server: ${error}`);
    }
  }

  /**
   * Checks if a server is running
   */
  async isServerRunning(appName: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`flyctl status --app ${appName}`);
      return stdout.includes('running');
    } catch (error) {
      // If the app doesn't exist or is not running, it will throw an error
      return false;
    }
  }

  /**
   * Creates a fly.toml file for the app
   */
  private async createFlyToml(appName: string, region: string): Promise<void> {
    const flyTomlContent = `# fly.toml app configuration file generated for ${appName}
#
# See https://fly.io/docs/reference/configuration/ for information about how to use this file.
#

app = '${appName}'
primary_region = '${region}'

[build]
  dockerfile = 'Dockerfile'

[[services]]
  protocol = 'tcp'
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ['http']

  [[services.ports]]
    port = 443
    handlers = ['tls', 'http']

[[vm]]
  memory = '16gb'
  cpu_kind = 'shared'
  cpus = 8
`;

    await fs.writeFile(path.join(this.contextfortDemoPath, 'fly.toml'), flyTomlContent);
  }

  /**
   * Schedules a server for destruction after a delay
   */
  scheduleDestruction(appName: string, delayMs: number): NodeJS.Timeout {
    console.log(`⏰ Scheduling destruction of ${appName} in ${delayMs / 1000} seconds`);
    
    return setTimeout(async () => {
      try {
        await this.destroyServer(appName);
      } catch (error) {
        console.error(`Failed to destroy scheduled server ${appName}:`, error);
      }
    }, delayMs);
  }
}

export const flyDeploymentService = new FlyDeploymentService();