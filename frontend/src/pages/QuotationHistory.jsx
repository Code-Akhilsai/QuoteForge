import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
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
import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import axios from "@/api";

const APPROVAL_THRESHOLD = 2500000;

export default function QuotationHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quotations, setQuotations] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [draftBusyId, setDraftBusyId] = useState(null);
  const [draft, setDraft] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const res = await axios.get("/quotations");
      setQuotations(res.data.quotations || []);
      setError("");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load quotations.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get("/quotations");
        if (cancelled) return;
        setQuotations(res.data.quotations || []);
      } catch (e) {
        if (!cancelled)
          setError(e?.response?.data?.message || "Failed to load quotations.");
      }
    })();
    return () => {
      cancelled = true;
    };
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
      setError(
        e?.response?.data?.message || `Failed to set status to ${status}.`,
      );
    } finally {
      setBusyId(null);
    }
  };

  const draftWithAI = async (q) => {
    const id = q._id || q.id;
    if (!id) return;
    setDraftBusyId(id);
    setError("");
    try {
      const res = await axios.post("/ai/quotation-draft", {
        quotationNumber: q.quotationNumber,
        customerName: q.customerName,
        customerEmail: q.customerEmail,
        productName: q.productName,
        quantity: q.quantity,
        unitCost: q.unitCost,
        totalCost: q.totalCost,
        status: q.status,
        validTill: q.validTill,
        createdAt: q.createdAt,
      });
      setDraft({
        quotationNumber: q.quotationNumber,
        ...(res.data?.draft || {}),
      });
    } catch (e) {
      setError(e?.response?.data?.message || "AI quotation draft failed.");
    } finally {
      setDraftBusyId(null);
    }
  };

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      (q.quotationNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.productName || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-header">
        <div>
          <h1 className="section-title">Quotation History</h1>
          <p className="section-subtitle">
            View quotations and update status. Quotes above{" "}
            {formatCurrency(APPROVAL_THRESHOLD)} need Admin/Sales Head approval.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" onClick={() => window.print()}>
            Print
          </Button>
          <Button size="small" onClick={() => navigate("/cost-estimation")}>
            New Quotation
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {draft && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                AI Draft — {draft.quotationNumber}
              </h3>
              {draft.notes && (
                <p className="text-xs text-slate-500">{draft.notes}</p>
              )}
            </div>
            <Button
              size="small"
              variant="ghost"
              onClick={() => setDraft(null)}
              title="Close"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {draft.subject && (
              <p className="text-sm">
                <span className="font-medium">Subject:</span> {draft.subject}
              </p>
            )}
            <textarea
              readOnly
              value={draft.body || ""}
              rows={10}
              className="w-full text-sm border border-slate-200 rounded-md bg-slate-50 px-3 py-2"
            />
            <Button
              size="small"
              variant="outline"
              onClick={() =>
                navigator.clipboard?.writeText(
                  `Subject: ${draft.subject || ""}\n\n${draft.body || ""}`,
                )
              }
            >
              Copy Draft
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-80">
              <Input
                placeholder="Search quotation # or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-md bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No quotations found. Generate a quotation from Cost Estimation to
              see it here.
            </div>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((q) => {
                    const id = q._id || q.id;
                    const actionable =
                      q.status === "draft" || q.status === "sent";
                    return (
                      <TableRow key={id}>
                        <TableCell className="font-medium">
                          {q.quotationNumber}
                          {(q.totalCost || 0) > APPROVAL_THRESHOLD && (
                            <div className="text-[11px] text-amber-700">
                              Above ₹25L
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{q.customerName}</TableCell>
                        <TableCell>{q.productName}</TableCell>
                        <TableCell className="text-right">
                          {q.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(q.unitCost)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(q.totalCost)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              q.status === "approved"
                                ? "success"
                                : q.status === "rejected"
                                  ? "danger"
                                  : "info"
                            }
                          >
                            {q.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                          {q.createdAt ? formatDate(q.createdAt) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="small"
                              variant="ghost"
                              onClick={() => draftWithAI(q)}
                              disabled={draftBusyId === id}
                              title="AI draft"
                            >
                              <Sparkles className="size-4" />
                            </Button>
                            {actionable ? (
                              <>
                                <Button
                                  size="small"
                                  variant="outline"
                                  onClick={() => setStatus(q, "approved")}
                                  disabled={busyId === id}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="ghost"
                                  className="text-rose-600"
                                  onClick={() => setStatus(q, "rejected")}
                                  disabled={busyId === id}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : null}
                          </div>
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
    </div>
  );
}
