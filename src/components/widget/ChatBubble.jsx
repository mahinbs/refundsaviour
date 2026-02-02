import React from "react";
import { cn } from "../../lib/utils";
import { Bot, User } from "lucide-react";

/**
 * ChatBubble Component
 * @param {object} props
 * @param {string} props.message - The text to display
 * @param {'ai' | 'user'} props.sender - Who sent the message
 * @param {boolean} [props.animate] - Whether to animate entry
 */
export function ChatBubble({ message, sender, animate = true }) {
    const isAI = sender === "ai";

    return (
        <div
            className={cn(
                "flex w-full items-end gap-3 mb-6",
                isAI ? "justify-start" : "justify-end",
                animate && "animate-in fade-in slide-in-from-bottom-2 duration-300"
            )}
        >
            {isAI && (
                <div className="relative flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-black border border-primary/30 shadow-neon-blue">
                    <Bot className="h-6 w-6 text-primary animate-pulse-slow" />
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20"></div>
                </div>
            )}

            <div
                className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm shadow-md backdrop-blur-md relative overflow-hidden",
                    isAI
                        ? "bg-black/40 text-white border border-primary/20 rounded-bl-none"
                        : "bg-primary/20 text-white border border-primary/40 rounded-br-none shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                )}
            >
                {isAI && <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>}
                <p className="leading-relaxed relative z-10">{message}</p>
            </div>

            {!isAI && (
                <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-secondary/20 border border-secondary/40 shadow-neon-purple text-secondary">
                    <User className="h-6 w-6" />
                </div>
            )}
        </div>
    );
}
