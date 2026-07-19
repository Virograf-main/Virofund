"use client";
import {
  Bell,
  Boxes,
  Flag,
  Home,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/atoms/theme-toggle";

export function MobileSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const pathName = usePathname();
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      label: "Connections",
      route: "/connections",
      icon: <Users />,
    },
    {
      label: "Profile",
      route: "/profile",
      icon: <UserRound />,
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

  // "/profile" covers viewing/editing YOUR profile (/profile, /profile/edit,
  // /profile/preferences). /profile/[profileId] is a different page (viewing
  // someone else's profile) and should NOT highlight this nav item.
  const isActive = (route: string) => {
    if (route === "/profile") {
      return (
        pathName === "/profile" ||
        pathName.startsWith("/profile/edit") ||
        pathName.startsWith("/profile/preferences")
      );
    }
    return pathName === route || pathName.startsWith(`${route}/`);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 xl:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] max-w-[80vw] z-50 xl:hidden
          bg-background shadow-2xl
          flex flex-col justify-between py-6
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <Image src="/svg/logo.svg" width={24} height={24} alt="logo" />
              <p className="text-xl font-bold text-foreground">virofund</p>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex flex-col px-3 gap-1">
            {sidebarItems.map((item, key) => {
              return (
                <Link
                  href={item.route}
                  key={key}
                  className={`w-full flex items-center p-3 gap-3 rounded-lg transition-all duration-200 ${
                    isActive(item.route)
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {item.icon || <Home className="w-5 h-5" />}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col px-3 gap-1 border-t pt-4 mx-3">
          {sidebarBottomItems.map((item, key) => {
            return (
              <Link
                href={item.route}
                key={key}
                className={`w-full flex items-center p-3 gap-3 rounded-lg transition-all duration-200 ${
                  isActive(item.route)
                    ? "bg-secondary text-secondary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
