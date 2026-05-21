"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import TextInput from "@/components/Inputs/Text";
import { Button } from "@/components/Button";
import { toast } from "@/lib/toast";
import { AuthService } from "@/services/AuthService";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ModalCadastrarUsuario({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState<"ADMIN" | "USER">("USER");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNome("");
    setCargo("");
    setEmail("");
    setSenha("");
    setPapel("USER");
  };

  const handleClose = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (!nome || !cargo || !email || !senha) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    if (senha.length < 8) {
      toast.warning("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await AuthService.cadastrarUsuario({
        nome,
        cargo,
        email,
        senha,
        papel,
      });

      toast.success("Usuário cadastrado com sucesso.");
      handleClose(false);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao cadastrar usuário."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Cadastrar usuário"
      footer={
        <>
          <Button
            variant="soft"
            color="primary"
            onClick={() => handleClose(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <TextInput
          id="nome"
          label="Nome"
          placeholder="Digite o nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <TextInput
          id="cargo"
          label="Cargo"
          placeholder="Digite o cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />

        <TextInput
          id="email"
          label="E-mail"
          type="email"
          placeholder="Digite o e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          id="senha"
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="papel"
            className="text-sm font-medium text-slate-700"
          >
            Papel
          </label>

          <select
            id="papel"
            value={papel}
            onChange={(e) => setPapel(e.target.value as "ADMIN" | "USER")}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary"
          >
            <option value="USER">Usuário comum</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}