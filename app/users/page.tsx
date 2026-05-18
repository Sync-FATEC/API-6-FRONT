"use client";

import { useEffect, useState } from "react";

import Icon from "@/components/Icon";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BaseService } from "@/services/BaseService";

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

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        setLoading(true);
        setErro(null);

        const data = await BaseService.get<Usuario[]>("/usuarios");
        setUsuarios(data);
      } catch {
        setErro("Não foi possível carregar a listagem de usuários.");
      } finally {
        setLoading(false);
      }
    }

    carregarUsuarios();
  }, []);

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

          <h1 className="text-2xl font-semibold text-slate-800">
            Usuários
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Visualize os usuários cadastrados no sistema ASG.
          </p>
        </div>

        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
          <Icon name="users" size={28} className="text-primary" />
        </div>
      </section>

      <section className="bg-white rounded-lg p-5 shadow-sm flex-1 min-h-0 overflow-hidden">
        {usuarios.length === 0 ? (
          <EmptyUsuariosState />
        ) : (
          <div className="overflow-auto h-full scrollbar-mini">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="py-3 px-3 font-semibold">Nome</th>
                  <th className="py-3 px-3 font-semibold">E-mail</th>
                  <th className="py-3 px-3 font-semibold">Cargo</th>
                  <th className="py-3 px-3 font-semibold">Papel</th>
                  <th className="py-3 px-3 font-semibold">Criado em</th>
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

                    <td className="py-3 px-3 text-slate-600">
                      {usuario.email}
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {usuario.cargo || "-"}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          usuario.papel === "ADMIN"
                            ? "bg-primary-50 text-primary"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {usuario.papel}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500">
                      {usuario.criado_em
                        ? new Date(usuario.criado_em).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
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