import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, CheckCircle2, Shield, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/helpers";
import axios from "@/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await axios.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const result = res.data;
      if (result.success && result.user && result.token) {
        login(result.user, result.token);
        navigate(ROUTES.DASHBOARD);
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (email, password) => {
    form.setValue("email", email);
    form.setValue("password", password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Column: Brand Context & Value */}
      <div className="lg:w-1/2 bg-slate-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-md bg-white text-slate-900 font-bold text-sm flex items-center justify-center">
              QF
            </span>
            <span className="font-bold text-lg tracking-tight text-white">
              QuoteForge
            </span>
          </Link>

          <div className="mt-16 max-w-lg">
            <div className="inline-block px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs font-semibold tracking-wider uppercase mb-5 border border-slate-700">
              Discrete Manufacturing System
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight mb-5">
              Precision quotation and cost estimation engine.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
              Calibrated hourly cycle costs, live material rate books, and margin governance designed for machine shops and fabrication suppliers.
            </p>

            <div className="space-y-4 border-t border-slate-800 pt-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Single Source of Costing Truth</p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    Eliminates fragmented Excel sheets across estimating and sales teams.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Automatic ₹25 Lakh Sign-Off Gate</p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    High-value quotes require Sales Head review before customer release.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Multi-Tier Volume Breakpoints</p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    Simulate 100, 500, and 1000 unit economies with custom scrap and setup costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>QuoteForge Manufacturing System &copy; {new Date().getFullYear()}</span>
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">
            &larr; Back to Landing
          </Link>
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Sign In
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Enter your credentials to access the workbench
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Work Email
              </label>
              <Input
                type="email"
                placeholder="name@quoteforge.in"
                {...form.register("email")}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 border border-rose-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-2.5 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick-fill Demo Credentials */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Demo Accounts (Click to auto-fill)
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleFillDemo("estimator@quoteforge.in", "estimator123")}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <User className="size-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Estimator</p>
                    <p className="text-[11px] font-mono text-slate-500">estimator@quoteforge.in</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 group-hover:text-slate-900 font-medium">
                  Use &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("saleshead@quoteforge.in", "saleshead123")}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="size-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Sales Head</p>
                    <p className="text-[11px] font-mono text-slate-500">saleshead@quoteforge.in</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 group-hover:text-slate-900 font-medium">
                  Use &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("admin@quoteforge.in", "admin123")}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="size-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">System Admin</p>
                    <p className="text-[11px] font-mono text-slate-500">admin@quoteforge.in</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 group-hover:text-slate-900 font-medium">
                  Use &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}