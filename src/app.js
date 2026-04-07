import express from "express";
import logger from "#config/logger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import authRoutes from "#routers/auth.routes.js";
import userRoutes from "#routers/user.routes.js";
import securityMiddleware from "#middleware/security.middleware.js";

app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(securityMiddleware);
app.set("trust proxy", true);

app.get("/", (req, res) => {
  logger.info("Hello from acquisitions service!");
  res.status(200).json({ message: "Hello from acquisitions!" });
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the Acquisitions API!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler (Catch-all for unknown routes)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: "Route not found" });
});

// Final Error Handler
app.use((err, req, res) => {
  logger.error("Unhandled Error", { message: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred",
  });
});

export default app;
