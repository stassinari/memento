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

export const useTastingDetailData = ({ tastingId }: { tastingId: string }) => {
  const { data: tasting, isLoading: isLoadingTasting } = useQuery({
    ...tastingQueryOptions(tastingId),
  });
  const { data: beans = [] } = useQuery({
    ...beansLookupQueryOptions(),
  });

  return {
    tasting,
    beans,
    isLoadingTasting,
  };
};
