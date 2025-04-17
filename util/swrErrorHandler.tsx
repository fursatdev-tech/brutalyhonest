import { toast } from "@/components/ui/use-toast";

export const handleError = {
  onErrorRetry: (
    error: any,
    key: any,
    config: any,
    revalidate: any,
    { retryCount }: { retryCount: number }
  ) => {
    // Never retry on 404.
    if (error.status === 404) return;

    // Only retry up to 2 times.
    if (retryCount >= 2) return;

    // Retry after 5 seconds.
    setTimeout(() => revalidate({ retryCount }), 5000);

    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description:
        `${error.message}` || "There was a problem with your request.",
    });
  },
};
