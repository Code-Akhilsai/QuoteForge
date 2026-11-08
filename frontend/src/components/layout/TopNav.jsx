import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { NavIcon } from "@/components/ui/Icons";

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 transition-colors">
            <Avatar src={undefined} alt={user?.name ?? "U"} className="size-7" />
            <span className="hidden sm:block text-sm font-medium text-slate-900">{user?.name ?? "User"}</span>
          </div>
          <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
            <NavIcon name="LogOut" size={16} /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
