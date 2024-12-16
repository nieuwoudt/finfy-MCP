"use client";

import React, { useState, useEffect } from "react";
import CurrencyFlag from "react-currency-flags";
import axios from "axios";
import { Autocomplete } from "../Autocomplete";
import { OptionsType } from "@/types";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

interface CurrencyData {
  [key: string]: {
    name: string;
    symbol: string;
  };
}

const  currencyFilter =  {
  'US': 'USD',
  'ZA': 'ZAR'
} as const;

interface CurrencySelectorProps {
  onChange?: (options: OptionsType) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onChange }) => {
  const [currencies, setCurrencies] = useState<OptionsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.user.user);

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
          content: currencyData[code].name,
        }));
        const defaultValue = currencyOptions.find(
          (currency) => currency.value === user?.selected_currency
        );
        if (defaultValue && onChange) {
          onChange(defaultValue);
        }
        let filteredCurrencyOptions = currencyOptions;
        if (user?.selected_country && user.selected_country in currencyFilter) {
          filteredCurrencyOptions = currencyOptions.filter((option) => option.value === currencyFilter[user.selected_country as keyof typeof currencyFilter])
        }
        setCurrencies(filteredCurrencyOptions);
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
      defaultValue={currencies.find(
        (currency) => currency.value === user?.selected_currency
      )}
    />
  );
};

export { CurrencySelector };
