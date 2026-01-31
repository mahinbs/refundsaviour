import React from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "../ui/Input";

export function Header({ title }) {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-background/50 px-8 backdrop-blur-xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                <p className="text-xs text-muted-foreground">Overview & Statistics</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:block w-64">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            className="h-9 w-full rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                <button className="relative rounded-full bg-white/5 p-2 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                </button>

                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-2 pr-4 py-1.5 hover:bg-white/10 cursor-pointer transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px]">
                        <div className="h-full w-full rounded-full bg-black">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="h-full w-full rounded-full" />
                        </div>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-white leading-none">Admin</p>
                        <p className="text-[10px] text-muted-foreground">Store Owner</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
