import { Button } from "@/components/atoms";
import Link from "next/link";

export function Disclaimer({
  title,
  text,
  linkText,
  linkUrl,
}: {
  title: string;
  text: string;
  linkText: string;
  linkUrl: string;
}) {
  return (
    <div className="h-[91vh] text-[14px] lg:text-[16px]  grid place-items-center ">
      <article className="text-center flex flex-col gap-4">
        <h1 className="font-[600] text-[24px] lg:text-[36px]">{title}</h1>
        <p className="max-w-[375px] text-[14px] lg:text-[16px]">{text} </p>
        <Link href={linkUrl}>
          <Button className="my-2 text-[14px] lg:text-[16px]">
            {linkText}
          </Button>
        </Link>
      </article>
    </div>
  );
}
