import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS } from "@/utils/helpers";
import { NavIcon } from "@/components/ui/Icons";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 transition-all duration-300 border-r border-slate-200 bg-white ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200">
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
            QF
          </div>
          {!collapsed && <span className="font-bold text-lg text-slate-900 tracking-tight">QuoteForge</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors", collapsed ? "ml-auto" : "hidden")}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <NavIcon name="ChevronRight" size={18} /> : <NavIcon name="ChevronLeft" size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = typeof window !== "undefined" && window.location.pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                collapsed ? "justify-center" : "",
              )}
            >
              <div className={cn(collapsed ? "flex justify-center w-5" : "w-5 shrink-0")}>
                <NavIcon name={item.icon} />
              </div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">
          <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-2 px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
            <NavIcon name="LogOut" size={16} /> Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
