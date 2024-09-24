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
    title: "💼 Financial Coaching",
    text: "Personalized financial advice for better planning.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "💼",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "💼",
        category: "investment",
      },
    ],
  },
  {
    title: "🛒 Product Recommendation",
    text: "Tailored product saggestions to fit your needs.",
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
    title: "👥 Connect with a Human Advisor",
    text: "Instantly connect with a financial expert.",
    suggest: [
      {
        label: "Expense Alert",
        content: "You spent $120 on groceries today.",
        icon: "👥",
        category: "expense",
      },
      {
        label: "Investment Update",
        content: "Your portfolio gained $500 in value this week.",
        icon: "👥",
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
