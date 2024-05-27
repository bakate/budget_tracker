import { Button } from "@/components/ui/button";
import Link from "next/link";
const HomePage = () => {
  return (
    <div className="grid place-items-center h-screen gap-y-4 place-content-center">
      <h1 className="text-2xl text-muted-foreground">
        Welcome to the Budget tracker app. login to get started
      </h1>
      <Button asChild>
        <Link href="/sign-in">Login</Link>
      </Button>
    </div>
  );
};

export default HomePage;
