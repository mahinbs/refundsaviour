import { Outlet, useLocation, Link } from "@remix-run/react";
import { Toaster } from "sonner";
import { cn } from "../../src/lib/utils";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Hexagon,
  ExternalLink,
  Menu,
  Bell,
  Search,
} from "lucide-react";

function Sidebar({ className, onNavigate }) {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "/app/analytics", icon: BarChart3 },
    { label: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl", className)}>
      <div className="flex h-20 items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 font-bold text-xl tracking-wide text-white">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 animate-pulse-slow rounded-lg bg-primary/20 blur-md"></div>
            <Hexagon className="relative h-8 w-8 text-primary" strokeWidth={2.5} />
            <span className="absolute text-xs font-bold text-black">R</span>
          </div>
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">RefundSavior</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-primary/10 text-primary shadow-neon-blue"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              )}
              <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
          <h4 className="mb-2 text-sm font-semibold text-white">Pro Plan</h4>
          <div className="mb-4 h-1.5 w-full rounded-full bg-white/10">
            <div className="h-1.5 w-3/4 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
          </div>
          <Link
            to="/app/widget-demo"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 hover:border-primary/50"
          >
            <ExternalLink className="h-3 w-3" />
            Launch Widget Demo
          </Link>
        </div>
      </div>
    </div>
  );
}

function Header({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-black/30 px-4 backdrop-blur-lg md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white">
          <Search className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTitle = () => {
    switch (location.pathname) {
      case "/app/dashboard": return "Command Center";
      case "/app/analytics": return "Data Analytics";
      case "/app/settings": return "System Settings";
      default: return "Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Toaster position="top-center" richColors theme="dark" />

      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex sticky top-0 h-screen" />

      {/* Mobile Sidebar & Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 flex md:hidden transition-all duration-300",
        isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
      )}>
        <div
          className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <Sidebar
          className={cn(
            "relative z-10 h-full w-64 bg-[#0a0a0a] shadow-2xl border-r border-white/10 transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onNavigate={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={getTitle()} onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
