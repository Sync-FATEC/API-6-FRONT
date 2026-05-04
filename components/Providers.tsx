"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { DaySelectionProvider } from "@/contexts/DaySelectionContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 100,
            retry: 1,
          },
        },
      })
  );

  return (
    <DaySelectionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          visibleToasts={3}
          toastOptions={{
            classNames: {
              toast: "!flex !gap-3 !p-4 !border-0 !shadow-sm",
              success: "!bg-success-50 !text-success",
              error: "!bg-danger-50 !text-danger",
              warning: " !bg-warning-50 !text-warning",
              title: "!font-bold !text-lg",
              description: "!text-inherit !text-md !font-semibold !opacity-80",
            },
          }}
        />
      </QueryClientProvider>
    </DaySelectionProvider>
  );
}
