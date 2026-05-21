"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BaseService } from "@/services/BaseService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/Button";
import ModalCadastrarUsuario from "@/components/Modal/ModalCadastrarUsuario";
import ModalEditarUsuario from "@/components/Modal/ModalEditarUsuario";
import ModalExcluirUsuario from "@/components/Modal/ModalExcluirUsuario";
import { TOKEN_KEY } from "@/constants/auth";

interface Usuario {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  papel: "ADMIN" | "USER";
  criado_em?: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [openCadastrarModal, setOpenCadastrarModal] = useState(false);
  const [openEditarModal, setOpenEditarModal] = useState(false);
  const [openExcluirModal, setOpenExcluirModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && user?.papel !== "ADMIN") {
      router.replace("/");
    }
  }, [mounted, isLoading, user, router]);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        setLoading(true);
        setErro(null);

        const token = localStorage.getItem(TOKEN_KEY) ?? "";
        const data = await BaseService.getWithAuth<Usuario[]>(
          "/v1/auth/usuarios",
          token
        );

        setUsuarios(data);
      } catch {
        setErro("Não foi possível carregar a listagem de usuários.");
      } finally {
        setLoading(false);
      }
    }

    if (mounted && !isLoading && user?.papel === "ADMIN") {
      carregarUsuarios();
    }
  }, [mounted, isLoading, user]);

  if (!mounted || isLoading) return null;

  if (user?.papel !== "ADMIN") return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-white rounded-lg shadow-sm p-8">
        <Icon name="info" size={32} className="text-danger" />

        <p className="font-semibold text-slate-700">{erro}</p>

        <p className="text-sm text-slate-500">
          Verifique se o backend está em execução e se a rota{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded">
            /api/usuarios
          </code>{" "}
          existe.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <section className="bg-white rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
            <Icon name="users" size={18} />
            Gerenciamento
          </div>

          <h1 className="text-2xl font-semibold text-slate-800">Usuários</h1>

          <p className="text-sm text-slate-500 mt-1">
            Visualize os usuários cadastrados no sistema.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setOpenCadastrarModal(true)}>
            Novo usuário
          </Button>
        </div>
      </section>

      <section className="bg-white rounded-lg p-5 shadow-sm flex-1 min-h-0 overflow-hidden">
        {usuarios.length === 0 ? (
          <EmptyUsuariosState />
        ) : (
          <div className="overflow-auto h-full scrollbar-mini">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[38%]" />
                <col className="w-[16%]" />
                <col className="w-[10%]" />
                <col className="w-[11%]" />
              </colgroup>

              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="py-3 px-3 font-semibold">Nome</th>
                  <th className="py-3 px-3 font-semibold">E-mail</th>
                  <th className="py-3 px-3 font-semibold">Cargo</th>
                  <th className="py-3 px-3 font-semibold">Papel</th>
                  <th className="py-3 px-3 font-semibold text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                          {usuario.nome?.[0]?.toUpperCase() || "U"}
                        </div>

                        <span className="font-medium text-slate-700">
                          {usuario.nome || "Sem nome"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 truncate">
                      {usuario.email}
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {usuario.cargo || "-"}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${usuario.papel === "ADMIN"
                          ? "bg-primary-50 text-primary"
                          : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {usuario.papel}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                          title="Editar usuário"
                            onClick={() => {
                            setUsuarioSelecionado(usuario);
                            setOpenEditarModal(true);
                          }}
                        >
                          <Icon name="edit" size={18} />
                        </button>

                        <button
                          className="w-9 h-9 rounded-lg border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                          title="Excluir usuário"
                          onClick={() => {
                            setUsuarioSelecionado(usuario);
                            setOpenExcluirModal(true);
                          }}
                        >
                          <Icon name="trash" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <ModalCadastrarUsuario
        open={openCadastrarModal}
        onOpenChange={setOpenCadastrarModal}
        onSuccess={() => {
          window.location.reload();
        }}
      />
      <ModalEditarUsuario
        open={openEditarModal}
        usuario={usuarioSelecionado}
        onOpenChange={setOpenEditarModal}
        onSuccess={() => {
          window.location.reload();
        }}
      />
      <ModalExcluirUsuario
        open={openExcluirModal}
        usuario={usuarioSelecionado}
        onOpenChange={setOpenExcluirModal}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </div>

  );
}

function EmptyUsuariosState() {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col gap-4 max-w-md w-full items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
          <Icon name="users" size={40} className="text-primary" />
        </div>

        <h3 className="font-semibold text-2xl text-slate-700">
          Nenhum usuário encontrado
        </h3>

        <p className="text-base text-slate-500 leading-relaxed">
          Quando houver usuários cadastrados, eles aparecerão nesta listagem.
        </p>
      </div>
    </div>
  );
}