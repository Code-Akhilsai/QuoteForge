import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import rfqRoutes from "./routes/rfqRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import rateMasterRoutes from "./routes/rateMasterRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "https://quoteforge123.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
];

const corsOptions = {
  credentials: true,
  origin(origin, cb) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes("*")
    ) {
      cb(null, true);
    } else {
      cb(null, true); // Allow origin dynamically to prevent preflight blocks
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Support both /api/auth and direct /auth if VITE_API_URL misses /api

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "QuoteForge API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/upload", uploadRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/rfqs", rfqRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/quotations", quotationRoutes);
app.use("/api/rate-masters", rateMasterRoutes);
app.use("/rate-masters", rateMasterRoutes);
app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
