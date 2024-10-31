"use client";

import { AssistInput, Conversation } from "@/components/organisms";
import { Button, Icon } from "@/components/atoms";
import { DynamicChart, Header, HeaderText, HomeSuggestBoxes } from "@/components/molecules";
import { FC, PropsWithChildren, useState } from "react";
import { useChat, useDynamicChart, useUser } from "@/hooks";
import { DesktopChartModal } from "@/components/molecules/DesktopChartModal/DesktopChartModal";
import { MobileChartModal } from "@/components/molecules/MobileChartModal/MobileChartModal";
import { cn } from "@/lib/utils";

interface LayoutDashboardProps extends PropsWithChildren { }

const LayoutDashboard: FC<LayoutDashboardProps> = ({ children }) => {
  const { messages } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);

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

  return (
    <><div className={cn("bg-navy-25  w-full p-4 pt-16 lg:p-10 flex flex-col ", selectedChartId ? "bg-[#272E48] rounded-lg m-10" : "h-screen max-w-[1280px] mx-auto" )}>
      <Header />
      {messages.length ? (
        <Conversation handleOpenModal={handleOpenModal} />
      ) : (
        <>
          <HeaderText />
          <div className="flex flex-1 flex-col">
            <div className="flex items-center h-fit text-grey-15">
              <Icon type="LightningBolt" className="text-grey-15" />
              <p className="text-base">Suggested</p>
            </div>
            <HomeSuggestBoxes />
          </div>
        </>
      )}
      <div className="bg-[#1F263D]">
      <AssistInput isDark={!!selectedChartId} />

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