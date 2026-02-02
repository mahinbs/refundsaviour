import React from "react";
import { cn } from "../../lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BarChart3, Settings, LogOut, Hexagon, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function Sidebar({ className, onNavigate }) {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Analytics", href: "/analytics", icon: BarChart3 },
        { label: "Settings", href: "/settings", icon: Settings },
    ];

    const handleLogout = () => {
        toast.info("Logging out...", {
            description: "Securely terminating session."
        });

        // Simulate a small delay for effect
        setTimeout(() => {
            navigate("/login");
            if (onNavigate) onNavigate(); // Close mobile menu if open
        }, 1000);
    };

    return (
        <div className={cn("flex h-screen w-64 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl", className)}>
            <div className="flex h-20 items-center px-6 border-b border-white/5">
                <div className="flex items-center gap-3 font-bold text-xl tracking-wide text-white">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                        <div className="absolute inset-0 animate-pulse-slow rounded-lg bg-primary/20 blur-md"></div>
                        <Hexagon className="relative h-8 w-8 text-primary" strokeWidth={2.5} />
                        <span className="absolute text-xs font-bold text-primary-foreground">R</span>
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
                        to="/widget-demo"
                        target="_blank"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 hover:border-primary/50"
                    >
                        <ExternalLink className="h-3 w-3" />
                        Launch Widget Demo
                    </Link>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-all duration-300 hover:bg-destructive/10 hover:text-destructive-foreground group"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Logout
                </button>
            </div>
        </div>
    );
}
