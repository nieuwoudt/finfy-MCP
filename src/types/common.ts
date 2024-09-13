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

export interface Transaction {
  id: string;
  account_id: string;
  account_owner: string | null;
  amount: number;
  authorized_date: string;
  authorized_datetime: string | null;
  category: string[];
  category_id: string;
  check_number: string | null;
  counterparties: object | null;
  date: string;
  datetime: string | null;
  iso_currency_code: string;
  location: object | null;
  logo_url: string | null;
  merchant_entity_id: string;
  merchant_name: string;
  name: string;
  payment_channel: string;
  payment_meta: object | null;
  pending: boolean;
  pending_transaction_id: string | null;
  personal_finance_category: object | null;
  personal_finance_category_icon_url: string;
  transaction_code: string | null;
  transaction_id: string;
  transaction_type: string;
  unofficial_currency_code: string | null;
  website: string;
}

export interface Account {
  id?: string;
  account_id: string;
  account_owner: string | null;
  user_id?: string;
  balance: number;
  created_at?: string;
  updated_at?: string;
  iso_currency_code: string;
  status: string;
  type: string;
}
