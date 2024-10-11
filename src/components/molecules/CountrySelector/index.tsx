"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Autocomplete } from "../Autocomplete";
import { OptionsType } from "@/types";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

interface CountryData {
  name: {
    common: string;
  };
  cca2: string;
}

interface CountrySelectorProps {
  onChange?: (options: OptionsType) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ onChange }) => {
  const [countries, setCountries] = useState<OptionsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get<CountryData[]>(
          "https://restcountries.com/v3.1/all"
        );
        const countryData = response.data;
        const countryOptions = countryData.map((country) => ({
          value: country.cca2,
          label: country.name.common,
          content: country.name.common,
        }));
        const defaultValue = countryOptions.find(
          (count) => count.value === user?.selected_country
        );
        if (defaultValue && onChange) {
          onChange(defaultValue);
        }
        setCountries(countryOptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <Autocomplete
      isLoading={loading}
      options={countries}
      handleOptionClick={onChange}
      full
      placeholder="Choose your country"
      defaultValue={countries.find(
        (count) => count.value === user?.selected_country
      )}
    />
  );
};

export { CountrySelector };
