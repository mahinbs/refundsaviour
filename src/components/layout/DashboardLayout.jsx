import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet, useLocation } from "react-router-dom";

export function DashboardLayout() {
    const location = useLocation();

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
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-y-auto h-screen">
                <Header title={getTitle()} />
                <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
