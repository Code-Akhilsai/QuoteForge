import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  BarChart3,
  Save,
  Plus,
  Sparkles,
  Calculator,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/utils/helpers";
import axios from "@/api";
import { useNavigate } from "react-router-dom";

export default function RFQManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rfqs, setRFQs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [aiText, setAiText] = useState("");
  const [aiNotes, setAiNotes] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/rfqs");
        setRFQs(res.data.rfqs || []);
      } catch {
        // ignore
      }
    };
    void load();
  }, []);

  const form = useForm({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      productName: "",
      quantity: "",
      priority: "medium",
      deadline: "",
      estimatedValue: "",
    },
  });

  const filtered = rfqs.filter((r) => {
    const matchesSearch =
      (r.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.productName || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.rfqNumber || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const editRFQ = async (data) => {
    if (!editingId) return;
    try {
      const res = await axios.put(`/rfqs/${editingId}`, {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        productName: data.productName,
        quantity: parseInt(data.quantity, 10),
        priority: data.priority || "medium",
        deadline: data.deadline || null,
        estimatedValue: parseFloat(data.estimatedValue) || 0,
        status: data.status || "estimating",
        lossReason: data.lossReason || "",
      });
      if (res.status === 200) {
        const load = async () => {
          try {
            const res2 = await axios.get("/rfqs");
            setRFQs(res2.data.rfqs || []);
          } catch {
            // ignore
          }
        };
        await load();
        setOpenDialog(false);
        setEditingId(null);
        form.reset();
        return;
      }
    } catch {
      // ignore
    }
  };

  const deleteRFQ = async (id) => {
    if (!window.confirm("Are you sure you want to delete this RFQ?")) return;
    try {
      await axios.delete(`/rfqs/${id}`);
      const load = async () => {
        try {
          const res2 = await axios.get("/rfqs");
          setRFQs(res2.data.rfqs || []);
        } catch {
          // ignore
        }
      };
      await load();
    } catch {
      // ignore
    }
  };

  const openEdit = (rfq) => {
    setEditingId(rfq._id);
    form.reset({
      customerName: rfq.customerName || "",
      customerEmail: rfq.customerEmail || "",
      customerPhone: rfq.customerPhone || "",
      productName: rfq.productName || "",
      quantity: rfq.quantity || "",
      priority: rfq.priority || "medium",
      deadline: rfq.deadline
        ? new Date(rfq.deadline).toISOString().slice(0, 10)
        : "",
      estimatedValue: rfq.estimatedValue || "",
      status: rfq.status || "estimating",
      lossReason: rfq.lossReason || "",
    });
    setOpenDialog(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setAiText("");
    setAiNotes("");
    setAiError("");
    form.reset({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      productName: "",
      quantity: "",
      priority: "medium",
      deadline: "",
      estimatedValue: "",
      status: "estimating",
      lossReason: "",
    });
    setOpenDialog(true);
  };

  const extractWithAI = async () => {
    if (!aiText.trim()) {
      setAiError("Paste RFQ email or text first.");
      return;
    }
    setAiBusy(true);
    setAiError("");
    try {
      const res = await axios.post("/ai/rfq-intake", { text: aiText });
      const d = res.data?.rfq || {};
      form.reset({
        ...form.getValues(),
        customerName: d.customerName || "",
        customerEmail: d.customerEmail || "",
        customerPhone: d.customerPhone || "",
        productName: d.productName || "",
        quantity: d.quantity ? String(d.quantity) : "",
        priority: d.priority || "medium",
        deadline: d.deadline || "",
        estimatedValue: d.estimatedValue ? String(d.estimatedValue) : "",
        status: "estimating",
        lossReason: form.getValues("lossReason") || "",
      });
      setAiNotes(d.notes || "");
    } catch (e) {
      setAiError(
        e?.response?.data?.message ||
          "AI extraction failed. You can still fill the form manually.",
      );
    } finally {
      setAiBusy(false);
    }
  };

  const convertToQuotation = async (rfq) => {
    const id = rfq._id || rfq.id;
    if (!id) return;
    try {
      const res = await axios.post("/quotations", {
        customerName: rfq.customerName || "Walk-in Customer",
        customerEmail: rfq.customerEmail || "",
        productName: rfq.productName || "Custom Part",
        quantity: rfq.quantity || 1,
        unitCost: 0,
        totalCost: 0,
        rfqId: id,
      });
      if (res.status === 201 || res.status === 200) {
        navigate("/cost-estimation", { state: { rfqId: id } });
      }
    } catch {
      // ignore
    }
  };

  const handleSubmit = () => {
    const values = form.getValues();
    if (editingId) {
      editRFQ(values);
    } else {
      addRFQ(values);
    }
  };

  const addRFQ = async (data) => {
    try {
      const res = await axios.post("/rfqs", {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        productName: data.productName,
        quantity: parseInt(data.quantity, 10),
        priority: data.priority || "medium",
        deadline: data.deadline || null,
        estimatedValue: parseFloat(data.estimatedValue) || 0,
        status: "estimating",
        lossReason: data.lossReason || "",
      });
      if (res.status === 201 || res.status === 200) {
        const load = async () => {
          try {
            const res2 = await axios.get("/rfqs");
            setRFQs(res2.data.rfqs || []);
          } catch {
            // ignore
          }
        };
        await load();
        setOpenDialog(false);
        form.reset();
        return;
      }
    } catch {
      // ignore
    }

    const newRFQ = {
      id: Date.now().toString(),
      rfqNumber: "RFQ-" + String(1000 + rfqs.length).padStart(4, "0"),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      productName: data.productName,
      quantity: parseInt(data.quantity, 10),
      priority: data.priority || "medium",
      deadline: data.deadline,
      estimatedValue: 0,
      status: "estimating",
      lossReason: data.lossReason || "",
      createdAt: new Date().toISOString(),
      owner: "",
    };
    setRFQs([...rfqs, newRFQ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-header">
        <div>
          <h1 className="section-title">RFQ Management</h1>
          <p className="section-subtitle">
            Manage customer Request for Quotation (RFQ) records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="small" onClick={() => openCreate()}>
            <Plus className="mr-2 size-4" /> New RFQ
          </Button>
          <Button
            onClick={() => {
              const load = async () => {
                try {
                  const res = await axios.get("/rfqs");
                  setRFQs(res.data.rfqs || []);
                } catch {
                  // ignore
                }
              };
              void load();
            }}
          >
            <Save className="mr-2 size-4" /> Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-72">
              <Mail className="absolute left-3 top-3 size-5 text-slate-400" />
              <Input
                placeholder="Search customer or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-md bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="estimating">Estimating</option>
                <option value="sent">Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 sm:p-6">
          <div className="-space-y-px">
            <TableContainer>
              <Table className="min-w-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Contact
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right w-20">Qty</TableHead>
                    <TableHead className="text-right w-24">
                      Est. Value
                    </TableHead>
                    <TableHead className="text-center w-20">Status</TableHead>
                    <TableHead className="text-right w-16">Deadline</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-sm text-slate-500"
                      >
                        No RFQs found. Add your first RFQ or upload data.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((rfq) => (
                      <TableRow key={rfq._id || rfq.id}>
                        <TableCell className="font-medium">
                          {rfq.rfqNumber}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{rfq.customerName}</div>
                          <div className="text-xs text-slate-500">
                            {rfq.owner || rfq.createdBy?.name || ""}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-slate-500">
                          {rfq.customerEmail}
                        </TableCell>
                        <TableCell className="font-medium">
                          {rfq.productName}
                        </TableCell>
                        <TableCell className="text-right">
                          {rfq.quantity}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(rfq.estimatedValue)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              rfq.status === "estimating"
                                ? "info"
                                : rfq.status === "sent"
                                  ? "warning"
                                  : rfq.status === "won"
                                    ? "success"
                                    : rfq.status === "lost"
                                      ? "danger"
                                      : "info"
                            }
                          >
                            {rfq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                          {rfq.deadline ? formatDate(rfq.deadline) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              size="small"
                              variant="ghost"
                              className="p-1.5"
                              title="Convert to Quotation"
                              onClick={() => convertToQuotation(rfq)}
                            >
                              <Calculator className="size-4" />
                            </Button>
                            <Button
                              size="small"
                              variant="ghost"
                              className="p-1.5"
                              title="Edit"
                              onClick={() => openEdit(rfq)}
                            >
                              <BarChart3 className="size-4" />
                            </Button>
                            <Button
                              size="small"
                              variant="ghost"
                              className="p-1.5 text-rose-500"
                              title="Delete"
                              onClick={() => deleteRFQ(rfq._id || rfq.id)}
                            >
                              <Trash2 className="size-4" />
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

      <div
        className={`fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 ${openDialog ? "" : "hidden"}`}
        onClick={(e) => e.target === e.currentTarget && setOpenDialog(false)}
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpenDialog(false)}
        />
        <div className="relative mx-auto flex min-h-full w-full max-w-lg items-start justify-center py-4 sm:items-center">
          <Card className="w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col overflow-hidden">
            <CardHeader className="shrink-0">
              <CardTitle>{editingId ? "Edit RFQ" : "Create New RFQ"}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto min-h-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-4"
              >
                {!editingId && (
                  <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <label className="label-field flex items-center gap-2 text-slate-900 font-semibold">
                      <Sparkles className="size-4 text-slate-700 shrink-0" /> AI
                      RFQ Intake (Gemini)
                    </label>
                    <textarea
                      value={aiText}
                      onChange={(e) => setAiText(e.target.value)}
                      rows={4}
                      placeholder="Paste RFQ email or text. AI will extract fields; review before creating."
                      className="w-full text-sm border border-slate-200 rounded-lg bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y min-h-24"
                    />
                    {aiError && (
                      <p className="text-xs text-rose-600">{aiError}</p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Button
                        type="button"
                        size="small"
                        variant="primary"
                        onClick={extractWithAI}
                        disabled={aiBusy}
                        className="shrink-0 self-start"
                      >
                        <Sparkles className="mr-1.5 size-4" />{" "}
                        {aiBusy ? "Extracting..." : "Extract with AI"}
                      </Button>
                      <span className="text-xs text-slate-600 leading-snug">
                        Review and edit extracted values below before creating
                        the RFQ.
                      </span>
                    </div>
                    {aiNotes && (
                      <p className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5">
                        <span className="font-medium text-slate-900">
                          AI notes:
                        </span>{" "}
                        {aiNotes}
                      </p>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Customer Name</label>
                    <Input
                      placeholder="e.g. Precision Auto Components"
                      {...form.register("customerName")}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Customer Email</label>
                    <Input
                      type="email"
                      placeholder="e.g. buying@company.in"
                      {...form.register("customerEmail")}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Customer Phone</label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...form.register("customerPhone")}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Product Name</label>
                    <Input
                      placeholder="e.g. Brake Caliper Housing"
                      {...form.register("productName")}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Quantity</label>
                    <Input
                      type="number"
                      placeholder="Units"
                      {...form.register("quantity")}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Estimated Value (₹)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...form.register("estimatedValue")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Priority</label>
                    <select
                      {...form.register("priority")}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="label-field">Deadline</label>
                  <Input type="date" {...form.register("deadline")} required />
                </div>
                <div className="space-y-1">
                  <label className="label-field">Loss Reason</label>
                  <Input
                    placeholder="Reason for losing this RFQ"
                    {...form.register("lossReason")}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Save RFQ" : "Create RFQ"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
