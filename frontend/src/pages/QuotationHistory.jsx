import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function QuotationHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-header">
        <div>
          <h1 className="section-title">Quotation History</h1>
          <p className="section-subtitle">Upload your quotation data to populate the history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="outline" size="small">
            New Quotation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-80">
              <Input
                placeholder="Search quotation # or customer..."
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
            No quotations found. Upload your quotation data to see them here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
