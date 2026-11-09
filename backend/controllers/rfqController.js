import { RFQ } from "../models/RFQ.js";

const generateRFQNumber = async () => {
  const count = await RFQ.countDocuments();
  return `RFQ-${String(1001 + count).padStart(4, "0")}`;
};

export const createRFQ = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      productName,
      quantity,
      priority,
      deadline,
      estimatedValue,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !productName ||
      !quantity
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        });
    }

    const rfqNumber = await generateRFQNumber();
    const rfq = await RFQ.create({
      rfqNumber,
      customerName,
      customerEmail,
      customerPhone,
      productName,
      quantity,
      priority: priority || "medium",
      deadline: deadline || null,
      estimatedValue: estimatedValue || 0,
      createdBy: req.user.id,
    });

    const populatedRFQ = await RFQ.findById(rfq._id).populate(
      "createdBy",
      "name email role",
    );

    res.status(201).json({ success: true, rfq: populatedRFQ });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRFQs = async (req, res) => {
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
        { rfqNumber: { $regex: search, $options: "i" } },
      ];
    }

    const rfqs = await RFQ.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RFQ.countDocuments(query);

    res.json({
      success: true,
      rfqs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRFQById = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );
    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }
    res.json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email role");

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    res.json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndDelete(req.params.id);
    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }
    res.json({ success: true, message: "RFQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
