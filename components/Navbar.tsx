"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import ScheduleUpdateModal from "./ScheduleUpdateModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white text-white p-4 shadow-sm rounded-md h-18 mb-3">
        <div className="flex justify-between items-center h-full">
          <img src="/visiona_logo.svg" alt="VISIONA GeoQuery Logo" className="w-auto h-full" />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Icon name="database-refresh" size={16} />
            Atualizar Base
          </Button>
        </div>
      </nav>

      {isModalOpen && (
        <ScheduleUpdateModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
