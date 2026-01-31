import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

const Modal = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Content */}
            <div className={cn(
                "relative z-50 w-full max-w-lg rounded-2xl border border-white/10 bg-black/90 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden",
                className
            )}>
                {/* Header Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

                <div className="flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0">
                    <div className="flex justify-between items-center">
                        {title && <h2 className="text-xl font-bold leading-none tracking-tight text-white drop-shadow-md">{title}</h2>}
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export { Modal };
