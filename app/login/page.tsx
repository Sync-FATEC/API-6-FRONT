"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import { IconAt, IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/className";

interface FormErrors {
  email?: string;
  senha?: string;
}

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
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
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <IconAt size={18} />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  setApiError(null);
                }}
                className={cn(
                  "w-full h-11 pl-10 pr-4 rounded-lg border text-slate-800 text-sm outline-none transition-all",
                  "placeholder:text-slate-400",
                  "focus:ring-2 focus:ring-primary focus:border-primary",
                  errors.email
                    ? "border-danger ring-1 ring-danger bg-danger-50"
                    : "border-slate-300 bg-white hover:border-slate-400"
                )}
              />
            </div>
            {errors.email && (
              <p className="text-danger text-xs font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="text-sm font-semibold text-slate-700">
              Senha
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <IconLock size={18} />
              </span>
              <input
                id="senha"
                type={showSenha ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (errors.senha) setErrors((prev) => ({ ...prev, senha: undefined }));
                  setApiError(null);
                }}
                className={cn(
                  "w-full h-11 pl-10 pr-11 rounded-lg border text-slate-800 text-sm outline-none transition-all",
                  "placeholder:text-slate-400",
                  "focus:ring-2 focus:ring-primary focus:border-primary",
                  errors.senha
                    ? "border-danger ring-1 ring-danger bg-danger-50"
                    : "border-slate-300 bg-white hover:border-slate-400"
                )}
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {showSenha ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
            {errors.senha && (
              <p className="text-danger text-xs font-medium">{errors.senha}</p>
            )}
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
