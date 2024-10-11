import { Plan } from "@/types";

export const plans: Plan[] = [
  {
    id: 0,
    name: "Plus",
    pricing: {
      amount: 20,
      currency: "USD",
      billingCycle: "monthly",
      formattedPrice: "$20 / month",
    },
    description: {
      short:
        "Supercharge your team's work with a secure, collaborative workspace",
      detailed:
        "The Plus plan offers a secure workspace for teams, along with features like automatic account linking, advanced data analysis, and compliance with GDPR.",
    },
    features: {
      highlighted: [
        "40 Co-pilot Quick Financial Questions",
        "Link all your accounts automatically",
        "Access to Advance data analysis Imali specialized and finetunied AI Model",
        "Visualised up to 50 answers a day.",
        "GDPR compliant",
      ],
    },
    ctaButton: {
      label: "You current plan",
      isDisabled: true,
      type: "primary",
      link: null,
    },
  },
  {
    id: 1,
    name: "Team",
    pricing: {
      amount: 25,
      currency: "USD",
      billingCycle: "monthly",
      formattedPrice: "$25 / month",
    },
    description: {
      short:
        "Supercharge your team's work with a secure, collaborative workspace",
      detailed:
        "The Team plan is perfect for larger teams that need more advanced features, such as enhanced collaboration and data visualization.",
    },
    features: {
      highlighted: [
        "40 Co-pilot Quick Financial Questions",
        "Link all your accounts automatically",
        "Access to Advance data analysis Imali specialized and finetunied AI Model",
        "Visualised up to 50 answers a day.",
        "GDPR compliant",
      ],
    },
    ctaButton: {
      label: "Contact sales",
      isDisabled: false,
      type: "secondary",
      link: "/contact-sales",
    },
  },
];
