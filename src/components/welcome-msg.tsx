"use client";

import { useUser } from "@clerk/nextjs";
import { useMountedState } from "react-use";

const WelcomeMsg = () => {
  const { isLoaded, user } = useUser();
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Welcome Back{isLoaded ? ", " : " "}
        {user?.firstName}
      </h2>
      <p className="text-sm lg:text-base text-white/85">
        This is your financial Report
      </p>
    </div>
  );
};

export default WelcomeMsg;
