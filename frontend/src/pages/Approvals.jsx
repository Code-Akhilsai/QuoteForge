import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export default function Approvals() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-header">
        <div>
          <h1 className="section-title">Approvals</h1>
          <p className="section-subtitle">Upload your quotation data to populate approval requests</p>
        </div>
        <Badge variant="success">
          0 pending
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-80">
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
                <option value="estimating">Estimating</option>
                <option value="sent">Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-sm text-slate-500">
            No approval requests found. Upload your quotation data to see them here.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">RFQs in Estimating</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="rounded-full bg-amber-50 p-3 text-amber-600">
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Quotations Sent</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Lost</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="rounded-full bg-rose-50 p-3 text-rose-600">
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
