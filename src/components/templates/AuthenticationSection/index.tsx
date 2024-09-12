"use client";

import { PlaidLink } from "@/components/molecules";
import { CardAuthentication } from "@/components/organisms";

const AuthenticationSection = () => {
  return (
    <>
      <CardAuthentication />
      <PlaidLink />
    </>
  );
};

export { AuthenticationSection };
