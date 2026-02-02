import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Cog, Database, Zap, Save, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
    const [isEditing, setIsEditing] = useState(false);
    const [storeName, setStoreName] = useState("RefundSavior Demo Store");

    const handleSave = () => {
        if (isEditing) {
            toast.success("System parameters updated successfully");
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                    <Cog className="h-6 w-6 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">System Configuration</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Parameters</CardTitle>
                    <CardDescription>Establish core identity and platform links.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-3">
                        <label className="text-sm font-medium text-slate-300">Store Identity</label>
                        <Input
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            disabled={!isEditing}
                            className={`bg-black/40 border-primary/20 text-primary font-mono ${!isEditing && "opacity-70 cursor-not-allowed"}`}
                        />
                    </div>
                    <div className="grid gap-3">
                        <label className="text-sm font-medium text-slate-300">Platform Integration</label>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5">
                            <div className="h-8 w-8 rounded bg-[#95BF47] flex items-center justify-center text-black font-bold">S</div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white">Shopify</p>
                                <p className="text-xs text-muted-foreground">Store ID: shp_89210-x</p>
                            </div>
                            <Badge variant="success" className="animate-pulse">Live link established</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/30 shadow-neon-blue">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <CardTitle className="text-primary">Widget Logic Matrix</CardTitle>
                    </div>
                    <CardDescription>Control AI interception behaviors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 animate-pulse-slow"></div>
                        <div className="space-y-1 relative z-10">
                            <label className="text-sm font-bold text-white">Interception Module</label>
                            <p className="text-xs text-primary/80">Widget triggers on return initiation.</p>
                        </div>
                        <Badge variant="default" className="relative z-10">System Online</Badge>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="h-4 w-4 text-secondary" /> Offer Strategy Variables
                        </h4>
                        <div className="grid gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5 hover:border-secondary/50 transition-colors gap-2">
                                <span className="text-slate-300">Store Credit Multiplier</span>
                                <span className="font-mono text-secondary font-bold">1.10x</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5 hover:border-secondary/50 transition-colors gap-2">
                                <span className="text-slate-300">Exchange Incentive</span>
                                <span className="font-mono text-secondary font-bold">SHIPPING_WAIVER</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            variant={isEditing ? "default" : "outline"}
                            onClick={handleSave}
                            className={isEditing ? "bg-primary text-black hover:bg-primary/90" : ""}
                        >
                            {isEditing ? (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" /> Modify Parameters (Admin Lock)
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
