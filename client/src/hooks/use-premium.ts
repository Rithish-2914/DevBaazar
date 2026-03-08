import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { PremiumContent, InsertPremiumContent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePremiumContent() {
  return useQuery<PremiumContent[]>({
    queryKey: [api.premiumContent.list.path],
    queryFn: async () => {
      const res = await fetch(api.premiumContent.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch premium content");
      return res.json();
    },
  });
}

export function useCreatePremiumContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertPremiumContent) => {
      const res = await fetch(api.premiumContent.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create premium content");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.premiumContent.list.path] });
      toast({ title: "Content published!", description: "Your premium content is now live." });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to publish", description: error.message, variant: "destructive" });
    },
  });
}
