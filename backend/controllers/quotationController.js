import { Quotation } from "../models/Quotation.js";
import { RFQ } from "../models/RFQ.js";

const generateQuotationNumber = async () => {
  const count = await Quotation.countDocuments();
  return `QT-${String(100000 + count).padStart(6, "0")}`;
};

export const createQuotation = async (req, res) => {
  try {
    const {
      rfqId,
      customerName,
      customerEmail,
      productName,
      quantity,
      unitCost,
      totalCost,
      validTill,
    } = req.body;

    if (
      !customerName ||
      !productName ||
      !quantity ||
      unitCost === undefined ||
      totalCost === undefined
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        });
    }

    const quotationNumber = await generateQuotationNumber();

    const quotationData = {
      quotationNumber,
      customerName,
      customerEmail: customerEmail || "",
      productName,
      quantity,
      unitCost,
      totalCost,
      validTill: validTill || null,
      createdBy: req.user.id,
    };

    if (rfqId) {
      quotationData.rfq = rfqId;
      await RFQ.findByIdAndUpdate(rfqId, { status: "sent" });
    }

    const quotation = await Quotation.create(quotationData);
    const populated = await Quotation.findById(quotation._id)
      .populate("createdBy", "name email role")
      .populate("rfq", "rfqNumber customerName productName");

    res.status(201).json({ success: true, quotation: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuotations = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
        { quotationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const quotations = await Quotation.find(query)
      .populate("createdBy", "name email role")
      .populate("rfq", "rfqNumber customerName productName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quotation.countDocuments(query);

    res.json({
      success: true,
      quotations,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("rfq", "rfqNumber customerName productName");

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    res.json({ success: true, quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["draft", "sent", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const quotation = await Quotation.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );
    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    // Quotes above ₹25 lakh need sales head approval
    if (
      quotation.totalCost > 2500000 &&
      !["admin", "sales_head"].includes(req.userObj?.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Quotes above ₹25 lakh require Sales Head approval",
      });
    }

    const updated = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).populate("createdBy", "name email role");

    res.json({ success: true, quotation: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }
    res.json({ success: true, message: "Quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
