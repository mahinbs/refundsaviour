import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import React from "react";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary/20 text-primary hover:bg-primary/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
                secondary:
                    "border-transparent bg-secondary/20 text-secondary hover:bg-secondary/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]",
                destructive:
                    "border-transparent bg-destructive/20 text-destructive hover:bg-destructive/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
                success:
                    "border-transparent bg-success/20 text-success hover:bg-success/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
