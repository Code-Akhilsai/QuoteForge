import { Router } from "express";
import {
  createRFQ,
  getRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ,
} from "../controllers/rfqController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, createRFQ);
router.get("/", protect, getRFQs);
router.get("/:id", protect, getRFQById);
router.put("/:id", protect, updateRFQ);
router.delete("/:id", protect, deleteRFQ);

export default router;
