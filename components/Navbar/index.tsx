"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../Icon";
import ModalUpdateData from "./ModalUpdateData";
import { Button } from "../Button";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const toggleLink = isDashboard ? "/" : "/dashboard";
  const toggleLabel = isDashboard ? "Chat" : "Dashboard";
  const toggleIcon = isDashboard ? "search" : "bar-chart-2";

  return (
    <>
      <nav className="bg-white text-white p-4 shadow-sm rounded-md h-18 mb-3">
        <div className="flex justify-between items-center h-full">
          <Link href="/" className="flex items-center h-full">
            <img src="/visiona_logo.svg" alt="VISIONA GeoQuery Logo" className="w-auto h-full cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>

          <div className="flex gap-2">
            <Link href={toggleLink}>
              <Button size="md" className="me-1" variant="soft" color="primary">
                <Icon name={toggleIcon} size={20} />
                {toggleLabel}
              </Button>
            </Link>
            <Button size="md" className="me-1" onClick={() => setIsModalOpen(true)}>
              <Icon name="data-plus" size={20} />
              Atualizar dados
            </Button>
          </div>
        </div>
      </nav>

      <ModalUpdateData open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
