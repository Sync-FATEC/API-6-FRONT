"use client";

import React, { useState, useRef } from "react";
import Button from "../Button";
import Icon from "../Icon";
import HelpModal from "./HelpModal";

interface Props {
  message: string;
  hasMessages: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onNewChat: () => void;
  onVoiceInput: (text: string) => void;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function ChatBox({
  message,
  hasMessages,
  textareaRef,
  onInput,
  onKeyDown,
  onSend,
  onNewChat,
  onVoiceInput,
}: Props) {
  const hasText = message.trim().length > 0;
  const [isListening, setIsListening] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const initializeRecognition = () => {
    if (recognitionRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Reconhecimento de voz não é suportado neste navegador");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onVoiceInput(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  };

  const handleVoiceClick = () => {
    if (!recognitionRef.current) {
      initializeRecognition();
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-2 pe-0 shadow-sm flex flex-col justify-between">
        <textarea
          ref={textareaRef}
          value={message}
          placeholder="Digite a sua pergunta aqui"
          onChange={onInput}
          onKeyDown={onKeyDown}
          className="w-full text-slate-700 bg-transparent outline-none p-3 resize-none overflow-y-hidden max-h-24 h-12 scrollbar-mini"
        />

        <div className="flex justify-between items-end mt-2">
          <Button variant="ghost" className="text-primary" onClick={() => setHelpOpen(true)}>
            <Icon name="help" size={20} />
            Ajuda
          </Button>

          <div className="flex gap-1">
            {hasMessages && (
              <Button variant="ghost" className="text-slate-400 animate-pop-in" onClick={onNewChat}>
                Novo Chat
              </Button>
            )}

            <Button
              variant="ghost"
              className={`text-slate-500 me-2 transition-colors ${isListening ? "text-red-500" : ""}`}
              square
              onClick={() => {
                if (hasText) {
                  onSend();
                } else {
                  handleVoiceClick();
                }
              }}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div
                  className={`absolute transition-all duration-300 ${
                    hasText ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                >
                  <Icon name="send" size={24} />
                </div>

                <div
                  className={`absolute transition-all duration-300 ${
                    isListening ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                >
                  <Icon name="pause" size={24} />
                </div>

                <div
                  className={`absolute transition-all duration-300 ${
                    !isListening && !hasText ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                >
                  <Icon name="mic" size={24} />
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  );
}
