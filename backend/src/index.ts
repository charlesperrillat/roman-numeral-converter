import express from "express";
import cors from "cors";
import { convertToRoman } from "./utils/romanConverter.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Store for SSE connections
const sseConnections: Array<{ id: string; res: express.Response }> = [];

// SSE endpoint
app.get(`/convert-stream`, (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // Generate unique ID for this connection
  const connectionId = Date.now().toString();

  // Add connection to store
  sseConnections.push({ id: connectionId, res });

  // Send initial connection message
  res.write(
    `data: ${JSON.stringify({
      type: "connected",
      message: "Connected to SSE",
    })}\n\n`
  );

  // Handle client disconnect
  req.on("close", () => {
    const index = sseConnections.findIndex((conn) => conn.id === connectionId);
    if (index !== -1) {
      sseConnections.splice(index, 1);
    }
  });
});

// Endpoint to trigger SSE conversion
app.post(`/convert-sse`, (req, res) => {
  try {
    const { number } = req.body;

    if (
      typeof number !== "number" ||
      number < 0 ||
      number > 100 ||
      !Number.isInteger(number)
    ) {
      return res.status(400).json({
        error: "Number must be an integer between 0 and 100",
      });
    }

    const roman = convertToRoman(number);

    // Send to all SSE connections
    const data = JSON.stringify({
      type: "conversion",
      number,
      roman,
      timestamp: new Date().toISOString(),
    });

    sseConnections.forEach((conn) => {
      try {
        conn.res.write(`data: ${data}\n\n`);
      } catch (error) {
        console.error("Error writing to SSE connection:", error);
      }
    });

    res.json({ success: true, message: "Conversion sent via SSE" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
