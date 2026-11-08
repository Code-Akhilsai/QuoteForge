import { draftQuotation, extractRfqFromText, suggestCosting } from "../services/geminiService.js";

export const extractRFQ = async (req, res) => {
  try {
    const { text } = req.body || {};
    const rfq = await extractRfqFromText(text);
    res.json({ success: true, rfq });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to extract RFQ data.",
    });
  }
};

export const suggestCostingValues = async (req, res) => {
  try {
    const suggestion = await suggestCosting(req.body || {});
    res.json({ success: true, suggestion });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to suggest costing values.",
    });
  }
};

export const draftQuotationSummary = async (req, res) => {
  try {
    const draft = await draftQuotation(req.body || {});
    res.json({ success: true, draft });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to draft quotation.",
    });
  }
};
