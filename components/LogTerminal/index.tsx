import { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

interface Props {
  logs: string[];
}

export default function LogTerminal({ logs }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isFinished =
    logs.length > 0 &&
    (logs[logs.length - 1].includes("Pipeline finalizado") ||
      logs[logs.length - 1].includes("Stream não iniciado") ||
      logs[logs.length - 1].includes("[ERRO] Tempo esgotado"));

  useEffect(() => {
    if (isFinished) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setElapsedSeconds(0);

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [logs, isFinished]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, elapsedSeconds]);

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-100 overflow-y-auto font-mono text-xs w-full shadow-inner scrollbar-mini">
      {logs.length === 0 ? (
        <div className="flex items-center gap-2 text-slate-500 animate-pop-in-soft">
          <LoadingSpinner />
          Aguardando conexão com o servidor e inicialização do log...
        </div>
      ) : (
        <ul className="space-y-1">
          {logs.map((log, index) => {
            const isError = log.includes("[ERRO]") || log.includes("[ERROR]");

            return (
              <li key={index} className={isError ? "text-danger" : "text-slate-700"}>
                {log}
              </li>
            );
          })}

          {!isFinished && elapsedSeconds >= 2 && (
            <li className="flex justify-between items-center text-slate-400 mt-3">
              <span className="flex items-center gap-2 animate-pop-in-soft">
                <LoadingSpinner />
                Processando dados em segundo plano...
              </span>
              <span className="font-semibold">{elapsedSeconds}s</span>
            </li>
          )}
        </ul>
      )}
      <div ref={endRef} />
    </div>
  );
}
