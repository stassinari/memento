import { theme } from "twin.macro";
import useMediaQuery from "./useMediaQuery";

const useScreenMediaQuery = (size: "sm" | "md" | "lg" | "xl" | "2xl") => {
  const breakpoints: Record<string, string> = theme`screens`;
  const screen = breakpoints[size];

  console.log(screen);

  return useMediaQuery(`(min-width: ${screen})`);
};

export default useScreenMediaQuery;
