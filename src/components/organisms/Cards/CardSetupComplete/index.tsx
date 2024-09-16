"use client";

import { Button, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";

const CardSetupComplete = () => {
  return (
    <CardTemplate
      title={
        <>
          <Icon type={"ShieldCompleteIcon"} />
          <h4 className="text-xl text-white font-semibold ">Success</h4>
        </>
      }
      classes={{
        cardHeader: "flex flex-col justify-center items-center",
        cardDescription: "text-center",
      }}
      description="Thank you! Your bank account was connected to Imali"
    >
      <CardTemplate.Footer className="flex justify-between items-center mt-6">
        <Button href="/dashboard" size="xl" as="link" full>
          Go to Dashboard
        </Button>
      </CardTemplate.Footer>
    </CardTemplate>
  );
};

export { CardSetupComplete };
