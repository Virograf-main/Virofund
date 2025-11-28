"use client";
import { MobileSidebar } from "@/components/navigation/sidebar";
import { useUserStore } from "@/store/userStore";
import { Bell, MenuIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export function Navbar() {
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="py-2">
      <div className="flex items-center justify-between">
        <h1 className="text-[1.5em] lg:text-[2em] font-semibold hidden xl:block">
          Welcome back, {user?.firstName || "No Name"}!
        </h1>
        <div className="flex gap-2 items-center xl:hidden">
          <MenuIcon onClick={() => setIsOpen(true)} />
          <h1 className="text-[1.5em] lg:text-[2em] font-semibold">Virofund</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full overflow-hidden h-[40px] w-[40px]">
            <Image
              src="/jpg/no-image.jpg"
              width={50}
              height={50}
              alt="profile"
            />
          </div>
          <Bell height={30} width={30} />
        </div>
      </div>

      {isOpen && <MobileSidebar setIsOpen={setIsOpen} />}
    </nav>
  );
}
