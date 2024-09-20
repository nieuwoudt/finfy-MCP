import { SeparatorLine } from "@/components/atoms";
import { SettingsTab } from "@/components/organisms";

const SettingsSection = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow ">
        <h1 className="font-semibold px-10 pt-5 text-white text-2xl">
          Settings
        </h1>
        <SeparatorLine />
      </div>
      <div className="flex items-center justify-center w-full h-full text-grey-15 text-sm">
        <div className=" justify-between flex flex-col">
          <SettingsTab />
        </div>
      </div>
      <footer className="flex gap-5 items-center justify-center text-sm text-grey-15 py-4">
        <p className="hover:text-white cursor-pointer">Pro</p>
        <p className="hover:text-white cursor-pointer">Enterprise</p>
        <p className="hover:text-white cursor-pointer">Playground</p>
        <p className="hover:text-white cursor-pointer">Blog</p>
        <p className="hover:text-white cursor-pointer">Careers</p>
      </footer>
    </div>
  );
};

export { SettingsSection };
