import { AssistInput } from "@/components/organisms";
import { Icon } from "@/components/atoms";
import { Header, HeaderText, HomeSuggestBoxes } from "@/components/molecules";
import { FC, PropsWithChildren } from "react";

interface LayoutDashboardProps extends PropsWithChildren {}

const LayoutDashboard: FC<LayoutDashboardProps> = ({ children }) => {
  return (
    <div className="bg-navy-25 w-full p-4 pt-16 lg:p-10 flex flex-col h-screen">
      <Header />
      <HeaderText />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center h-fit text-grey-15">
          <Icon type="LightningBolt" className="text-grey-15" />
          <p className="text-base">Suggested</p>
        </div>
        <HomeSuggestBoxes />
      </div>
      <AssistInput />
    </div>
  );
};

export { LayoutDashboard };
