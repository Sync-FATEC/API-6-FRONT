"use client";

import { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import { ScheduleService } from "../services/ScheduleService";

interface Props {
  onClose: () => void;
}

export default function ScheduleUpdateModal({ onClose }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit = date && time && !isPending && !success;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsPending(true);
    setIsError(false);
    try {
      await ScheduleService.scheduleUpdate({ data: date, hora: time });
      setSuccess(true);
    } catch {
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <Icon name="database-refresh" size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Agendar Atualização
              </h2>
              <p className="text-xs text-slate-400">Base de dados geoespacial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="bg-green-100 text-green-600 rounded-full p-3">
                <Icon name="check" size={28} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Atualização agendada com sucesso!
              </p>
              <p className="text-xs text-slate-400">
                A base de dados será atualizada em{" "}
                <span className="font-medium text-slate-600">
                  {new Date(`${date}T${time}`).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                .
              </p>
              <Button variant="secondary" size="sm" onClick={onClose} className="mt-2">
                Fechar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <p className="text-sm text-slate-500">
                Selecione a data e o horário para a próxima atualização da base de
                dados geoespacial.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Data
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {isError && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                  Erro ao agendar a atualização. Tente novamente.
                </p>
              )}

              {/* Footer */}
              <div className="flex gap-2 justify-end pt-1">
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!canSubmit}
                >
                  {isPending ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Agendando...
                    </>
                  ) : (
                    <>
                      <Icon name="calendar" size={16} />
                      Agendar
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
