import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock authentication delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (formData.email === "admin@refundsavior.com" && formData.password === "password") {
            toast.success("Identity Verified", {
                description: "Welcome back, Commander."
            });
            navigate("/");
        } else if (formData.email !== "" && formData.password !== "") {
            // Allow any non-empty credentials for demo purposes if specific ones aren't used, 
            // but let's encourage the "correct" ones via placeholder or just allow all for demo.
            // For this specific specific implementation, I'll allow "demo" access or specific admin access.
            // Let's actually just let them in for the demo experience if they type anything valid-ish.
            toast.success("Access Granted", {
                description: "Redirecting to Command Center..."
            });
            navigate("/");
        } else {
            toast.error("Authentication Failed", {
                description: "Invalid credentials provided."
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] animate-pulse-slow delay-1000"></div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md p-8 mx-4">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"></div>
                <div className="relative z-20 space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px] mb-6 shadow-neon-blue">
                            <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Command Center Access</h1>
                        <p className="text-sm text-muted-foreground">Enter your credentials to verify identity.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="admin@refundsavior.com"
                                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Authenticate <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-xs text-slate-500">
                            Secured by <span className="text-slate-400">RefundSavior Quantum Encrypt™</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
