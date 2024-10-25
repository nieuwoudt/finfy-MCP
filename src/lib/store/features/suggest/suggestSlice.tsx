import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SuggestState {
  suggest: any;
  focusSuggests: any;
  loading: any;
  error: any;
}

const initialState: SuggestState = {
  suggest: [],
  focusSuggests: [],
  loading: false,
  error: "",
};

function adaptApiDataToMock(apiData: any) {
  const categoryIcons: any = {
    spending: "🛍️",
    budgetting: "📊",
    goals: "🎯",
    cash_forcast: "🌤️",
    credit_card_usage: "💳",
    investment_holdings: "🏠",
    net_worth: "📈",
    cashflow: "💰",
    recent_transactions: "💸"
  };

  const descriptions: any = {
    spending: "Monitor and analyze spending habits.",
    budgetting: "Create and adjust financial budgets.",
    goals: "Set and pursue financial targets.",
    cash_forcast: "Predict future financial status.",
    credit_card_usage: "Optimize and track card benefits.",
    investment_holdings: "Manage and assess investment assets.",
    net_worth: "Calculate and track total worth.",
    cashflow: "Ensure adequate funds for expenses.",
    recent_transactions: "Track and review recent expenses."
  };

  const labels: any = {
    spending: "Spending Question",
    budgetting: "Budget Insight",
    goals: "Goal Progress",
    cash_forcast: "Cash Forecast",
    credit_card_usage: "Credit Card Tip",
    investment_holdings: "Investment Insight",
    net_worth: "Net Worth Update",
    cashflow: "Cash Flow Alert",
    recent_transactions: "Recent Transaction"
  };

  return Object.entries(apiData).map(([category, questions]: any) => ({
    title: `${categoryIcons[category] || ""} ${capitalizeWords(category.replace('_', ' '))}`,
    text: descriptions[category] || "Manage your finances efficiently.",
    suggest: Object.values(questions).map(question => ({
      label: labels[category] || "Financial Update",
      content: question,
      icon: categoryIcons[category] || "📂",
      category: category
    }))
  }));

  function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
  }
}


export const fetchFocusSuggests = createAsyncThunk(
  "suggested/fetchFocusSuggests",
  async () => {
    const response = await fetch(
      "https://finify-ai-137495399237.us-central1.run.app/get_suggested_question_bank"
    );
    const data = await response.json();
    console.log(adaptApiDataToMock(data), "kghfghfghghjjfhg")
    return adaptApiDataToMock(data);
  }
);

export const suggestSlice = createSlice({
  name: "suggested",
  initialState,
  reducers: {
    setSuggest: (state, action) => {
      state.suggest = [...action.payload];
    },
    setFocusSuggests: (state, action) => {
      state.focusSuggests = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFocusSuggests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFocusSuggests.fulfilled, (state, action) => {
        state.loading = false;
        state.focusSuggests = action.payload;
      })
      .addCase(fetchFocusSuggests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSuggest, setFocusSuggests } = suggestSlice.actions;

export default suggestSlice.reducer;
