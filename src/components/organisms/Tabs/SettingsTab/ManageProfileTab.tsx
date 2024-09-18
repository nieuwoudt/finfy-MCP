import { Icon, SeparatorLine } from "@/components/atoms";
import { ThemeSelector, SwitchTemplate, ThemeButtons, UserAvatar } from "@/components/molecules";

const ManageProfileTab = () => {
  return (
    <>
      <p className="my-2">General</p>
      <div className="p-3 border rounded-md bg-navy-15 border-navy-5">
        <div className="flex items-center justify-between">
          <div className="">
            <p className="text-white mb-2">Appearance</p>
            <p className="text-xs">Set your preferred theme for Perplexity</p>
          </div>
          <div className="w-[300px] text-white">
            <ThemeButtons />
          </div>
        </div>
        <SeparatorLine />
        <div className="flex items-center justify-between">
          <div className="w-full">
            <p className="text-white mb-2">Language</p>
            <p className="text-xs">
              Set your preferred language for Perplexity&apos;s interface
            </p>
          </div>
          <div className="text-white">
            <ThemeSelector placeholder="English" />
          </div>
        </div>
      </div>
      <div>
        <p className="my-2">Account</p>
        <div className="p-3 border rounded-md bg-navy-15 border-navy-5 text-white">
          <div className="w-full flex items-center justify-between">
            <p>Avatar</p>
            <UserAvatar className="rounded-full" />
          </div>
          <SeparatorLine />
          <div className="w-full flex justify-between">
            <p>Username</p>
            <div className="flex items-center gap-2 text-grey-5">
              nieuwoudt
              <Icon type="PenIcon" className="size-4" />
            </div>
          </div>
          <SeparatorLine />
          <div className="w-full flex justify-between">
            <p>Email</p>
            <p className="text-grey-5">nieuwoudt@nexilient.com</p>
          </div>
          <SeparatorLine />
          <div className="flex">
            <div className="w-full">
              <p>AI Data Retention</p>
              <p className="text-xs my-5 text-grey-15">
                AI Data Retention allows Perplexity to use your searches to
                improve AI models. <br /> Turn this setting off if you wish to
                exclude your data this process.
              </p>
            </div>
            <div className="flex items-center text-white">
              <SwitchTemplate />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ManageProfileTab };
