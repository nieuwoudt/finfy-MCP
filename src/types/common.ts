import { routesOnboarding, THEMES } from "@/utils/variables";
import { FC, ReactNode } from "react";

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
  id: string;
  name: string;
  email: string;
  created_at: string;
  plan: string;
  selected_currency: string;
  selected_country: string;
  phone: string;
  finished_onboarding: boolean;
  plaid_access_token: string;
  plaid_user_token: string;
  is_connected_bank: boolean;
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
  user_id: string;
}

export interface TransactionYodlee {
  id: number;
  container: string;
  amount: number;
  currency: string;
  category_type: string;
  category_id: number;
  category: string;
  category_source: string;
  high_level_category_id: number;
  created_date: string;
  last_updated: string;
  description_original: string;
  is_manual: boolean;
  source_type: string;
  date: string;
  transaction_date: string;
  post_date: string;
  status: string;
  account_id: number;
  running_balance_amount: number;
  running_balance_currency: string;
  check_number: string;
  user_id: string;
}

export interface AccountYodlee {
  id: number;
  CONTAINER: string;
  providerAccountId: number;
  accountName: string;
  accountStatus: string;
  accountNumber: string;
  aggregationSource: string;
  isAsset: boolean;
  balance: {
    amount: number;
    currency: string;
  };
  userClassification: string;
  includeInNetWorth: boolean;
  providerId: string;
  providerName: string;
  isManual: boolean;
  availableBalance?: {
    amount: number;
    currency: string;
  };
  currentBalance: {
    amount: number;
    currency: string;
  };
  accountType: string;
  displayedName: string;
  createdDate: string;
  lastUpdated: string;
  bankTransferCode: Array<{
    id: string;
    type: string;
  }>;
  fullAccountNumber: string;
  fullAccountNumberList: {
    paymentAccountNumber: string;
  };
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

export type OptionsType = {
  label: string | ReactNode;
  value: string;
};

export type MenuItem = {
  value: string;
  icon: FC<{ className?: string }>;
  title: string;
  link: string;
  href: string;
  isHideChevron?: boolean;
  contents:
    | {
        title: string;
        date: string;
        chatId: string;
        category: "assistant" | "goals" | "payments" | "advisor";
      }[]
    | [];
};

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

export type FileType = {
  id: number;
  file?: File;
  url?: string;
  type?: string;
  name?: string;
};
