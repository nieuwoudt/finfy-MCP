import { MouseEventHandler, ReactNode } from "react";

interface CustomButtonProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const CustomButtonIcon = ({
  icon,
  title,
  description,
  onClick,
}: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex h-auto md:min-h-[172px]  w-full md:w-[157px] flex-col items-center justify-center rounded-xl border border-ring py-3 md:py-1 px-[5px] shadow-lg hover:bg-navy-15"
    >
      {icon}
      <p className="mt-3 text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-center text-[11px] font-medium text-grey-15">
        {description}
      </p>
    </button>
  );
};

export { CustomButtonIcon };
