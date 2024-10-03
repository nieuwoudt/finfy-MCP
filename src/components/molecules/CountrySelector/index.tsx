"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Autocomplete } from "../Autocomplete";
import { OptionsType } from "@/types";

interface CountryData {
  name: {
    common: string;
  };
  cca2: string; // Alpha-2 code (country code)
}

interface CountrySelectorProps {
  onChange?: (options: OptionsType) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ onChange }) => {
  const [countries, setCountries] = useState<OptionsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        }));
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
    />
  );
};

export { CountrySelector };
