"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import TextInput from "@/components/Inputs/Text";
import { AuthService } from "@/services/AuthService";

interface FormErrors {
  novaSenha?: string;
  confirmarSenha?: string;
}

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!novaSenha) {
      next.novaSenha = "Nova senha é obrigatória.";
    } else if (novaSenha.length < 8) {
      next.novaSenha = "A senha deve ter pelo menos 8 caracteres.";
    }
    if (!confirmarSenha) {
      next.confirmarSenha = "Confirme a nova senha.";
    } else if (novaSenha !== confirmarSenha) {
      next.confirmarSenha = "As senhas não conferem.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    if (!token) {
      setApiError("Link de redefinição inválido. Solicite um novo.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.redefinirSenha(token, novaSenha);
      router.replace("/login?senha_redefinida=1");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao redefinir a senha.";
      setApiError(msg.includes("Token") ? "Este link é inválido ou já expirou. Solicite um novo." : msg);
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-10 mb-6 mx-auto" />
          <p className="text-slate-700 font-medium mb-4">
            Link de redefinição inválido ou ausente.
          </p>
          <a href="/esqueci-senha" className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2">
            Solicitar novo link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-10 mb-6" />
          <h1 className="text-2xl font-bold text-slate-800">Redefinir senha</h1>
          <p className="text-slate-500 text-sm mt-1">Crie uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <TextInput
              id="nova-senha"
              label="Nova senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={novaSenha}
              onChange={(e) => {
                setNovaSenha(e.target.value);
                setErrors((prev) => ({ ...prev, novaSenha: undefined }));
                setApiError(null);
              }}
            />
            {errors.novaSenha && (
              <p className="text-danger text-xs font-medium">{errors.novaSenha}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <TextInput
              id="confirmar-senha"
              label="Confirmar nova senha"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmarSenha}
              onChange={(e) => {
                setConfirmarSenha(e.target.value);
                setErrors((prev) => ({ ...prev, confirmarSenha: undefined }));
                setApiError(null);
              }}
            />
            {errors.confirmarSenha && (
              <p className="text-danger text-xs font-medium">{errors.confirmarSenha}</p>
            )}
          </div>

          {apiError && (
            <div className="flex items-start gap-2 bg-danger-50 border border-danger-100 text-danger rounded-lg px-4 py-3 text-sm font-medium">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{apiError}</span>
            </div>
          )}

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-1">
            Redefinir senha
          </Button>
        </form>
      </div>
    </div>
  );
}
