"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Icon from "../Icon";
import ModalUpdateData from "./ModalUpdateData";
import { Button } from "../Button";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white text-white p-4 shadow-sm rounded-md h-18 mb-3">
        <div className="flex justify-between items-center h-full">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery Logo" className="w-auto h-full" />

          <Button size="md" className="me-1" onClick={() => setIsModalOpen(true)}>
            <Icon name="data-plus" size={20} />
            Atualizar dados
          </Button>
        </div>
      </nav>

      <ModalUpdateData open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
