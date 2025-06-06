import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase, sandboxSessionService } from './lib/supabase';
import { flyDeploymentService } from './lib/deploymentService';

const app = express();
app.use(express.json());
app.use(cors());

// Deploy sandbox server
app.post('/api/deploy-sandbox', async (req: express.Request, res: express.Response) => {
  try {
    const { userId, appName, password } = req.body;

    if (!userId || !appName || !password) {
      return res.status(400).json({ error: 'Missing required fields: userId, appName, password' });
    }

    // Create session record with pending status
    const session = await sandboxSessionService.createSession(
      userId,
      appName,
      `https://${appName}.fly.dev`,
      password,
      30
    );

    // Start deployment process asynchronously
    deployServer(session.id, appName, password);

    res.json({ 
      success: true, 
      sessionId: session.id,
      appName,
      status: 'deploying'
    });
  } catch (error) {
    console.error('Error deploying sandbox:', error);
    res.status(500).json({ error: 'Failed to deploy sandbox' });
  }
});

// Get deployment status
app.get('/api/deployment-status/:sessionId', async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId } = req.params;
    
    const { data: session, error } = await supabase
      .from('user_sandbox_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.id,
      appName: session.app_name,
      url: session.sandbox_url,
      status: session.deployment_status,
      timeRemaining: sandboxSessionService.getRemainingTime(session)
    });
  } catch (error) {
    console.error('Error getting deployment status:', error);
    res.status(500).json({ error: 'Failed to get deployment status' });
  }
});

// Destroy sandbox server
app.post('/api/destroy-sandbox', async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    const session = await sandboxSessionService.getSessionByAppName(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update status to destroying
    await sandboxSessionService.updateDeploymentStatus(session.id, 'destroying');

    // Destroy server asynchronously
    destroyServer(session.app_name, session.id);

    res.json({ success: true, message: 'Server destruction initiated' });
  } catch (error) {
    console.error('Error destroying sandbox:', error);
    res.status(500).json({ error: 'Failed to destroy sandbox' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test Supabase connection
app.get('/test-supabase', async (req, res) => {
  try {
    console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.VITE_SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('user_sandbox_sessions')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      res.status(500).json({ error: 'Supabase connection failed', details: error });
    } else {
      res.json({ status: 'Supabase connected successfully', data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Supabase connection error', details: err });
  }
});

// Async function to deploy server
async function deployServer(sessionId: string, appName: string, password: string) {
  try {
    await sandboxSessionService.updateDeploymentStatus(sessionId, 'deploying');
    
    const result = await flyDeploymentService.createServer({
      appName,
      region: 'sjc',
      password
    });

    await sandboxSessionService.updateDeploymentStatus(sessionId, 'running');
    
    // Schedule destruction after 30 minutes
    flyDeploymentService.scheduleDestruction(appName, 30 * 60 * 1000);
    
    console.log(`✅ Server deployed successfully: ${result.url}`);
  } catch (error) {
    console.error(`❌ Failed to deploy server ${appName}:`, error);
    await sandboxSessionService.updateDeploymentStatus(sessionId, 'failed');
  }
}

// Async function to destroy server
async function destroyServer(appName: string, sessionId: string) {
  try {
    await flyDeploymentService.destroyServer(appName);
    await sandboxSessionService.expireSession(sessionId);
    console.log(`✅ Server destroyed successfully: ${appName}`);
  } catch (error) {
    console.error(`❌ Failed to destroy server ${appName}:`, error);
  }
}

// Start server
const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});

export default app;