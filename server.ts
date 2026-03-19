import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // PDF Proxy Route to bypass CORS
  app.get("/api/proxy-pdf", async (req, res) => {
    const pdfUrl = req.query.url as string;
    if (!pdfUrl) {
      return res.status(400).send("URL parameter is required");
    }

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        return res.status(response.status).send(`Failed to fetch PDF: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error("Proxy fetch error:", error.message);
      if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
        return res.status(404).send("PDF source domain not found. Please check the URL.");
      }
      res.status(500).send(`Error fetching PDF: ${error.message}`);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
