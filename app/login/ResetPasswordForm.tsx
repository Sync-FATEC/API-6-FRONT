"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import TextInput from "@/components/Inputs/Text";
import { AuthService } from "@/services/AuthService";
import Icon from "@/components/Icon";
import { toast } from "@/lib/toast";

interface Props {
  onBack: () => void;
}

export default function ResetPasswordForm({ onBack }: Props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [sucesso, setSucesso] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  function validate(): boolean {
    if (!email.trim()) {
      setEmailError("Campo obrigatório");
      toast.warning("Formulário inválido", "Verifique os campos.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Informe um e-mail válido");
      toast.warning("E-mail inválido", "Verifique o e-mail fornecido.");
      return false;
    }

    setEmailError("");

    return true;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await AuthService.esqueciSenha(email.trim());

      setSucesso(true);

      toast.success("E-mail enviado", "Verifique sua caixa de entrada.");
    } catch {
      toast.error("Erro ao enviar e-mail", "Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start mb-8">
        <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-12 mb-8" />

        <h1 className="text-3xl font-semibold text-slate-800">Recuperar senha</h1>

        <p className="text-slate-500 mt-2">
          Informe seu e-mail para receber o link de redefinição.
        </p>
      </div>

      {sucesso ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 bg-success-50 text-success rounded-lg px-4 py-3 text-sm font-medium">
            <div className="flex gap-2">
              <Icon name="check" />

              <p className="text-base">E-mail enviado com sucesso!</p>
            </div>

            <span>Se o e-mail estiver cadastrado, você receberá as instruções em breve.</span>
          </div>

          <Button variant="solid" onClick={onBack}>
            Voltar para Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <TextInput
            id="forgot-email"
            label="E-mail"
            type="email"
            placeholder="email@visiona.com.br"
            value={email}
            error={emailError}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-4">
            Enviar link de redefinição
          </Button>

          <Button variant="soft" type="button" onClick={onBack}>
            Voltar para login
          </Button>
        </form>
      )}
    </>
  );
}
