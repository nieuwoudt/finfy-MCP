// Local Storage Keys

export const localStorageKeys = {
  darkMode: "darkMode",
};


// Cookie Keys

export const cookiesKeys = {
  sidebar: "sidebar"
};


export const emojis = ['🗂','🧑', '🛒', '💸', '🛍️', '💰', '📈', '🏠', '🌤️', '💳'];

export const routesOnboarding = {
  verifyPhoneNumber: "verify-phone-number",
  confirmPhoneNumber: "confirm-phone-number",
  selectPlan: "select-plan",
  personalize: "personalize",
  userPolicy: "user-policy",
  finalUserPolicy: "final-user-policy",
  selectCountry: "select-country",
  connectBank: "connect-bank",
  selectCurrency: "select-currency",
  addStripe: "add-stripe",
  // selectBank: "select-bank",
  // connectBankAccount: "connect-bank-account",
  // bankCredentials: "bank-credentials",
  setupComplete: "setup-complete",
} as const;

export const stepsOnboarding = Object.values(routesOnboarding);

export const THEMES = { light: "", dark: ".dark" } as const;
