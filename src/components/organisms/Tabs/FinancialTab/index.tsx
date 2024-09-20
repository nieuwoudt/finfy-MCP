"use client"

import React from "react";
import { Tab } from "@/components/atoms";
import {
  CashFlowChart,
  SpendingChart,
  TransactionChart,
} from "@/components/molecules";

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
        <SpendingChart />
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
