import { Chat } from "@/components/organisms";
import {
  HeaderText,
  HomeSuggestBoxes,
  HomeAssistButtons,
  Header,
} from "@/components/molecules";
import { Icon } from "@/components/atoms";

const DashboardSection = () => {
  return (
    <div className="bg-navy-25 w-full p-4 md:p-10 flex flex-col h-screen pt-16">
      <Header />
      <div className="flex flex-col w-full justify-center items-center">
        <HeaderText />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center h-fit text-grey-15">
            <Icon type="LightningBolt" className="size-5 text-grey-15" />
            <p className="text-base">Suggested</p>
          </div>
          <HomeSuggestBoxes />
        </div>
      </div>
      <div className="flex flex-1 flex-col relative">
        <div className="w-full p-2 bottom-0 absolute">
          <HomeAssistButtons />
          <Chat />
        </div>
      </div>
    </div>
  );
};

export { DashboardSection };
