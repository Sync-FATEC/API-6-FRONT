"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../Icon";
import ModalUpdateData from "./ModalUpdateData";
import { Button } from "../Button";
import { cn } from "@/utils/className";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isDashboard = pathname === "/dashboard";
  const isQgis = pathname === "/qgis";
  const toggleLink = isDashboard ? "/" : "/dashboard";
  const toggleLabel = isDashboard ? "Chat" : "Dashboard";
  const toggleIcon = isDashboard ? "search" : "bar-chart-2";

  return (
    <>
      <nav className="bg-white text-white py-5 shadow-sm z-49">
        <div
          className={cn(
            "mx-auto transition-all duration-300 flex justify-between items-center",
            !isDashboard ? "w-full px-6" : "w-5/6"
          )}
        >
            <img
              src="/visiona_logo.svg"
              alt="VISIONA GeoQuery Logo"
              className="w-auto h-full"
            />
          <div className="flex gap-2 items-center">
            <Link href={toggleLink}>
              <Button size="md" className="me-1" variant="soft" color="primary">
                <Icon name={toggleIcon} size={20} />
                {toggleLabel}
              </Button>
            </Link>
            <Link href={isQgis ? "/" : "/qgis"}>
              <Button
                size="md"
                className="me-1"
                variant={isQgis ? "solid" : "soft"}
                color="primary"
              >
                <Icon name="world" size={20} />
                QGIS
              </Button>
            </Link>
            <Button size="md" className="me-1" onClick={() => setIsModalOpen(true)}>
              <Icon name="data-plus" size={20} />
              Atualizar dados
            </Button>
            <Button size="md" variant="soft" color="danger" onClick={logout}>
              <Icon name="log-out" size={20} />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <ModalUpdateData open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
