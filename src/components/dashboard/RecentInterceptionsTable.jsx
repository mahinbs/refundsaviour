import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function RecentInterceptionsTable({ data = [] }) {
    return (
        <Card className="col-span-1 lg:col-span-4 overflow-hidden">
            <CardHeader>
                <CardTitle>Live Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-white mb-1">No activity yet</p>
                        <p className="text-xs text-muted-foreground">Interceptions will appear here once customers start using the widget.</p>
                    </div>
                ) : (
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
                                {data.map((item, index) => (
                                    <tr key={item.id || index} className="transition-colors hover:bg-white/5 group">
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
                )}
            </CardContent>
        </Card>
    );
}
