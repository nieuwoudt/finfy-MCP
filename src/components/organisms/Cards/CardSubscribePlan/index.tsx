"use client";

import { CardTemplate } from "@/components/molecules";
import { Plan } from "@/types";
import { FC } from "react";

interface CardSubscribePlanProps {
  plan: Plan;
}

const CardSubscribePlan: FC<CardSubscribePlanProps> = ({ plan }) => {
  return (
    <CardTemplate>
      <CardTemplate.Content>
        <div
          style={{ border: "1px solid #ccc", padding: "20px", margin: "20px" }}
        >
          <h2>{plan.name}</h2>
          <p>{plan.pricing.formattedPrice}</p>
          <p>{plan.description.short}</p>
          <ul>
            {plan.features.highlighted.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button
            disabled={plan.ctaButton.isDisabled}
            style={{
              backgroundColor: plan.ctaButton.isDisabled ? "#ddd" : "#0070f3",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: plan.ctaButton.isDisabled ? "not-allowed" : "pointer",
            }}
          >
            {plan.ctaButton.label}
          </button>
        </div>
      </CardTemplate.Content>
      <CardTemplate.Footer className="flex justify-between items-center mt-6"></CardTemplate.Footer>
    </CardTemplate>
  );
};

export { CardSubscribePlan };
