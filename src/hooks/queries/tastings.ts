import { queryOptions, useQuery } from "@tanstack/react-query";
import { getBeansLookup, getTasting } from "~/db/queries";

export const tastingQueryOptions = (tastingId: string) =>
  queryOptions({
    queryKey: ["tastings", tastingId],
    queryFn: () =>
      getTasting({
        data: { tastingId },
      }),
  });

export const beansLookupQueryOptions = () =>
  queryOptions({
    queryKey: ["beans", "lookup"],
    queryFn: () => getBeansLookup(),
  });

interface UseTastingDetailDataParams {
  tastingId: string;
  enabledTasting?: boolean;
  enabledBeans?: boolean;
}

export const useTastingDetailData = ({
  tastingId,
  enabledTasting = true,
  enabledBeans = true,
}: UseTastingDetailDataParams) => {
  const { data: tasting, isLoading: isLoadingTasting } = useQuery({
    ...tastingQueryOptions(tastingId),
    enabled: enabledTasting,
  });
  const { data: beans = [] } = useQuery({
    ...beansLookupQueryOptions(),
    enabled: enabledBeans,
  });

  return {
    tasting,
    beans,
    isLoadingTasting,
  };
};
