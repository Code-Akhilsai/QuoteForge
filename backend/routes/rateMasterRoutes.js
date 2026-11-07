import { Router } from "express";
import {
  getRateMasters,
  createRateMaster,
  updateRateMaster,
  deleteRateMaster,
  seedRateMasters,
} from "../controllers/rateMasterController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", protect, getRateMasters);
router.post("/", protect, authorize("admin", "sales_head"), createRateMaster);
router.put("/:id", protect, authorize("admin", "sales_head"), updateRateMaster);
router.delete("/:id", protect, authorize("admin", "sales_head"), deleteRateMaster);
router.post("/seed", protect, authorize("admin", "sales_head"), seedRateMasters);

export default router;
