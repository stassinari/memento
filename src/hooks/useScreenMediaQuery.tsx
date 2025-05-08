import useMediaQuery from "./useMediaQuery";

const useScreenMediaQuery = (size: "sm" | "md" | "lg" | "xl" | "2xl") => {
  // FIXME find a better way to handle breakpoints
  const breakpoints: Record<string, string> = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };
  const screen = breakpoints[size];

  return useMediaQuery(`(min-width: ${screen})`);
};

export default useScreenMediaQuery;
