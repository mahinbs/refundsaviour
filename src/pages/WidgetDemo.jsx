import React, { useState } from "react";
import { RetainWidget } from "../components/widget/RetainWidget";
import { Button } from "../components/ui/Button";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function WidgetDemo() {
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden p-4">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="absolute top-8 left-8">
                <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center justify-center p-6 bg-white/5 border border-white/10 rounded-full shadow-neon-blue mb-4 relative group">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all"></div>
                    <ShoppingBag className="h-10 w-10 text-white relative z-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Interception Protocol</h1>
                    <p className="text-muted-foreground">
                        Simulate a customer return attempt to trigger the AI retention sequence.
                    </p>
                </div>

                <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl transition-transform hover:scale-105 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-left">
                            <p className="font-bold text-white text-lg">Order #ORD-7829</p>
                            <p className="text-sm text-primary">1 Item • $120.00</p>
                        </div>
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full text-lg h-12 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        onClick={() => setIsWidgetOpen(true)}
                    >
                        Initiate Return Sequence
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
                    Secure Environment // End-to-End Encrypted
                </p>
            </div>

            <RetainWidget
                isOpen={isWidgetOpen}
                onClose={() => setIsWidgetOpen(false)}
            />
        </div>
    );
}
