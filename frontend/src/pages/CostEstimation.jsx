import { useCallback, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Calculator,
  Plus,
  Download,
  Printer,
  BarChart3,
  Truck,
  Package,
  Check,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/api";

const DEFAULT_OPERATION = {
  id: Date.now(),
  machineId: "",
  machineName: "",
  ratePerHour: 0,
  hours: 0,
};

const OVERHEAD_DEFAULTS = {
  labourRatePerHour: 150,
  powerRatePerHour: 45,
  scrapPercentage: 0,
  profitMarginPercentage: 0,
};

export default function CostEstimation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [operations, setOperations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [machines, setMachines] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [materialSelection, setMaterialSelection] = useState("");
  const [materialQty, setMaterialQty] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [volume1, setVolume1] = useState("0");
  const [volume2, setVolume2] = useState("0");
  const [volume3, setVolume3] = useState("0");
  const [scrapPct, setScrapPct] = useState(
    OVERHEAD_DEFAULTS.scrapPercentage.toString(),
  );
  const [profitMargin, setProfitMargin] = useState(
    OVERHEAD_DEFAULTS.profitMarginPercentage.toString(),
  );
  const [savingQuotation, setSavingQuotation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [rfqPrefillId, setRfqPrefillId] = useState(
    () => location.state?.rfqId || "",
  );
  const [freightCost, setFreightCost] = useState("0");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiNote, setAiNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rateRes, rfqRes] = await Promise.all([
          axios.get("/rate-masters"),
          axios.get("/rfqs"),
        ]);
        const rates = rateRes.data.rates || [];
        setMaterials(rates.filter((r) => r.type === "material"));
        setMachines(rates.filter((r) => r.type === "machine"));
        setRfqs(rfqRes.data.rfqs || []);
      } catch {
        // ignore
      }
    };
    void fetchData();
  }, []);

  const form = useForm({
    defaultValues: {
      customerName: "",
      productName: "",
      rfqId: "",
      customerEmail: "",
    },
  });
  const rfqIdValue = useWatch({ control: form.control, name: "rfqId" });

  const onSelectRFQ = useCallback(
    (rfqId) => {
      const selected = rfqs.find(
        (r) => (r._id || r.id) === rfqId || r.rfqNumber === rfqId,
      );
      if (selected) {
        form.setValue("rfqId", selected._id || selected.id);
        form.setValue("customerName", selected.customerName || "");
        form.setValue("productName", selected.productName || "");
        form.setValue("customerEmail", selected.customerEmail || "");
        if (selected.quantity) {
          setQuantity(selected.quantity.toString());
        }
      }
    },
    [rfqs, form],
  );

  useEffect(() => {
    if (!rfqPrefillId || rfqs.length === 0) return;
    const id = rfqPrefillId;
    // defer to avoid synchronous setState-in-effect lint; selecting an RFQ is an intentional prefill
    const t = setTimeout(() => {
      onSelectRFQ(id);
      setRfqPrefillId("");
    }, 0);
    return () => clearTimeout(t);
  }, [rfqPrefillId, rfqs, onSelectRFQ]);

  const material = materials.find((m) => (m._id || m.id) === materialSelection);

  const safeQty = Math.max(1, parseFloat(quantity || "0") || 1);

  const materialCostPerUnit =
    material && materialQty
      ? (material.rate * parseFloat(materialQty)) / safeQty
      : 0;

  const machiningCostPerUnit =
    operations.reduce((sum, op) => sum + op.ratePerHour * op.hours, 0) /
    safeQty;

  const labourRate = OVERHEAD_DEFAULTS.labourRatePerHour;
  const powerRate = OVERHEAD_DEFAULTS.powerRatePerHour;
  const totalHours = operations.reduce((sum, op) => sum + op.hours, 0);
  const labourCostPerUnit =
    (labourRate * totalHours) / safeQty;
  const powerCostPerUnit = (powerRate * totalHours) / safeQty;

  const baseCostPerUnit =
    materialCostPerUnit +
    machiningCostPerUnit +
    labourCostPerUnit +
    powerCostPerUnit;
  const freightPerUnit =
    parseFloat(freightCost || "0") / safeQty;
  const scrapFactor = 1 + parseFloat(scrapPct || 0) / 100;
  const costWithScrap = (baseCostPerUnit + freightPerUnit) * scrapFactor;
  const profitFactor = 1 + parseFloat(profitMargin || 0) / 100;
  const sellingPricePerUnit = costWithScrap * profitFactor;

  const computeCosts = (vol) => {
    const v = Math.max(1, parseFloat(vol || "0") || 1);
    if (!vol || vol <= 0) return { withProfit: 0, total: 0 };
    const matCost = material
      ? (material.rate * parseFloat(materialQty || "0")) / v
      : 0;
    const machCost =
      operations.reduce((sum, op) => sum + op.ratePerHour * op.hours, 0) / v;
    const labourCost = (labourRate * totalHours) / v;
    const powerCost = (powerRate * totalHours) / v;
    const base = matCost + machCost + labourCost + powerCost;
    const freightPerVol = parseFloat(freightCost || "0") / v;
    const withScrap = (base + freightPerVol) * scrapFactor;
    const withProfit = withScrap * profitFactor;
    return {
      material: matCost,
      machining: machCost,
      labour: labourCost,
      power: powerCost,
      freight: freightPerVol,
      base,
      withScrap,
      withProfit,
      total: withProfit * v,
    };
  };

  const handleCreateQuotation = async () => {
    const values = form.getValues();
    const qty = parseFloat(quantity || 1);
    const unitPrice = parseFloat(sellingPricePerUnit.toFixed(2));
    const totalPrice = parseFloat((unitPrice * qty).toFixed(2));

    if (!values.productName || !values.productName.trim()) {
      setAiError("Product name is required before creating a quotation.");
      return;
    }
    if (!values.customerName || !values.customerName.trim()) {
      setAiError("Customer name is required before creating a quotation.");
      return;
    }
    if (!qty || qty <= 0) {
      setAiError("Quantity must be greater than 0.");
      return;
    }
    if (unitPrice <= 0) {
      setAiError("Selling price is zero. Add a material and/or machining operations.");
      return;
    }

    setSavingQuotation(true);
    try {
      const res = await axios.post("/quotations", {
        customerName: values.customerName,
        customerEmail: values.customerEmail || "",
        productName: values.productName,
        quantity: qty,
        unitCost: unitPrice,
        totalCost: totalPrice,
        rfqId: values.rfqId || undefined,
        freightCost: parseFloat(freightCost || "0"),
      });

      if (res.status === 201 || res.status === 200) {
        setSaveSuccess(true);
        setTimeout(() => {
          navigate("/quotation-history");
        }, 800);
      }
    } catch {
      // ignore
    } finally {
      setSavingQuotation(false);
    }
  };

  const suggestWithAI = async () => {
    setAiBusy(true);
    setAiError("");
    try {
      const values = form.getValues();
      const res = await axios.post("/ai/costing-suggest", {
        productName: values.productName,
        customerName: values.customerName,
        quantity: parseFloat(quantity || "0"),
        volumes: [
          parseFloat(volume1 || "0"),
          parseFloat(volume2 || "0"),
          parseFloat(volume3 || "0"),
        ],
        material: material
          ? { name: material.name, rate: material.rate, unit: material.unit }
          : null,
        materialQty: parseFloat(materialQty || "0"),
        operations: operations.map((op) => ({
          machineName: op.machineName,
          ratePerHour: op.ratePerHour,
          hours: op.hours,
        })),
      });
      const s = res.data?.suggestion || {};
      if (s.scrapPercentage !== undefined)
        setScrapPct(String(s.scrapPercentage));
      if (s.profitMarginPercentage !== undefined)
        setProfitMargin(String(s.profitMarginPercentage));
      if (s.materialQty > 0) setMaterialQty(String(s.materialQty));
      if (s.operationHours > 0 && operations.length === 1) {
        updateOperation(operations[0].id, "hours", s.operationHours);
      }
      setAiNote(
        s.reasoning ||
          "AI suggestions applied. Review before creating a quotation.",
      );
    } catch (e) {
      setAiError(e?.response?.data?.message || "AI costing suggestion failed.");
    } finally {
      setAiBusy(false);
    }
  };

  const breakdown = [
    { label: "Material Cost", value: materialCostPerUnit, icon: Truck },
    { label: "Machining Cost", value: machiningCostPerUnit, icon: Package },
    { label: "Labour Cost", value: labourCostPerUnit, icon: BarChart3 },
    { label: "Power & Overhead", value: powerCostPerUnit, icon: Package },
    { label: "Freight / Delivery", value: freightPerUnit, icon: Truck },
  ];

  function addOperation() {
    setOperations([...operations, { ...DEFAULT_OPERATION, id: Date.now() }]);
  }

  function removeOperation(id) {
    setOperations(operations.filter((o) => o.id !== id));
  }

  function updateOperation(id, field, value) {
    setOperations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  }

  function handleMachineChange(opId, selectedValue) {
    const matched = machines.find(
      (m) => String(m._id || m.id) === String(selectedValue)
    );
    setOperations((prev) =>
      prev.map((o) =>
        o.id === opId
          ? {
              ...o,
              machineId: selectedValue,
              machineName: matched?.name || "",
              ratePerHour: Number(matched?.rate ?? matched?.ratePerHour ?? 0),
            }
          : o
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cost Estimation
          </h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            Add materials and machines via upload or manually to calculate costs
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {saveSuccess && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 flex items-center gap-1 w-full sm:w-auto justify-center">
              <Check className="size-3.5" /> Saved & Redirecting...
            </span>
          )}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="small"
              onClick={() => window.print()}
              className="text-xs sm:text-sm py-1.5 px-3"
            >
              <Printer className="mr-1.5 size-3.5 sm:size-4 shrink-0" />
              <span>Print Estimate</span>
            </Button>
            <Button
              onClick={handleCreateQuotation}
              disabled={savingQuotation}
              className="text-xs sm:text-sm py-1.5 px-3"
            >
              <Download className="mr-1.5 size-3.5 sm:size-4 shrink-0" />
              <span>{savingQuotation ? "Saving..." : "Create Quotation"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="size-4" />
                <CardTitle className="ml-1">Manufacturing Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={form.handleSubmit(() => {})}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Customer Name</label>
                    <Input
                      placeholder="Customer name"
                      {...form.register("customerName")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">RFQ Reference</label>
                    {rfqs.length > 0 ? (
                      <select
                        value={rfqIdValue || ""}
                        className="w-full text-sm border border-slate-200 rounded-md bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        onChange={(e) => onSelectRFQ(e.target.value)}
                      >
                        <option value="">
                          Select an existing RFQ or type below
                        </option>
                        {rfqs.map((r) => (
                          <option key={r._id || r.id} value={r._id || r.id}>
                            {r.rfqNumber} - {r.customerName} ({r.productName})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="e.g. RFQ-1001"
                        {...form.register("rfqId")}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="label-field">Product Name</label>
                  <Input
                    placeholder="e.g. Brake Caliper Housing"
                    {...form.register("productName")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="label-field">Order Quantity (units)</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="label-field">Volume Pricing (units)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Volume 1</label>
                      <Input
                        type="number"
                        value={volume1}
                        onChange={(e) => setVolume1(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Volume 2</label>
                      <Input
                        type="number"
                        value={volume2}
                        onChange={(e) => setVolume2(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Volume 3</label>
                      <Input
                        type="number"
                        value={volume3}
                        onChange={(e) => setVolume3(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="size-4" />
                <CardTitle className="ml-1">Material Cost</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="label-field">Select Material</label>
                <select
                  value={materialSelection}
                  onChange={(e) => setMaterialSelection(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-md bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Choose a material</option>
                  {materials.map((m) => {
                    const val = String(m._id || m.id || "");
                    return (
                      <option key={val} value={val}>
                        {m.name} (₹{m.rate}/{m.unit})
                      </option>
                    );
                  })}
                </select>
                {materials.length === 0 && (
                  <p className="text-xs text-slate-500">
                    No materials available. Add via Rate Masters or upload data.
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="label-field">Material Required (kg)</label>
                <Input
                  type="number"
                  value={materialQty}
                  onChange={(e) => setMaterialQty(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="label-field">
                  Freight / Delivery Cost (₹)
                </label>
                <Input
                  type="number"
                  value={freightCost}
                  onChange={(e) => setFreightCost(e.target.value)}
                  placeholder="Total freight for the order"
                />
              </div>
              {material && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Material Rate</span>
                    <span className="font-medium text-slate-900">
                      ₹{material.rate} / {material.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-500">Material Cost / Unit</span>
                    <span className="font-semibold text-slate-900">
                      ₹{materialCostPerUnit.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Package className="size-4" />
                <CardTitle className="ml-1">Machining Operations</CardTitle>
              </div>
              <Button size="small" variant="outline" onClick={addOperation}>
                <Plus className="mr-1 size-4" /> Add Operation
              </Button>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="space-y-2 overflow-x-auto">
                <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-slate-500 uppercase mb-1 px-1 min-w-150">
                  <div className="col-span-3">Machine</div>
                  <div className="col-span-1 text-right">Rate/hr</div>
                  <div className="col-span-1 text-right">Hours</div>
                  <div className="col-span-1 text-right">Cost</div>
                </div>
                {operations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No operations added. Click "Add Operation" to add a
                    machining step.
                  </div>
                ) : (
                  operations.map((op) => {
                    const machine = machines.find(
                      (m) => String(m._id || m.id) === String(op.machineId),
                    );
                    const cost =
                      (machine?.rate || machine?.ratePerHour || 0) * op.hours;
                    return (
                      <div
                        key={op.id}
                        className="grid grid-cols-6 gap-2 items-center px-2 py-2 bg-slate-50 rounded border border-slate-100 min-w-150"
                      >
                        <div className="col-span-3">
                          <select
                            value={op.machineId || ""}
                            onChange={(e) => handleMachineChange(op.id, e.target.value)}
                            className="w-full text-sm border border-slate-300 rounded-md bg-white px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer text-slate-900"
                          >
                            <option value="">Select machine</option>
                            {machines.map((m) => {
                              const val = String(m._id || m.id || "");
                              return (
                                <option key={val} value={val}>
                                  {m.name} (₹{m.rate ?? m.ratePerHour}/hr)
                                </option>
                              );
                            })}
                          </select>
                          {machines.length === 0 && (
                            <p className="text-xs text-rose-500 mt-1">
                              No machines found. Please check Rate Masters.
                            </p>
                          )}
                        </div>
                        <div className="col-span-1 text-right text-sm font-medium">
                          {(machine?.rate || machine?.ratePerHour)?.toFixed(
                            0,
                          ) ?? "-"}
                        </div>
                        <div className="col-span-1 text-right">
                          <Input
                            type="number"
                            value={op.hours.toString()}
                            onChange={(e) =>
                              updateOperation(
                                op.id,
                                "hours",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="h-8 px-1 text-sm text-right"
                          />
                        </div>
                        <div className="col-span-1 text-right text-sm font-medium">
                          ₹{cost.toFixed(0)}
                        </div>
                        <div className="col-span-1 flex items-center">
                          <Button
                            size="small"
                            variant="destructive"
                            onClick={() => removeOperation(op.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {breakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between text-sm border-b border-slate-100 pb-2 last:border-0"
                >
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-medium text-slate-900">
                    ₹{item.value.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between text-sm font-semibold text-slate-900">
                  <span>Base Cost / Unit</span>
                  <span>₹{baseCostPerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-500">Scrap ({scrapPct}%)</span>
                  <span className="text-slate-500">
                    ₹{(costWithScrap - baseCostPerUnit).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-500">
                    Profit Margin ({profitMargin}%)
                  </span>
                  <span className="text-slate-500">
                    ₹{(sellingPricePerUnit - costWithScrap).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex justify-between text-lg font-bold text-slate-950">
                  <span>Selling Price / Unit</span>
                  <span>₹{sellingPricePerUnit.toFixed(2)}</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Volume Pricing
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[volume1, volume2, volume3].map((vol, i) => {
                      const c = computeCosts(parseFloat(vol || "0"));
                      return (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50"
                        >
                          <div className="text-xs font-semibold text-slate-700 mb-1">
                            Volume {i + 1}
                          </div>
                          <div className="text-sm text-slate-500">
                            {parseFloat(vol || "0").toLocaleString()} units
                          </div>
                          <div className="mt-1 flex justify-between text-sm">
                            <span className="text-slate-500">Unit Price</span>
                            <span className="font-medium text-slate-900">
                              ₹{c.withProfit.toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-1 flex justify-between text-sm">
                            <span className="text-slate-500">Total</span>
                            <span className="font-medium text-slate-900">
                              ₹{c.total.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Overhead Settings</CardTitle>
              <Button
                type="button"
                size="small"
                variant="outline"
                onClick={suggestWithAI}
                disabled={aiBusy}
              >
                <Sparkles className="mr-1.5 size-4" />{" "}
                {aiBusy ? "Suggesting..." : "AI Suggest"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {aiError && <p className="text-xs text-rose-600">{aiError}</p>}
              {aiNote && (
                <p className="text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded p-2">
                  {aiNote}
                </p>
              )}
              <div className="space-y-1">
                <label className="label-field">Scrap Percentage (%)</label>
                <Input
                  type="number"
                  value={scrapPct}
                  onChange={(e) => setScrapPct(e.target.value)}
                  className="w-full sm:w-24"
                />
              </div>
              <div className="space-y-1">
                <label className="label-field">Profit Margin (%)</label>
                <Input
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                  className="w-full sm:w-24"
                />
              </div>
              <div className="space-y-1">
                <label className="label-field">Labour Rate (₹/hr)</label>
                <Input
                  type="number"
                  value={labourRate}
                  disabled
                  className="w-full sm:w-24 bg-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="label-field">Power Rate (₹/hr)</label>
                <Input
                  type="number"
                  value={powerRate}
                  disabled
                  className="w-full sm:w-24 bg-slate-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
