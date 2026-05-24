"use client";

import { cn } from "@/utils/className";
import Icon from "../Icon";
import { Button } from "../Button";
import { LoadingSpinner } from "../LoadingSpinner";
import { useChatHistory } from "./useChatHistory";
import Tooltip from "../Tooltip";

interface Props {
  onClose: () => void;
  onSelectChat?: (id: string) => void;
  activeChatId?: string | null;
  onDeleteChat?: (id: string) => void;
}

export default function HistoryList({ onClose, onSelectChat, activeChatId, onDeleteChat }: Props) {
  const { history, isLoading, isError } = useChatHistory();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-lg font-semibold text-slate-700 ps-2">Histórico</h2>
        <Button
          variant="plain"
          size="icon"
          onClick={onClose}
          className="w-10 h-10 bg-slate-50 me-5"
        >
          <Icon name="chevron-left" size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-6 scrollbar-mini pr-1 pb-4">
        {isLoading && <LoadingSpinner />}

        {isError && (
          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
            Ocorreu um erro inesperado ao carregar o histórico.
          </p>
        )}

        {!isLoading && !isError && history.length === 0 && (
          <p className="text-sm text-slate-400">Nenhuma conversa encontrada.</p>
        )}

        {!isLoading &&
          history.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <h3 className="text-sm mb-1 text-slate-400 ps-2">{group.label}</h3>

              {group.items.map((item) => {
                const isActive = item.id === activeChatId;

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectChat && onSelectChat(item.id)}
                    className={cn(
                      "group flex items-center justify-between ps-2 rounded-md cursor-pointer me-3",
                      isActive ? "bg-primary/5" : "hover:bg-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className={cn(
                          "text-sm truncate transition-colors",
                          isActive
                            ? "text-primary font-medium"
                            : "text-slate-600 group-hover:text-slate-800"
                        )}
                      >
                        {item.title}
                      </span>
                    </div>

                    <Tooltip content="Excluir conversa">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat?.(item.id);
                        }}
                        className={cn(
                          "cursor-pointer opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 rounded shrink-0",
                          "text-sm truncate",
                          isActive
                            ? "text-primary"
                            : "text-slate-400"
                        )}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
}
