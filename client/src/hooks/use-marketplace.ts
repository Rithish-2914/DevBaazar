import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { MarketplaceItem, InsertMarketplaceItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useMarketplaceItems() {
  return useQuery<MarketplaceItem[]>({
    queryKey: [api.marketplace.list.path],
    queryFn: async () => {
      const res = await fetch(api.marketplace.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch marketplace items");
      return res.json();
    },
  });
}

export function useCreateMarketplaceItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertMarketplaceItem) => {
      const res = await fetch(api.marketplace.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create listing");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.marketplace.list.path] });
      toast({ title: "Listing created!", description: "Your item is now in the marketplace." });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
    },
  });
}
