const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'visitor-data.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Initialize visitor data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it
    const initialData = {
      totalVisitors: 0,
      uniqueVisitors: new Set(),
      visits: []
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('Initialized visitor data file');
  }
}

// Read visitor data
async function readVisitorData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Convert array back to Set for uniqueVisitors
    parsed.uniqueVisitors = new Set(parsed.uniqueVisitors);
    return parsed;
  } catch (error) {
    console.error('Error reading visitor data:', error);
    return {
      totalVisitors: 0,
      uniqueVisitors: new Set(),
      visits: []
    };
  }
}

// Write visitor data
async function writeVisitorData(data) {
  try {
    // Convert Set to array for JSON serialization
    const dataToWrite = {
      ...data,
      uniqueVisitors: Array.from(data.uniqueVisitors)
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(dataToWrite, null, 2));
  } catch (error) {
    console.error('Error writing visitor data:', error);
  }
}

// Generate visitor fingerprint based on IP and User-Agent
function generateVisitorFingerprint(req) {
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || '';
  return crypto.createHash('sha256').update(ip + userAgent).digest('hex');
}

// API endpoint to track visitor and get count
app.post('/api/visitor', async (req, res) => {
  try {
    const visitorData = await readVisitorData();
    const fingerprint = generateVisitorFingerprint(req);
    
    let isNewVisitor = false;
    
    // Check if this is a new unique visitor
    if (!visitorData.uniqueVisitors.has(fingerprint)) {
      visitorData.uniqueVisitors.add(fingerprint);
      isNewVisitor = true;
    }
    
    // Increment total visitor count
    visitorData.totalVisitors += 1;
    
    // Add visit record
    visitorData.visits.push({
      timestamp: new Date().toISOString(),
      fingerprint: fingerprint.substring(0, 8), // Store only first 8 chars for privacy
      isNew: isNewVisitor,
      userAgent: req.get('User-Agent') || '',
      ip: req.ip || req.connection.remoteAddress || 'unknown'
    });
    
    // Keep only last 1000 visits to prevent file from growing too large
    if (visitorData.visits.length > 1000) {
      visitorData.visits = visitorData.visits.slice(-1000);
    }
    
    await writeVisitorData(visitorData);
    
    res.json({
      success: true,
      uniqueVisitors: visitorData.uniqueVisitors.size,
      totalVisits: visitorData.totalVisitors,
      isNewVisitor
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// API endpoint to get visitor statistics
app.get('/api/stats', async (req, res) => {
  try {
    const visitorData = await readVisitorData();
    
    res.json({
      uniqueVisitors: visitorData.uniqueVisitors.size,
      totalVisits: visitorData.totalVisitors,
      recentVisits: visitorData.visits.slice(-10) // Last 10 visits
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Existing contact form endpoint (from your original script.js)
app.post('/api/requests', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and phone are required' });
    }
    
    // Here you would typically save to a database
    // For now, we'll just log it and save to a file
    const requestData = {
      timestamp: new Date().toISOString(),
      name,
      phone,
      email,
      message
    };
    
    console.log('New contact request:', requestData);
    
    // Save to requests file
    const requestsFile = path.join(__dirname, 'contact-requests.json');
    let requests = [];
    
    try {
      const existingData = await fs.readFile(requestsFile, 'utf8');
      requests = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is empty
    }
    
    requests.push(requestData);
    await fs.writeFile(requestsFile, JSON.stringify(requests, null, 2));
    
    res.json({ success: true, message: 'Request received successfully' });
  } catch (error) {
    console.error('Error processing contact request:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Newsletter signup endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    // Save newsletter signup
    const newsletterData = {
      timestamp: new Date().toISOString(),
      email: email.toLowerCase(),
      ip: req.ip || req.connection.remoteAddress || 'unknown'
    };
    
    console.log('New newsletter signup:', newsletterData);
    
    // Save to newsletter file
    const newsletterFile = path.join(__dirname, 'newsletter-signups.json');
    let signups = [];
    
    try {
      const existingData = await fs.readFile(newsletterFile, 'utf8');
      signups = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is empty
    }
    
    // Check if email already exists
    const existingSignup = signups.find(signup => signup.email === email.toLowerCase());
    if (existingSignup) {
      return res.status(409).json({ success: false, error: 'Email already subscribed' });
    }
    
    signups.push(newsletterData);
    await fs.writeFile(newsletterFile, JSON.stringify(signups, null, 2));
    
    res.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Error processing newsletter signup:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
async function startServer() {
  await initializeDataFile();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Visitor counter is active!');
  });
}

startServer().catch(console.error);
