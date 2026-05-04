"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface FiltroMapaDia {
  queimadasDia: Array<{ [key: string]: unknown }>;
  desmatamentoDia: Array<{ [key: string]: unknown }>;
  sicarDia: Array<{ [key: string]: unknown }>;
  prodesDia: Array<{ [key: string]: unknown }>;
}

interface DaySelectionContextType {
  dataSelecionada: string | null;
  filtroMapaDia: FiltroMapaDia;
  setDaySelection: (data: string | null, filtro: FiltroMapaDia) => void;
  clearDaySelection: () => void;
}

const DaySelectionContext = createContext<DaySelectionContextType | undefined>(undefined);

export function DaySelectionProvider({ children }: { children: ReactNode }) {
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [filtroMapaDia, setFiltroMapaDia] = useState<FiltroMapaDia>({
    queimadasDia: [],
    desmatamentoDia: [],
    sicarDia: [],
    prodesDia: [],
  });

  const setDaySelection = (data: string | null, filtro: FiltroMapaDia) => {
    setDataSelecionada(data);
    setFiltroMapaDia(filtro);
  };

  const clearDaySelection = () => {
    setDataSelecionada(null);
    setFiltroMapaDia({
      queimadasDia: [],
      desmatamentoDia: [],
      sicarDia: [],
      prodesDia: [],
    });
  };

  return (
    <DaySelectionContext.Provider
      value={{
        dataSelecionada,
        filtroMapaDia,
        setDaySelection,
        clearDaySelection,
      }}
    >
      {children}
    </DaySelectionContext.Provider>
  );
}

export function useDaySelection() {
  const context = useContext(DaySelectionContext);
  if (context === undefined) {
    throw new Error("useDaySelection deve ser usado dentro de DaySelectionProvider");
  }
  return context;
}
