import { RateMaster } from "../models/RateMaster.js";

export const getRateMasters = async (req, res) => {
  try {
    const { type, asOf } = req.query;
    const query = {};
    if (type && type !== "all") {
      query.type = type;
    }

    if (asOf) {
      const asOfDate = new Date(asOf);
      query.effectiveDate = { $lte: asOfDate };
      query.$or = [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: asOfDate } },
      ];
    }

    const rates = await RateMaster.find(query).sort({ type: 1, name: 1, effectiveDate: -1 });
    res.json({ success: true, rates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRateMaster = async (req, res) => {
  try {
    const { type, name, unit, rate, category, effectiveDate, endDate } = req.body;

    if (!type || !name || !unit || rate === undefined || rate === null || !effectiveDate) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const rateMaster = await RateMaster.create({
      type,
      name,
      unit,
      rate,
      category: category || "",
      effectiveDate,
      endDate: endDate || null,
    });

    res.status(201).json({ success: true, rate: rateMaster });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: `${type} "${name}" already exists` });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRateMaster = async (req, res) => {
  try {
    const rateMaster = await RateMaster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!rateMaster) {
      return res.status(404).json({ success: false, message: "Rate not found" });
    }

    res.json({ success: true, rate: rateMaster });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Rate name already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRateMaster = async (req, res) => {
  try {
    const rateMaster = await RateMaster.findByIdAndDelete(req.params.id);
    if (!rateMaster) {
      return res.status(404).json({ success: false, message: "Rate not found" });
    }
    res.json({ success: true, message: "Rate deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedRateMasters = async (req, res) => {
  try {
    const existing = await RateMaster.countDocuments();
    if (existing > 0) {
      return res.json({ success: true, message: "Rate masters already seeded", count: existing });
    }

    const materials = [
      { type: "material", name: "Mild Steel Sheet (CRCA)", unit: "kg", rate: 68, category: "Ferrous" },
      { type: "material", name: "Stainless Steel 304", unit: "kg", rate: 215, category: "Ferrous" },
      { type: "material", name: "Aluminium 6061-T6", unit: "kg", rate: 240, category: "Non-Ferrous" },
      { type: "material", name: "Copper Wire", unit: "kg", rate: 780, category: "Non-Ferrous" },
      { type: "material", name: "Cast Iron FG260", unit: "kg", rate: 55, category: "Ferrous" },
    ];

    const machines = [
      { type: "machine", name: "CNC Lathe", unit: "hour", rate: 450, category: "Machining" },
      { type: "machine", name: "CNC Milling (VMC)", unit: "hour", rate: 620, category: "Machining" },
      { type: "machine", name: "Surface Grinder", unit: "hour", rate: 320, category: "Finishing" },
      { type: "machine", name: "MIG Welding Station", unit: "hour", rate: 280, category: "Fabrication" },
      { type: "machine", name: "Powder Coating Booth", unit: "hour", rate: 180, category: "Finishing" },
    ];

    await RateMaster.insertMany([...materials, ...machines]);

    res.json({ success: true, message: "Rate masters seeded successfully", count: materials.length + machines.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
