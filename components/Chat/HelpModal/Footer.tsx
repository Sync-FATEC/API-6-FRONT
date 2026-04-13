import { Button } from "@/components/Button";
import ModalFooter from "@/components/Modal/Footer";

interface Props {
  mode: "home" | "tutorial";
  step: number;
  totalSteps: number;
  onStartTutorial: () => void;
  onStepChange: (step: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function HelpFooter({
  mode,
  step,
  totalSteps,
  onStartTutorial,
  onStepChange,
  onPrev,
  onNext,
}: Props) {
  if (mode === "home") {
    return (
      <ModalFooter
        right={
          <Button onClick={onStartTutorial}>
            Iniciar tutorial
          </Button>
        }
      />
    );
  }

  return (
    <ModalFooter
      left={
        <div className="flex gap-1.5 items-center bg-slate-50 py-4 px-6 rounded-xl">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => onStepChange(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === step ? "bg-primary w-6" : "bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      }
      right={
        <>
          {step > 0 && (
            <Button variant="soft" onClick={onPrev}>
              Anterior
            </Button>
          )}
          <Button onClick={onNext}>
            {step < totalSteps - 1 ? "Próximo" : "Concluir"}
          </Button>
        </>
      }
    />
  );
}
