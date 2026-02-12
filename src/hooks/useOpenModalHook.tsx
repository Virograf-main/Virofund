"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useModal() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const openModal = (name: string) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("modal", name);
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  const closeModal = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.delete("modal");
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return { openModal, closeModal };
}
