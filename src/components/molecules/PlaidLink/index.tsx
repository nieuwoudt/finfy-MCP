import { Button } from "@/components/atoms";
import { usePlaid } from "@/hooks";

const PlaidLink = () => {
  const { openPlaidLink, isPlaidLinkReady, transactions } = usePlaid();
  return (
    <Button onClick={() => openPlaidLink()} disabled={!isPlaidLinkReady}>
      Link account
    </Button>
  );
};

export { PlaidLink };
