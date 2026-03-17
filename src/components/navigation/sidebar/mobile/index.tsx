"use client";
import {
  Bell,
  Boxes,
  Flag,
  Home,
  Settings,
  Sparkles,
  UserRound,
  X,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogout } from "@/lib/auth";
import { useUserStore } from "@/store/userStore";

const sidebarItems = [
  { label: "Dashboard", route: "/dashboard", icon: <Home size={20} /> },
  { label: "Suggestions", route: "/suggestions", icon: <Sparkles size={20} /> },
  {
    label: "Co-founder Requests",
    route: "/requests",
    icon: <Boxes size={20} />,
  },
  { label: "Profile", route: "/profile", icon: <UserRound size={20} /> },
  // { label: "Notifications", route: "/notifications", icon: <Bell size={20} /> },
];

const sidebarBottomItems = [
  { label: "Reporting", route: "/reporting", icon: <Flag size={20} /> },
  // { label: "Settings", route: "/settings", icon: <Settings size={20} /> },
];

export function MobileSidebar({
  setIsOpen,
}: {
  setIsOpen: (val: boolean) => void;
}) {
  const pathName = usePathname();
  const router = useRouter();
  const { user } = useUserStore();

  const isActive = (route: string) =>
    pathName === route || pathName.startsWith(`${route}/`);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] xl:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Drawer */}
        <motion.aside
          className="absolute top-0 left-0 h-full w-[300px] bg-white flex flex-col shadow-2xl"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Image src="/svg/logo.svg" width={22} height={22} alt="logo" />
              <p className="text-lg font-semibold tracking-tight">virofund</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* User info */}
          {user && (
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#94f0c5] to-[#2db87a] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
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
          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
            {sidebarItems.map((item, key) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: key * 0.05 }}
              >
                <Link
                  href={item.route}
                  onClick={() => setIsOpen(false)}
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
                      layoutId="mobile-active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2db87a]"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom items + logout */}
          <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
            {sidebarBottomItems.map((item, key) => (
              <Link
                key={key}
                href={item.route}
                onClick={() => setIsOpen(false)}
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
              onClick={() => handleLogout(router)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-1"
            >
              <LogOut size={20} />
              Log out
            </button>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}
