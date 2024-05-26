"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: (href: string) => void;
};
const NavButton = ({ href, label, isActive, onClick }: Props) => {
  return (
    <Button
      asChild
      size={"sm"}
      variant={"outline"}
      className={cn(
        "w-full text-white lg:w-auto justify-between font-normal hover:bg-white/30 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition focus:bg-white/30",
        isActive ? "bg-white/10 text-white" : "bg-transparent"
      )}
      onClick={() => {
        if (isActive) return;
        if (onClick) onClick(href);
      }}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
