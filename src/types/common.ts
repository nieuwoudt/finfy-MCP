import { routesOnboarding } from "@/utils/variables";

export type Classes = {
  wrapper?: string;
  container?: string;
};

export type PhoneInputFieldProps = {
  onChange: (phone: string) => void;
  value: string;
  disabled?: boolean;
};

export type RouteOnboardingValues =
  (typeof routesOnboarding)[keyof typeof routesOnboarding];

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  plan: string;
}
