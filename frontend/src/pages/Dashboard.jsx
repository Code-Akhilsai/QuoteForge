import { BarChart3, Clock, Mail, CheckCircle2, AlertCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { MOCK_RFQS, MOCK_QUOTATIONS, MOCK_APPROVALS, MOCK_ACTIVITIES, STATUS_LABELS, STATUS_BADGE } from "@/data/mockData";
import { formatCurrency, formatDate, ROLES } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";

const STATUS_ICONS = {
  open: BarChart3,
  sent: Mail,
  pending: Clock,
  approved: CheckCircle2,
  rejected: AlertCircle,
};

export default function Dashboard() {
  const { user, isRole } = useAuth();

  const openRFQs = MOCK_RFQS.filter((r) => r.status === "open").length;
  const totalQuotes = MOCK_QUOTATIONS.length;
  const pendingApprovals = MOCK_APPROVALS.filter((a) => a.status === "pending").length;
  const totalValue = MOCK_QUOTATIONS.reduce((sum, q) => sum + q.totalCost, 0);

  const recentQuotes = [...MOCK_QUOTATIONS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Overview of RFQ statistics, pending quotations, approvals, and recent activities</p>
        </div>
        <Button variant="outline" size="small">
          <DollarSign className="mr-2 size-4" /> Export Report
        </Button>
      </div>

      <div className="grid-stats">
        <StatCard
          title="Active RFQs"
          value={openRFQs}
          subtitle="requests pending quote"
          trend="up"
          trendLabel="12% vs last month"
          icon={<BarChart3 className="size-5" />}
        />
        <StatCard
          title="Quotations Sent"
          value={totalQuotes}
          subtitle="this month"
          trend="up"
          trendLabel="8% vs last month"
          icon={<Mail className="size-5" />}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals}
          subtitle={isRole(ROLES.SALES_HEAD) ? "awaiting your sign-off" : "awaiting sales head"}
          trend="down"
          trendLabel="3 cleared this week"
          icon={<Clock className="size-5" />}
        />
        <StatCard
  title="Total Quote Value"
  value={formatCurrency(totalValue).replace("₹", "").trim()}
  subtitle="quoted this month"
  trend="up"
  trendLabel={`₹${totalValue.toLocaleString()}`}
          icon={<DollarSign className="size-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Pending Quotations</CardTitle>
              <Button size="small" variant="outline">
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="-space-y-px">
                <TableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quotation #</TableHead>
                        <TableHead className="lg:hidden">Customer</TableHead>
                        <TableHead className="text-right w-20">Amount</TableHead>
                        <TableHead className="text-right w-20">Status</TableHead>
                        <TableHead className="text-right w-16">Valid Till</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentQuotes.map((q) => (
                        <TableRow key={q.id}>
                          <TableCell className="font-medium">{q.id}</TableCell>
                          <TableCell className="hidden lg:table-cell">{q.customerName}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(q.totalCost)}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={STATUS_BADGE[q.status]}>{STATUS_LABELS[q.status]}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-500">{formatDate(q.validTill)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {MOCK_ACTIVITIES.map((a) => {
                  const Icon = STATUS_ICONS[a.status] ?? BarChart3;
                  return (
                    <div key={a.id} className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Icon className="size-4" />
                      </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{a.action}</p>
                      <p className="text-xs text-slate-500">{a.time}</p>
                    </div>
                    <Badge variant={STATUS_BADGE[a.status]} className="shrink-0">{STATUS_LABELS[a.status]}</Badge>
                  </div>
                );
              })}
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
              <div className="space-y-3">
                {MOCK_APPROVALS.filter((a) => a.status === "pending").map((a) => (
                  <Card key={a.id} className="p-3 border-none bg-transparent shadow-none hover:bg-indigo-50/50 transition-colors group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">{a.id}</span>
                      <Badge variant={STATUS_BADGE[a.priority]}>{a.priority}</Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">{a.customerName}</p>
                    <p className="text-xs text-slate-500 mb-3">{a.productName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{formatCurrency(a.amount)}</span>
                      <Button size="small" variant="outline" className="h-8 px-2">
                        Review
                      </Button>
                    </div>
                  </Card>
                ))}
                {MOCK_APPROVALS.filter((a) => a.status === "pending").length === 0 && (
                  <div className="text-center py-4 text-sm text-slate-500">No pending approvals</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Role Access</h3>
                <p className="text-xs text-slate-500">Logged in as {user?.name}</p>
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
                <Badge variant={isRole(ROLES.SALES_HEAD) ? "success" : "danger"}>{isRole(ROLES.SALES_HEAD) ? "Access" : "Restricted"}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Approvals</span>
                <Badge variant={isRole(ROLES.SALES_HEAD) ? "success" : "danger"}>{isRole(ROLES.SALES_HEAD) ? "Access" : "Restricted"}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
