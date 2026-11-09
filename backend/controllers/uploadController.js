import XLSX from "xlsx";
import { RFQ } from "../models/RFQ.js";

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
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
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

      const rfqNumber = tryKey([
        "RFQ No",
        "rfqNumber",
        "RFQ Number",
        "rfq_no",
        "RFQ#",
        "RFQ ID",
        "rfq_id",
      ]);
      const customerName = tryKey([
        "Customer",
        "customerName",
        "customer_name",
        "Customer Name",
        "client",
      ]);
      const productName = tryKey([
        "Part",
        "Product",
        "productName",
        "product_name",
        "Part Name",
        "Item",
        "Description",
      ]);
      const quantity = normalizeNumber(
        tryKey([
          "Annual Volume",
          "quantity",
          "Quantity",
          "Annual Volume (units)",
          "Qty",
          "Volume",
        ]),
      );
      const unitCost = normalizeNumber(
        tryKey([
          "Hour Rate ₹",
          "Hour Rate",
          "unitCost",
          "Rate",
          "rate",
          "Unit Cost",
          "Price",
        ]),
      );
      const totalCost = normalizeNumber(
        tryKey([
          "Total Cost",
          "totalCost",
          "total_cost",
          "Amount",
          "Total",
          "Total Amount",
        ]),
      );
      const rawStatus = tryKey(["Status", "status"]) || "estimating";
      const statusLower = String(rawStatus).toLowerCase().trim();

      let mappedStatus = "estimating";
      if (statusLower.includes("draft")) mappedStatus = "draft";
      else if (
        statusLower.includes("won") ||
        statusLower.includes("approved") ||
        statusLower.includes("accept")
      )
        mappedStatus = "won";
      else if (statusLower.includes("lost") || statusLower.includes("reject"))
        mappedStatus = "lost";
      else if (
        statusLower.includes("sent") ||
        statusLower.includes("quote") ||
        statusLower.includes("pending")
      )
        mappedStatus = "sent";
      else if (
        ["draft", "estimating", "sent", "won", "lost"].includes(statusLower)
      )
        mappedStatus = statusLower;

      const autoNumber = `RFQ-${Date.now().toString().slice(-4)}${i + 1}`;

      const doc = {
        rfqNumber: rfqNumber || autoNumber,
        customerName: customerName || `Customer ${i + 1}`,
        customerEmail: tryKey(["Email", "email", "customerEmail"]) || "",
        customerPhone: tryKey(["Phone", "phone", "customerPhone"]) || "",
        productName: productName || `Part ${i + 1}`,
        quantity: quantity > 0 ? quantity : 1,
        status: mappedStatus,
        priority: "medium",
        deadline: null,
        estimatedValue: totalCost || unitCost * (quantity || 1) || 0,
        createdBy: req.user.id,
      };

      try {
        const existing = rfqNumber ? await RFQ.findOne({ rfqNumber }) : null;
        if (existing) {
          await RFQ.findByIdAndUpdate(existing._id, doc, {
            runValidators: true,
          });
        } else {
          await RFQ.create(doc);
        }
        created.rfqs++;
      } catch (err) {
        created.errors.push({ row: i + 2, error: err.message });
        console.error(`Row ${i + 2} error:`, err.message);
      }
    }

    res.json({
      success: created.rfqs > 0 || rows.length === 0,
      message: `Imported ${created.rfqs} of ${rows.length} records${created.errors.length ? `; ${created.errors.length} row(s) failed` : ""}`,
      created,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
