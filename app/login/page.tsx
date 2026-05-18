"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import TextInput from "@/components/Inputs/Text";
interface FormErrors {
  email?: string;
  senha?: string;
}

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!email.trim()) {
      next.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Informe um e-mail válido.";
    }

    if (!senha) {
      next.senha = "Senha é obrigatória.";
    } else if (senha.length < 6) {
      next.senha = "Senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email.trim(), senha);
    } catch {
      setApiError("E-mail ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-10 mb-6" />
          <h1 className="text-2xl font-bold text-slate-800">Bem-vindo de volta</h1>
          <p className="text-slate-500 text-sm mt-1">Acesse o painel de monitoramento</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">

            <div className="relative">

              <TextInput
                id="email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (errors.email) {
                    setErrors((prev) => ({
                      ...prev,
                      email: undefined,
                    }));
                  }

                  setApiError(null);
                }}
              />
              {errors.email && (
                <p className="text-danger text-xs font-medium">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <TextInput
                id="senha"
                label="Senha"
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);

                  if (errors.senha) {
                    setErrors((prev) => ({
                      ...prev,
                      senha: undefined,
                    }));
                  }

                  setApiError(null);
                }}
              />
              {errors.senha && (
                <p className="text-danger text-xs font-medium">
                  {errors.senha}
                </p>
              )}
            </div>
          </div>

          {/* API error */}
          {apiError && (
            <div className="flex items-start gap-2 bg-danger-50 border border-danger-100 text-danger rounded-lg px-4 py-3 text-sm font-medium">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{apiError}</span>
            </div>
          )}

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-1">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
