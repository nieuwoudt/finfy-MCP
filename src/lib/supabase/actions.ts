"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/utils/helpers";
import { Account, Transaction } from "@/types";
import * as Sentry from "@sentry/nextjs";
import { config } from "@/config/env";

export const createAccountAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { auth } = createSupabaseClient();
    const { error } = await auth.signUp({ password, email });
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const loginAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { auth } = createSupabaseClient();
    const { error } = await auth.signInWithPassword({ password, email });
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const signOutAction = async () => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.signOut();
    if (error) {
      Sentry.captureException("error");
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const signInWithOtp = async (phone: string) => {
  try {
    const { auth } = supabase;
    const { error } = await auth.signInWithOtp({
      phone: `+${phone}`,
    });
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const resetPasswordForEmail = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const { auth } = createSupabaseClient();
    const { error } = await auth.resetPasswordForEmail(email, {
      redirectTo: `${config.BASE_URL}/update-password`,
    });
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const updatePassword = async (formData: FormData) => {
  try {
    const newPassword = formData.get("password") as string;
    const { auth } = createSupabaseClient();
    const { error } = await auth.updateUser({
      password: newPassword
    })
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const verifyPhoneUser = async (phone: string, token: string) => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const resendCodeOTP = async (phone: string) => {
  try {
    const { auth } = createSupabaseClient();
    const { error } = await auth.resend({
      phone,
      type: "sms",
    });
    if (error) {
      Sentry.captureException(error);
      throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveTransactionsAndAccounts = async (
  transactions: Transaction[],
  userId: string
) => {
  try {
    const uniqueAccounts = transactions.reduce(
      (acc: Account[], transaction) => {
        if (
          !acc.some((account) => account.account_id === transaction.account_id)
        ) {
          const account: Account = {
            account_id: transaction.account_id,
            account_owner: transaction.account_owner,
            iso_currency_code: transaction.iso_currency_code,
            balance: 0,
            status: "active",
            type: "default",
            user_id: `${userId}`,
          };
          acc.push(account);
        }
        return acc;
      },
      []
    );

    const { error: accountError } = await supabase
      .from("accounts")
      .insert(uniqueAccounts);
    Sentry.captureException(accountError);

    if (accountError) {
      throw accountError;
    }

    const formattedTransactions = transactions.map((transaction) => ({
      account_id: transaction.account_id,
      amount: transaction.amount,
      authorized_date: transaction.authorized_date,
      authorized_datetime: transaction.authorized_datetime,
      category: transaction.category,
      category_id: transaction.category_id,
      check_number: transaction.check_number,
      counterparties: JSON.stringify(transaction.counterparties),
      date: transaction.date,
      datetime: transaction.datetime,
      iso_currency_code: transaction.iso_currency_code,
      location: JSON.stringify(transaction.location),
      logo_url: transaction.logo_url,
      merchant_entity_id: transaction.merchant_entity_id,
      merchant_name: transaction.merchant_name,
      name: transaction.name,
      payment_channel: transaction.payment_channel,
      payment_meta: JSON.stringify(transaction.payment_meta),
      pending: transaction.pending,
      pending_transaction_id: transaction.pending_transaction_id,
      personal_finance_category: JSON.stringify(
        transaction.personal_finance_category
      ),
      personal_finance_category_icon_url:
        transaction.personal_finance_category_icon_url,
      transaction_code: transaction.transaction_code,
      transaction_id: transaction.transaction_id,
      transaction_type: transaction.transaction_type,
      unofficial_currency_code: transaction.unofficial_currency_code,
      website: transaction.website,
      user_id: `${userId}`,
    }));

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert(formattedTransactions);

    if (transactionError) {
      throw transactionError;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveBalances = async (accountData: any, userId: string) => {
  try {
    const { error } = await supabase.from("balances").insert(
      accountData.map((account: any) => ({
        account_id: account.account_id,
        persistent_account_id: account.persistent_account_id,
        name: account.name,
        official_name: account.official_name,
        mask: account.mask,
        subtype: account.subtype,
        type: account.type,
        available_balance: account.balances.available,
        current_balance: account.balances.current,
        iso_currency_code: account.balances.iso_currency_code,
        unofficial_currency_code: account.balances.unofficial_currency_code,
        created_at: new Date().toISOString(),
        user_id: userId,
      }))
    );
    if (error) {
      Sentry.captureException(error);
      throw error;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveLiabilities = async (liabilitiesData: any, userId: string) => {
  try {
    const creditLiabilities = liabilitiesData.credit.map((credit: any) => ({
      account_id: credit.account_id,
      account_type: "credit",
      aprs: credit.aprs,
      is_overdue: credit.is_overdue,
      last_payment_amount: credit.last_payment_amount,
      last_payment_date: credit.last_payment_date,
      last_statement_issue_date: credit.last_statement_issue_date,
      last_statement_balance: credit.last_statement_balance,
      minimum_payment_amount: credit.minimum_payment_amount,
      next_payment_due_date: credit.next_payment_due_date,
      user_id: userId,
    }));

    const mortgageLiabilities = liabilitiesData.mortgage.map(
      (mortgage: any) => ({
        account_id: mortgage.account_id,
        account_type: "mortgage",
        account_number: mortgage.account_number,
        current_late_fee: mortgage.current_late_fee,
        escrow_balance: mortgage.escrow_balance,
        has_pmi: mortgage.has_pmi,
        has_prepayment_penalty: mortgage.has_prepayment_penalty,
        interest_rate: mortgage.interest_rate,
        loan_term: mortgage.loan_term,
        loan_type_description: mortgage.loan_type_description,
        maturity_date: mortgage.maturity_date,
        next_monthly_payment: mortgage.next_monthly_payment,
        origination_date: mortgage.origination_date,
        origination_principal_amount: mortgage.origination_principal_amount,
        past_due_amount: mortgage.past_due_amount,
        property_address: mortgage.property_address,
        ytd_interest_paid: mortgage.ytd_interest_paid,
        ytd_principal_paid: mortgage.ytd_principal_paid,
        user_id: userId,
      })
    );

    const studentLiabilities = liabilitiesData.student.map((student: any) => ({
      account_id: student.account_id,
      account_type: "student",
      account_number: student.account_number,
      disbursement_dates: student.disbursement_dates,
      expected_payoff_date: student.expected_payoff_date,
      guarantor: student.guarantor,
      interest_rate_percentage: student.interest_rate_percentage,
      loan_name: student.loan_name,
      loan_status: student.loan_status,
      outstanding_interest_amount: student.outstanding_interest_amount,
      payment_reference_number: student.payment_reference_number,
      pslf_status: student.pslf_status,
      repayment_plan: student.repayment_plan,
      servicer_address: student.servicer_address,
      sequence_number: student.sequence_number,
      user_id: userId,
    }));

    const { error } = await supabase
      .from("liabilities")
      .insert([
        ...creditLiabilities,
        ...mortgageLiabilities,
        ...studentLiabilities,
      ]);

    if (error) {
      Sentry.captureException(error);
      throw error;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveInvestmentTransactions = async (
  transactions: any[],
  userId: string
) => {
  try {
    const { error } = await supabase.from("investment_transactions").insert(
      transactions.map((transaction: any) => ({
        investment_transaction_id: transaction.investment_transaction_id,
        account_id: transaction.account_id,
        amount: transaction.amount,
        cancel_transaction_id: transaction.cancel_transaction_id,
        transaction_date: transaction.date,
        fees: transaction.fees,
        iso_currency_code: transaction.iso_currency_code,
        name: transaction.name,
        price: transaction.price,
        quantity: transaction.quantity,
        security_id: transaction.security_id,
        subtype: transaction.subtype,
        type: transaction.type,
        unofficial_currency_code: transaction.unofficial_currency_code,
        user_id: userId,
        created_at: new Date().toISOString(),
      }))
    );

    if (error) {
      Sentry.captureException(error);
      throw error;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveBankIncome = async (bankIncomeData: any, userId: string) => {
  try {
    const { error } = await supabase.from("bank_income").insert([
      {
        bank_income_id: bankIncomeData.bank_income_id,
        bank_income_summary: bankIncomeData.bank_income_summary,
        days_requested: bankIncomeData.days_requested,
        generated_time: bankIncomeData.generated_time,
        items: bankIncomeData.items,
        request_id: bankIncomeData.request_id,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      Sentry.captureException(error);
      throw error;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};

export const saveAssetReport = async (reportData: any, userId: string) => {
  try {
    const { error } = await supabase.from("asset_reports").insert([
      {
        asset_report_id: reportData.report.asset_report_id,
        client_report_id: reportData.report.client_report_id,
        date_generated: reportData.report.date_generated,
        days_requested: reportData.report.days_requested,
        items: reportData.report.items,
        user_info: reportData.report.user,
        created_at: new Date().toISOString(),
        user_id: userId,
      },
    ]);

    if (error) {
      Sentry.captureException(error);
      throw error;
    }

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    };
  }
};
