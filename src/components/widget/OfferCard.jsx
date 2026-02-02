import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * OfferCard Component
 * @param {object} props
 * @param {object} props.offer - The offer data object
 * @param {function} props.onSelect - Handler for selecting this offer
 */
export function OfferCard({ offer, onSelect }) {
    const isRecommended = offer.recommended;

    return (
        <Card
            className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-300 group ring-1 ring-white/5",
                isRecommended
                    ? "bg-gradient-to-br from-primary/10 to-transparent hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-primary/40"
                    : "hover:bg-white/5 hover:border-white/20"
            )}
            onClick={() => onSelect(offer)}
        >
            {isRecommended && (
                <>
                    <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 rounded-bl-lg bg-gradient-to-l from-primary to-cyan-400 px-3 py-1 text-xs font-bold text-black shadow-neon-blue flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Recommended
                    </div>
                </>
            )}

            <CardContent className="p-5 flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-start">
                    <h4 className={cn("font-semibold text-lg tracking-tight", isRecommended ? "text-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" : "text-white")}>
                        {offer.title}
                    </h4>
                </div>

                <p className="text-sm text-muted-foreground leading-snug">
                    {offer.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 pt-3 border-t border-white/5 gap-3">
                    <span className="font-bold text-xl text-white tracking-widest font-mono">
                        ${offer.value.toFixed(2)}
                    </span>
                    <Button
                        variant={isRecommended ? "default" : "outline"}
                        size="sm"
                        className="gap-2 rounded-full px-5 transition-transform group-hover:scale-105 w-full sm:w-auto"
                    >
                        Select <ArrowRight className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
