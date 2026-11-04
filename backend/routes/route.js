import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "QuoteForge API is running" });
});

export default router;
