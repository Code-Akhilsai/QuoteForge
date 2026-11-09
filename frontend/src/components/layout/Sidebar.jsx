import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS } from "@/utils/helpers";
import { NavIcon } from "@/components/ui/Icons";

export default function Sidebar({
  mobileOpen = false,
  onCloseMobile = () => {},
  collapsed = false,
  onToggleCollapsed = () => {},
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role),
  );

  const handleNav = (href) => {
    navigate(href);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 border-r border-slate-200 bg-white",
          "w-64",
          // Mobile responsive placement
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <div className="flex items-center justify-between h-16 px-3 bg-white border-b border-slate-200">
          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden",
              collapsed ? "md:justify-center md:w-full" : "",
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs shrink-0">
              QF
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-bold text-lg text-slate-900 tracking-tight whitespace-nowrap">
                QuoteForge
              </span>
            )}
          </div>
          <div className="flex items-center">
            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={onToggleCollapsed}
              className={cn(
                "hidden md:flex p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors items-center justify-center",
                collapsed
                  ? "absolute -right-3 top-5 bg-white border border-slate-200 shadow-xs rounded-full size-6"
                  : "",
              )}
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <NavIcon name="ChevronRight" size={14} />
              ) : (
                <NavIcon name="ChevronLeft" size={18} />
              )}
            </button>
            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              aria-label="Close menu"
            >
              <NavIcon name="ChevronLeft" size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive =
              typeof window !== "undefined" &&
              window.location.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  collapsed ? "md:justify-center" : "",
                )}
              >
                <div
                  className={cn(
                    collapsed
                      ? "md:flex md:justify-center w-5"
                      : "w-5 shrink-0",
                  )}
                >
                  <NavIcon name={item.icon} />
                </div>
                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 rounded-lg transition-colors">
            <button
              onClick={() => {
                logout();
                onCloseMobile();
                navigate("/login");
              }}
              title="Sign out"
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors w-full",
                collapsed ? "md:justify-center md:px-0" : "",
              )}
            >
              <NavIcon name="LogOut" size={16} />
              {(!collapsed || mobileOpen) && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
