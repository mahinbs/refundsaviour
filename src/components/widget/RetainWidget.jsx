import React, { useState, useEffect, useRef } from "react";
import { Modal } from "../ui/Modal";
import { ChatBubble } from "./ChatBubble";
import { OfferCard } from "./OfferCard";
import { Button } from "../ui/Button";
import { WIDGET_CONFIG } from "../../data/mockData";
import { RotateCw, ShieldCheck, Zap } from "lucide-react";

/**
 * RetainWidget
 * Coordinates the conversational flow and offers.
 * @param {boolean} isOpen
 * @param {function} onClose
 */
export function RetainWidget({ isOpen, onClose }) {
    // Stages: 'idle', 'chat-reason', 'chat-evaluating', 'offers', 'accepted', 'refunded'
    const [stage, setStage] = useState("idle");
    const [history, setHistory] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null);
    const [acceptedOffer, setAcceptedOffer] = useState(null);
    const messagesEndRef = useRef(null);

    // Initialize chat when opened
    useEffect(() => {
        if (isOpen && stage === "idle") {
            setStage("chat-reason");
            addMessage("ai", "I see you're looking to return this item. Could you share a quick reason why?");
        }
    }, [isOpen, stage]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const addMessage = (sender, text) => {
        setHistory((prev) => [...prev, { sender, text, id: Date.now() }]);
    };

    const handleReasonSelect = (reason) => {
        addMessage("user", reason);
        setSelectedReason(reason);
        setStage("chat-evaluating");

        // Simulate AI "thinking"
        setTimeout(() => {
            addMessage("ai", "Analyzing your request... I found some options personalized for you.");
            setTimeout(() => {
                setStage("offers");
            }, 800);
        }, 800);
    };

    // Mock accepting an offer
    const handleAcceptOffer = (offer) => {
        if (offer.type === "refund") {
            setStage("refunded");
            addMessage("user", "I'd prefer the refund.");
            setTimeout(() => {
                addMessage("ai", "Understood. Starting standard refund protocol.");
            }, 500);
        } else {
            setAcceptedOffer(offer);
            setStage("accepted");
            addMessage("user", `I'll take the ${offer.title}.`);
            setTimeout(() => {
                addMessage("ai", "Excellent choice. Value has been instantly credited to your wallet.");
            }, 500);
        }
    };

    const reset = () => {
        setStage("idle");
        setHistory([]);
        setSelectedReason(null);
        setAcceptedOffer(null);
        onClose();
    };

    // Render content based on stage
    return (
        <Modal
            isOpen={isOpen}
            onClose={reset}
            title="Resolution Center"
            className="h-[650px] flex flex-col overflow-y-auto border-primary/20 bg-black/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)]"
        >
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/20">
                {history.map((msg) => (
                    <ChatBubble key={msg.id} message={msg.text} sender={msg.sender} />
                ))}

                {/* Stage: Reason Selection */}
                {stage === "chat-reason" && (
                    <div className="grid grid-cols-1 gap-3 pl-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {WIDGET_CONFIG.questions[0].options.map((opt) => (
                            <Button
                                key={opt}
                                variant="outline"
                                onClick={() => handleReasonSelect(opt)}
                                className="justify-start text-left h-auto py-3 border-white/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all rounded-xl"
                            >
                                {opt}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Stage: Offers */}
                {stage === "offers" && (
                    <div className="space-y-4 pl-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-bold">
                            <Zap className="h-3 w-3" /> AI Suggested Resolutions
                        </div>
                        {WIDGET_CONFIG.offers.map((offer) => (
                            <OfferCard
                                key={offer.id}
                                offer={offer}
                                onSelect={handleAcceptOffer}
                            />
                        ))}
                    </div>
                )}

                {/* Stage: Accepted Success */}
                {stage === "accepted" && (
                    <div className="mt-8 flex flex-col items-center justify-center space-y-6 rounded-2xl bg-gradient-to-b from-success/10 to-transparent border border-success/20 p-8 text-center animate-in zoom-in duration-300">
                        <div className="relative">
                            <div className="rounded-full bg-success/20 p-4 text-success shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                <ShieldCheck className="h-10 w-10" />
                            </div>
                            <div className="absolute inset-0 rounded-full border border-success/40 animate-ping opacity-30"></div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Resolution Complete</h3>
                            <p className="text-success font-mono text-lg">${acceptedOffer?.value.toFixed(2)} Saved</p>
                        </div>
                        <Button onClick={reset} className="w-full bg-success hover:bg-success/90 text-white font-bold shadow-lg">Done</Button>
                    </div>
                )}

                {/* Stage: Refunded (Loss) */}
                {stage === "refunded" && (
                    <div className="mt-8 flex flex-col items-center justify-center space-y-6 rounded-2xl bg-white/5 border border-white/10 p-8 text-center animate-in zoom-in duration-300">
                        <div className="rounded-full bg-white/10 p-4 text-muted-foreground">
                            <RotateCw className="h-10 w-10" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Refund Initiated</h3>
                            <p className="text-muted-foreground">Processing estimate: 3-5 days</p>
                        </div>
                        <Button onClick={reset} variant="ghost" className="w-full border border-white/10">Close Window</Button>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

        </Modal>
    );
}
