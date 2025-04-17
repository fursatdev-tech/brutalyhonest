import { toast } from "@/components/ui/use-toast";

export const showError = (error: any) => {
  return toast({
    title: "Uh oh! Something went wrong.",
    description:
      error?.response?.data || error?.message || "Something went wrong",
    duration: 3000,
    variant: "destructive",
  });
};
