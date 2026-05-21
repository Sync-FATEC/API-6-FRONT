"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/Button";
import { toast } from "@/lib/toast";
import { AuthService } from "@/services/AuthService";

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface Props {
  open: boolean;
  usuario: Usuario | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ModalExcluirUsuario({
  open,
  usuario,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClose = (open: boolean) => {
    if (loading) return;
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (!usuario) return;

    setLoading(true);

    try {
      const mensagem = await AuthService.excluirUsuario(usuario.id);

      toast.success(mensagem);
      handleClose(false);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao excluir usuário."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Excluir usuário"
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
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 py-2">
        <p className="text-sm text-slate-600">
          Tem certeza que deseja excluir este usuário?
        </p>

        {usuario && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-semibold text-slate-700">{usuario.nome}</p>
            <p className="text-sm text-slate-500">{usuario.email}</p>
          </div>
        )}

        <p className="text-sm text-red-500">
          Essa ação não poderá ser desfeita.
        </p>
      </div>
    </Modal>
  );
}