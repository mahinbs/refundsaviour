import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import WidgetDemo from "../pages/WidgetDemo";
import Login from "../pages/Login";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Dashboard Routes */}
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Standalone Routes */}
            <Route path="/widget-demo" element={<WidgetDemo />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}
