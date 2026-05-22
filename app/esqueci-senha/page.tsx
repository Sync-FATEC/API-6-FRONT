"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import TextInput from "@/components/Inputs/Text";
import { AuthService } from "@/services/AuthService";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    if (!email.trim()) {
      setEmailError("E-mail é obrigatório.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Informe um e-mail válido.");
      return false;
    }
    setEmailError(undefined);
    return true;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      await AuthService.esqueciSenha(email.trim());
      setSucesso(true);
    } catch {
      setApiError("Ocorreu um erro ao enviar o e-mail. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-10 mb-6" />
          <h1 className="text-2xl font-bold text-slate-800">Esqueci minha senha</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {sucesso ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium">
              <span className="shrink-0 mt-0.5">✓</span>
              <span>
                Se o e-mail estiver cadastrado, você receberá as instruções em breve.
                Verifique sua caixa de entrada e a pasta de spam.
              </span>
            </div>
            <Link
              href="/login"
              className="text-center text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <TextInput
                id="email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(undefined);
                  setApiError(null);
                }}
              />
              {emailError && (
                <p className="text-danger text-xs font-medium">{emailError}</p>
              )}
            </div>

            {apiError && (
              <div className="flex items-start gap-2 bg-danger-50 border border-danger-100 text-danger rounded-lg px-4 py-3 text-sm font-medium">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{apiError}</span>
              </div>
            )}

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-1">
              Enviar link de redefinição
            </Button>

            <Link
              href="/login"
              className="text-center text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
            >
              Voltar para o login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
