import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Shield, ArrowRight, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/helpers";

const CREDENTIALS = [
  { email: "estimator@quoteforge.in", password: "estimator123", role: "estimator", name: "Amit Verma" },
  { email: "saleshead@quoteforge.in", password: "saleshead123", role: "sales_head", name: "Rahul Sharma" },
  { email: "admin@quoteforge.in", password: "admin123", role: "admin", name: "System Admin" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "", role: "estimator" },
  });

  const onSubmit = (data) => {
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      const user = CREDENTIALS.find(
        (c) => c.email === data.email && c.password === data.password && c.role === data.role,
      );
      if (user) {
        login({ id: "USR-001", name: user.name, email: user.email, role: user.role }, "mock-token");
        navigate(ROUTES.DASHBOARD);
      } else {
        setError("Invalid email, password, or role combination.");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quote<span className="text-indigo-600">Forge</span></h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">Sign in to your manufacturing dashboard</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="label-field">Work Email</label>
              <Input type="email" placeholder="name@company.in" {...form.register("email")} required />
            </div>
            <div className="space-y-1">
              <label className="label-field">Password</label>
              <Input type="password" placeholder="••••••••" {...form.register("password")} required />
            </div>
            <div className="space-y-1">
              <label className="label-field">Role</label>
              <select {...form.register("role")} className="input-field">
                <option value="estimator">Estimator</option>
                <option value="sales_head">Sales Head</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && (
              <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 border border-rose-100">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : <span className="flex items-center justify-center gap-2">Sign In <ArrowRight className="size-4" /></span>}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 mb-3">Demo credentials</div>
            <div className="text-xs text-slate-600 space-y-1 max-w-xs">
              <div className="flex gap-2"><User className="size-3.5" /> estimator@quoteforge.in / estimator123</div>
              <div className="flex gap-2"><Building2 className="size-3.5" /> saleshead@quoteforge.in / saleshead123</div>
              <div className="flex gap-2"><Shield className="size-3.5" /> admin@quoteforge.in / admin123</div>
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
