import multer from "multer";
import XLSX from "xlsx";
import { RFQ } from "../models/RFQ.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const parseFile = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
};

const normalizeNumber = (v) => {
  const n = parseFloat(String(v).replace(/[₹,]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const rows = parseFile(req.file.buffer);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "File is empty" });
    }

    const created = { rfqs: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const tryKey = (keys) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== "") return row[k];
        }
        return undefined;
      };

      const rfqNumber = tryKey(["RFQ No", "rfqNumber", "RFQ Number", "rfq_no"]);
      const customerName = tryKey(["Customer", "customerName", "customer_name"]);
      const productName = tryKey(["Part", "Product", "productName", "product_name"]);
      const material = tryKey(["Material", "material"]);
      const quantity = normalizeNumber(tryKey(["Annual Volume", "quantity", "Quantity", "Annual Volume (units)"]));
      const unitCost = normalizeNumber(tryKey(["Hour Rate ₹", "Hour Rate", "unitCost", "Rate", "rate"]));
      const totalCost = normalizeNumber(tryKey(["Total Cost", "totalCost", "total_cost"]));
      const status = tryKey(["Status", "status"]) || "draft";

      const doc = {
        customerName: customerName || "Unknown Customer",
        customerEmail: "",
        customerPhone: "",
        productName: productName || "Unknown Product",
        quantity: quantity || 1,
        status: status === "open" ? "estimating" : status === "quoted" ? "sent" : status === "approved" ? "won" : status === "rejected" ? "lost" : status,
        priority: "medium",
        deadline: null,
        estimatedValue: totalCost || unitCost * quantity || 0,
        createdBy: req.user.id,
      };

      if (rfqNumber) doc.rfqNumber = rfqNumber;

      try {
        const existing = rfqNumber ? await RFQ.findOne({ rfqNumber }) : null;
        if (existing) {
          await RFQ.findByIdAndUpdate(existing._id, doc, { runValidators: true });
        } else {
          await RFQ.create(doc);
        }
        created.rfqs++;
      } catch (err) {
        created.errors.push({ row: i + 2, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Imported ${created.rfqs} records`,
      created,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
