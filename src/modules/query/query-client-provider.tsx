import { useToastStore } from "@/store";
import * as ReactQuery from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GC_TIME, SHORT_STALE_TIME } from "./consts";

const queryClient = new ReactQuery.QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: SHORT_STALE_TIME,
      gcTime: GC_TIME,
      // @ts-expect-error error: Error -> error: AxiosError
      retry: (failureCount, error: AxiosError) => {
        if (failureCount >= 3) {
          useToastStore.getState().error({ description: error.message });
          return false;
        }
        if (
          error.response?.status &&
          (error.response?.status === 429 || error.response?.status >= 500)
        ) {
          return true;
        }
        return false;
      },
    },
  },
});

export const QueryClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReactQuery.QueryClientProvider client={queryClient}>
    {children}
  </ReactQuery.QueryClientProvider>
);
