'use client'
import { Button, Icon, SeparatorLine } from "@/components/atoms";
import {
  ThemeSelector,
  SwitchTemplate,
  ThemeButtons,
  ConnectBankAction,
} from "@/components/molecules";
import { UserAvatarWithUpload } from "@/components/organisms";
import { useAccounts, useUser } from "@/hooks";
import { updatePassword } from "@/lib/supabase/actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageProfileTab = () => {
  const { user } = useUser();
  const [password, setPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const { accounts, fetchAccountsByUserId, deleteAccount } = useAccounts();

  useEffect(() => {
    const fetchBankAccounts = async () => {
      await fetchAccountsByUserId(user?.id as string);
    }

    if (user) {
      fetchBankAccounts();
    }
  },[user]);

  const handlePasswordChange = async () => {
    if (password) {
      try {
        const formData = new FormData();
        formData.set("password", password);

        const result = await updatePassword(formData);
        if (result.errorMessage) {
          toast.error(result.errorMessage);
          console.error(result.errorMessage);
        } else {
          console.log("Password updated successfully");
          toast.success("Password updated successfully");
        }
        setPassword("")
        setIsEditingPassword(false);
      } catch (error) {
        console.error("Failed to update password:", error);
      }
    }
    setIsEditingPassword(false);
  };
  return (
    <>
      <p className="my-4">General</p>
      <div className="p-3 border rounded-md bg-navy-15 border-navy-5">
        <div className="flex items-center justify-between">
          <div className="">
            <p className="text-white mb-2">Appearance</p>
            <p className="text-xs">Set your preferred theme for Perplexity</p>
          </div>
          <div className="text-white">
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
      <div className="mt-8">
        <p className="my-4">Account</p>
        <div className="p-3 border rounded-md bg-navy-15 border-navy-5 text-white">
          <div className="w-full flex items-center justify-between">
            <p>Avatar</p>
            <UserAvatarWithUpload />
          </div>
          <SeparatorLine />
          <div className="w-full flex justify-between">
            <p>Username</p>
            <div className="flex items-center gap-2 text-grey-5">
              {user?.name}
              <Button variant="ghost">
                <Icon type="PenIcon" className="h-4 w-4 fill-grey-15" />
              </Button>
            </div>
          </div>
          <SeparatorLine />
          <div className="w-full flex justify-between">
            <p>Email</p>
            <p className="text-grey-5"> {user?.email}</p>
          </div>
          <SeparatorLine />
          <div className="w-full flex justify-between">
            <p>Password</p>
            <div className="flex items-center gap-2" style={{ minWidth: "120px" }}>
              {isEditingPassword ? (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordChange}
                  autoFocus
                  className="border rounded-md border-none min-h-[28px] max-w-[120px] bg-transparent outline-none w-full"
                  style={{
                    letterSpacing: "2px",
                    caretColor: "white",
                  }}
                />
              ) : (
                <div
                  className="flex items-center justify-end w-full"
                  style={{ letterSpacing: "2px" }}
                >
                  <span>**********</span>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditingPassword(true)}
                  >
                    <Icon type="PenIcon" className="h-4 w-4 fill-grey-15" />
                  </Button>
                </div>
              )}
            </div>
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
          <SeparatorLine />
          <div className="flex">
          <div className="w-full">
            <div className="w-full flex justify-between items-center">
              <p className="mb-2 text-lg font-semibold">Connected Accounts</p>
              <ConnectBankAction />
            </div>
            {accounts && accounts.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {accounts.map((account) => {
                  return (
                    <div
                      key={account.account_id}
                      className="w-[calc(50%-0.75rem)] h-[68px] flex items-start justify-between border border-[#374061] rounded-xl p-3 bg-[#272E48] shadow-sm"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#374061]">
                          <Image
                            src={account.provider_logo as string}
                            alt="provider_logo"
                            height={512}
                            width={512}
                            className="object-fill w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium">{account.provider_name}</p>
                          <p className="text-sm font-medium opacity-70">{account.account_name}</p>
                        </div>
                      </div>
                      <Icon type="DeleteIcon" className="h-4 w-4 fill-grey-15 cursor-pointer" onClick={() => deleteAccount(account.account_id)}/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ManageProfileTab };
