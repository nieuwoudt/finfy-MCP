"use client";
import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import CurrencyFlag from "react-currency-flags";
import axios from "axios";

interface CurrencyData {
  [key: string]: {
    name: string;
    symbol: string;
  };
}

interface CurrencyOption {
  value: string;
  label: JSX.Element;
}

interface CurrencySelectorProps {
  onChange: (selectedOption: SingleValue<CurrencyOption>) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onChange }) => {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get<CurrencyData>(
          "https://api.vatcomply.com/currencies"
        );
        const currencyData = response.data;
        const currencyOptions = Object.keys(currencyData).map((code) => ({
          value: code,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <CurrencyFlag currency={code} size="lg" />
              <span style={{ marginLeft: 8 }}>
                {currencyData[code].name} ({code})
              </span>
            </div>
          ),
        }));
        setCurrencies(currencyOptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  if (loading) {
    return <p>Loading currencies...</p>;
  }

  return (
    <Select
      className="CurrencySelector"
      defaultValue={currencies.find((cur) => cur.value === "ZAR")}
      options={currencies}
      placeholder="Choose your currency"
      classNames={{
        control: () => "CurrencySelector__control",
        menu: () => "CurrencySelector__menu",
        singleValue: () => "CurrencySelector__single-value",
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
      onChange={onChange}
    />
  );
};

export { CurrencySelector };
