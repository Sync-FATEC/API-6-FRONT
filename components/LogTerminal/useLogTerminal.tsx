import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/utils/api";

export function useLogStream(isRunning: boolean) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isRunning) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLogs([]);
      return;
    }
    const apiUrl = getApiBaseUrl();
    const source = new EventSource(`${apiUrl}/etl/stream`);

    source.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);

      if (
        event.data.includes("Pipeline finalizado") ||
        event.data.includes("Stream não iniciado")
      ) {
        source.close();
      }
    };

    source.onerror = (err) => {
      console.error("Erro na conexão com o stream de logs", err);
      source.close();
    };

    return () => {
      source.close();
    };
  }, [isRunning]);

  return logs;
}
