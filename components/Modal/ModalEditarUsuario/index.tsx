"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import TextInput from "@/components/Inputs/Text";
import { Button } from "@/components/Button";

interface Usuario {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  papel: "ADMIN" | "USER";
}

interface Props {
  open: boolean;
  usuario: Usuario | null;
  onOpenChange: (open: boolean) => void;
}

export default function ModalEditarUsuario({
  open,
  onOpenChange,
}: Props) {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState<"ADMIN" | "USER">("USER");

  const resetForm = () => {
    setNome("");
    setCargo("");
    setEmail("");
    setPapel("USER");
  };

  const handleClose = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Editar usuário"
      footer={
        <>
          <Button
            variant="soft"
            color="primary"
            onClick={() => handleClose(false)}
          >
            Cancelar
          </Button>

          <Button>
            Salvar alterações
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <TextInput
          id="editar-nome"
          label="Nome"
          placeholder="Digite o nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <TextInput
          id="editar-cargo"
          label="Cargo"
          placeholder="Digite o cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />

        <TextInput
          id="editar-email"
          label="E-mail"
          type="email"
          placeholder="Digite o e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="editar-papel"
            className="text-sm font-medium text-slate-700"
          >
            Papel
          </label>

          <select
            id="editar-papel"
            value={papel}
            onChange={(e) => setPapel(e.target.value as "ADMIN" | "USER")}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}