"use client";

import { AssistInput, Conversation } from "@/components/organisms";
import { Button, Icon } from "@/components/atoms";
import { DynamicChart, Header, HeaderText, HomeSuggestBoxes } from "@/components/molecules";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useChat, useDynamicChart, useUser } from "@/hooks";
import { DesktopChartModal } from "@/components/molecules/DesktopChartModal/DesktopChartModal";
import { MobileChartModal } from "@/components/molecules/MobileChartModal/MobileChartModal";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { HeaderFocus } from "@/components/molecules/Header";
import { fetchFocusSuggests, setSuggest } from "@/lib/store/features/suggest/suggestSlice";
import clsx from "clsx";

interface LayoutDashboardProps extends PropsWithChildren { }

const LayoutDashboard: FC<LayoutDashboardProps> = ({ children }) => {
  const { messages } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const suggest = useAppSelector((state) => state.suggest.suggest);
  const focusData = useAppSelector((state) => state.suggest.focusSuggests);
  const dispatch = useAppDispatch();

  const { addChart, deleteChart, charts } = useDynamicChart();

  const handleOpenModal = (id: string, chart: any) => {
    addChart({ [id]: chart });
    setSelectedChartId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = (id: string) => {
    deleteChart(id);
    setIsModalOpen(false);
    setSelectedChartId(null);
  };

  const makeTitle = (id: string) => {
    const titleReplaced = id?.split("_")?.join(" ");
    const firstLetter = titleReplaced.slice(0, 1)?.toLocaleUpperCase();
    const restLetters = titleReplaced.slice(1);
    return firstLetter + restLetters;
  };

  useEffect(() => {
    dispatch(fetchFocusSuggests());
  }, [dispatch]);

  useEffect(() => {
    if (focusData.length && focusData[0].suggest) {
      dispatch(setSuggest(focusData[0].suggest.slice(0, 6)));
    }
  },[focusData])

  return (
    <><div className={cn("bg-navy-25  w-full p-4 pt-16 lg:p-6 flex flex-col ", selectedChartId ? "bg-[#272E48] rounded-lg m-10" : "h-screen max-w-[1280px] mx-auto")}>
      <HeaderFocus />
      <Header />
      {messages.length ? (
        <Conversation handleOpenModal={handleOpenModal} />
      ) : (
        <div className="lg:px-40 lg:pt-20 lg:pb-12">
          <HeaderText />
          <div className="hidden lg:flex flex-1 flex-col items-center">
            {!!suggest?.length && <>
              <div className="w-full justify-start flex items-center h-fit text-grey-15">
                <Icon type="LightningBolt" className="text-grey-15" />
                <p className="text-base">Suggested</p>
              </div>
            </>}
            {!!suggest?.length && <HomeSuggestBoxes />}
          </div>
          <div className="flex absolute bottom-[86px] h-[154px] left-0 right-0 lg:hidden flex-col">
            {!!suggest?.length && <>
              <div className="flex items-center h-fit text-grey-15">
                <Icon type="LightningBolt" className="text-grey-15" />
                <p className="text-base">Suggested</p>
              </div>
            </>}
            <HomeSuggestBoxes isMobile={true} />
          </div>
        </div>
      )}
      <div className={clsx("bg-[#1F263D] ", {"lg:py-20 lg:px-40": !messages.length })}>
        <AssistInput 
          isDark={!!selectedChartId} 
          classes={{
            container: messages.length ? "xl:bottom-0": "",
          }}
        />

      </div>
    </div>
      <div className={cn("flex", selectedChartId ? "w-full h-screen" : "")}>
        <DesktopChartModal
          isOpen={isModalOpen}
          onClose={
            selectedChartId ? () => handleCloseModal(selectedChartId) : () => { }}
          component={<DynamicChart selectedChartId={selectedChartId} />}
          title={selectedChartId ? makeTitle(selectedChartId) : ""} />
        <MobileChartModal
          isOpen={isModalOpen}
          onClose={
            selectedChartId ? () => handleCloseModal(selectedChartId) : () => { }}
          component={<DynamicChart selectedChartId={selectedChartId} />}
          title={selectedChartId ? makeTitle(selectedChartId) : ""} />
      </div>
    </>
  );
};


export { LayoutDashboard };