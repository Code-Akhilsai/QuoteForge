import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-md bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
              QF
            </span>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              QuoteForge
            </span>
          </Link>
          <div className="flex items-center">
            <Link
              to="/login"
              className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex-1 w-full">
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <div className="inline-block px-3 py-1 rounded bg-slate-200/70 text-slate-700 text-xs font-semibold tracking-wider uppercase mb-5">
            Manufacturing Cost Estimation &amp; Quoting
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-950 leading-[1.15] mb-6">
            Industrial costing without the spreadsheet chaos.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8">
            A purpose-built internal system for discrete manufacturers to compute material rates, machine hourly cycle times, and multi-tier quotations accurately and on time.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="bg-slate-900 text-white text-base font-medium px-6 py-3 rounded-md hover:bg-slate-800 transition-colors shadow-sm"
            >
              Sign In
            </Link>
            <span className="text-sm text-slate-500">
              Access for Estimators, Sales Heads, and Admins
            </span>
          </div>
        </div>

        {/* 3 Structured Core Columns */}
        <div className="border-t border-slate-200 pt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-950">1. RFQ Management</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Consolidate customer requests from CSV or manual entry. Maintain clear visibility from draft through estimating and win/loss records.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-1">
              Supports CSV &amp; Excel import &bull; Status tracking
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-950">2. Cost Estimation</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Model material requirements, CNC operations, labour, power, scrap percentages, and tiered volume pricing (100, 500, 1000 units).
            </p>
            <div className="text-xs font-medium text-slate-500 pt-1">
              Live rate book &bull; Volume breakpoints &bull; Margin controls
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-950">3. Approvals &amp; History</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Review margins with built-in thresholds. High-value commitments (&gt; ₹25 Lakh) trigger automatic review before formal dispatch.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-1">
              Commercial sign-off &bull; Printable records
            </div>
          </div>
        </div>

        {/* Seeded Roles Table */}
        <div className="mt-20 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-100/70 px-6 py-3.5 border-b border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-sm text-slate-800">Default Access Roles</span>
            <span className="text-xs text-slate-500 font-mono">Production Ready</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[620px] text-sm text-left">
              <thead className="border-b border-slate-200 text-slate-500 font-medium bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-950">Estimator</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">estimator@quoteforge.in</td>
                  <td className="px-6 py-4 text-sm text-slate-600">RFQ Entry, Cost Estimation, Draft Quotations</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-950">Sales Head</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">saleshead@quoteforge.in</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Commercial Approvals, Rate Master Management, Pipeline</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-950">System Admin</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">admin@quoteforge.in</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Full System Access &amp; User Controls</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-slate-500">
          <span>QuoteForge Manufacturing System &copy; {new Date().getFullYear()}</span>
          <Link to="/login" className="text-slate-800 font-medium hover:underline">
            Sign In &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
}
