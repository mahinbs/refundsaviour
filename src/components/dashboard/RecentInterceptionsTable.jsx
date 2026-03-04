import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function RecentInterceptionsTable({ data = [] }) {
    const interceptions = data.length > 0 ? data : [
        { id: "No data", customer: "N/A", type: "N/A", amount: "$0", status: "pending", time: "N/A" }
    ];
    
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
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Customer</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Time</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {interceptions.map((item, index) => (
                                <tr
                                    key={item.id || index}
                                    className="transition-colors hover:bg-white/5 group"
                                >
                                    <td className="p-6 align-middle text-white">{item.customer}</td>
                                    <td className="p-6 align-middle text-muted-foreground">{item.time}</td>
                                    <td className="p-6 align-middle text-white capitalize">{item.type}</td>
                                    <td className="p-6 align-middle text-right text-white font-mono">{item.amount}</td>
                                    <td className="p-6 align-middle text-right">
                                        <Badge variant={item.status === "accepted" ? "success" : item.status === "declined" ? "destructive" : "default"}>
                                            {item.status}
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
