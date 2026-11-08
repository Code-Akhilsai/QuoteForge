import { Router } from "express";
import { draftQuotationSummary, extractRFQ, suggestCostingValues } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/rfq-intake", protect, extractRFQ);
router.post("/costing-suggest", protect, suggestCostingValues);
router.post("/quotation-draft", protect, draftQuotationSummary);

export default router;
