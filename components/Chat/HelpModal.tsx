"use client";

import { useState } from "react";
import Button from "../Button";

interface HelpModalProps {
  onClose: () => void;
}

const SUGGESTIONS = [
  "Qual é a área de reserva legal em Campinas em 2023?",
  "Mostre propriedades com APP irregular em São Paulo",
  "Quais municípios têm maior índice de desmatamento?",
  "Qual o total de área protegida em Ribeirão Preto?",
];

const STEPS = [
  {
    title: "O que é o VISIONA GeoQuery?",
    content: (
      <div className="flex flex-col gap-3 text-slate-600 text-sm leading-relaxed">
        <p>
          O <span className="font-semibold text-slate-800">VISIONA GeoQuery</span> é
          um sistema de consulta inteligente para indicadores ambientais de
          propriedades rurais do estado de São Paulo.
        </p>
        <p>
          Através de <span className="font-semibold text-slate-800">linguagem natural</span>,
          você pode fazer perguntas sobre dados como reserva legal, Área de
          Preservação Permanente (APP), desmatamento e irregularidades no CAR
          — sem precisar saber programar ou usar filtros manuais.
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex flex-col gap-1">
          <p className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Dados disponíveis</p>
          <ul className="list-disc list-inside text-slate-600 flex flex-col gap-0.5">
            <li>Reserva legal e APP</li>
            <li>Indicadores de desmatamento</li>
            <li>Cadastro Ambiental Rural (CAR)</li>
            <li>Análise geoespacial por município</li>
          </ul>
        </div>
        <p>
          Os resultados aparecem como texto e também são exibidos no{" "}
          <span className="font-semibold text-slate-800">mapa interativo</span> ao
          lado.
        </p>
      </div>
    ),
  },
  {
    title: "Como funciona o PLN?",
    content: (
      <div className="flex flex-col gap-3 text-slate-600 text-sm leading-relaxed">
        <p>
          O sistema usa{" "}
          <span className="font-semibold text-slate-800">
            Processamento de Linguagem Natural (PLN)
          </span>{" "}
          para entender a sua pergunta. Veja os conceitos principais:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              term: "Tokenização",
              def: 'Divide a frase em partes menores (tokens). Ex: "reserva legal em Campinas" → ["reserva", "legal", "em", "Campinas"]',
            },
            {
              term: "Lematização",
              def: 'Reduz palavras à sua forma base. Ex: "irregularidades" → "irregular"',
            },
            {
              term: "Intenção detectada",
              def: "Identifica o que você quer saber — ex: área de APP, desmatamento, total de propriedades.",
            },
            {
              term: "Confiança",
              def: "Percentual de certeza do sistema sobre a intenção da sua pergunta. Quanto mais claro, maior a confiança.",
            },
            {
              term: "Entidades",
              def: "Elementos extraídos da pergunta, como nome de município ou período de tempo.",
            },
          ].map(({ term, def }) => (
            <div key={term} className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-800 text-xs mb-0.5">{term}</p>
              <p className="text-slate-600 text-xs leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Como interpretar as respostas?",
    content: (
      <div className="flex flex-col gap-3 text-slate-600 text-sm leading-relaxed">
        <p>
          Cada resposta do sistema traz informações adicionais que ajudam a
          avaliar a qualidade e a origem dos dados.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              term: "Fonte e Ano",
              def: 'Clique em "Mais informações" abaixo da resposta para ver de qual base de dados veio o resultado e o ano de referência.',
            },
            {
              term: "Mapa interativo",
              def: "Quando há dados geoespaciais, as propriedades ou regiões são destacadas automaticamente no mapa à direita.",
            },
            {
              term: "Intenção fora do escopo",
              def: "Se o sistema não reconhecer a pergunta, ele vai indicar que a intenção está fora do escopo — tente reformular de forma mais específica.",
            },
            {
              term: "Tempo de processamento",
              def: "O tempo exibido abaixo da resposta mostra quanto o sistema levou para processar e buscar os dados.",
            },
          ].map(({ term, def }) => (
            <div key={term} className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-800 text-xs mb-0.5">{term}</p>
              <p className="text-slate-600 text-xs leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 text-center mt-1">
          Pronto! Agora é só fazer sua pergunta. 🌿
        </p>
      </div>
    ),
  },
];

export default function HelpModal({ onClose }: HelpModalProps) {
  const [mode, setMode] = useState<"home" | "tutorial">("home");
  const [step, setStep] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));
  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="font-semibold text-slate-800 text-base">
            {mode === "home" ? "Ajuda" : STEPS[step].title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-2 max-h-[60vh] overflow-y-auto">
          {mode === "home" ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-500">
                Veja algumas perguntas que você pode fazer ou inicie o tutorial
                para entender como o sistema funciona.
              </p>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Sugestões de perguntas
                </p>
                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleCopy(suggestion, index)}
                    className="text-left text-sm text-slate-700 bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 rounded-lg px-3 py-2.5 transition-all flex items-center justify-between gap-3 group"
                  >
                    <span>{suggestion}</span>
                    <span className="text-xs shrink-0 text-slate-400 group-hover:text-primary transition-colors">
                      {copiedIndex === index ? "✓ Copiado" : "Copiar"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>{STEPS[step].content}</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-between border-t border-slate-100 mt-2">
          {mode === "home" ? (
            <>
              <span className="text-xs text-slate-400">
                Clique numa pergunta para copiar
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setStep(0);
                  setMode("tutorial");
                }}
              >
                Iniciar tutorial
              </Button>
            </>
          ) : (
            <>
              <div className="flex gap-1.5 items-center">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === step
                        ? "bg-primary w-4"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {step > 0 && (
                  <Button variant="tertiary" size="sm" onClick={handlePrev}>
                    Anterior
                  </Button>
                )}
                <Button variant="primary" size="sm" onClick={handleNext}>
                  {step < STEPS.length - 1 ? "Próximo" : "Concluir"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
