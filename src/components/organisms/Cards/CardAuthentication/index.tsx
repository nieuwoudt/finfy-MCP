"use client";

import { Button } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";

const CardAuthentication = () => {
  return (
    <CardTemplate
      classes={{
        cardTitle: "text-center",
      }}
      title="Get Started"
    >
      <CardTemplate.Footer className="flex gap-4 mt-4">
        <Button size="xl" full href="/login" as="link">
          Log in
        </Button>
        <Button size="xl" full href="/sign-up" as="link">
          Sign up
        </Button>
      </CardTemplate.Footer>
    </CardTemplate>
  );
};

export { CardAuthentication };
