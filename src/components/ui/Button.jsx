import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import React from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200",
    {
        variants: {
            variant: {
                default: "bg-primary text-black font-bold shadow-neon-blue hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]",
                destructive: "bg-destructive text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:bg-destructive/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]",
                success: "bg-success text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:bg-success/90 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]",
                outline: "border border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:shadow-neon-blue",
                secondary: "bg-secondary text-white shadow-neon-purple hover:bg-secondary/90 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]",
                ghost: "text-muted-foreground hover:bg-white/10 hover:text-white",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    );
});
Button.displayName = "Button";

export { Button, buttonVariants };
