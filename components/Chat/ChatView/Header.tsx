import React, { useEffect, useState } from "react";

interface ChatHeaderProps {
  isChatStarted: boolean;
}

export default function ChatHeader({ isChatStarted }: ChatHeaderProps) {
  const [headerText, setHeaderText] = useState("Bem vindo ao VISIONA GeoQuery");
  const [startTime, setStartTime] = useState<string>("");
  const [showStartTime, setShowStartTime] = useState(false);

  useEffect(() => {
    let eraseInterval: NodeJS.Timeout;
    let writeInterval: NodeJS.Timeout;

    if (!isChatStarted) {
      setHeaderText("Bem vindo ao VISIONA GeoQuery");
      setStartTime("");
      setShowStartTime(false);
    } else {
      const now = new Date();
      setStartTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      let currentText = "Bem vindo ao VISIONA GeoQuery";
      const targetText = "Conversa";

      eraseInterval = setInterval(() => {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          setHeaderText(currentText);
        } else {
          clearInterval(eraseInterval);

          setShowStartTime(true);

          let i = 0;
          writeInterval = setInterval(() => {
            if (i < targetText.length) {
              const nextChar = targetText.slice(0, i + 1);
              setHeaderText(nextChar);
              i++;
            } else {
              clearInterval(writeInterval);
            }
          }, 100);
        }
      }, 25);
    }

    return () => {
      clearInterval(eraseInterval);
      clearInterval(writeInterval);
    };
  }, [isChatStarted]);

  return (
    <div className="flex flex-col gap-4 mb-4 shrink-0">
      <div className="flex justify-between items-center">
        <h2 className="text-primary text-xl font-semibold flex items-center min-h-7">
          {headerText}
        </h2>

        {showStartTime && (
          <span className="text-slate-400 text-sm font-medium animate-pop-in">
            Iniciado às {startTime}
          </span>
        )}
      </div>

      {!isChatStarted && (
        <p className="text-slate-500 font-medium leading-relaxed">
          Aqui, você pode analisar os indicadores ambientais de qualquer imóvel rural do estado de
          São Paulo em segundos.
        </p>
      )}
    </div>
  );
}
