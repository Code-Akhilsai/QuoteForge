import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { MOCK_RATE_MASTERS } from "@/data/mockData";

const CATEGORY_COLOR = {
  Ferrous: "bg-slate-100 text-slate-700",
  "Non-Ferrous": "bg-indigo-50 text-indigo-700",
  Machining: "bg-emerald-50 text-emerald-700",
  Finishing: "bg-amber-50 text-amber-700",
  Fabrication: "bg-rose-50 text-rose-700",
};

export default function RateMasters() {
  const [activeTab, setActiveTab] = useState("materials");
  const [materials, setMaterials] = useState([...MOCK_RATE_MASTERS.materials]);
  const [machines, setMachines] = useState([...MOCK_RATE_MASTERS.machines]);

  const form = useForm({
    defaultValues: { name: "", unit: "kg", rate: "", category: "Ferrous" },
  });

  const addMaterial = (data) => {
    const newItem = {
      id: "M-" + String(100 + materials.length).padStart(3, "0"),
      name: data.name,
      unit: data.unit,
      rate: parseFloat(data.rate),
      category: data.category,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setMaterials([...materials, newItem]);
    form.reset();
  };

  const addMachine = (data) => {
    const newItem = {
      id: "MC-" + String(100 + machines.length).padStart(3, "0"),
      name: data.name,
      ratePerHour: parseFloat(data.rate),
      category: data.category,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setMachines([...machines, newItem]);
    form.reset();
  };

  const deleteMaterial = (id) => setMaterials(materials.filter((m) => m.id !== id));
  const deleteMachine = (id) => setMachines(machines.filter((m) => m.id !== id));

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Rate Masters</h1>
          <p className="section-subtitle">Manage material and machine rates used for cost estimation</p>
        </div>
        <Button variant="outline" size="small">
          <Save className="mr-2 size-4" /> Save All
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === "materials" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("materials")}
        >
          Material Rates
        </Button>
        <Button
          variant={activeTab === "machines" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("machines")}
        >
          Machine Rates
        </Button>
      </div>

      {activeTab === "materials" ? (
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Material Rate Master</CardTitle>
            <Button size="small" onClick={() => {}}>
              <Plus className="mr-1 size-4" /> Add Material
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); addMaterial(form.getValues()); }} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="label-field">Material Name</label>
                    <Input placeholder="e.g. Mild Steel Sheet" {...form.register("name")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Unit</label>
                    <Select value={form.getValues().unit} onValueChange={form.setValue("unit")} className="w-full px-1 py-1 text-sm">
                      <option value="kg">kg</option>
                      <option value="meter">meter</option>
                      <option value="piece">piece</option>
                      <option value="ton">ton</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Rate (₹)</label>
                    <Input type="number" placeholder="0.00" {...form.register("rate")} required />
                  </div>
                  <div className="space-y-1 flex items-end">
                    <label className="label-field">Category</label>
                    <Select value={form.getValues().category} onValueChange={form.setValue("category")} className="w-full px-1 py-1 text-sm">
                      <option value="Ferrous">Ferrous</option>
                      <option value="Non-Ferrous">Non-Ferrous</option>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="small">Add Material</Button>
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
                      <TableHead className="text-right w-16">Updated</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-center text-sm text-slate-500">{m.unit}</TableCell>
                        <TableCell className="text-right font-medium">₹{m.rate}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={m.category === "Ferrous" ? "secondary" : "info"} className="text-[10px] px-2 py-1">{m.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">{m.updatedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Button size="small" variant="ghost" className="p-1" title="Edit"><Edit className="size-3.5" /></Button>
                            <Button size="small" variant="ghost" className="p-1 text-rose-500" title="Delete" onClick={() => deleteMaterial(m.id)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Machine Rate Master</CardTitle>
            <Button size="small" onClick={() => {}}>
              <Plus className="mr-1 size-4" /> Add Machine
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); addMachine(form.getValues()); }} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="label-field">Machine Name</label>
                    <Input placeholder="e.g. CNC Milling" {...form.register("name")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Rate / Hour (₹)</label>
                    <Input type="number" placeholder="0.00" {...form.register("rate")} required />
                  </div>
                  <div className="space-y-1 flex items-end">
                    <label className="label-field">Category</label>
                    <Select value={form.getValues().category} onValueChange={form.setValue("category")} className="w-full px-1 py-1 text-sm">
                      <option value="Machining">Machining</option>
                      <option value="Finishing">Finishing</option>
                      <option value="Fabrication">Fabrication</option>
                    </Select>
                  </div>
                  <div className="flex items-end col-span-1">
                    <Button type="submit" size="small">Add Machine</Button>
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
                      <TableHead className="text-right w-16">Updated</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machines.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-right font-medium">₹{m.ratePerHour}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={CATEGORY_COLOR[m.category] || "secondary"} className="text-[10px] px-2 py-1">{m.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">{m.updatedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Button size="small" variant="ghost" className="p-1" title="Edit"><Edit className="size-3.5" /></Button>
                            <Button size="small" variant="ghost" className="p-1 text-rose-500" title="Delete" onClick={() => deleteMachine(m.id)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
