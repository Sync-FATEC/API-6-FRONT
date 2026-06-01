"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../Icon";
import ModalUpdateData from "../Modal/ModalUpdateData";
import ModalAlterarSenha from "../Modal/ModalAlterarSenha";
import Popover from "../Popover";
import { PopoverItem } from "../Popover/Item";
import { Button } from "../Button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/className";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlterarSenhaOpen, setIsAlterarSenhaOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const { logout, user, isLoading } = useAuth();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIsHydrated(true);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <nav className="bg-white text-white py-4 shadow-sm z-49">
        <div className="w-full px-6 mx-auto transition-all duration-300 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <img src="/visiona_logo.svg" alt="VISIONA GeoQuery Logo" className="w-auto h-10" />
          </div>

          <div className="flex gap-5 items-center justify-center">
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? "pointer-events-none" : ""}
            >
              <Button
                size="md"
                variant="plain"
                className={cn(pathname === "/dashboard" ? "text-primary" : "")}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/" className={pathname === "/" ? "pointer-events-none" : ""}>
              <Button
                size="md"
                variant="plain"
                className={cn(pathname === "/" ? "text-primary" : "")}
              >
                Chat
              </Button>
            </Link>

            <Link href="/qgis" className={pathname === "/qgis" ? "pointer-events-none" : ""}>
              <Button
                size="md"
                variant="plain"
                className={cn(pathname === "/qgis" ? "text-primary" : "")}
              >
                QGIS
              </Button>
            </Link>
            {isHydrated && !isLoading && user?.papel === "ADMIN" && (
              <Link href="/users" className={pathname === "/users" ? "pointer-events-none" : ""}>
                <Button
                  size="md"
                  variant="plain"
                  className={cn(pathname === "/users" ? "text-primary" : "")}
                >
                  Usuários
                </Button>
              </Link>
            )}
          </div>

          <div className="flex-1 flex gap-6 items-center justify-end">
            {isHydrated && !isLoading && user?.papel === "ADMIN" && (
              <Button size="md" onClick={() => setIsModalOpen(true)}>
                <Icon name="data-plus" size={20} />
                Atualizar dados
              </Button>
            )}
            <Popover
              align="end"
              trigger={
                <button className="flex gap-3 items-center hover:bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {isHydrated && !isLoading && user?.nome?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-700 font-semibold">{user?.nome}</span>
                  <Icon name="chevron-down" className="text-slate-400" />
                </button>
              }
            >
              <PopoverItem onClick={() => setIsAlterarSenhaOpen(true)}>
                <Icon name="shield" size={16} />
                Alterar senha
              </PopoverItem>
              <PopoverItem onClick={logout} className="text-danger hover:bg-red-50">
                <Icon name="log-out" size={16} />
                Sair
              </PopoverItem>
            </Popover>
          </div>
        </div>
      </nav>

      <ModalUpdateData open={isModalOpen} onOpenChange={setIsModalOpen} />
      <ModalAlterarSenha open={isAlterarSenhaOpen} onOpenChange={setIsAlterarSenhaOpen} />
    </>
  );
}
