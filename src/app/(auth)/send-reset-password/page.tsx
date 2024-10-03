import { SendResetPasswordPage } from "@/components/pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Reset Password | Finfy",
  description: "Chat",
};

const SendResetPassword = () => {
  return <SendResetPasswordPage />;
};

export default SendResetPassword;
