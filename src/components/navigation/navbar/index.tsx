"use client";
import { MobileSidebar } from "@/components/navigation/sidebar";
import { useUserStore } from "@/store/userStore";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { Bell, MenuIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export function Navbar() {
	const { user } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	return (
		<nav className="py-3">
			<div className="flex items-center justify-between">
				<h1 className="text-xl lg:text-2xl font-semibold hidden xl:block text-foreground ms-5">
					Welcome back, {user?.firstName || user?.profile.userName || "Founder"}
					!
				</h1>
				<div className="flex gap-3 items-center xl:hidden">
					<button
						onClick={() => setIsOpen(true)}
						className="p-2 rounded-lg hover:bg-secondary transition-colors"
					>
						<MenuIcon className="w-6 h-6" />
					</button>
					<h1 className="text-lg font-bold">Virofund</h1>
				</div>
				<div className="flex items-center gap-1 sm:gap-3">
					<ThemeToggle />
					<button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
						<Bell className="w-5 h-5 text-muted-foreground" />
						<span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
					</button>
					<div className="rounded-full overflow-hidden h-9 w-9 ring-2 ring-secondary">
						<Image
							src="/jpg/no-image.jpg"
							width={36}
							height={36}
							alt="profile"
							className="object-cover w-full h-full"
						/>
					</div>
				</div>
			</div>

			<MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
		</nav>
	);
}
