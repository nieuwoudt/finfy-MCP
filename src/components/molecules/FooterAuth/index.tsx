import { Icon, Button } from "@/components/atoms";

const FooterAuth = () => {
  return (
    <footer className="flex flex-col relative z-10 justify-center items-center w-full gap-4 mt-auto mb-6">
      <Icon type="FullLogoWhiteIcon" className="w-28 h-8" />
      <div className="flex gap-2 justify-between md:gap-6">
        <Button
          href="/terms-of-service"
          as="link"
          className="underline text-sm !font-medium underline-offset-4 p-0"
          variant="link"
        >
          Terms of Service
        </Button>
        <Button
          href="/privacy-policy"
          as="link"
          className="underline text-sm !font-medium underline-offset-4 p-0"
          variant="link"
        >
          Privacy Policy
        </Button>
        <Button
          href="/acceptable-use-policy"
          as="link"
          className="underline text-sm !font-medium underline-offset-4 p-0"
          variant="link"
        >
          Acceptable Use Policy
        </Button>
      </div>
    </footer>
  );
};

export { FooterAuth };
