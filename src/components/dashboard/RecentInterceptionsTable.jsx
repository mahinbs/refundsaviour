import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { RECENT_INTERCEPTIONS } from "../../data/mockData";

export function RecentInterceptionsTable() {
    return (
        <Card className="col-span-1 lg:col-span-4 overflow-hidden">
            <CardHeader>
                <CardTitle>Live Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative w-full overflow-x-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b [&_tr]:border-white/5 bg-white/5">
                            <tr>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Order ID</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Customer</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Decision</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Value</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {RECENT_INTERCEPTIONS.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-white/5 group"
                                >
                                    <td className="p-6 align-middle font-medium text-primary group-hover:text-glow transition-all">{item.id}</td>
                                    <td className="p-6 align-middle text-muted-foreground">{item.date}</td>
                                    <td className="p-6 align-middle text-white">{item.customer}</td>
                                    <td className="p-6 align-middle text-white">{item.decision}</td>
                                    <td className="p-6 align-middle text-right text-white font-mono">${item.value}</td>
                                    <td className="p-6 align-middle text-right">
                                        <Badge variant={item.outcome === "retained" ? "success" : "destructive"}>
                                            {item.outcome === "retained" ? "Retained" : "Lost"}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
