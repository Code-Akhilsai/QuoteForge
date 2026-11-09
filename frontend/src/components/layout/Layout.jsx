import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        collapsed={desktopCollapsed}
        onToggleCollapsed={() => setDesktopCollapsed(!desktopCollapsed)}
      />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          desktopCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <TopNav onOpenMobile={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
