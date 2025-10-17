"use client";
import {
  Bell,
  Boxes,
  Flag,
  Home,
  MessagesSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

export function DesktopSidebar() {
  const pathName = usePathname();
  console.log(pathName);
  const sidebarItems = [
    {
      label: "Dashboard",
      route: "/dashboard",
      icon: "",
    },
    {
      label: "Suggestions",
      route: "/suggestions",
      icon: <Sparkles />,
    },
    {
      label: "Co-founder Requests",
      route: "/requests",
      icon: <Boxes />,
    },
    {
      label: "Messages",
      route: "/messages",
      icon: <MessagesSquare />,
    },
    {
      label: "Notifications",
      route: "/notifications",
      icon: <Bell />,
    },
  ];

  const sidebarBottomItems = [
    {
      label: "Reporting",
      route: "/reporting",
      icon: <Flag />,
    },
    {
      label: "Settings",
      route: "/settings",
      icon: <Settings />,
    },
  ];
  const isActive = (route: string) =>
    pathName === route || pathName.startsWith(`${route}/`);
  return (
    <aside className="w-64 py-6 flex flex-col justify-between">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2 justify-center">
          <Image src="/svg/logo.svg" width={20} height={20} alt="logo" />
          <p className="text-[1.5em]">virofund</p>
        </div>
        <div className="flex flex-col px-2 gap-2">
          {sidebarItems.map((item, key) => {
            return (
              <div
                key={key}
                className={`w-full flex items-center p-2 gap-4 rounded-lg hover:bg-secondary transition-all duration-300 cursor-default ${
                  isActive(item.route) && "bg-secondary"
                }`}
              >
                {item.icon || <Home />}
                <p>{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col px-2 gap-2">
        {sidebarBottomItems.map((item, key) => {
          return (
            <div
              key={key}
              className={`w-full flex items-center p-2 gap-4 rounded-lg hover:bg-secondary transition-all duration-300 cursor-default font-medium ${
                isActive(item.route) && "bg-secondary"
              }`}
            >
              {item.icon}
              <p>{item.label}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
