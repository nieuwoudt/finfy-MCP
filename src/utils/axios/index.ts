import axios from "axios";
import { config } from "@/config/env";

const getBaseURL = (isExternal: boolean): string => {
  if (typeof window !== "undefined") {
    if (isExternal) {
      return config.FINFY_API as string;
    } else {
      return `${window.location.origin}`;
    }
  }

  if (isExternal) {
    return config.FINFY_API as string;
  } else {
    return config.BASE_URL as string;
  }
};

const createAxiosInstance = (isExternal: boolean) => {
  if (isExternal) {
    return axios.create({
      baseURL: getBaseURL(isExternal),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return axios.create({
      baseURL: "https://app.finfy.ai",
      headers: {
        "Content-Type": "application/json",
      },

    })
  };
}

export const axiosExternal = createAxiosInstance(true);
export const axiosInternal = createAxiosInstance(false);
