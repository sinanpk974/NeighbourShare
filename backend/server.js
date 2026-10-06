import express from "express";
import dotenv from "dotenv";
import connection from "./connection.js";
import router from "./router.js";
import cors from "cors";
import http from "http";

import { initializeSocket } from "./socket.js";

dotenv.config();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Express middleware
app.use(
  cors({
    origin: "https://neighbourshare-chi.vercel.app",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));

// API routes
app.use("/api", router);

// ==========================================
// DATABASE + SERVER
// ==========================================

connection()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(
        `server running http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });