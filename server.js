const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Initialize visitor counter
let visitorCount = 0;
let uptimeStart = Date.now();

// Load visitor count from file if exists
try {
  if (fs.existsSync('visitorCount.json')) {
    const data = JSON.parse(fs.readFileSync('visitorCount.json', 'utf8'));
    visitorCount = data.count || 0;
  }
} catch (error) {
  console.log('Starting fresh visitor count');
}

// Middleware
app.use(express.static('.'));
app.use(express.json());

// API endpoint for visitor tracking
app.post('/api/visit', (req, res) => {
  visitorCount++;
  
  // Save to file
  try {
    fs.writeFileSync('visitorCount.json', JSON.stringify({ count: visitorCount }));
  } catch (error) {
    console.error('Error saving visitor count:', error);
  }
  
  res.json({ 
    success: true, 
    visitorCount: visitorCount,
    uptime: Date.now() - uptimeStart
  });
});

// API endpoint for stats
app.get('/api/stats', (req, res) => {
  const uptimeMs = Date.now() - uptimeStart;
  const uptimeDays = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
  const uptimeHours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
  
  res.json({
    visitorCount: visitorCount,
    uptime: {
      milliseconds: uptimeMs,
      formatted: `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`,
      days: uptimeDays,
      hours: uptimeHours,
      minutes: uptimeMinutes
    },
    version: '7.0.0',
    lastUpdated: new Date().toISOString()
  });
});

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '7.0.0'
  });
});

app.listen(port, () => {
  console.log(`🚀 Ntando Store v7.0.0 running on port ${port}`);
  console.log(`📊 Visitor tracking enabled`);
  console.log(`⏰ Uptime monitoring active`);
  console.log(`🌐 Server ready for production`);
});

module.exports = app;