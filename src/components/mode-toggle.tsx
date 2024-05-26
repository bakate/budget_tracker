"use client";

import useClientCheck from "@/hooks/use-client-check";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  const isClient = useClientCheck();

  if (!isClient) {
    return null;
  }

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      className="transition-colors hover:bg-transparent"
      onClick={() => {
        if (theme === "dark") {
          setTheme("light");
        } else {
          setTheme("dark");
        }
      }}
    >
      {theme === "dark" ? (
        <Sun className="block h-5 w-5 rounded-full shadow-lg ring-0" />
      ) : (
        <Moon className="block h-5 w-5 rounded-full shadow-lg ring-0 text-white/80" />
      )}
    </Button>
  );
};
