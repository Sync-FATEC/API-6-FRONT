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
      <nav className="bg-white text-white py-5 shadow-sm z-49">
        <div className="mx-auto transition-all duration-300 flex justify-between items-center w-full px-6">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery Logo" className="w-auto h-full" />
          <div className="flex gap-2">
            <Link href={toggleLink}>
              <Button size="md" className="me-1" variant="soft" color="primary">
                <Icon name={toggleIcon} size={20} />
                {toggleLabel}
        <div className="w-full px-6 mx-auto transition-all duration-300 flex justify-between items-center">
          <img
            src="/visiona_logo.svg"
            alt="VISIONA GeoQuery Logo"
            className="w-auto h-full"
          />
          <div className="flex gap-2 items-center">
            <Link href="/">
              <Button
                size="md"
                className="me-1"
                variant={pathname === "/" ? "solid" : "soft"}
                color="primary"
              >
                <Icon name="search" size={20} />
                Chat
              </Button>
            </Link>
            {isHydrated && !isLoading && user?.papel === "ADMIN" && (
              <Link href="/users">
                <Button
                  size="md"
                  className="me-1"
                  variant={pathname === "/users" ? "solid" : "soft"}
                  color="primary"
                >
                  <Icon name="users" size={20} />
                  Usuários
                </Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button
                size="md"
                className="me-1"
                variant={pathname === "/dashboard" ? "solid" : "soft"}
                color="primary"
              >
                <Icon name="bar-chart-2" size={20} />
                Dashboard
              </Button>
            </Link>
            <Link href="/qgis">
              <Button
                size="md"
                className="me-1"
                variant={pathname === "/qgis" ? "solid" : "soft"}
                color="primary"
              >
                <Icon name="world" size={20} />
                QGIS
              </Button>
            </Link>
            {isHydrated && !isLoading && user?.papel === "ADMIN" && (
              <Button size="md" className="me-1" onClick={() => setIsModalOpen(true)}>
                <Icon name="data-plus" size={20} />
                Atualizar dados
              </Button>
            )}
            <Popover
              align="end"
              trigger={
                <button
                  suppressHydrationWarning
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {isHydrated && !isLoading && user?.nome?.charAt(0).toUpperCase()}
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
