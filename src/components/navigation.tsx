"use client";

import { useMedia } from "react-use";

import { Loader2, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import NavButton from "./nav-button";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const routes = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  // {
  //   href: "/settings",
  //   label: "Settings",
  // },
];

const Navigation = () => {
  const pathname = usePathname();
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();
  const handleClick = (href: string) => {
    setOpenDrawer(false);
    router.push(href);
  };
  const isMobile = useMedia("(max-width: 768px)", false);
  if (isMobile) {
    return (
      <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
        <SheetTrigger>
          <Button
            variant={"outline"}
            size={"sm"}
            className=" font-normal bg-white/10 hover:bg-white/20 border-none hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition focus:bg-white/30"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="px-2" side={"left"}>
          <div className="flex flex-col gap-y-2 pt-6 justify-between h-full pl-3">
            <div>
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  onClick={() => handleClick(route.href)}
                  className="w-full justify-start"
                >
                  {route.label}
                </Button>
              ))}
            </div>

            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin size-8 text-slate-400" />
            </ClerkLoading>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <nav className=" items-center overflow-x-clip gap-x-2 hidden lg:flex">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;
