import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { BrainCircuit, Activity } from "lucide-react";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";

export default function Analytics({ data }) {
    const reasonDistribution = data?.reasonDistribution || [];
    const totalInterceptions = data?.totalInterceptions || 0;

    // Fallback insight text based on real data
    const topReason = reasonDistribution[0];
    const secondReason = reasonDistribution[1];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/30">
                        <Activity className="h-6 w-6 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Return Pattern Analysis</h2>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success("Analytics data refreshed")}
                    className="hidden md:flex"
                >
                    Refresh Data
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Reason Distribution */}
                <Card className="border-t-4 border-t-primary/50">
                    <CardHeader>
                        <CardTitle>Reason Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {reasonDistribution.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No return data yet. Data will appear here once customers start using the widget.
                            </p>
                        ) : (
                            reasonDistribution.map((item) => (
                                <div key={item.reason} className="space-y-2 group">
                                    <div className="flex items-center justify-between text-sm gap-4">
                                        <span className="font-medium text-slate-300 group-hover:text-primary transition-colors truncate capitalize">
                                            {item.reason.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-muted-foreground whitespace-nowrap text-xs md:text-sm">
                                            {item.count} Returns ({item.percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary relative"
                                            style={{ width: `${item.percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Insight Summary */}
                <Card className="border-t-4 border-t-secondary/50">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-secondary animate-pulse" />
                        <CardTitle>AI Neural Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topReason ? (
                            <div className="rounded-xl border border-primary/20 bg-primary/10 p-5 relative overflow-hidden group hover:bg-primary/15 transition-colors">
                                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all"></div>
                                <p className="text-sm font-bold text-primary mb-1">Top Return Reason</p>
                                <p className="text-sm text-slate-300">
                                    "{topReason.reason.replace(/_/g, ' ')}" accounts for{" "}
                                    <span className="text-white font-bold">{topReason.percentage}%</span>{" "}
                                    of all returns ({topReason.count} total).
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
                                <p className="text-sm font-bold text-primary mb-1">Awaiting Data</p>
                                <p className="text-sm text-slate-300">
                                    Insights will appear here once customers interact with the widget.
                                </p>
                            </div>
                        )}

                        {secondReason ? (
                            <div className="rounded-xl border border-success/20 bg-success/10 p-5 relative overflow-hidden group hover:bg-success/15 transition-colors">
                                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/20 blur-xl group-hover:bg-success/30 transition-all"></div>
                                <p className="text-sm font-bold text-success mb-1">Performance Status</p>
                                <p className="text-sm text-slate-300">
                                    "{secondReason.reason.replace(/_/g, ' ')}" is the second most common reason at{" "}
                                    <span className="text-white font-bold">{secondReason.percentage}%</span>.{" "}
                                    Total of{" "}
                                    <span className="text-white font-bold">{totalInterceptions}</span>{" "}
                                    interceptions recorded.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-success/20 bg-success/10 p-5">
                                <p className="text-sm font-bold text-success mb-1">System Active</p>
                                <p className="text-sm text-slate-300">
                                    Widget is live and ready to intercept return requests.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
