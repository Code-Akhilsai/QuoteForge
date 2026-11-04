import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, NAV_ITEMS } from "@/utils/helpers";
import { NavIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 transition-all duration-300 border-r border-slate-200 bg-white ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200">
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.334 0 2.832.477 3.5 1.253v13c-.668.776-2.166 1.253-3.5 1.253s-2.832-.477-3.5-1.253V18c-1.334 0-2.832-.477-3.5-1.253" />
            </svg>
          </div>
          {!collapsed && <span className="font-bold text-xl text-slate-900 tracking-tight">Quote<span className="text-indigo-600">Forge</span></span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors", collapsed ? "ml-auto" : "hidden")}
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
                "flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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
        <div className={cn("flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200 transition-colors", collapsed ? "flex-col items-start gap-2" : "")}>
          <Avatar src={undefined} alt={user?.name ?? "U"} className="size-8" />
          <div className={cn(collapsed ? "hidden" : "flex flex-col min-w-0 flex-1")}>
            <div className="text-sm font-medium text-slate-900 truncate">{user?.name ?? "User"}</div>
            <div className="text-xs text-slate-500 truncate capitalize">{user?.role ?? ""}</div>
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={logout}
            className={cn(collapsed ? "ml-auto" : "", "px-2 py-1.5")}
            icon={<NavIcon name="LogOut" size={16} />}
          />
        </div>
      </div>

      {collapsed && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Button variant="ghost" size="small" className="size-9" title="Profile">
            <NavIcon name="User" size={18} />
          </Button>
          <Button variant="ghost" size="small" className="size-9" title="Settings" onClick={() => navigate(ROUTES.SETTINGS ?? "/")}>
            <NavIcon name="Settings" size={18} />
          </Button>
          <Button variant="ghost" size="small" className="size-9" title="Logout" onClick={logout}>
            <NavIcon name="LogOut" size={18} />
          </Button>
        </div>
      )}
    </aside>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
