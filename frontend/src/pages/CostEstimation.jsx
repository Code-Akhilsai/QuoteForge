import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calculator, Plus, Trash2, Download, Printer, BarChart3, Truck, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

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
  scrapPercentage: 5,
  profitMarginPercentage: 15,
};

export default function CostEstimation() {
  const [operations, setOperations] = useState([{ ...DEFAULT_OPERATION, id: 1 }]);
  const [materials] = useState([]);
  const [machines] = useState([]);  const [materialSelection, setMaterialSelection] = useState("");
  const [materialQty, setMaterialQty] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [volume1, setVolume1] = useState("100");
  const [volume2, setVolume2] = useState("500");
  const [volume3, setVolume3] = useState("1000");
  const [scrapPct, setScrapPct] = useState(OVERHEAD_DEFAULTS.scrapPercentage.toString());
  const [profitMargin, setProfitMargin] = useState(OVERHEAD_DEFAULTS.profitMarginPercentage.toString());

  const computeCosts = (vol) => {
    const matCost = material ? (material.rate * parseFloat(materialQty || "0")) / vol : 0;
    const machCost = operations.reduce((sum, op) => sum + op.ratePerHour * op.hours, 0) / vol;
    const labourCost = (labourRate * totalHours) / vol;
    const powerCost = (powerRate * totalHours) / vol;
    const base = matCost + machCost + labourCost + powerCost;
    const withScrap = base * (1 + parseFloat(scrapPct) / 100);
    const withProfit = withScrap * (1 + parseFloat(profitMargin) / 100);
    return {
      material: matCost,
      machining: machCost,
      labour: labourCost,
      power: powerCost,
      base,
      withScrap,
      withProfit,
      total: withProfit * vol,
    };
  };

  const form = useForm({
    defaultValues: {
      customerName: "",
      productName: "",
      rfqId: "",
    },
  });

  const material = materials.find((m) => m.id === materialSelection);

  const materialCostPerUnit = material && materialQty
    ? (material.rate * parseFloat(materialQty)) / parseFloat(quantity || 1)
    : 0;

  const machiningCostPerUnit =
    operations.reduce((sum, op) => sum + op.ratePerHour * op.hours, 0) / parseFloat(quantity || 1);

  const labourRate = OVERHEAD_DEFAULTS.labourRatePerHour;
  const powerRate = OVERHEAD_DEFAULTS.powerRatePerHour;
  const totalHours = operations.reduce((sum, op) => sum + op.hours, 0);
  const labourCostPerUnit = (labourRate * totalHours) / parseFloat(quantity || 1);
  const powerCostPerUnit = (powerRate * totalHours) / parseFloat(quantity || 1);

  const baseCostPerUnit = materialCostPerUnit + machiningCostPerUnit + labourCostPerUnit + powerCostPerUnit;
  const scrapFactor = 1 + parseFloat(scrapPct) / 100;
  const costWithScrap = baseCostPerUnit * scrapFactor;
  const profitFactor = 1 + parseFloat(profitMargin) / 100;
  const sellingPricePerUnit = costWithScrap * profitFactor;

  const breakdown = [
    { label: "Material Cost", value: materialCostPerUnit, icon: Truck },
    { label: "Machining Cost", value: machiningCostPerUnit, icon: Package },
    { label: "Labour Cost", value: labourCostPerUnit, icon: BarChart3 },
    { label: "Power & Overhead", value: powerCostPerUnit, icon: Package },
  ];

  function addOperation() {
    setOperations([...operations, { ...DEFAULT_OPERATION, id: Date.now() }]);
  }

  function removeOperation(id) {
    setOperations(operations.filter((o) => o.id !== id));
  }

  function updateOperation(id, field, value) {
    setOperations(operations.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Cost Estimation</h1>
          <p className="section-subtitle">Add materials and machines via upload or manually to calculate costs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small">
            <Printer className="mr-2 size-4" /> Print Estimate
          </Button>
          <Button>
            <Download className="mr-2 size-4" /> Create Quotation
          </Button>
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
              <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Customer Name</label>
                    <Input placeholder="Customer name" {...form.register("customerName")} />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">RFQ Reference</label>
                    <Input placeholder="e.g. RFQ-1001" {...form.register("rfqId")} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="label-field">Product Name</label>
                  <Input placeholder="e.g. Brake Caliper Housing" {...form.register("productName")} required />
                </div>
                <div className="space-y-1">
                  <label className="label-field">Order Quantity (units)</label>
                    <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="label-field">Volume Pricing (units)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Volume 1</label>
                      <Input type="number" value={volume1} onChange={(e) => setVolume1(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Volume 2</label>
                      <Input type="number" value={volume2} onChange={(e) => setVolume2(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Volume 3</label>
                      <Input type="number" value={volume3} onChange={(e) => setVolume3(e.target.value)} />
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
                <Select
                  value={materialSelection}
                  onValueChange={setMaterialSelection}
                  className="w-full"
                >
                  <option value="">Choose a material</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (₹{m.rate}/{m.unit})
                    </option>
                  ))}
                </Select>
                {materials.length === 0 && (
                  <p className="text-xs text-slate-500">No materials available. Add via Rate Masters or upload data.</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="label-field">Material Required (kg)</label>
                <Input type="number" value={materialQty} onChange={(e) => setMaterialQty(e.target.value)} />
              </div>
              {material && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Material Rate</span>
                    <span className="font-medium text-slate-900">₹{material.rate} / {material.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-500">Material Cost / Unit</span>
                    <span className="font-semibold text-indigo-600">₹{materialCostPerUnit.toFixed(2)}</span>
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
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-slate-500 uppercase mb-1 px-1">
                  <div className="col-span-3">Machine</div>
                  <div className="col-span-1 text-right">Rate/hr</div>
                  <div className="col-span-1 text-right">Hours</div>
                  <div className="col-span-1 text-right">Cost</div>
                </div>
                {operations.map((op) => {
                  const machine = machines.find((m) => m.id === op.machineId);
                  const cost = (machine?.ratePerHour || 0) * op.hours;
                  return (
                    <div key={op.id} className="grid grid-cols-6 gap-2 items-center px-2 py-2 bg-slate-50 rounded border border-slate-100">
                      <div className="col-span-3">
                        <Select value={op.machineId} onValueChange={(v) => {
                          const m = machines.find((mm) => mm.id === v);
                          updateOperation(op.id, "machineId", v);
                          updateOperation(op.id, "machineName", m?.name ?? "");
                          updateOperation(op.id, "ratePerHour", m?.ratePerHour ?? 0);
                        }} className="w-full px-1 py-1 text-sm">
                          <option value="">Select machine</option>
                          {machines.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </Select>
                        {machines.length === 0 && (
                          <p className="text-xs text-slate-500">No machines available.</p>
                        )}
                      </div>
                      <div className="col-span-1 text-right text-sm font-medium">{machine?.ratePerHour?.toFixed(0) ?? "-"}</div>
                      <div className="col-span-1 text-right">
                        <Input type="number" value={op.hours.toString()} onChange={(e) => updateOperation(op.id, "hours", parseFloat(e.target.value) || 0)} className="h-8 px-1 text-sm text-right" />
                      </div>
                      <div className="col-span-1 text-right text-sm font-medium">₹{cost.toFixed(0)}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button size="small" variant="ghost" className="p-1" title="Remove" onClick={() => removeOperation(op.id)}>
                          <Trash2 className="size-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
                <div key={item.label} className="flex justify-between text-sm border-b border-slate-100 pb-2 last:border-0">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-medium text-slate-900">₹{item.value.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between text-sm font-semibold text-slate-900">
                  <span>Base Cost / Unit</span>
                  <span>₹{baseCostPerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-500">Scrap ({scrapPct}%)</span>
                  <span className="text-slate-500">₹{(costWithScrap - baseCostPerUnit).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-500">Profit Margin ({profitMargin}%)</span>
                  <span className="text-slate-500">₹{(sellingPricePerUnit - costWithScrap).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex justify-between text-lg font-bold text-indigo-600">
                  <span>Selling Price / Unit</span>
                  <span>₹{sellingPricePerUnit.toFixed(2)}</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Volume Pricing</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[volume1, volume2, volume3].map((vol, i) => {
                      const c = computeCosts(parseFloat(vol || "0"));
                      return (
                        <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                          <div className="text-xs font-semibold text-slate-700 mb-1">Volume {i + 1}</div>
                          <div className="text-sm text-slate-500">{parseFloat(vol || "0").toLocaleString()} units</div>
                          <div className="mt-1 flex justify-between text-sm">
                            <span className="text-slate-500">Unit Price</span>
                            <span className="font-medium text-indigo-600">₹{c.withProfit.toFixed(2)}</span>
                          </div>
                          <div className="mt-1 flex justify-between text-sm">
                            <span className="text-slate-500">Total</span>
                            <span className="font-medium text-slate-900">₹{c.total.toFixed(0)}</span>
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
            <CardHeader>
              <CardTitle>Overhead Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-1">
                <label className="label-field">Scrap Percentage (%)</label>
                <Input type="number" value={scrapPct} onChange={(e) => setScrapPct(e.target.value)} className="w-24" />
              </div>
              <div className="space-y-1">
                <label className="label-field">Profit Margin (%)</label>
                <Input type="number" value={profitMargin} onChange={(e) => setProfitMargin(e.target.value)} className="w-24" />
              </div>
              <div className="space-y-1">
                <label className="label-field">Labour Rate (₹/hr)</label>
                <Input type="number" value={labourRate} disabled className="w-24 bg-slate-100" />
              </div>
              <div className="space-y-1">
                <label className="label-field">Power Rate (₹/hr)</label>
                <Input type="number" value={powerRate} disabled className="w-24 bg-slate-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
