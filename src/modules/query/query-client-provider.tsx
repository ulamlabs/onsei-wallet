import { useToastStore } from "@/store";
import * as ReactQuery from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GC_TIME, SHORT_STALE_TIME } from "./consts";
import { PropsWithChildren } from "react";

const queryClient = new ReactQuery.QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: SHORT_STALE_TIME,
      gcTime: GC_TIME,
      // @ts-expect-error error: Error -> error: AxiosError
      retry: (failureCount, error: AxiosError) => {
        if (failureCount >= 3) {
          console.error("Failed to fetch data after 3 attempts", error.message);
          useToastStore.getState().error({
            description: "Number of attempts exceeded. Try again later.",
          });
          return false;
        }
        if (
          error.response?.status &&
          (error.response?.status === 429 || error.response?.status >= 500)
        ) {
          return true;
        }
        console.error("Failed to fetch data", error.message);
        useToastStore
          .getState()
          .error({ description: "Failed to fetch data. Try again later." });
        return false;
      },
    },
  },
});

export const QueryClientProvider = ({ children }: PropsWithChildren) => (
  <ReactQuery.QueryClientProvider client={queryClient}>
    {children}
  </ReactQuery.QueryClientProvider>
);
