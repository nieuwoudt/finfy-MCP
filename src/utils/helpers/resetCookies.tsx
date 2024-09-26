import { getCookies, deleteCookie } from "cookies-next";

const resetCookies = () => {
  const cookies = getCookies();
  Object.keys(cookies).forEach((name) => {
    deleteCookie(name);
  });
};

export { resetCookies }
