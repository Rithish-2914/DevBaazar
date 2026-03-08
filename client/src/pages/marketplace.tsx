import { useState } from "react";
import { useMarketplaceItems, useCreateMarketplaceItem } from "@/hooks/use-marketplace";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMarketplaceItemSchema } from "@shared/schema";
import { z } from "zod";
import { Plus, Tag, Search, HandCoins, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Marketplace() {
  const { data: items, isLoading } = useMarketplaceItems();
  const { mutate: createItem, isPending } = useCreateMarketplaceItem();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof insertMarketplaceItemSchema>>({
    resolver: zodResolver(insertMarketplaceItemSchema),
    defaultValues: { title: "", description: "", type: "sale" },
  });

  const onSubmit = (data: z.infer<typeof insertMarketplaceItemSchema>) => {
    createItem(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  const forSale = items?.filter(i => i.type === 'sale') || [];
  const seeking = items?.filter(i => i.type === 'seeking') || [];

  const ItemCard = ({ item }: { item: any }) => (
    <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden">
      <div className={`h-2 w-full ${item.type === 'sale' ? 'bg-primary' : 'bg-blue-500'}`} />
      <CardHeader className="pb-3 px-6 pt-5">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
          <Badge variant={item.type === 'sale' ? "default" : "secondary"} className="shrink-0 rounded-lg shadow-sm">
            {item.type === 'sale' ? (
              <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> For Sale</span>
            ) : (
              <span className="flex items-center gap-1"><Search className="w-3 h-3"/> Seeking</span>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 flex-1">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">{item.description}</p>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-secondary/20 border-t border-border/40 flex justify-between items-center mt-auto">
        <span className="text-xs text-muted-foreground font-medium">
          {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : 'New'}
        </span>
        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10 gap-1.5">
          Connect <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <StoreIcon className="w-8 h-8 text-primary" /> Marketplace
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Trade services, tools, and skills with coins.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all h-11 px-6">
              <Plus className="w-5 h-5 mr-2" /> New Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
            <DialogHeader className="px-2 pt-2">
              <DialogTitle className="text-2xl font-display">Create Listing</DialogTitle>
              <DialogDescription>Post what you're offering or what you're looking for.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-2 pb-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${form.watch('type') === 'sale' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-border/80 text-muted-foreground'}`}
                    onClick={() => form.setValue('type', 'sale')}
                  >
                    <Tag className="w-6 h-6 mb-2" />
                    <p className="font-semibold">I'm Selling</p>
                  </div>
                  <div 
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${form.watch('type') === 'seeking' ? 'border-blue-500 bg-blue-500/5 text-blue-600' : 'border-border hover:border-border/80 text-muted-foreground'}`}
                    onClick={() => form.setValue('type', 'seeking')}
                  >
                    <Search className="w-6 h-6 mb-2" />
                    <p className="font-semibold">I'm Seeking</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Need a UI Designer for my app" className="h-11 rounded-xl" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" placeholder="Provide details about the listing..." className="min-h-[120px] rounded-xl resize-none" {...form.register("description")} />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-md" disabled={isPending}>
                {isPending ? "Posting..." : "Post Listing"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="sale" className="w-full">
        <TabsList className="bg-secondary/50 rounded-xl p-1 mb-8 w-full sm:w-auto inline-flex h-12">
          <TabsTrigger value="sale" className="rounded-lg font-medium px-8 h-full data-[state=active]:shadow-sm">
            For Sale <Badge variant="secondary" className="ml-2 bg-background">{forSale.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="seeking" className="rounded-lg font-medium px-8 h-full data-[state=active]:shadow-sm">
            Seeking <Badge variant="secondary" className="ml-2 bg-background">{seeking.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sale" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? Array(3).fill(0).map((_,i) => <div key={i} className="h-48 bg-secondary/20 rounded-2xl animate-pulse" />) 
             : forSale.map(item => <ItemCard key={item.id} item={item} />)}
            {!isLoading && forSale.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">No items for sale currently.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seeking" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? Array(3).fill(0).map((_,i) => <div key={i} className="h-48 bg-secondary/20 rounded-2xl animate-pulse" />) 
             : seeking.map(item => <ItemCard key={item.id} item={item} />)}
            {!isLoading && seeking.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">No one is seeking items right now.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Icon helper
function StoreIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
}
