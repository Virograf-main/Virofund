import Image from "next/image";
export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/svg/logo.svg" alt="co-founder" width={20} height={20} />
      <h1 className="text-[1.5em]">Virofund</h1>
    </div>
  );
}
