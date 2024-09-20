"use client";
import { BurgerButton } from "@/components/molecules";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 p-3.5 w-full bg-navy-25 block lg:hidden">
      <BurgerButton />
    </header>
  );
};

export { Header };
