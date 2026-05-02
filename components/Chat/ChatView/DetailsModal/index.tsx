import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/Button";
import { IQueryResponse } from "@/interfaces/services/QueryService";
import { DetailsBody } from "./Details";
import { CalculationBody } from "./Calculation";
import { DetailsFooter } from "./Details/Footer";
import { CalculationFooter } from "./Calculation/Footer";

interface Props {
  data: IQueryResponse;
}

type ViewType = "details" | "calculation";

export default function DetailsModal({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("details");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) setCurrentView("details");
  };

  if (data.intencao_detectada?.includes("fora_do_escopo")) return null;

  const hasAHP = Boolean(data.nota_risco && data.nota_risco.metodo_ahp);

  const titles = {
    details: "Detalhes do Processamento",
    calculation: "Detalhes do cálculo AHP",
  };

  const bodies = {
    details: <DetailsBody data={data} />,
    calculation: data.nota_risco?.metodo_ahp ? (
      <CalculationBody ahp={data.nota_risco.metodo_ahp} />
    ) : null,
  };

  const footers = {
    details: (
      <DetailsFooter
        hasAHP={hasAHP}
        onViewCalculation={() => setCurrentView("calculation")}
        onClose={() => setIsOpen(false)}
      />
    ),
    calculation: <CalculationFooter onBack={() => setCurrentView("details")} />,
  };

  return (
    <>
      <Button
        variant="plain"
        size="sm"
        className="bg-slate-50 mt-2 text-slate-500 text-xs font-medium"
        onClick={() => setIsOpen(true)}
      >
        Mais informações
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={handleOpenChange}
        title={titles[currentView]}
        footer={footers[currentView]}
      >
        {bodies[currentView]}
      </Modal>
    </>
  );
}
