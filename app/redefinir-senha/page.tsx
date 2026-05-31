"use client";
/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import TextInput from "@/components/Inputs/Text";
import { AuthService } from "@/services/AuthService";
import { toast } from "@/lib/toast";
import LoginLayout from "@/components/LoginLayout";

interface FormErrors {
  novaSenha?: string;
  confirmarSenha?: string;
}

function RedefinirSenhaContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const [isLoading, setIsLoading] = useState(false);

  const tokenInvalido = !token;

  function validate(): boolean {
    const next: FormErrors = {};

    if (!novaSenha) {
      next.novaSenha = "Campo obrigatório";
    } else if (novaSenha.length < 8) {
      next.novaSenha = "Mínimo de 8 caracteres";
    }

    if (!confirmarSenha) {
      next.confirmarSenha = "Campo obrigatório";
    } else if (novaSenha !== confirmarSenha) {
      next.confirmarSenha = "As senhas não conferem";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) {
      toast.warning("Formulário inválido", "Verifique os campos e tente novamente.");

      return;
    }

    if (!token) {
      toast.error("Link inválido", "Solicite um novo link de redefinição.");

      return;
    }

    setIsLoading(true);

    try {
      await AuthService.redefinirSenha(token, novaSenha);

      toast.success("Senha redefinida", "Faça login com sua nova senha.");

      router.replace("/login?senha_redefinida=1");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao redefinir senha.";

      toast.error(
        "Erro ao redefinir senha",
        msg.includes("Token") ? "Este link expirou ou já foi utilizado." : msg
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LoginLayout compact={tokenInvalido}>
      {tokenInvalido ? (
        <div className="text-center">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-12 mx-auto mb-8" />

          <h1 className="text-2xl font-semibold text-slate-800 mb-3">Link inválido</h1>

          <p className="text-slate-500 mb-6">
            Este link de redefinição é inválido, expirou ou já foi utilizado.
          </p>

          <Button className="w-full" onClick={() => router.push("/login")}>
            Voltar para Login
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-start mb-8">
            <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-12 mb-8" />

            <h1 className="text-3xl font-semibold text-slate-800">Redefinir senha</h1>

            <p className="text-slate-500 mt-2">Crie uma nova senha para sua conta.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <TextInput
              id="nova-senha"
              label="Nova senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={novaSenha}
              error={errors.novaSenha}
              onChange={(e) => {
                setNovaSenha(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  novaSenha: undefined,
                }));
              }}
            />

            <TextInput
              id="confirmar-senha"
              label="Confirmar nova senha"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmarSenha}
              error={errors.confirmarSenha}
              onChange={(e) => {
                setConfirmarSenha(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  confirmarSenha: undefined,
                }));
              }}
            />

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-4">
              Redefinir senha
            </Button>
          </form>
        </>
      )}
    </LoginLayout>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense>
      <RedefinirSenhaContent />
    </Suspense>
  );
}
