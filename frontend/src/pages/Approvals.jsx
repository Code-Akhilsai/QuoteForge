import { useState } from "react";
import { CheckCircle2, AlertCircle, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { MOCK_APPROVALS, STATUS_LABELS, STATUS_BADGE } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/helpers";

export default function Approvals() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = MOCK_APPROVALS.filter((a) => {
    const matchesSearch = a.customerName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (id, action) => {
    // In a real app, this would call an API
    window.alert(`${action} approval ${id}`);
  };

  const pendingCount = MOCK_APPROVALS.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-header">
        <div>
          <h1 className="section-title">Approvals</h1>
          <p className="section-subtitle">Review and approve or reject quotation approval requests</p>
        </div>
        <Badge variant={pendingCount > 0 ? "danger" : "success"}>
          {pendingCount} pending
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-80">
              <User className="absolute left-3 top-3 size-5 text-slate-400" />
              <Input
                placeholder="Search approval # or customer..."
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
                <option value="pending">Pending</option>
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
                    <TableHead>Approval #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden lg:table-cell">Product</TableHead>
                    <TableHead className="text-right w-20">Amount</TableHead>
                    <TableHead className="text-center w-20">Requested By</TableHead>
                    <TableHead className="text-center w-20">Status</TableHead>
                    <TableHead className="text-right w-16">Priority</TableHead>
                    <TableHead className="text-right w-16">Date</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-sm text-slate-500">
                        No approval requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.id}</TableCell>
                        <TableCell className="font-medium">{a.customerName}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-slate-500">{a.productName}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(a.amount)}</TableCell>
                        <TableCell className="text-center text-sm text-slate-500">{a.requestedBy}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={STATUS_BADGE[a.status]}>{STATUS_LABELS[a.status]}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs text-slate-500 capitalize">{a.priority}</TableCell>
                        <TableCell className="text-right text-xs text-slate-500">{formatDate(a.requestedAt)}</TableCell>
                        <TableCell className="text-right">
                          {a.status === "pending" ? (
                            <div className="flex items-center gap-1">
                              <Button
                                size="small"
                                variant="success"
                                className="px-2"
                                onClick={() => handleAction(a.id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="danger"
                                className="px-2"
                                onClick={() => handleAction(a.id, "reject")}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button size="small" variant="outline" className="px-2" disabled>
                              {STATUS_LABELS[a.status]}
                            </Button>
                          )}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Pending Approvals</p>
                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              </div>
              <div className="rounded-full bg-amber-50 p-3 text-amber-600">
                <Clock className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Approved</p>
                <p className="text-2xl font-bold text-slate-900">
                  {MOCK_APPROVALS.filter((a) => a.status === "approved").length}
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Rejected</p>
                <p className="text-2xl font-bold text-slate-900">
                  {MOCK_APPROVALS.filter((a) => a.status === "rejected").length}
                </p>
              </div>
              <div className="rounded-full bg-rose-50 p-3 text-rose-600">
                <AlertCircle className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
