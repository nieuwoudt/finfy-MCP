"use client";
import { SuggestedBox } from "@/components/atoms";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

const HomeSuggestBoxes = ({ isMobile = false }: { isMobile?: boolean }) => {
  const suggest = useAppSelector((state) => state.suggest.suggest);
  const isLgScreen = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <div className="w-full relative max-w-[95%] mt-3">
      <div className="hidden lg:block w-full">
        <Swiper
          key={JSON.stringify(suggest)}
          className="max-w-[calc(100vw-400px)] max-h-[116px]"
          spaceBetween={16}
          slidesPerView={isLgScreen ? 4 : 3}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation]}
        >
          {suggest.map((item: any, i: number) => (
            <SwiperSlide key={item.label + i}>
              <SuggestedBox
                content={item.content}
                icon={item.icon}
                label={item.label}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          style={{
            backgroundColor: "transparent",
            color: "#74BBC9",
            left: "-40px",
          }}
          className="swiper-button-prev !w-8 absolute z-10 !bg-transparent !-translate-y-2 !scale-[0.4]"
        ></button>
        <button
          style={{
            backgroundColor: "transparent",
            color: "#74BBC9",
            right: "-40px",
            top: "50%",
          }}
          className="swiper-button-next !w-8 absolute z-10 !bg-transparent !-translate-y-2 !scale-[0.4]"
        ></button>
      </div>
      <div
        className={cn(
          "w-full mt-3 lg:hidden flex gap-3",
          isMobile
            ? "flex-row overflow-x-auto min-h-[230px] overflow-y-hidden whitespace-nowrap"
            : "flex-wrap overflow-y-auto max-h-[calc(100vh-350px)]"
        )}
        style={{
          maxHeight: isMobile ? "calc(100vh - 150px)" : undefined,
        }}
      >
        {suggest.map((item: any, i: any) => (
          <div key={item.label + i} className={cn("flex-shrink-0", isMobile ? "min-h-[136px]" : "")}>
            <SuggestedBox
              content={item.content}
              icon={item.icon}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export { HomeSuggestBoxes };
