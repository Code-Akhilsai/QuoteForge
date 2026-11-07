import { BarChart3, Clock, Mail, DollarSign, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";
import { formatCurrency, ROLES } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, isRole } = useAuth();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadResult({
          success: true,
          message: data.message,
          created: data.created,
        });
      } else {
        setUploadResult({
          success: false,
          message: data.message || "Upload failed",
        });
      }
    } catch {
      setUploadResult({
        success: false,
        message: "Network error. Is the backend running on port 3000?",
      });
    } finally {
      setUploadLoading(false);
    }
  };

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
          <label className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors disabled:opacity-50">
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${uploadResult.success ? "bg-green-50 text-green-700 border-green-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}
            >
              {uploadResult.success ? "✓" : "✕"} {uploadResult.message}
              {uploadResult.created && uploadResult.created.rfqs && (
                <span className="ml-2">
                  ({uploadResult.created.rfqs} records)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid-stats">
        <StatCard
          title="RFQs in Estimating"
          value={0}
          subtitle="requests pending quote"
          icon={<BarChart3 className="size-5" />}
        />
        <StatCard
          title="Quotations Sent"
          value={0}
          subtitle="this month"
          icon={<Mail className="size-5" />}
        />
        <StatCard
          title="Pending Approvals"
          value={0}
          subtitle="awaiting review"
          icon={<Clock className="size-5" />}
        />
        <StatCard
          title="Total Quote Value"
          value={formatCurrency(0).replace("₹", "").trim()}
          subtitle="quoted this month"
          icon={<DollarSign className="size-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Pending Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-sm text-slate-500">
                No quotations found. Upload your data to see them here.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-12 text-sm text-slate-500">
                No recent activities. Upload your data to see activities here.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Approval Requests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-12 text-sm text-slate-500">
                No pending approvals.
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
