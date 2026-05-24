import { useEffect, useRef } from "react";
import ChatHeader from "./Header";
import DetailsModal from "./DetailsModal";
import ImovelAmeacasCard from "./ImovelAmeacasCard";
import GruposCard from "./GruposCard";
import QgisExportLink from "./QgisExportLink";
import { ChatMessage } from "@/interfaces/components/chat";
import { Button } from "@/components/Button";
import Icon from "@/components/Icon";
import { IQueryResponse } from "@/interfaces/services/QueryService";

interface Props {
  messages: ChatMessage[];
  activeMessageId?: string | null;
  onActivateMap?: (msgId: string, queryData: IQueryResponse) => void;
}

export default function ChatView({ messages, activeMessageId, onActivateMap }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isChatStarted = messages.length > 0;

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg p-6 shadow-sm flex flex-col gap-4 min-h-0 scrollbar-mini">
      <ChatHeader isChatStarted={isChatStarted} />

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[80%] wrap-break-word rounded-lg text-sm sm:text-base ${
            msg.role === "user"
              ? "bg-slate-50 text-slate-700 self-end rounded-br-none p-3"
              : "text-slate-700 self-start rounded-bl-none"
          }`}
        >
          {msg.role === "bot" ? (
            <>
              {msg.status === "thinking" ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              ) : (
                <>
                  {msg.thinkingTime && (
                    <div className="text-sm font-medium text-slate-400 mb-1 animate-pop-in-up">
                      Pensou por {(msg.thinkingTime / 1000).toFixed(2)}s
                    </div>
                  )}
                  <p>{msg.content}</p>

                  {msg.status === "done" && msg.queryData?.imovel && (
                    <ImovelAmeacasCard
                      imovel={msg.queryData.imovel}
                      ameacas={msg.queryData.ameacas_encontradas ?? []}
                      risco={msg.queryData.nota_risco}
                    />
                  )}

                  {msg.status === "done" &&
                    msg.queryData?.grupos &&
                    msg.queryData.grupos.length > 1 && (
                      <GruposCard
                        grupos={msg.queryData.grupos}
                        eixo={msg.queryData.eixo_agrupamento ?? "unico"}
                      />
                    )}

                  {msg.status === "done" && msg.queryData && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <DetailsModal data={msg.queryData} />

                      {(msg.queryData.total_resultados ?? 0) > 0 && (
                        <QgisExportLink
                          url={msg.queryData.qgis_url}
                          urlsGrupos={msg.queryData.qgis_urls}
                        />
                      )}

                      {msg.queryData.geojson && (
                        <Button
                          variant={msg.id === activeMessageId ? "solid" : "soft"}
                          size="sm"
                          onClick={() => onActivateMap?.(msg.id, msg.queryData!)}
                          className={msg.id === activeMessageId ? "pointer-events-none" : undefined}
                        >
                          <Icon name="gps-pin" size={20} />
                          {msg.id === activeMessageId ? "Focando" : "Focar"}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
