// Local Storage Keys

export const localStorageKeys = {
  darkMode: "darkMode",
  sidebar: "sidebar"
};

export const routesOnboarding = {
  verifyPhoneNumber: "verify-phone-number",
  confirmPhoneNumber: "confirm-phone-number",
  selectPlan: "select-plan",
  personalize: "personalize",
  userPolicy: "user-policy",
  finalUserPolicy: "final-user-policy",
  connectBank: "connect-bank",
  selectCurrency: "select-currency",
  // selectBank: "select-bank",
  // connectBankAccount: "connect-bank-account",
  // bankCredentials: "bank-credentials",
  setupComplete: "setup-complete",
} as const;

export const stepsOnboarding = Object.values(routesOnboarding);

export const THEMES = { light: "", dark: ".dark" } as const;
