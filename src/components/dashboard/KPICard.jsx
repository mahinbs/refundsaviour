import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { cn } from "../../lib/utils";

export function KPICard({ title, value, icon: Icon, trend, trendValue, color = "default" }) {

    const getValueColor = () => {
        if (color === "success") return "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]";
        if (color === "destructive") return "text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]";
        return "text-white";
    };

    const getGradientBorder = () => {
        if (color === "success") return "from-success/20 to-transparent";
        if (color === "destructive") return "from-destructive/20 to-transparent";
        return "from-primary/20 to-transparent";
    }

    return (
        <Card className={cn("relative overflow-hidden group hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]")}>
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", getGradientBorder())}></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground truncate pr-2">
                    {title}
                </CardTitle>
                {Icon && <Icon className={cn("h-4 w-4 transition-colors", color === "success" ? "text-green-500" : color === "destructive" ? "text-red-500" : "text-primary")} />}
            </CardHeader>
            <CardContent className="relative z-10">
                <div className={cn("text-2xl font-bold tracking-tight", getValueColor())}>{value}</div>
                {(trend) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className={cn(trend === "up" ? "text-green-400" : "text-red-400", "font-medium")}>
                            {trend === "up" ? "+" : "-"}{trendValue}
                        </span>
                        {" "}from last month
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
