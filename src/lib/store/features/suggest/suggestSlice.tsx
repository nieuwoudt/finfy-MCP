import { Icon } from "@/components/atoms";
import { capitalizeWords } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../..";

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
    spending: "",
    budgetting: "",
    goals: "",
    cash_forcast: "",
    credit_card_usage: "",
    investment_holdings: "",
    net_worth: "",
    cashflow: "",
    recent_transactions: ""
  };
  // const categoryIcons: any = {
  //   spending: "🛍️",
  //   budgeting: "📊",
  //   goals: "🎯",
  //   cash_forecast: "🌤️",
  //   credit_card_usage: "💳",
  //   investment_holdings: "🏠",
  //   net_worth: "📈",
  //   cashflow: "💰",
  //   recent_transactions: "💸"
  // };

  const categoryIconTypes: any = {
    spending: "ShoppingBag",
    budgeting: "CurrencyDollar",
    goals: "Flag",
    cash_forecast: "Sun",
    credit_card_usage: "CreditCardUsage",
    investment_holdings: "Home",
    net_worth: "PresentationChartLine",
    cashflow: "Income",
    recent_transactions: "Refresh"
  };

  const descriptions: any = {
    spending: "Monitor and analyze spending habits.",
    budgeting: "Manege your finances efficiently.",
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
    budgeting: "Budget Insight",
    goals: "Goal Progress",
    cash_forcast: "Cash Forecast",
    credit_card_usage: "Credit Card Tip",
    investment_holdings: "Investment Insight",
    net_worth: "Net Worth Update",
    cashflow: "Cash Flow Alert",
    recent_transactions: "Recent Transaction"
  };

  const budgetSuggestData = [
    {
      "label": "Set Up Budget:",
      "content": "Can you help me set up my budget for this month using the 70/20/10 rule?",
      "icon": "",
      "category": "budgeting"
    },
    {
      "label": "Income Allocation:",
      "content": "How much of my income should go towards 'Needs,' 'Wants,' and 'Savings'?",
      "icon": "",
      "category": "budgeting"
    },
    {
      "label": "How 70/20/10 Works:",
      "content": "How does the 70/20/10 rule work for my spending?",
      "icon": "",
      "category": "budgeting"
    },
    {
      "label": "Allocate Income:",
      "content": "What’s the best way to allocate my income using the 70/20/10 budget?",
      "icon": "",
      "category": "budgeting"
    },
    {
      "label": "Increase Savings:",
      "content": "How can I adjust my budget to start saving more?",
      "icon": "",
      "category": "budgeting"
    },
    {
      "label": "Wants Budget:",
      "content": "What’s my recommended budget for 'Wants' based on my income?",
      "icon": "",
      "category": "budgeting"
    }
  ]

  return Object.entries(apiData).map(([category, questions]: any) => {
    let suggestQuestionsAdapted = Object.values(questions).map(question => ({
      label: labels[category] || "Financial Update",
      content: question,
      icon: categoryIcons[category] || "",
      category: category
    }));

    if (category === 'budgeting') {
      suggestQuestionsAdapted = [...budgetSuggestData, ...suggestQuestionsAdapted]
    }

    return {
      title: `${capitalizeWords(category.replace('_', ' '))}`,
      text: descriptions[category] || "Predict future financial status.",
      icon: categoryIconTypes[category] ? <Icon type={categoryIconTypes[category]} /> : "",
      suggest: suggestQuestionsAdapted
    }
  });
}


const cache = new Map<string, any>();

export const fetchFocusSuggests = createAsyncThunk<
  any,
  { userId: string; provider: string },
  { rejectValue: string }
>(
  "suggested/fetchFocusSuggests",
  async ({ userId, provider }, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }

      const cacheKey = `${userId}-${provider}`;

      if (cache.has(cacheKey)) {
        console.log("Returning cached data");
        return cache.get(cacheKey);
      }

      const response = await fetch(
        "https://finify-ai-137495399237.us-central1.run.app/personalized_questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, provider }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("CHECK data", data);

      const adaptedData = adaptApiDataToMock(data?.personalized_questions);

      cache.set(cacheKey, adaptedData);

      return adaptedData;
    } catch (error: any) {
      console.error("Error fetching personalized questions:", error);
      return rejectWithValue(error.message);
    }
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
