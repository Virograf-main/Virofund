"use client";
import { Boxes, Flag, Home, LogOut, Sparkles, UserRound } from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { handleLogout } from "@/lib/auth";
import { useUserStore } from "@/store/userStore";
import { useQueryClient } from "@tanstack/react-query";

const sidebarItems = [
  { label: "Dashboard", route: "/dashboard", icon: <Home size={18} /> },
  { label: "Suggestions", route: "/suggestions", icon: <Sparkles size={18} /> },
  {
    label: "Co-founder Requests",
    route: "/requests",
    icon: <Boxes size={18} />,
  },
  { label: "Profile", route: "/profile", icon: <UserRound size={18} /> },
];

const sidebarBottomItems = [
  { label: "Reporting", route: "/reporting", icon: <Flag size={18} /> },
];

export function DesktopSidebar() {
  const pathName = usePathname();
  const router = useRouter();
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  const handleLogoutButtonClick = async () => {
    try {
      queryClient.clear();
      await handleLogout(router);
    } catch (err) {
      console.log(err);
    }
  };

  const isActive = (route: string) =>
    pathName === route || pathName.startsWith(`${route}/`);

  return (
    <aside className="w-64 h-screen py-6 flex-col justify-between hidden xl:flex border-r border-gray-100 bg-white">
      {/* Top section */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5">
          <Image src="/svg/logo.svg" width={22} height={22} alt="logo" />
          <p className="text-lg font-semibold tracking-tight">virofund</p>
        </div>

        {/* User info */}
        {user && (
          <div className="mx-3 px-3 py-3 rounded-xl bg-[#94f0c5]/10 border border-[#94f0c5]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#94f0c5] to-[#2db87a] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {user?.profile?.userName
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) ?? "?"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.profile?.userName ?? "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <div className="flex flex-col px-3 gap-1">
          {sidebarItems.map((item, key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: key * 0.05 }}
            >
              <Link
                href={item.route}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.route)
                    ? "bg-[#94f0c5]/20 text-[#1a6b4a]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={
                    isActive(item.route) ? "text-[#2db87a]" : "text-gray-400"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
                {isActive(item.route) && (
                  <motion.div
                    layoutId="desktop-active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2db87a]"
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col px-3 gap-1 border-t border-gray-100 pt-4">
        {sidebarBottomItems.map((item, key) => (
          <Link
            key={key}
            href={item.route}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.route)
                ? "bg-[#94f0c5]/20 text-[#1a6b4a]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-gray-400">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <button
          onClick={() => handleLogoutButtonClick()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-1"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
