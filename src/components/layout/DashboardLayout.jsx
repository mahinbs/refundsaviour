import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

export function DashboardLayout() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const getTitle = () => {
        switch (location.pathname) {
            case "/": return "Command Center";
            case "/analytics": return "Data Analytics";
            case "/settings": return "System Settings";
            default: return "Dashboard";
        }
    };

    return (
        <div className="flex min-h-screen">
            <Toaster position="top-center" richColors theme="dark" />
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex sticky top-0" />

            {/* Mobile Sidebar & Overlay */}
            <div className={`fixed inset-0 z-50 flex md:hidden transition-all duration-300 ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
                <Sidebar
                    className={`relative z-10 h-full w-64 bg-[#0a0a0a] shadow-2xl border-r border-white/10 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                    onNavigate={() => setIsMobileMenuOpen(false)}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto h-screen w-full">
                <Header
                    title={getTitle()}
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
