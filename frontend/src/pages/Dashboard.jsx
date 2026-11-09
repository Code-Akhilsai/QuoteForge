import { useEffect, useState } from "react";
import {
  BarChart3,
  Clock,
  Mail,
  Upload,
  RefreshCw,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
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
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, ROLES } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import axios from "@/api";

const STATUS_LABELS = {
  draft: "Draft",
  estimating: "Estimating",
  sent: "Sent",
  won: "Won",
  lost: "Lost",
};

const STATUS_BADGE = {
  draft: "info",
  estimating: "info",
  sent: "warning",
  won: "success",
  lost: "danger",
};

export default function Dashboard() {
  const { user, isRole } = useAuth();
  const [rfqs, setRfqs] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/rfqs");
        setRfqs(res.data.rfqs || []);
      } catch {
        // ignore
      }
    };
    void load();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setUploadResult({
          success: true,
          message: res.data.message,
          created: res.data.created,
        });
        const load2 = async () => {
          try {
            const res2 = await axios.get("/rfqs");
            setRfqs(res2.data.rfqs || []);
          } catch {
            // ignore
          }
        };
        void load2();
      } else {
        setUploadResult({
          success: false,
          message: res.data.message || "Upload failed",
        });
      }
    } catch {
      setUploadResult({
        success: false,
        message: "Network error. Is the backend running on port 3000?",
      });
    } finally {
      setUploadLoading(false);
      e.target.value = "";
    }
  };

  const stats = {
    openRFQs: rfqs.filter((r) => r.status === "estimating").length,
    totalQuotes: rfqs.length,
    pendingApprovals: rfqs.filter((r) => r.status === "sent").length,
    totalValue: rfqs.reduce((sum, r) => sum + (r.estimatedValue || 0), 0),
  };

  const recentQuotes = [...rfqs]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">
            Upload your RFQ data (CSV/Excel) to populate the dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
            <Upload className="size-4" />
            <span>{uploadLoading ? "Uploading..." : "Upload Data"}</span>
            <input
              type="file"
              accept=".csv,.json,.xlsx"
              className="hidden"
              onChange={handleUpload}
              disabled={uploadLoading}
            />
          </label>
          {uploadResult && (
            <div
              className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs font-medium border max-w-xl ${uploadResult.success ? "bg-green-50 text-green-700 border-green-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}
            >
              <span>
                {uploadResult.success ? "✓" : "✕"} {uploadResult.message}
              </span>
              {uploadResult.created?.errors?.length > 0 && (
                <span className="block text-rose-700 font-normal">
                  First issue: row {uploadResult.created.errors[0].row} —{" "}
                  {uploadResult.created.errors[0].error}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid-stats">
        <StatCard
          title="RFQs in Estimating"
          value={stats.openRFQs}
          subtitle="requests pending quote"
          icon={<BarChart3 className="size-5" />}
        />
        <StatCard
          title="Total RFQs"
          value={stats.totalQuotes}
          subtitle="this month"
          icon={<Mail className="size-5" />}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          subtitle="awaiting review"
          icon={<Clock className="size-5" />}
        />
        <StatCard
          title="Total Quote Value"
          value={formatCurrency(stats.totalValue)}
          subtitle="quoted this month"
          icon={<IndianRupee className="size-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Pending Quotations</CardTitle>
              <Button
                size="small"
                variant="outline"
                onClick={() => {
                  const load = async () => {
                    try {
                      const res = await axios.get("/rfqs");
                      setRfqs(res.data.rfqs || []);
                    } catch {
                      // ignore
                    }
                  };
                  void load();
                }}
              >
                <RefreshCw className="mr-1 size-4" /> Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="-space-y-px">
                <TableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RFQ #</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Customer
                        </TableHead>
                        <TableHead className="text-right w-20">
                          Amount
                        </TableHead>
                        <TableHead className="text-right w-20">
                          Status
                        </TableHead>
                        <TableHead className="text-right w-16">
                          Deadline
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentQuotes.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-sm text-slate-500"
                          >
                            No quotations found. Upload your data to see them
                            here.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentQuotes.map((q) => (
                          <TableRow key={q._id}>
                            <TableCell className="font-medium">
                              {q.rfqNumber}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {q.customerName}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(q.estimatedValue)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={STATUS_BADGE[q.status] ?? "info"}>
                                {STATUS_LABELS[q.status] ?? q.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-slate-500">
                              {formatDate(q.deadline || "-")}
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {recentQuotes.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-500">
                  No RFQs yet. Upload data or add an RFQ to see recent
                  activities.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentQuotes.map((q) => (
                    <div
                      key={q._id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500">
                            {q.rfqNumber}
                          </span>
                          <Badge variant={STATUS_BADGE[q.status] ?? "info"} className="text-[10px]">
                            {STATUS_LABELS[q.status] ?? q.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {q.customerName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {q.productName}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-slate-900">
                          {formatCurrency(q.estimatedValue)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDate(q.createdAt || q.deadline || "-")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Approval Requests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {recentQuotes
                  .filter((q) => q.status === "sent")
                  .map((q) => (
                    <Card
                      key={q._id}
                      className="p-3 border-none bg-transparent shadow-none hover:bg-slate-100/70 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500">
                          {q.rfqNumber}
                        </span>
                        <Badge variant="warning">{q.status}</Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-1">
                        {q.customerName}
                      </p>
                      <p className="text-xs text-slate-500 mb-3">
                        {q.productName}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {formatCurrency(q.estimatedValue)}
                        </span>
                        <Button
                          size="small"
                          variant="outline"
                          className="h-8 px-2"
                          onClick={() => (window.location.href = "/rfq")}
                        >
                          Review
                        </Button>
                      </div>
                    </Card>
                  ))}
                {recentQuotes.filter((q) => q.status === "sent").length ===
                  0 && (
                  <div className="text-center py-4 text-sm text-slate-500">
                    No pending approvals
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Role Access
                </h3>
                <p className="text-xs text-slate-500">
                  Logged in as {user?.name}
                </p>
              </div>
              <Badge variant="info">{user?.role}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">RFQ Management</span>
                <Badge variant="success">Access</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Rate Masters</span>
                <Badge
                  variant={isRole(ROLES.SALES_HEAD) ? "success" : "danger"}
                >
                  {isRole(ROLES.SALES_HEAD) ? "Access" : "Restricted"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Approvals</span>
                <Badge
                  variant={isRole(ROLES.SALES_HEAD) ? "success" : "danger"}
                >
                  {isRole(ROLES.SALES_HEAD) ? "Access" : "Restricted"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
