import { useEffect, useState } from "react";

// taken from https://usehooks-ts.com/react-hook/use-media-query
function useMediaQuery(query: string): boolean {
  // Always start with false to match SSR
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Only run on client
    const matchMedia = window.matchMedia(query);

    // Set initial value
    setMatches(matchMedia.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange as any);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange as any);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
