import { Icon, Button } from "@/components/atoms";

const FooterAuth = () => {
  return (
    <footer className="flex flex-col justify-center items-center w-full gap-4 mt-auto mb-6">
      <Icon type="ImaliLogo" />
      <div className="flex gap-6">
        <Button
          href="/term-of-use"
          as="link"
          className="underline text-sm !font-medium underline-offset-4"
          variant="plain"
        >
          Terms of Use
        </Button>
        <span className="bg-white h-full w-px block"></span>
        <Button
          href="/privacy-policy"
          as="link"
          className="underline text-sm !font-medium underline-offset-4"
          variant="plain"
        >
          Privacy Policy
        </Button>
      </div>
    </footer>
  );
};

export { FooterAuth };
