import { Icon } from "@/components/atoms";

export interface ButtonProps {
  Icon: JSX.Element;
  text: string;
}

const HomeAssistButton: React.FC<ButtonProps> = ({ Icon, text }) => (
  <button className="home-assist-btn group gap-1 items-center flex text-sm text-normal py-0.5 px-1.5">
    {Icon}
    {text}
  </button>
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
  <div className="flex text-grey-15 gap-2 mb-2">
    {buttonsData.map((button, index) => (
      <HomeAssistButton key={index} Icon={button.Icon} text={button.text} />
    ))}
  </div>
);

export { HomeAssistButtons };
