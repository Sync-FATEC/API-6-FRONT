"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import Icon from "@/components/Icon";
import TextInput from "@/components/Inputs/Text";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/toast";

interface Props {
  onForgotPassword: () => void;
}

interface FormErrors {
  email?: string;
  senha?: string;
}

export default function LoginForm({ onForgotPassword }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!email.trim()) {
      next.email = "Campo obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Informe um e-mail válido.";
    }

    if (!senha) {
      next.senha = "Campo obrigatório";
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

    setIsLoading(true);

    try {
      await login(email.trim(), senha);
    } catch {
      toast.error("Login inválido", "E-mail ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start mb-8">
        <img src="/visiona_logo.svg" alt="VISIONA GeoQuery" className="h-12 mb-8" />

        <h1 className="text-3xl font-semibold text-slate-800">Acesse sua conta</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextInput
          id="email"
          label="E-mail"
          type="email"
          placeholder="email@visiona.com.br"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);

            if (errors.email) {
              setErrors((prev) => ({
                ...prev,
                email: undefined,
              }));
            }
          }}
        />

        <TextInput
          id="senha"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={senha}
          error={errors.senha}
          onChange={(e) => {
            setSenha(e.target.value);

            if (errors.senha) {
              setErrors((prev) => ({
                ...prev,
                senha: undefined,
              }));
            }
          }}
        />

        <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-4">
          Entrar
          <Icon name="login" />
        </Button>

        <Button variant="soft" type="button" onClick={onForgotPassword}>
          Esqueci minha senha
        </Button>
      </form>
    </>
  );
}
