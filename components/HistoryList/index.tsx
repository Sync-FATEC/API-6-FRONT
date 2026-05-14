"use client";

import { cn } from "@/utils/className";
import Icon from "../Icon";
import { Button } from "../Button"; // Importe o seu botão

interface HistoryItem {
  id: string;
  title: string;
  date: string;
}

interface HistoryGroup {
  label: string;
  items: HistoryItem[];
}

const mockHistory: HistoryGroup[] = [
  {
    label: "Hoje",
    items: [
      { id: "1", title: "Qual a situação ambiental de Ubatuba?", date: "10:30" },
      { id: "2", title: "Imóveis rurais em Campinas", date: "09:15" },
    ],
  },
  {
    label: "Ontem",
    items: [
      { id: "3", title: "Quais terras indígenas existem em Osasco?", date: "15:45" },
      { id: "4", title: "Comunidades quilombolas em Eldorado", date: "11:20" },
      { id: "5", title: "Análise de nascentes perto da Rodovia Dutra", date: "08:00" },
    ],
  },
  {
    label: "Últimos 7 dias",
    items: [
      { id: "6", title: "Focos de desmatamento em São José dos Campos", date: "10/05" },
      { id: "7", title: "Áreas de preservação permanente (APP) no Vale do Paraíba", date: "09/05" },
      { id: "8", title: "Sobreposição de CAR com unidades de conservação", date: "07/05" },
    ],
  },
];

interface Props {
  onClose: () => void;
}

export default function HistoryList({ onClose }: Props) {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto h-full scrollbar-mini">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-slate-700">Histórico</h2>
        <Button
          variant="plain"
          size="icon"
          onClick={onClose}
          className="w-10 h-10 bg-slate-50"
        >
          <Icon name="chevron-left" size={20} />
        </Button>
      </div>

      {mockHistory.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <h3 className="text-sm mb-1 text-slate-400">{group.label}</h3>

          {group.items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex items-center justify-between p-2 rounded-md cursor-pointer",
                "hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Icon
                  name="clock-past"
                  size={16}
                  className="text-slate-400 group-hover:text-primary shrink-0"
                />
                <span className="text-sm text-slate-600 truncate group-hover:text-slate-800">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
