import { Icon } from "@/components/atoms";

export interface ButtonProps {
  Icon: JSX.Element;
  text: string;
}

const HomeAssistButton: React.FC<ButtonProps> = ({ Icon, text }) => (
  <div className="home-assist-btn group">
    <div className="text-purple-15 group-hover:text-white size-5">{Icon}</div>
    {text}
  </div>
);

const buttonsData: ButtonProps[] = [
  {
    Icon: (
      <Icon
        type="SearchIcon"
        className="text-purple-15 group-hover:text-white size-5"
      />
    ),
    text: "Focus",
  },
  {
    Icon: (
      <Icon
        type="UserSolidIcon"
        className="text-purple-15 group-hover:text-white size-5"
      />
    ),
    text: "Link Accounts",
  },
  {
    Icon: (
      <Icon
        type="PaperClipIcon"
        className="text-purple-15 group-hover:text-white size-5"
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
