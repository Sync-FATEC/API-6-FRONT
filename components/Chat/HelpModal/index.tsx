"use client";

import Modal from "@/components/Modal";
import { useState, useEffect } from "react";
import HelpFooter from "./Footer";
import { STEPS, SUGGESTIONS } from "./Content";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpModal({ open, onOpenChange }: HelpModalProps) {
  const [mode, setMode] = useState<"home" | "tutorial">("home");
  const [step, setStep] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setMode("home");
        setStep(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));
  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else onOpenChange(false);
  };

  const modalTitle = mode === "home" ? "Ajuda" : STEPS[step].title;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={modalTitle}
      footer={
        <HelpFooter
          mode={mode}
          step={step}
          totalSteps={STEPS.length}
          onStartTutorial={() => {
            setStep(0);
            setMode("tutorial");
          }}
          onStepChange={setStep}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      }
    >
      <div className="max-h-[60vh] overflow-y-auto pr-1">
        {mode === "home" ? (
          <div className="flex flex-col gap-8">
            <p className="text-slate-500">
              Veja algumas perguntas que você pode fazer ou inicie o tutorial para entender como o
              sistema funciona.
            </p>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                Sugestões de perguntas
              </p>
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleCopy(suggestion, index)}
                  className="text-left cursor-pointer text-sm text-slate-700 bg-slate-50 hover:bg-primary/5 rounded-lg p-3 transition-all flex items-center justify-between gap-3 group"
                >
                  <span>{suggestion}</span>
                  <span className="text-sm shrink-0 text-slate-400 group-hover:text-primary transition-colors">
                    {copiedIndex === index ? "✓ Copiado" : "Copiar"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>{STEPS[step].content}</div>
        )}
      </div>
    </Modal>
  );
}
