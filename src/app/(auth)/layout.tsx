import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="lg:grid lg:grid-cols-2 h-screen">
      <div className="grid place-items-center w-full px-3 lg:px-0">
        {children}
      </div>

      <div className="bg-purple-400 p-4 hidden lg:block h-full">
        <div className="grid place-items-center h-full">
          <Image src="/logo.svg" alt="Image" width="150" height="150" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
