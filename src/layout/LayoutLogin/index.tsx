'use client'
import { FC, PropsWithChildren, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Icon, RootMain } from "@/components/atoms";
import { FooterAuth } from "@/components/molecules";
import { usePathname } from "next/navigation";
import { SuggestedBox } from "@/components/atoms";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

const LoginSlidersBoxes = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { href: "/images/transactions.png", width: "426", label: "Show me a breakdown of my home expenses for October." },
    { href: "/images/cashflow.png", width: "514", label: "Can you show me my cash flow over the last 6 months?" },
    { href: "/images/spending.png", width: "426", label: "Can you show me my total spending for each month this year?" },
  ];

  return (
    <div className="relative max-w-screen mb-1 lg:mb-10 lg:w-full w-[60vw] lg:max-w-[95%] mt-3">
      <Swiper
        key={JSON.stringify(slides)}
        className="max-w-full lg:min-h-[620px]"
        spaceBetween={16}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        modules={[Pagination, Autoplay]}
      >
        {slides.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex justify-center min-h-[32vh] items-center lg:min-h-[600px]">
              <img
                src={item.href}
                alt={`Slide ${index + 1}`}
                style={{ maxWidth: `${item.width}px` }}
                className="h-auto !max-h-[25vh] lg:!max-h-[80vh] w-[60vw] lg:w-[70wv] object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.map((item, index) => (
        <div
          key={index}
          className={clsx(
            "absolute flex p-6 bg-gradient-to-r from-white to-[#f6f8fb] rounded-2xl shadow-[0px_4px_30px_0px_rgba(54,80,127,0.10)] backdrop-blur-[15px] justify-start items-start gap-2",
            activeIndex === index ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          style={{
            transition: "opacity 500ms ease-in-out, visibility 500ms ease-in-out",
            zIndex: 999,
            ...(index === 0 ? { top: "-10%", left: "-30%" } : {}),
            ...(index === 1 ? { bottom: "17%", left: "-30%" } : {}),
            ...(index === 2 ? { top: "-5%", right: "-20%" } : {}),
          }}
        >
          <div className="w-[317px] text-[#363f60] text-lg font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

interface LayoutLoginProps extends PropsWithChildren {
  classes?: {
    wrapper?: string;
  };
}

const LayoutLogin: FC<LayoutLoginProps> = ({ children, classes }) => {
  const pathname = usePathname();
  const isAuthentication = pathname.includes('authentication');
  const isDisplayCarousel = !pathname.includes('authentication');
  return (
    <RootMain className={clsx("w-full lg:flex-row overflow-hidden items-center flex-col-reverse flex", classes?.wrapper)}>
      <div
        className={
          "relative bg-white hidden lg:flex justify-center items-center flex-[60%]"
        }
      >
        <Image
          fill
          src={"/images/view.png"}
          className="!bottom-20 !top-auto !-left-1/4 !right-auto hidden lg:block !max-w-xl !h-auto"
          objectFit="contain"
          alt="view"
        />
        <Image
          fill
          src={"/images/view.png"}
          className="!top-1/3 !bottom-auto !left-1/2 hidden lg:block !right-auto !max-w-xl !h-auto"
          objectFit="contain"
          alt="view"
        />
        {isAuthentication && <div className="flex flex-col gap-6 items-start max-w-xl">
          <h1 className="text-navy-15 text-4xl font-bold">
            Financially empower yourself with Finfy
          </h1>
          <p className="text-navy-15 text-lg font-medium">
            Empower Your Financial Institution with Customizable Virtual
            Financial Assistants and Conversational AI, Tailored to Speak Your
            Customers Language on Their Preferred Channels.
          </p>
        </div>}
        {isDisplayCarousel && <div className="flex flex-col gap-6 items-start max-w-xl">
        <LoginSlidersBoxes/>
        </div>}
      </div>
      <div className={clsx("relative flex-1 lg:flex-[40%]")}>
        {/* <Image
          fill
          src={"/images/bg-login-page.png"}
          alt="background-login-page"
          objectFit="cover"
          className={"opacity-20"}
        /> */}
        <div className={"h-screen w-screen lg:w-full flex-col flex bg-purple-15"}>
          <div className={clsx("flex-1 flex-col gap-9 flex max-h-fit lg:max-h-full items-center relative z-10 p-6", isAuthentication ? "" : "justify-center")}>
              <Icon type="FullLogoWhiteIcon" className="w-28 h-8" />
              {<div className={clsx("w-[400px] text-center text-white hidden lg:flex text-[28px] font-bold ", isAuthentication ? " opacity-0 h-[256px]" : "")}>Expense Insights: Ask and Understand Your Finances in Plain Language</div>}
              <>{children}</>
              {isDisplayCarousel && <button type="button" className="h-9 px-4 py-2 w-[133px] bg-[#686fda] rounded-lg border text-gray-300 text-sm font-medium leading-tight border-gray-300 justify-start items-center gap-1 inline-flex">
                Learn more
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2362 9.26331C13.4051 9.43208 13.5 9.66096 13.5 9.89961C13.5 10.1383 13.4051 10.3671 13.2362 10.5359L9.63166 14.1359C9.46267 14.3046 9.23351 14.3994 8.99456 14.3994C8.75561 14.3994 8.52645 14.3046 8.35746 14.1359L4.75296 10.5359C4.58881 10.3662 4.49798 10.1388 4.50003 9.90285C4.50209 9.66687 4.59686 9.44114 4.76393 9.27427C4.93101 9.10741 5.15702 9.01275 5.3933 9.0107C5.62957 9.00865 5.85719 9.09937 6.02715 9.26331L8.09343 11.327V4.49961C8.09343 4.26091 8.18837 4.032 8.35737 3.86321C8.52636 3.69443 8.75557 3.59961 8.99456 3.59961C9.23355 3.59961 9.46276 3.69443 9.63175 3.86321C9.80075 4.032 9.89569 4.26091 9.89569 4.49961V11.327L11.962 9.26331C12.131 9.09459 12.3601 8.9998 12.5991 8.9998C12.838 8.9998 13.0672 9.09459 13.2362 9.26331Z" fill="#D1D5DB"/>
                </svg>
              </>
            </button>}
          </div>
          {isDisplayCarousel && <div className="flex mx-auto lg:hidden flex-col gap-6 items-start max-w-xl">
        <LoginSlidersBoxes/>
        </div>}
          {/* <FooterAuth /> */}
        </div>
      </div>
    </RootMain>
  );
};

export { LayoutLogin };
