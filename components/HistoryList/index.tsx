"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/className";
import Icon from "../Icon";
import { Button } from "../Button";
import { LoadingSpinner } from "../LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { TOKEN_KEY } from "@/constants/auth";
import { HistoricoService } from "@/services/HistoricoService";
import { IHistoricoItem } from "@/interfaces/services/HistoricoService";

interface Props {
  onClose: () => void;
}

function agrupar(items: IHistoricoItem[]): Record<string, IHistoricoItem[]> {
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const seteDias = new Date(hoje);
  seteDias.setDate(seteDias.getDate() - 7);

  const grupos: Record<string, IHistoricoItem[]> = {
    Hoje: [],
    Ontem: [],
    "Últimos 7 dias": [],
    Anteriores: [],
  };

  for (const item of items) {
    const d = new Date(item.atualizado_em ?? item.criado_em);
    if (d.toDateString() === hoje.toDateString()) grupos["Hoje"].push(item);
    else if (d.toDateString() === ontem.toDateString()) grupos["Ontem"].push(item);
    else if (d >= seteDias) grupos["Últimos 7 dias"].push(item);
    else grupos["Anteriores"].push(item);
  }

  return grupos;
}

export default function HistoryList({ onClose }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<IHistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function carregar() {
      setLoading(true);
      setErro(null);
      try {
        const token = localStorage.getItem(TOKEN_KEY) ?? "";
        const data = await HistoricoService.listar(token);
        setItems(data);
      } catch {
        setErro("Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [user]);

  const grupos = agrupar(items);

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

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <LoadingSpinner />
        </div>
      ) : erro ? (
        <p className="text-sm text-slate-400 text-center">{erro}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-400 text-center">Nenhuma conversa ainda.</p>
      ) : (
        Object.entries(grupos).map(([label, grupo]) =>
          grupo.length === 0 ? null : (
            <div key={label} className="flex flex-col gap-1">
              <h3 className="text-sm mb-1 text-slate-400">{label}</h3>

              {grupo.map((item) => (
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
                      {item.titulo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )
      )}
    </div>
  );
}
