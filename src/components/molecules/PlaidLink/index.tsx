import { Button } from "@/components/atoms";
import { usePlaid } from "@/hooks";

const PlaidLink = () => {
  const { openPlaidLink, isPlaidLinkReady, transactions } = usePlaid();
  console.log(transactions, "transactions");
  return (
    <Button onClick={() => openPlaidLink()} disabled={!isPlaidLinkReady}>
      Link account
    </Button>
  );
};

export { PlaidLink };
