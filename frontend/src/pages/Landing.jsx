import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <nav className="border-b border-slate-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.334 0 2.832.477 3.5 1.253v13c-.668.776-2.166 1.253-3.5 1.253s-2.832-.477-3.5-1.253V18c-1.334 0-2.832-.477-3.5-1.253" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">Quote<span className="text-indigo-600">Forge</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Log in</Link>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="flex-1">
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">Manufacturing Quotation</span>
              <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl mt-2 leading-tight">
                Accurate quotes for industrial manufacturing
              </h1>
              <p className="text-lg text-slate-600 mt-6 leading-relaxed max-w-xl">
                QuoteForge helps estimators and sales heads calculate product costs, manage customer RFQs,
                and generate professional PDF quotations — all from one desktop-first dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-5 py-3 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  className="border border-slate-300 text-slate-700 px-5 py-3 rounded-md text-sm font-medium hover:bg-slate-50"
                >
                  View features
                </Link>
              </div>
            </div>
            <div className="flex-1 hidden sm:block">
              <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Core features</h3>
                <ul className="text-sm text-slate-600 space-y-3 list-disc pl-5">
                  <li>RFQ register with status and owners</li>
                  <li>Cost estimation at 2–3 volumes</li>
                  <li>Material and machine rate masters</li>
                  <li>PDF quotation generation</li>
                  <li>Approval workflow (₹25 lakh threshold)</li>
                  <li>Excel/CSV quote import</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-b border-slate-200 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <MetricCard label="Turnaround" value="4 days" sub="from 9 working days" />
              <MetricCard label="Estimator time" value="1 hr / part" sub="from 2.5 hours" />
              <MetricCard label="RFQs per month" value="60+" sub="5 parts each (typical)" />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Who uses QuoteForge</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <RoleCard
                name="Estimator"
                desc="Create RFQs, run cost estimates, build quotes, manage material and machine rates."
                items={["RFQ entry", "Cost estimation", "Rate masters", "Quote drafts"]}
              />
              <RoleCard
                name="Sales Head"
                desc="Review pipeline, approve quotes above ₹25 lakh, oversee sales operations."
                items={["Quote review", "Approval threshold", "Pipeline oversight"]}
              />
              <RoleCard
                name="Admin"
                desc="Full system access: user management, rate configuration, system settings."
                items={["Full access", "User management", "System settings"]}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <span>QuoteForge — Desktop-first manufacturing quotation platform</span>
          <span>Estimator &amp; Sales Head roles</span>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white">
      <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function RoleCard({ name, desc, items }) {
  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white hover:border-indigo-200 transition-colors">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">{name}</h3>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{desc}</p>
      <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
