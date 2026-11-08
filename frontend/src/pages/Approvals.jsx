import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/utils/helpers";
import axios from "@/api";

const APPROVAL_THRESHOLD = 2500000;
const PENDING = new Set(["draft", "sent"]);

export default function Approvals() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [quotations, setQuotations] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/quotations");
      setQuotations(res.data.quotations || []);
      setError("");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load quotations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get("/quotations");
        if (cancelled) return;
        setQuotations(res.data.quotations || []);
        setError("");
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || "Failed to load quotations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const setStatus = async (q, status) => {
    const id = q._id || q.id;
    if (!id) return;
    setBusyId(id);
    setError("");
    try {
      await axios.patch(`/quotations/${id}/status`, { status });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || `Failed to ${status} quotation.`);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => quotations.filter((q) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (q.quotationNumber || "").toLowerCase().includes(term) ||
      (q.customerName || "").toLowerCase().includes(term) ||
      (q.productName || "").toLowerCase().includes(term);
    const matchesStatus =
      statusFilter === "all" ? true :
      statusFilter === "pending" ? PENDING.has(q.status) :
      q.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [quotations, search, statusFilter]);

  const pending = quotations.filter((q) => PENDING.has(q.status)).length;
  const highValuePending = quotations.filter((q) => PENDING.has(q.status) && (q.totalCost || 0) > APPROVAL_THRESHOLD).length;
  const approved = quotations.filter((q) => q.status === "approved").length;
  const rejected = quotations.filter((q) => q.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-header">
        <div>
          <h1 className="section-title">Approvals</h1>
          <p className="section-subtitle">Review quotations. Quotes above {formatCurrency(APPROVAL_THRESHOLD)} require Admin or Sales Head approval.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pending ? "warning" : "success"}>{pending} pending</Badge>
          <Button variant="outline" size="small" onClick={load} disabled={loading}>
            <RefreshCw className="mr-2 size-4" /> Refresh
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-80">
              <Input
                placeholder="Search quotation #, customer, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-md bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pending">Pending (draft/sent)</option>
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-500">Loading quotations...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No quotations found. Create a quotation from Cost Estimation to review it here.
            </div>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((q) => {
                    const id = q._id || q.id;
                    const highValue = (q.totalCost || 0) > APPROVAL_THRESHOLD;
                    const actionable = PENDING.has(q.status);
                    return (
                      <TableRow key={id}>
                        <TableCell className="font-medium">
                          {q.quotationNumber}
                          {highValue && <div className="text-[11px] text-amber-700">Above ₹25L threshold</div>}
                        </TableCell>
                        <TableCell>{q.customerName}</TableCell>
                        <TableCell>{q.productName}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(q.totalCost)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={q.status === "approved" ? "success" : q.status === "rejected" ? "danger" : q.status === "sent" ? "info" : "secondary"}>
                            {q.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">{q.createdAt ? formatDate(q.createdAt) : "—"}</TableCell>
                        <TableCell className="text-right">
                          {actionable ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button size="small" variant="success" onClick={() => setStatus(q, "approved")} disabled={busyId === id} title="Approve">
                                <Check className="size-3.5" />
                              </Button>
                              <Button size="small" variant="danger" onClick={() => setStatus(q, "rejected")} disabled={busyId === id} title="Reject">
                                <X className="size-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500 uppercase">Pending</p><p className="text-2xl font-bold text-slate-900">{pending}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500 uppercase">&gt; ₹25L Pending</p><p className="text-2xl font-bold text-amber-700">{highValuePending}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500 uppercase">Approved</p><p className="text-2xl font-bold text-emerald-700">{approved}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500 uppercase">Rejected</p><p className="text-2xl font-bold text-rose-700">{rejected}</p></CardContent></Card>
      </div>
    </div>
  );
}
