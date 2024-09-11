import { FC, PropsWithChildren } from "react";
import Image from "next/image";
import clsx from "clsx";
import { RootMain } from "@/components/atoms";
import { FooterAuth } from "@/components/molecules";

interface LayoutLoginProps extends PropsWithChildren {
  classes?: {
    wrapper?: string;
  };
}

const LayoutLogin: FC<LayoutLoginProps> = ({ children, classes }) => {
  return (
    <RootMain className={clsx("w-full flex", classes?.wrapper)}>
      <div
        className={
          "relative hidden bg-white lg:flex justify-center items-center flex-[60%]"
        }
      >
        <Image
          fill
          src={"/images/view.png"}
          className="!bottom-20 !top-auto !-left-1/4 !right-auto !max-w-xl !h-auto"
          objectFit="contain"
          alt="view"
        />
        <Image
          fill
          src={"/images/view.png"}
          className="!top-1/3 !bottom-auto !left-1/2 !right-auto !max-w-xl !h-auto"
          objectFit="contain"
          alt="view"
        />
        <div className="flex flex-col gap-6 items-start max-w-xl">
          <h1 className="text-slate-blue text-4xl font-bold">
            Financially empower yourself with IMALI
          </h1>
          <p className="text-slate-blue text-lg font-medium">
            Empower Your Financial Institution with Customizable Virtual
            Financial Assistants and Conversational AI, Tailored to Speak Your
            Customers Language on Their Preferred Channels.
          </p>
        </div>
      </div>
      <div className={clsx("relative flex-1 lg:flex-[40%]")}>
        <Image
          fill
          src={"/images/bg-login-page.png"}
          alt="background-login-page"
          objectFit="cover"
          className={"opacity-20"}
        />
        <div className={"h-full flex-col flex bg-purple-15"}>
          <div className="flex-1 flex justify-center items-center relative z-10 p-6">
            {children}
          </div>
          <FooterAuth />
        </div>
      </div>
    </RootMain>
  );
};

export { LayoutLogin };
