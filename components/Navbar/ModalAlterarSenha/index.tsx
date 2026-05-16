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
}

export default function ModalAlterarSenha({ open, onOpenChange }: Props) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const handleClose = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.warning("Preencha todos os campos.");
      return;
    }
    if (novaSenha.length < 8) {
      toast.warning("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.warning("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const mensagem = await AuthService.alterarSenha(senhaAtual, novaSenha);
      toast.success(mensagem);
      handleClose(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Alterar senha"
      footer={
        <>
          <Button variant="soft" color="primary" onClick={() => handleClose(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <TextInput
          id="senha-atual"
          label="Senha atual"
          type="password"
          placeholder="Digite sua senha atual"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
        />
        <TextInput
          id="nova-senha"
          label="Nova senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <TextInput
          id="confirmar-senha"
          label="Confirmar nova senha"
          type="password"
          placeholder="Repita a nova senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />
      </div>
    </Modal>
  );
}
