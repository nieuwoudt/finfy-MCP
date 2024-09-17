import { Icon } from "@/components/atoms";

export interface ButtonProps {
  Icon: JSX.Element;
  text: string;
}

const HomeAssistButton: React.FC<ButtonProps> = ({ Icon, text }) => (
  <div className="home-assist-btn group items-center flex">
    {Icon}
    {text}
  </div>
);

const buttonsData: ButtonProps[] = [
  {
    Icon: (
      <Icon
        type="SearchIcon"
        className="fill-purple-15 group-hover:fill-white h-3.5 w-5"
      />
    ),
    text: "Focus",
  },
  {
    Icon: (
      <Icon
        type="UserSolidIcon"
        className="fill-purple-15 group-hover:fill-white h-3.5 w-5"
      />
    ),
    text: "Link Accounts",
  },
  {
    Icon: (
      <Icon
        type="PaperClipIcon"
        className="fill-purple-15 group-hover:fill-white h-3.5 w-5"
      />
    ),
    text: "Attach",
  },
];

const HomeAssistButtons: React.FC = () => (
  <div className="flex text-grey-15 space-x-5 mb-2">
    {buttonsData.map((button, index) => (
      <HomeAssistButton key={index} Icon={button.Icon} text={button.text} />
    ))}
  </div>
);

export { HomeAssistButtons };
