import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { NavIcon } from "@/components/ui/Icons";

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/80 backdrop-blur border-b border-slate-200 px-4">
      <button
        className="flex items-center p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md md:hidden transition-colors"
        aria-label="Open menu"
      >
        <NavIcon name="Menu" size={22} />
      </button>

      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 transition-colors">
            <Avatar
              src={undefined}
              alt={user?.name ?? "U"}
              className="size-7"
            />
            <span className="hidden sm:block text-sm font-medium text-slate-900">
              {user?.name ?? "User"}
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <NavIcon name="LogOut" size={16} /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
