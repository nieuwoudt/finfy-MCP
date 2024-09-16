"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import CurrencyFlag from "react-currency-flags";
import axios from "axios";
import { Autocomplete } from "../Autocomplete";
import { OptionsType } from "@/types";

interface CurrencyData {
  [key: string]: {
    name: string;
    symbol: string;
  };
}

interface CurrencySelectorProps {
  onChange?: (options: OptionsType) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onChange }) => {
  const [currencies, setCurrencies] = useState<OptionsType[]>([]);
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
              <CurrencyFlag currency={code} size="sm" />
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

  return (
    <Autocomplete
      isLoading={loading}
      options={currencies}
      handleOptionClick={onChange}
      full
      placeholder="Choose your currency"
    />
  );
};

export { CurrencySelector };
