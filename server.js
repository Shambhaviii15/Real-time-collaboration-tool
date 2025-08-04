// server.js
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils.js";

const app = express();                 // for future REST endpoints (e.g. room list)
const httpServer = createServer(app);  // share HTTP + WS on one port

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws, req) => {
  // Yjs handles CRDT sync + document lifecycle
  setupWSConnection(ws, req);
});

const PORT = process.env.PORT || 1234;
httpServer.listen(PORT, () => {
  console.log(`Yjs WebSocket server running at ws://localhost:${PORT}`);
});
