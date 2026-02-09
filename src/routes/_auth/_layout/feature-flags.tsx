import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "~/components/Card";
import { Heading } from "~/components/Heading";
import { Toggle } from "~/components/Toggle";
import { changeFeatureFlag } from "~/db/mutations";
import { getFeatureFlags } from "~/db/queries";

export const flagsQueryOptions = () =>
  queryOptions({
    queryKey: ["featureFlags"],
    queryFn: getFeatureFlags,
  });

export const Route = createFileRoute("/_auth/_layout/feature-flags")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function RouteComponent() {
  const { data: flags } = useSuspenseQuery(flagsQueryOptions());

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: changeFeatureFlag,
    onSuccess: () => {
      // Invalidate both flag queries so the provider picks up changes
      queryClient.invalidateQueries(flagsQueryOptions());
      queryClient.invalidateQueries({ queryKey: ["featureFlagsContext"] });
    },
  });

  const handleFlagChange = (name: string, enabled: boolean) => {
    mutation.mutate({ data: { name, enabled } });
  };

  return (
    <div className="space-y-4">
      <Heading>Feature Flags</Heading>

      {flags && flags.length > 0 ? (
        <div className="space-y-3">
          {flags.map((flag) => (
            <Card key={flag.name}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{flag.name}</p>
                  {flag.description && (
                    <p className="text-sm text-gray-500">{flag.description}</p>
                  )}
                </div>
                <Toggle
                  checked={flag.enabled}
                  onChange={(enabled) => handleFlagChange(flag.name, enabled)}
                  disabled={mutation.isPending}
                  label=""
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No feature flags found</div>
      )}
    </div>
  );
}
