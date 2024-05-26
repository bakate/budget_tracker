import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import HeaderLogo from "./header-logo";
import { ModeToggle } from "./mode-toggle";
import Navigation from "./navigation";
import WelcomeMsg from "./welcome-msg";

const Header = () => {
  return (
    <nav className="bg-gradient-to-b from-purple-800  to-purple-600  px-4 py-8 lg:px-14 lg:pb-36">
      <div className="max-w-4xl mx-auto">
        <div className="w-full flex justify-between mb-14">
          <div className="flex items-center lg:gap-x-10">
            <HeaderLogo />
            <Navigation />
          </div>
          <div className="flex items-center gap-x-4">
            <ModeToggle />
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin size-8 text-slate-400" />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMsg />
        {/* TODO add filters */}
      </div>
    </nav>
  );
};

export default Header;
