import React, { useEffect, useState } from "react";

interface ChatHeaderProps {
  isChatStarted: boolean;
}

export default function ChatHeader({ isChatStarted }: ChatHeaderProps) {
  const [headerText, setHeaderText] = useState("Bem vindo ao VISIONA GeoQuery");
  const [startTime, setStartTime] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isChatStarted && !isAnimating && headerText !== "Conversa") {
      setIsAnimating(true);

      const now = new Date();
      setStartTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      let currentText = headerText;
      const targetText = "Conversa";

      const eraseInterval = setInterval(() => {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          setHeaderText(currentText);
        } else {
          clearInterval(eraseInterval);

          let i = 0;
          const writeInterval = setInterval(() => {
            if (i < targetText.length) {
              const nextChar = targetText.slice(0, i + 1);
              setHeaderText(nextChar);
              i++;
            } else {
              clearInterval(writeInterval);
              setIsAnimating(false);
            }
          }, 100);
        }
      }, 25);
    }
  }, [isChatStarted, isAnimating, headerText]);

  return (
    <div className="flex justify-between items-center mb-4 shrink-0">
      <h2 className="text-primary text-xl font-semibold flex items-center">{headerText}</h2>

      {isChatStarted && startTime && (
        <span className="text-slate-400 text-sm font-medium animate-in fade-in">
          Iniciado às {startTime}
        </span>
      )}
    </div>
  );
}
