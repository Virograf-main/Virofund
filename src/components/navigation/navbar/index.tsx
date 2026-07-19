"use client";
import { MobileSidebar } from "@/components/navigation/sidebar";
import { useUserStore } from "@/store/userStore";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { NotificationBell } from "@/components/molecules/notification-bell";
import { LogOut, MenuIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { base_url } from "@/lib/constants";
import toast from "react-hot-toast";

export function Navbar() {
	const { user, clearUser } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsProfileOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			const accessToken = localStorage.getItem("accessToken");
			await fetch(`${base_url}/auth/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
		} catch {
			// Proceed with client-side cleanup regardless of server response
		}

		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		clearUser();
		setIsProfileOpen(false);
		setIsLoggingOut(false);
		toast.success("Logged out successfully");
		router.push("/");
	};

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
					<NotificationBell />
					<div className="relative" ref={dropdownRef}>
						<button
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							className="rounded-full overflow-hidden h-9 w-9 ring-2 ring-secondary hover:ring-primary transition-all cursor-pointer"
						>
							<Image
								src="/jpg/no-image.jpg"
								width={36}
								height={36}
								alt="profile"
								className="object-cover w-full h-full"
							/>
						</button>

						{/* Dropdown menu */}
						{isProfileOpen && (
							<div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
								<div className="px-3 py-2 border-b border-border">
									<p className="text-sm font-medium truncate">
										{user?.firstName} {user?.lastName}
									</p>
									<p className="text-xs text-muted-foreground truncate">
										{user?.email}
									</p>
								</div>
								<button
									onClick={handleLogout}
									disabled={isLoggingOut}
									className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
								>
									<LogOut className="w-4 h-4" />
									{isLoggingOut ? "Logging out..." : "Logout"}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
		</nav>
	);
}
