"use client";
import {
  Bell,
  Boxes,
  Flag,
  Home,
  Settings,
  Sparkles,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/atoms/theme-toggle";

export function DesktopSidebar() {
  const pathName = usePathname();
  const sidebarItems = [
    {
      label: "Dashboard",
      route: "/dashboard",
      icon: <Home />,
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
    <aside className="w-64 h-screen flex-col justify-between hidden xl:flex border-r border-border bg-background sticky top-0">
      <div className="flex flex-col gap-8 pt-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6">
          <Image src="/svg/logo.svg" width={28} height={28} alt="logo" />
          <p className="text-xl font-bold text-foreground">virofund</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col px-3 gap-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">
            Main Menu
          </p>
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
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col px-3 gap-1 pb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-1">
          Other
        </p>
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
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        <div className="w-full flex items-center justify-between p-3 mt-1 rounded-lg text-muted-foreground">
          <span className="flex items-center gap-3 text-sm">
            <span className="w-5 h-5 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </span>
            Appearance
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
