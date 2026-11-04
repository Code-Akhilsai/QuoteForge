import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { NavIcon } from "@/components/ui/Icons";

export default function TopNav() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/80 backdrop-blur border-b border-slate-200 px-4">
      <button className="flex items-center p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md md:hidden transition-colors" aria-label="Open menu">
        <NavIcon name="Menu" size={22} />
      </button>

      <div className="flex-1 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.334 0 2.832.477 3.5 1.253v13c-.668.776-2.166 1.253-3.5 1.253s-2.832-.477-3.5-1.253V18c-1.334 0-2.832-.477-3.5-1.253" />
            </svg>
          </div>
          <span className="text-indigo-600">QuoteForge</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -right-2 -top-2 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></div>
            <Button variant="outline" size="small" className="px-3" aria-label="Notifications">
              <NavIcon name="Bell" size={18} />
              <span className="absolute right-0 top-0 size-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </Button>
          </div>

          <div className="relative group" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              <Avatar src={undefined} alt={user?.name ?? "U"} className="size-7" />
              <span className="hidden sm:block text-sm font-medium text-slate-900">{user?.name ?? "User"}</span>
              <NavIcon name="ChevronDown" size={16} className="text-slate-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-50 animate-in fade-in zoom-in duration-100">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-900 border-b border-slate-100 pb-1">
                    <Avatar src={undefined} alt={user?.name ?? "U"} className="size-8" />
                    <div>
                      <div className="font-medium">{user?.name ?? "User"}</div>
                      <div className="text-xs text-slate-500 capitalize">{user?.role ?? ""}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <NavIcon name="User" size={16} /> Profile
                  </button>
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <NavIcon name="Settings" size={16} /> Settings
                  </button>
                  <button onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                    <NavIcon name="LogOut" size={16} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
