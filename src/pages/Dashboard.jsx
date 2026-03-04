import React from "react";
import { KPICard } from "../components/dashboard/KPICard";
import { RecentInterceptionsTable } from "../components/dashboard/RecentInterceptionsTable";
import { DollarSign, ShieldCheck, UserX, TrendingUp, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";

export default function Dashboard({ data }) {
    const kpis = data?.kpis || [];
    const recentActivity = data?.recentActivity || [];
    
    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/5 to-transparent p-6 border border-primary/20">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Command Center Active</h2>
                        <p className="text-muted-foreground">System functioning at optimal efficiency. Revenue retention protocols engaged.</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Button
                            variant="default"
                            className="hidden md:flex gap-2 shadow-neon-blue"
                            onClick={() => toast.success("Dashboard metrics updated")}
                        >
                            <RefreshCcw className="h-4 w-4" /> Live Update
                        </Button>
                        <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 shadow-neon-blue animate-pulse-slow">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent skew-x-12"></div>
            </div>

            {/* KPI Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, index) => {
                    const iconMap = {
                        "Refunds Intercepted": ShieldCheck,
                        "Retention Rate": TrendingUp,
                        "Revenue Saved": DollarSign,
                        "Active Offers": UserX,
                    };
                    return (
                        <KPICard
                            key={index}
                            title={kpi.title}
                            value={kpi.value}
                            icon={iconMap[kpi.title] || ShieldCheck}
                            trend={kpi.trend}
                            trendValue={kpi.change}
                            color={kpi.title.includes("Revenue") ? "success" : "default"}
                        />
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-1">
                <RecentInterceptionsTable data={recentActivity} />
            </div>
        </div>
    );
}
