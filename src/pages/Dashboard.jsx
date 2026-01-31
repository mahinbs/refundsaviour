import React from "react";
import { KPICard } from "../components/dashboard/KPICard";
import { RecentInterceptionsTable } from "../components/dashboard/RecentInterceptionsTable";
import { KPI_DATA } from "../data/mockData";
import { DollarSign, ShieldCheck, UserX, TrendingUp, Sparkles } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/5 to-transparent p-6 border border-primary/20">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Command Center Active</h2>
                        <p className="text-muted-foreground">System functioning at optimal efficiency. Revenue retention protocols engaged.</p>
                    </div>
                    <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 shadow-neon-blue animate-pulse-slow">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent skew-x-12"></div>
            </div>

            {/* KPI Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Revenue Retained"
                    value={`$${KPI_DATA.revenueRetained.toLocaleString()}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="12%"
                    color="success"
                />
                <KPICard
                    title="Total Interceptions"
                    value={KPI_DATA.totalInterceptions.toLocaleString()}
                    icon={ShieldCheck}
                    trend="up"
                    trendValue="8%"
                />
                <KPICard
                    title="Conversion Rate"
                    value={`${KPI_DATA.conversionRate}%`}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="2.1%"
                />
                <KPICard
                    title="Refunds Lost"
                    value={`$${KPI_DATA.refundsLost.toLocaleString()}`}
                    icon={UserX}
                    trend="down"
                    trendValue="4%"
                    color="destructive"
                />
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-1">
                <RecentInterceptionsTable />
            </div>
        </div>
    );
}
