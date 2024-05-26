import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image
          src="/logo.svg"
          alt="Image"
          width={28}
          height={28}
          className=" object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <p className="font-semibold text-white text-2xl ml-2">Budget tracker</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
