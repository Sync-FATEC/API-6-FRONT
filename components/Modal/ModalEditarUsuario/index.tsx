"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import TextInput from "@/components/Inputs/Text";
import { Button } from "@/components/Button";
import { toast } from "@/lib/toast";
import { AuthService } from "@/services/AuthService";
import { useAuth } from "@/contexts/AuthContext";
import Select from "@/components/Inputs/Select";

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
  onSuccess?: () => void;
}

export default function ModalEditarUsuario({ open, usuario, onOpenChange, onSuccess }: Props) {
  const { user: loggedUser } = useAuth();

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState<"ADMIN" | "USER">("USER");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && usuario) {
      setNome(usuario.nome);
      setCargo(usuario.cargo);
      setEmail(usuario.email);
      setPapel(usuario.papel);
      setNovaSenha("");
      setConfirmarNovaSenha("");
    }
  }, [open, usuario]);

  const resetForm = () => {
    setNome("");
    setCargo("");
    setEmail("");
    setPapel("USER");
    setNovaSenha("");
    setConfirmarNovaSenha("");
  };

  const handleClose = (open: boolean) => {
    if (loading) return;
    if (!open) resetForm();
    onOpenChange(open);
  };

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!usuario) {
      toast.error("Nenhum usuário selecionado.");
      return;
    }

    if (!nome.trim()) {
      toast.warning("O nome é obrigatório.");
      return;
    }

    if (nome.trim().length < 1 || nome.trim().length > 255) {
      toast.warning("O nome deve ter entre 1 e 255 caracteres.");
      return;
    }

    if (!email.trim()) {
      toast.warning("O e-mail é obrigatório.");
      return;
    }

    if (!validarEmail(email)) {
      toast.warning("Digite um e-mail válido.");
      return;
    }

    if (cargo.trim().length > 200) {
      toast.warning("O cargo deve ter no máximo 200 caracteres.");
      return;
    }

    if (novaSenha || confirmarNovaSenha) {
      if (novaSenha.length < 8) {
        toast.warning("A nova senha deve ter pelo menos 8 caracteres.");
        return;
      }

      if (novaSenha !== confirmarNovaSenha) {
        toast.warning("As senhas não coincidem.");
        return;
      }

      if (novaSenha === nome.trim()) {
        toast.warning("A senha não pode ser igual ao nome.");
        return;
      }

      if (novaSenha === email.trim()) {
        toast.warning("A senha não pode ser igual ao e-mail.");
        return;
      }
    }

    const isAdmin = loggedUser?.papel === "ADMIN";
    const podeAlterarPapel = isAdmin;

    const payload: {
      nome: string;
      cargo: string;
      email: string;
      papel?: "ADMIN" | "USER";
      nova_senha?: string;
    } = {
      nome: nome.trim(),
      cargo: cargo.trim(),
      email: email.toLowerCase().trim(),
    };

    if (podeAlterarPapel) {
      payload.papel = papel;
    }

    if (novaSenha) {
      payload.nova_senha = novaSenha;
    }

    setLoading(true);

    try {
      await AuthService.editarUsuario(usuario.id, payload);

      toast.success("Usuário atualizado com sucesso.");
      handleClose(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const podeEditarPapel = loggedUser?.papel === "ADMIN";

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
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button onClick={handleSubmit} isLoading={loading}>
            Salvar alterações
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            id="editar-nome"
            label="Nome"
            placeholder="Digite o nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />

          <TextInput
            id="editar-email"
            label="E-mail"
            type="email"
            placeholder="Digite o e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            id="editar-cargo"
            label="Cargo"
            placeholder="Digite o cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            disabled={loading}
          />

          {podeEditarPapel ? (
            <Select
              id="editar-papel"
              label="Papel"
              value={papel}
              onChange={(value) => setPapel(value as "ADMIN" | "USER")}
              options={[
                {
                  value: "USER",
                  label: "Usuário comum",
                },
                {
                  value: "ADMIN",
                  label: "Administrador",
                },
              ]}
            />
          ) : (
            <div />
          )}
        </div>

        <div className="border-t border-slate-200 pt-4 mt-2">
          <p className="font-medium text-slate-700 mb-3">
            Alterar senha <span className="ms-1 text-slate-400">(opcional)</span>
          </p>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              id="editar-nova-senha"
              label="Nova senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              disabled={loading}
            />

            <TextInput
              id="editar-confirmar-senha"
              label="Confirmar nova senha"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
