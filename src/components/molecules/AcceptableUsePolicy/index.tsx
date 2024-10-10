import { EmbedTerms } from "@/components/atoms";

const AcceptableUsePolicy = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <h1 className="text-white text-3xl font-bold">Acceptable Use Policy</h1>
      <EmbedTerms documentType="aup" />
    </div>
  );
};

export { AcceptableUsePolicy };
