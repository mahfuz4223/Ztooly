import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Enhanced security middleware
app.use((req, res, next) => {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Rate limiting (simple in-memory)
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  if (!global.rateLimiter) {
    global.rateLimiter = new Map();
  }
  
  const clientData = global.rateLimiter.get(clientId) || { requests: [], blocked: false };
  
  // Clean old requests (older than 1 minute)
  clientData.requests = clientData.requests.filter(time => now - time < 60000);
  
  // Check if blocked (block for 5 minutes after 100 requests in 1 minute)
  if (clientData.blocked && now - clientData.blockedAt < 300000) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }
  
  // Reset block if time has passed
  if (clientData.blocked && now - clientData.blockedAt >= 300000) {
    clientData.blocked = false;
    clientData.requests = [];
  }
  
  // Add current request
  clientData.requests.push(now);
  
  // Block if too many requests
  if (clientData.requests.length > 100) {
    clientData.blocked = true;
    clientData.blockedAt = now;
    global.rateLimiter.set(clientId, clientData);
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }
  
  global.rateLimiter.set(clientId, clientData);
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

let db;

// Initialize database connection
async function initDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Create necessary tables
async function createTables() {
  try {
    // Tool usage table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tool_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tool_id VARCHAR(255) NOT NULL,
        tool_name VARCHAR(255) NOT NULL,
        user_session VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        INDEX idx_tool_id (tool_id),
        INDEX idx_timestamp (timestamp),
        INDEX idx_user_session (user_session)
      )
    `);    // Daily stats table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS daily_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE UNIQUE NOT NULL,
        total_users INT DEFAULT 0,
        total_tool_uses INT DEFAULT 0,
        unique_tools_used INT DEFAULT 0,
        INDEX idx_date (date)
      )
    `);

    // User sessions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_visit DATETIME,
        total_tool_uses INT DEFAULT 0,
        ip_address VARCHAR(45),
        user_agent TEXT,
        INDEX idx_session_id (session_id),
        INDEX idx_first_visit (first_visit)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Admin authentication middleware
const isAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  const validAdminKey = process.env.ADMIN_KEY || 'admin123'; // Change this in production
  
  if (adminKey !== validAdminKey) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// Routes

// Public API root endpoint (hide sensitive info)
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Ztooly Analytics API - Tools Made Simple',
    version: '2.0.0',
    endpoints: {
      'GET /api/health': 'Health check',
      'POST /api/track-usage': 'Track tool usage',
      'GET /api/popular-tools': 'Get popular tools',
      'GET /api/daily-stats': 'Get daily statistics',
      'GET /api/tool-usage/:toolId': 'Get usage count for specific tool',
      'GET /api/client-info': 'Get basic client info'
    },
    timestamp: new Date().toISOString()
  });
});

// Enhanced IP extraction function
function extractRealIpAddress(req) {
  // List of possible IP headers in order of preference
  const ipHeaders = [
    'cf-connecting-ip', // Cloudflare
    'x-forwarded-for',  // Standard proxy header
    'x-real-ip',        // Nginx
    'x-client-ip',      // Apache
    'x-forwarded',      // Other proxies
    'forwarded-for',    // Legacy
    'forwarded'         // RFC 7239
  ];
  
  // Check headers for IP address
  for (const header of ipHeaders) {
    const headerValue = req.headers[header];
    if (headerValue) {
      // Handle comma-separated IPs (take the first one)
      const ip = headerValue.split(',')[0].trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }
  
  // Fallback to connection IP
  const connectionIp = req.connection?.remoteAddress 
    || req.socket?.remoteAddress
    || req.ip
    || req.connection?.socket?.remoteAddress;
  
  if (connectionIp) {
    return connectionIp;
  }
  
  return 'unknown';
}

// Clean and validate IP address
function cleanAndValidateIp(rawIp) {
  if (!rawIp || rawIp === 'unknown') {
    return 'unknown';
  }
  
  let cleanIp = rawIp.toString().trim();
  
  // Remove IPv6 prefix for IPv4-mapped addresses
  cleanIp = cleanIp.replace(/^::ffff:/, '');
  
  // Handle localhost variations
  if (cleanIp === '::1' || cleanIp === '127.0.0.1') {
    return 'localhost';
  }
  
  // Basic IP validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (ipv4Regex.test(cleanIp) || ipv6Regex.test(cleanIp)) {
    return cleanIp;
  }
  
  return cleanIp; // Return as-is if it doesn't match common patterns
}

// Track tool usage
app.post('/api/track-usage', async (req, res) => {
  try {
    const { toolId, toolName, userSession, userAgent, clientIp } = req.body;
    
    // Validate required fields
    if (!toolId || !toolName || !userSession) {
      return res.status(400).json({ error: 'Missing required fields: toolId, toolName, userSession' });
    }
      // Use client-provided IP first, then extract from headers
    const rawIpAddress = clientIp || extractRealIpAddress(req);
    const cleanIpAddress = cleanAndValidateIp(rawIpAddress);
    
    const safeUserAgent = userAgent || req.headers['user-agent'] || 'Unknown';
    
    console.log(`📊 Tracking: ${toolId} | IP: ${cleanIpAddress} (raw: ${rawIpAddress}) | Session: ${userSession.substring(0, 8)}...`);
    
    // Insert tool usage
    await db.execute(
      'INSERT INTO tool_usage (tool_id, tool_name, user_session, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [toolId, toolName, userSession, cleanIpAddress, safeUserAgent]
    );    // Update or insert user session
    await db.execute(`
      INSERT INTO user_sessions (session_id, ip_address, user_agent, total_tool_uses, last_visit) 
      VALUES (?, ?, ?, 1, NOW())
      ON DUPLICATE KEY UPDATE 
        last_visit = NOW(),
        total_tool_uses = total_tool_uses + 1,
        ip_address = VALUES(ip_address),
        user_agent = VALUES(user_agent)
    `, [userSession, cleanIpAddress, safeUserAgent]);

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    await db.execute(`
      INSERT INTO daily_stats (date, total_tool_uses, unique_tools_used) 
      VALUES (?, 1, 1)
      ON DUPLICATE KEY UPDATE 
        total_tool_uses = total_tool_uses + 1
    `, [today]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking usage:', error);
    res.status(500).json({ error: 'Failed to track usage' });
  }
});

// Get popular tools
app.get('/api/popular-tools', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await db.execute(`
      SELECT tool_id, tool_name, COUNT(*) as usage_count
      FROM tool_usage 
      GROUP BY tool_id, tool_name 
      ORDER BY usage_count DESC 
      LIMIT ?
    `, [limit]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching popular tools:', error);
    res.status(500).json({ error: 'Failed to fetch popular tools' });
  }
});

// Get daily stats
app.get('/api/daily-stats', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const [rows] = await db.execute(`
      SELECT date, total_users, total_tool_uses, unique_tools_used
      FROM daily_stats 
      ORDER BY date DESC 
      LIMIT ?
    `, [days]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ error: 'Failed to fetch daily stats' });
  }
});

// Get total usage count for a specific tool
app.get('/api/tool-usage/:toolId', async (req, res) => {
  try {
    const { toolId } = req.params;
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM tool_usage WHERE tool_id = ?',
      [toolId]
    );
    
    res.json({ toolId, count: rows[0].count });
  } catch (error) {
    console.error('Error fetching tool usage:', error);
    res.status(500).json({ error: 'Failed to fetch tool usage' });
  }
});

// Get client IP and basic info (public but limited)
app.get('/api/client-info', (req, res) => {
  try {
    const rawIpAddress = extractRealIpAddress(req);
    const cleanIpAddress = cleanAndValidateIp(rawIpAddress);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    
    // Only return basic info for public endpoint
    res.json({
      ip: cleanIpAddress,
      userAgent: userAgent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting client info:', error);
    res.status(500).json({ error: 'Failed to get client info' });
  }
});

// Get public IP address via external services (server-side proxy)
app.get('/api/public-ip', async (req, res) => {
  try {
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://api64.ipify.org?format=json',
      'https://api.my-ip.io/ip.json'
    ];

    for (const service of ipServices) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(service, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Analytics Service)'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          // Extract IP from different response formats
          const publicIp = data.ip || data.query || data.IPv4 || null;
          
          if (publicIp && publicIp !== 'unknown') {
            console.log(`🌐 Public IP detected via ${service}: ${publicIp}`);
            
            return res.json({
              ip: publicIp,
              source: service,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.warn(`Public IP service ${service} failed:`, error.message);
        continue;
      }
    }
    
    // If all services fail, return the client's detected IP
    const fallbackIp = extractRealIpAddress(req);
    const cleanFallbackIp = cleanAndValidateIp(fallbackIp);
    
    res.json({
      ip: cleanFallbackIp,
      source: 'fallback-headers',
      warning: 'External IP services unavailable',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching public IP:', error);
    res.status(500).json({ error: 'Failed to fetch public IP' });
  }
});

// Admin-only endpoints (require authentication)
// Get recent tool usage with IP addresses (for debugging)
app.get('/api/admin/recent-usage', isAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await db.execute(`
      SELECT tool_id, tool_name, user_session, ip_address, user_agent, timestamp
      FROM tool_usage 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [limit]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent usage:', error);
    res.status(500).json({ error: 'Failed to fetch recent usage' });
  }
});

// Get detailed client IP and headers (admin only)
app.get('/api/admin/client-debug', isAdmin, (req, res) => {
  try {
    const rawIpAddress = extractRealIpAddress(req);
    const cleanIpAddress = cleanAndValidateIp(rawIpAddress);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    
    console.log(`🔍 Admin debug - Raw IP: ${rawIpAddress}, Clean IP: ${cleanIpAddress}`);
    
    res.json({
      ip: cleanIpAddress,
      rawIp: rawIpAddress,
      userAgent: userAgent,
      allHeaders: req.headers,
      connection: {
        remoteAddress: req.connection?.remoteAddress,
        socketAddress: req.socket?.remoteAddress
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting admin client info:', error);
    res.status(500).json({ error: 'Failed to get client info' });
  }
});

// Get analytics dashboard data (admin only)
app.get('/api/admin/dashboard', isAdmin, async (req, res) => {
  try {
    // Get comprehensive stats
    const [totalUsage] = await db.execute('SELECT COUNT(*) as total FROM tool_usage');
    const [totalSessions] = await db.execute('SELECT COUNT(*) as total FROM user_sessions');
    const [recentActivity] = await db.execute(`
      SELECT tool_name, COUNT(*) as count 
      FROM tool_usage 
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY tool_name 
      ORDER BY count DESC 
      LIMIT 5
    `);
    
    res.json({
      totalUsage: totalUsage[0].total,
      totalSessions: totalSessions[0].total,
      recentActivity: recentActivity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Public endpoints (no authentication required)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ztooly Analytics API running on http://localhost:${PORT}`);
  console.log(`📊 Tools Made Simple - Analytics Dashboard`);
  initDB();
});

export default app;
