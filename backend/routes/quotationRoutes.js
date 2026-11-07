import { Router } from "express";
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotationStatus,
  deleteQuotation,
} from "../controllers/quotationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, createQuotation);
router.get("/", protect, getQuotations);
router.get("/:id", protect, getQuotationById);
router.patch("/:id/status", protect, updateQuotationStatus);
router.delete("/:id", protect, deleteQuotation);

export default router;
