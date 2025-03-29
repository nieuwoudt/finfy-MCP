"use client";

import { useUser } from "@/hooks";
import { Button, Dialog, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { FC, useState } from "react";
import { useNavigationOnboarding } from "@/hooks";
import { withRedirect } from "@/hoc";
import { WithRedirectProps } from "@/types";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateUser } from "@/lib/store/features/user/userSlice";

interface DataProviderCardProps extends WithRedirectProps {}

interface DataProviderOption {
  id: string;
  name: string;
  description: string;
}

const dataProviders: DataProviderOption[] = [
  {
    id: "plaid",
    name: "Plaid",
    description: "Connect to over 12,000 financial institutions in the US and Canada"
  },
  {
    id: "fingoal",
    name: "FinGoal/Yodlee",
    description: "Connect to thousands of financial institutions worldwide with enhanced analytics"
  }
];

const CardSelectDataProvider: FC<DataProviderCardProps> = ({ redirect }) => {
  const { nextStep, prevStep } = useNavigationOnboarding();
  const { user } = useUser();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  
  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };
  
  const handleSubmit = async () => {
    if (!selectedProvider) {
      toast.error("Please select a data provider");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (user?.id) {
        await dispatch(updateUser({
          id: user.id,
          name: `${user.name || ''} [provider:${selectedProvider}]`
        }));
        
        toast.success(`${selectedProvider === 'plaid' ? 'Plaid' : 'FinGoal/Yodlee'} selected as your data provider`);
        nextStep();
      } else {
        toast.error("User data not found");
      }
    } catch (error) {
      toast.error("Failed to save your selection");
      console.error("Error saving data provider selection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <CardTemplate
      title="Select Your Data Provider"
      description="Choose how you want to connect your financial accounts"
    >
      <CardTemplate.Content>
        <div className="space-y-4">
          {dataProviders.map((provider) => (
            <div
              key={provider.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedProvider === provider.id
                  ? "border-purple-15 bg-purple-15/10"
                  : "border-gray-700 hover:border-gray-500"
              }`}
              onClick={() => handleProviderSelect(provider.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {provider.id === "plaid" ? (
                    <Icon type="CreditCardIcon" className="w-6 h-6" />
                  ) : (
                    <Icon type="SparkleIcon" className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-medium">{provider.name}</h3>
                  <p className="text-sm text-gray-300">{provider.description}</p>
                </div>
                {selectedProvider === provider.id && (
                  <div className="ml-auto">
                    <Icon type="CheckIcon" className="text-purple-15" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardTemplate.Content>
      
      <CardTemplate.Footer className="flex justify-between flex-col w-full gap-3 items-center mt-6">
        <Button onClick={handleSubmit} size="xl" full disabled={!selectedProvider || isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
        </Button>
        <Button variant="ghost" onClick={prevStep} size="xl" full>
          Back
        </Button>
      </CardTemplate.Footer>
    </CardTemplate>
  );
};

export default withRedirect(CardSelectDataProvider); 