import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFeatureFlags } from "~/db/queries";

export type FeatureFlagName =
  | "read_from_postgres"
  | "write_to_postgres"
  | "write_to_firestore";

type FeatureFlagsResponse = {
  read_from_postgres: boolean;
  write_to_postgres: boolean;
  write_to_firestore: boolean;
};

type FeatureFlagsContextType = FeatureFlagsResponse & {
  isLoading: boolean;
  refetch: () => void;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType | null>(null);

async function fetchFeatureFlags(): Promise<FeatureFlagsResponse> {
  const flags = await getFeatureFlags();

  // Transform array of flags to flat object
  const flagsMap = flags.reduce(
    (acc, flag) => {
      acc[flag.name] = flag.enabled;
      return acc;
    },
    {} as Record<string, boolean>
  );

  return {
    read_from_postgres: flagsMap.read_from_postgres ?? false,
    write_to_postgres: flagsMap.write_to_postgres ?? false,
    write_to_firestore: flagsMap.write_to_firestore ?? true,
  };
}

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["featureFlagsContext"], // Different key to avoid collision with featureFlags route
    queryFn: fetchFeatureFlags,
    staleTime: 0, // Always refetch - flags need to be fresh
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 min to avoid redundant fetches
  });

  const value: FeatureFlagsContextType = {
    read_from_postgres: data?.read_from_postgres ?? false,
    write_to_postgres: data?.write_to_postgres ?? false,
    write_to_firestore: data?.write_to_firestore ?? true,
    isLoading,
    refetch,
  };

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlag(name: FeatureFlagName): boolean {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error(
      "useFeatureFlag must be used within a FeatureFlagsProvider",
    );
  }
  return context[name];
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider",
    );
  }
  return context;
}
