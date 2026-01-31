import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { REFUND_REASONS } from "../data/mockData";
import { BrainCircuit, Activity } from "lucide-react";

export default function Analytics() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/30">
                    <Activity className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Return Pattern Analysis</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Reason Distribution */}
                <Card className="border-t-4 border-t-primary/50">
                    <CardHeader>
                        <CardTitle>Reason Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {REFUND_REASONS.map((item) => (
                            <div key={item.reason} className="space-y-2 group">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-300 group-hover:text-primary transition-colors">{item.reason}</span>
                                    <span className="text-muted-foreground">{item.count} Returns ({item.percentage}%)</span>
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
                        ))}
                    </CardContent>
                </Card>

                {/* Insight Summary */}
                <Card className="border-t-4 border-t-secondary/50">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-secondary animate-pulse" />
                        <CardTitle>AI Neural Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-xl border border-primary/20 bg-primary/10 p-5 relative overflow-hidden group hover:bg-primary/15 transition-colors">
                            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all"></div>
                            <p className="text-sm font-bold text-primary mb-1">Anomaly Detected</p>
                            <p className="text-sm text-slate-300">
                                "Size / Fit Issue" accounts for <span className="text-white font-bold">42%</span> of all returns. Implementation of a virtual sizing assistant recommended.
                            </p>
                        </div>
                        <div className="rounded-xl border border-success/20 bg-success/10 p-5 relative overflow-hidden group hover:bg-success/15 transition-colors">
                            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/20 blur-xl group-hover:bg-success/30 transition-all"></div>
                            <p className="text-sm font-bold text-success mb-1">Performance Optimal</p>
                            <p className="text-sm text-slate-300">
                                30% of customers are accepting the <span className="text-white font-bold">"110% Store Credit"</span> offer, saving roughly $4,500 in revenue this week.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
