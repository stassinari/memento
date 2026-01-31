import { useSearch } from "@tanstack/react-router";

export const useRedirectTo = () => {
  const search = useSearch({ strict: false }) as { redirect?: string };
  return search.redirect || "/";
};
