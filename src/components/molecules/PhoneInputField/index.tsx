"use client";

import { PhoneInputFieldProps } from "@/types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInputField = ({ onChange, value, disabled }: PhoneInputFieldProps) => {
  return (
    <div className="mt-2 w-full">
      <PhoneInput
        country={value}
        value={value}
        disabled={disabled}
        onChange={(phone) => onChange(phone)}
        buttonStyle={{
          backgroundColor: "transparent",
          border: "none",
        }}
        dropdownStyle={{
          color: "white",
          backgroundColor: "#272E48",
        }}
        inputStyle={{
          width: "100%",
          paddingLeft: "50px",
          fontSize: "16px",
          color: "white",
          backgroundColor: "transparent",
          border: "1px solid",
          borderColor: "#6870DA",
        }}
      />
    </div>
  );
};

export { PhoneInputField };
