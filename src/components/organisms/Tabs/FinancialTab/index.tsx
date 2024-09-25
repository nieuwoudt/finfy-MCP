"use client"

import React from "react";
import { Tab } from "@/components/atoms";
import {
  CashFlowChart,
  SpendingChart,
  TransactionChart,
  BarChartPrimaryCategory,
  BarChartPrimarySecondary,
  PieChartTransactionType,
  LineChartByDate
} from "@/components/molecules";

const spendingData = {
  "total_spending": 1375.0,
  "spending_by_primary_category": {
    "BANK_FEES": 420.0,
    "ENTERTAINMENT": 280.0,
    "GENERAL_SERVICES": 375.0,
    "INCOME": 300.0
  },
  "spending_by_primary_secondary": {
    "BANK_FEES": {
      "BANK_FEES_OTHER_BANK_FEES": 420.0
    },
    "ENTERTAINMENT": {
      "ENTERTAINMENT_CASINOS_AND_GAMBLING": 100.0,
      "ENTERTAINMENT_SPORTING_EVENTS_AMUSEMENT_PARKS_AND_MUSEUMS": 30.0,
      "ENTERTAINMENT_TV_AND_MOVIES": 150.0
    },
    "GENERAL_SERVICES": {
      "GENERAL_SERVICES_INSURANCE": 75.0,
      "GENERAL_SERVICES_SECURITY": 300.0
    },
    "INCOME": {
      "INCOME_OTHER_INCOME": 300.0
    }
  },
  "spending_by_date": {
    "2024-01-10": 300.0,
    "2024-01-15": 100.0,
    "2024-01-19": 75.0,
    "2024-02-27": 30.0,
    "2024-03-01": 420.0,
    "2024-03-15": 300.0,
    "2024-03-20": 150.0
  },
  "spending_by_primary_secondary_date": {
    "2024-01-10": [
      {
        "primary_category": "INCOME",
        "detailed_category": "INCOME_OTHER_INCOME",
        "amount": 300.0
      }
    ],
    "2024-01-15": [
      {
        "primary_category": "ENTERTAINMENT",
        "detailed_category": "ENTERTAINMENT_CASINOS_AND_GAMBLING",
        "amount": 100.0
      }
    ],
    "2024-01-19": [
      {
        "primary_category": "GENERAL_SERVICES",
        "detailed_category": "GENERAL_SERVICES_INSURANCE",
        "amount": 75.0
      }
    ],
    "2024-02-27": [
      {
        "primary_category": "ENTERTAINMENT",
        "detailed_category": "ENTERTAINMENT_SPORTING_EVENTS_AMUSEMENT_PARKS_AND_MUSEUMS",
        "amount": 30.0
      }
    ],
    "2024-03-01": [
      {
        "primary_category": "BANK_FEES",
        "detailed_category": "BANK_FEES_OTHER_BANK_FEES",
        "amount": 420.0
      }
    ],
    "2024-03-15": [
      {
        "primary_category": "GENERAL_SERVICES",
        "detailed_category": "GENERAL_SERVICES_SECURITY",
        "amount": 300.0
      }
    ],
    "2024-03-20": [
      {
        "primary_category": "ENTERTAINMENT",
        "detailed_category": "ENTERTAINMENT_TV_AND_MOVIES",
        "amount": 150.0
      }
    ]
  },
  "spending_by_transaction_type": {
    "fee": 420.0,
    "income": 300.0,
    "purchase": 280.0,
    "service": 375.0
  }
}

const FinancialTab = () => {
  return (
    <Tab
      defaultValue="spending"
      className="border rounded-md p-5 bg-navy-15 border-navy-5"
    >
      <Tab.List className="text-white">
        <Tab.Trigger
          value="spending"
          className="gap-1 items-center border-navy-15"
        >
          Spending
        </Tab.Trigger>
        <Tab.Trigger
          value="transactions"
          className="gap-1 items-center border-navy-15"
        >
          Transactions
        </Tab.Trigger>
        <Tab.Trigger
          value="cashflow"
          className="gap-1 items-center border-navy-15"
        >
          Cashflow
        </Tab.Trigger>
        <Tab.Trigger
          value="planner"
          className="gap-1 items-center border-navy-15"
        >
          Planner
        </Tab.Trigger>
      </Tab.List>
      <Tab.Content value="spending">
      <h3>Spending by Primary Category</h3>
      <BarChartPrimaryCategory data={spendingData.spending_by_primary_category} />

      <h3>Spending by Primary and Secondary Category</h3>
      <BarChartPrimarySecondary data={spendingData.spending_by_primary_secondary} />

      <h3>Spending by Date</h3>
      <LineChartByDate data={spendingData.spending_by_date} />

      <h3>Spending by Transaction Type</h3>
      <PieChartTransactionType data={spendingData.spending_by_transaction_type} />
      </Tab.Content>
      <Tab.Content value="transactions">
        <TransactionChart />
      </Tab.Content>
      <Tab.Content value="cashflow">
        <CashFlowChart />
      </Tab.Content>
      <Tab.Content value="planner">Next action steps:</Tab.Content>
    </Tab>
  );
};

export { FinancialTab };
