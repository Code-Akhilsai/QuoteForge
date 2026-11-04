import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, BarChart3, Clock, Save, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { MOCK_RFQS, STATUS_LABELS, STATUS_BADGE } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/helpers";

export default function RFQManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      productName: "",
      quantity: "",
      priority: "medium",
      deadline: "",
    },
  });

  const filtered = MOCK_RFQS.filter((r) => {
    const matchesSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || r.productName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = () => {
    setOpenDialog(false);
    form.reset();
    navigate("/rfq");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-header">
        <div>
          <h1 className="section-title">RFQ Management</h1>
          <p className="section-subtitle">Manage customer Request for Quotation (RFQ) records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="small" onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 size-4" /> New RFQ
          </Button>
          <Button>
            <Save className="mr-2 size-4" /> Save Changes
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
                className="text-sm border border-slate-200 rounded-md bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="quoted">Quoted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="-space-y-px">
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden lg:table-cell">Contact</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right w-20">Qty</TableHead>
                    <TableHead className="text-right w-24">Est. Value</TableHead>
                    <TableHead className="text-center w-20">Status</TableHead>
                    <TableHead className="text-right w-16">Deadline</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-sm text-slate-500">
                        No RFQs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((rfq) => (
                      <TableRow key={rfq.id}>
                        <TableCell className="font-medium">{rfq.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{rfq.customerName}</div>
                          <div className="text-xs text-slate-500">{rfq.owner}</div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-slate-500">
                          {rfq.customerEmail}
                        </TableCell>
                        <TableCell className="font-medium">{rfq.productName}</TableCell>
                        <TableCell className="text-right">{rfq.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(rfq.estimatedValue)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={STATUS_BADGE[rfq.status]}>{STATUS_LABELS[rfq.status]}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">{formatDate(rfq.deadline)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Button size="small" variant="ghost" className="p-1.5" title="Edit">
                              <BarChart3 className="size-4" />
                            </Button>
                            <Button size="small" variant="ghost" className="p-1.5" title="Convert to Quotation">
                              <Clock className="size-4" />
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
        className={cn("fixed inset-0 z-50 flex items-center justify-center", openDialog ? "" : "hidden")}
        onClick={(e) => e.target === e.currentTarget && setOpenDialog(false)}
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenDialog(false)} />
        <div className="relative w-full max-w-lg p-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New RFQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Customer Name</label>
                    <Input placeholder="e.g. Precision Auto Components" {...form.register("customerName")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Customer Email</label>
                    <Input type="email" placeholder="e.g. buying@company.in" {...form.register("customerEmail")} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Customer Phone</label>
                    <Input type="tel" placeholder="+91 98765 43210" {...form.register("customerPhone")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Product Name</label>
                    <Input placeholder="e.g. Brake Caliper Housing" {...form.register("productName")} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label-field">Quantity</label>
                    <Input type="number" placeholder="Units" {...form.register("quantity")} required />
                  </div>
                  <div className="space-y-1">
                    <label className="label-field">Priority</label>
                    <select {...form.register("priority")} className="input-field">
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
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" size="small" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create RFQ</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
