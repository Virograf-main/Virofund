"use client";

import { ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UrlDialogProps = {
  name: string;
  title?: string;
  children: ReactNode;
};

export function UrlDialog({ name, title, children }: UrlDialogProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeModal = params.get("modal");
  const open = activeModal === name;

  function setOpen(next: boolean) {
    const newParams = new URLSearchParams(params.toString());

    if (next) {
      newParams.set("modal", name);
    } else {
      newParams.delete("modal");
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}
