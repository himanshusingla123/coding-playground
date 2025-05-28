const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const codeRoutes = require('./routes/code');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// WebSocket connections
const clients = new Map();

wss.on('connection', (ws, req) => {
  const sessionId = req.url.split('/').pop();
  clients.set(sessionId, ws);
  
  ws.on('close', () => {
    clients.delete(sessionId);
  });
});

app.use('/api/code', codeRoutes);

// Make WebSocket clients available to routes
app.locals.wsClients = clients;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});