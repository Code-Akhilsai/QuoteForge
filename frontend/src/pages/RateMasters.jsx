import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Save, Edit, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import axios from "@/api";

const CATEGORY_COLOR = {
  Ferrous: "bg-slate-100 text-slate-700",
  "Non-Ferrous": "bg-slate-100 text-slate-800",
  Machining: "bg-emerald-50 text-emerald-700",
  Finishing: "bg-amber-50 text-amber-700",
  Fabrication: "bg-rose-50 text-rose-700",
};

const toDateInput = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");
const rowId = (r) => r._id || r.id;
const rateValue = (r) => r.rate ?? r.ratePerHour ?? 0;

export default function RateMasters() {
  const [activeTab, setActiveTab] = useState("materials");
  const [materials, setMaterials] = useState([]);
  const [machines, setMachines] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const form = useForm({
    defaultValues: { name: "", unit: "kg", rate: "", category: "Ferrous", effectiveDate: new Date().toISOString().slice(0, 10), endDate: "" },
  });
  const unit = useWatch({ control: form.control, name: "unit" });
  const category = useWatch({ control: form.control, name: "category" });

  const load = useCallback(async () => {
    try {
      const res = await axios.get("/rate-masters");
      const allRates = res.data.rates || [];
      setMaterials(allRates.filter((r) => r.type === "material"));
      setMachines(allRates.filter((r) => r.type === "machine"));
      setError("");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load rate masters.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get("/rate-masters");
        if (cancelled) return;
        const allRates = res.data.rates || [];
        setMaterials(allRates.filter((r) => r.type === "material"));
        setMachines(allRates.filter((r) => r.type === "machine"));
        setError("");
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || "Failed to load rate masters.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const resetForm = (tab = activeTab) => {
    form.reset({
      name: "",
      unit: tab === "machines" ? "hour" : "kg",
      rate: "",
      category: tab === "machines" ? "Machining" : "Ferrous",
      effectiveDate: new Date().toISOString().slice(0, 10),
      endDate: "",
    });
    setEditId(null);
  };

  const startEdit = (item, tab) => {
    setActiveTab(tab);
    setEditId(rowId(item));
    form.reset({
      name: item.name || "",
      unit: item.unit || (tab === "machines" ? "hour" : "kg"),
      rate: String(rateValue(item)),
      category: item.category || (tab === "machines" ? "Machining" : "Ferrous"),
      effectiveDate: toDateInput(item.effectiveDate) || new Date().toISOString().slice(0, 10),
      endDate: toDateInput(item.endDate),
    });
    setError("");
  };

  const saveMaterial = async (data) => {
    setBusy(true);
    setError("");
    const payload = {
      type: "material",
      name: data.name,
      unit: data.unit || "kg",
      rate: parseFloat(data.rate),
      category: data.category || "Ferrous",
      effectiveDate: data.effectiveDate || new Date().toISOString(),
      endDate: data.endDate || null,
    };
    try {
      if (editId) await axios.put(`/rate-masters/${editId}`, payload);
      else await axios.post("/rate-masters", payload);
      await load();
      resetForm("materials");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save material rate.");
    } finally {
      setBusy(false);
    }
  };

  const saveMachine = async (data) => {
    setBusy(true);
    setError("");
    const payload = {
      type: "machine",
      name: data.name,
      unit: data.unit || "hour",
      rate: parseFloat(data.rate),
      category: data.category || "Machining",
      effectiveDate: data.effectiveDate,
      endDate: data.endDate || null,
    };
    try {
      if (editId) await axios.put(`/rate-masters/${editId}`, payload);
      else await axios.post("/rate-masters", payload);
      await load();
      resetForm("machines");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save machine rate.");
    } finally {
      setBusy(false);
    }
  };

  const removeRate = async (item) => {
    const id = rowId(item);
    if (!id) return;
    setBusy(true);
    setError("");
    try {
      await axios.delete(`/rate-masters/${id}`);
      if (editId === id) resetForm();
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete rate.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Rate Masters</h1>
          <p className="section-subtitle">Add material and machine rates with effective dates</p>
        </div>
        <Button variant="outline" size="small" onClick={load} disabled={busy}>
          <Save className="mr-2 size-4" /> Refresh
        </Button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex gap-2">
        <Button
          variant={activeTab === "materials" ? "primary" : "outline"}
          size="small"
          onClick={() => { setActiveTab("materials"); resetForm("materials"); }}
        >
          Material Rates
        </Button>
        <Button
          variant={activeTab === "machines" ? "primary" : "outline"}
          size="small"
          onClick={() => { setActiveTab("machines"); resetForm("machines"); }}
        >
          Machine Rates
        </Button>
      </div>

      {activeTab === "materials" ? (
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>{editId ? "Edit Material Rate" : "Material Rate Master"}</CardTitle>
            {editId && (
              <Button size="small" variant="outline" onClick={() => resetForm("materials")}>
                <X className="mr-1 size-4" /> Cancel
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form onSubmit={form.handleSubmit(saveMaterial)} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="label-field">Material Name</label>
                    <Input placeholder="e.g. Mild Steel Sheet" {...form.register("name")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Unit</label>
                    <Select value={unit} onValueChange={(v) => form.setValue("unit", v)} className="w-full px-1 py-1 text-sm">
                      <option value="kg">kg</option>
                      <option value="meter">meter</option>
                      <option value="piece">piece</option>
                      <option value="ton">ton</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Rate (₹)</label>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...form.register("rate")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Category</label>
                    <Select value={category} onValueChange={(v) => form.setValue("category", v)} className="w-full px-1 py-1 text-sm">
                      <option value="Ferrous">Ferrous</option>
                      <option value="Non-Ferrous">Non-Ferrous</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Effective Date</label>
                    <Input type="date" {...form.register("effectiveDate")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">End Date</label>
                    <Input type="date" {...form.register("endDate")} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="small" disabled={busy}>{editId ? "Update Material" : "Add Material"}</Button>
                </div>
              </form>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-center w-16">Unit</TableHead>
                      <TableHead className="text-right w-20">Rate (₹)</TableHead>
                      <TableHead className="w-24">Category</TableHead>
                      <TableHead className="text-right w-20">Effective</TableHead>
                      <TableHead className="text-right w-20">End Date</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-sm text-slate-500">
                          No materials found. Add your first material rate.
                        </TableCell>
                      </TableRow>
                    ) : (
                      materials.map((m) => (
                        <TableRow key={rowId(m)}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-center text-sm text-slate-500">{m.unit}</TableCell>
                          <TableCell className="text-right font-medium">₹{rateValue(m)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={m.category === "Ferrous" ? "secondary" : "info"} className="text-[10px] px-2 py-1">{m.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-500">{toDateInput(m.effectiveDate)}</TableCell>
                          <TableCell className="text-right text-xs text-slate-500">{toDateInput(m.endDate) || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1">
                              <Button size="small" variant="ghost" className="p-1" title="Edit" onClick={() => startEdit(m, "materials")} disabled={busy}><Edit className="size-3.5" /></Button>
                              <Button size="small" variant="ghost" className="p-1 text-rose-500" title="Delete" onClick={() => removeRate(m)} disabled={busy}>
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>{editId ? "Edit Machine Rate" : "Machine Rate Master"}</CardTitle>
            {editId && (
              <Button size="small" variant="outline" onClick={() => resetForm("machines")}>
                <X className="mr-1 size-4" /> Cancel
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form onSubmit={form.handleSubmit(saveMachine)} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="label-field">Machine Name</label>
                    <Input placeholder="e.g. CNC Milling" {...form.register("name")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Rate / Hour (₹)</label>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...form.register("rate")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Category</label>
                    <Select value={category} onValueChange={(v) => form.setValue("category", v)} className="w-full px-1 py-1 text-sm">
                      <option value="Machining">Machining</option>
                      <option value="Finishing">Finishing</option>
                      <option value="Fabrication">Fabrication</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Effective Date</label>
                    <Input type="date" {...form.register("effectiveDate")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">End Date</label>
                    <Input type="date" {...form.register("endDate")} />
                  </div>
                  <div className="flex items-end col-span-1">
                    <Button type="submit" size="small" disabled={busy}>{editId ? "Update Machine" : "Add Machine"}</Button>
                  </div>
                </div>
              </form>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Machine</TableHead>
                      <TableHead className="text-right w-20">Rate / Hour (₹)</TableHead>
                      <TableHead className="w-24">Category</TableHead>
                      <TableHead className="text-right w-20">Effective</TableHead>
                      <TableHead className="text-right w-20">End Date</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-sm text-slate-500">
                          No machines found. Add your first machine rate.
                        </TableCell>
                      </TableRow>
                    ) : (
                      machines.map((m) => (
                        <TableRow key={rowId(m)}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-right font-medium">₹{rateValue(m)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={CATEGORY_COLOR[m.category] || "secondary"} className="text-[10px] px-2 py-1">{m.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-500">{toDateInput(m.effectiveDate)}</TableCell>
                          <TableCell className="text-right text-xs text-slate-500">{toDateInput(m.endDate) || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1">
                              <Button size="small" variant="ghost" className="p-1" title="Edit" onClick={() => startEdit(m, "machines")} disabled={busy}><Edit className="size-3.5" /></Button>
                              <Button size="small" variant="ghost" className="p-1 text-rose-500" title="Delete" onClick={() => removeRate(m)} disabled={busy}>
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
