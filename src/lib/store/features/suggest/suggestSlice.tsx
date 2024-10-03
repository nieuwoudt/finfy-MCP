import { createSlice } from "@reduxjs/toolkit";

const fakeSuggestionData = [
  {
    label: "Recent Transactions",
    content: "Payment of $250 received from John Doe. Balance updated.",
    icon: "💸",
    category: "transactions",
  },
  {
    label: "Pending Payments",
    content: "You have a pending payment of $75 to Acme Corp.",
    icon: "💳",
    category: "payments",
  },
  {
    label: "Account Balance",
    content: "Your current account balance is $1,450.75.",
    icon: "🏦",
    category: "balance",
  },
  {
    label: "Expense Alert",
    content: "You spent $120 on groceries today.",
    icon: "🛒",
    category: "expense",
  },
  {
    label: "Investment Update",
    content: "Your portfolio gained $500 in value this week.",
    icon: "📈",
    category: "investment",
  },
];

const mockData = [
  {
    title: "🗂️ Accounts",
    text: "Manage, track, and review accounts.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "🗂️",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "🗂️",
        category: "investment",
      },
    ],
  },
  {
    title: "🛍️ Spending",
    text: "Monitor and analyze spending habits.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "🛍️",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "🛍️",
        category: "investment",
      },
    ],
  },
  {
    title: "📊 Budgets",
    text: "Create and adjust financial budgets.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "📊",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "📊",
        category: "investment",
      },
    ],
  },
  {
    title: "🧑‍💼 Financial Advisor",
    text: "Expert guidance on financial strategies.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "🧑‍💼",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "🧑‍💼",
        category: "investment",
      },
    ],
  },
  {
    title: "💰 Cash Flow",
    text: "Ensure adequate funds for expenses.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "💰",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "💰",
        category: "investment",
      },
    ],
  },
  {
    title: "🎯 Goals",
    text: "Set and pursue financial targets.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "🎯",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "🎯",
        category: "investment",
      },
    ],
  },
  {
    title: "🛒 Financial Products",
    text: "Explore and compare financial offerings.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "🛒",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "🛒",
        category: "investment",
      },
    ],
  },
  {
    title: "📈 Net Worth",
    text: "Calculate and track total worth.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "📈",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "📈",
        category: "investment",
      },
    ],
  },
  {
    title: "🌤️ Cash Forecast",
    text: "Predict future financial status..",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "🌤️",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "🌤️",
        category: "investment",
      },
    ],
  },
  {
    title: "💸 Recent Transactionst",
    text: "Track and review recent expenses.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "💸",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "💸",
        category: "investment",
      },
    ],
  },
  {
    title: "🏠 Investment Holdings",
    text: "Manage and assess investment assets.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "🏠",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "🏠",
        category: "investment",
      },
    ],
  },
  {
    title: "💳 Credit Card Usage",
    text: "Optimize and track card benefit..",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "💳",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "💳",
        category: "investment",
      },
    ],
  },
];

interface SuggestState {
  suggest: any;
  focusSuggests: any;
}

const initialState: SuggestState = {
  suggest: fakeSuggestionData,
  focusSuggests: mockData,
};

export const suggestSlice = createSlice({
  name: "suggested",
  initialState,
  reducers: {
    setSuggest: (state, action) => {
      state.suggest = action.payload;
    },
  },
});

export const { setSuggest } = suggestSlice.actions;

export default suggestSlice.reducer;
