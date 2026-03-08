import { useState } from "react";
import { usePremiumContent, useCreatePremiumContent } from "@/hooks/use-premium";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPremiumContentSchema } from "@shared/schema";
import { z } from "zod";
import { Lock, Unlock, Plus, Gem, Coins, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Premium() {
  const { data: content, isLoading } = usePremiumContent();
  const { mutate: createContent, isPending } = useCreatePremiumContent();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<number[]>([]);

  const schema = insertPremiumContentSchema.extend({
    cost: z.coerce.number().min(1, "Cost must be at least 1 coin"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", content: "", cost: 50 },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    createContent(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  const handleUnlock = (item: any) => {
    if ((user?.coins || 0) < item.cost) {
      toast({ title: "Not enough coins", description: "You need more coins to unlock this content.", variant: "destructive" });
      return;
    }
    // Simulate unlock (since schema doesn't have an unlock endpoint specified)
    setUnlockedItems(prev => [...prev, item.id]);
    toast({ title: "Content Unlocked!", description: `Enjoy reading "${item.title}".` });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 rounded-[2rem] border border-white/50 shadow-inner relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-primary/5 opacity-50 transform rotate-12">
          <Gem className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-indigo-500 text-white hover:bg-indigo-600 mb-4 rounded-md shadow-sm border-0 px-3 py-1">Premium</Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Exclusive Content</h1>
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
            Unlock high-quality tutorials, boilerplate code, and specialized knowledge using your Dev Bazaar coins.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all h-12 px-6 text-white relative z-10 border-0">
              <Plus className="w-5 h-5 mr-2" /> Publish Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-[2rem]">
            <DialogHeader className="px-2 pt-2">
              <DialogTitle className="text-2xl font-display flex items-center gap-2">
                <Gem className="w-6 h-6 text-indigo-500" /> Publish Premium
              </DialogTitle>
              <DialogDescription>Share valuable content and earn coins when others unlock it.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-2 pb-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Advanced React Patterns Guide" className="h-11 rounded-xl" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Short Description (Public)</Label>
                <Textarea id="desc" placeholder="What will users learn?" className="h-20 rounded-xl resize-none" {...form.register("description")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Full Content (Hidden until unlocked)</Label>
                <Textarea id="content" placeholder="Write your premium content here..." className="min-h-[200px] rounded-xl font-mono text-sm resize-y" {...form.register("content")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Unlock Cost (Coins)</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
                  <Input id="cost" type="number" className="h-11 rounded-xl pl-10 text-lg font-semibold text-amber-600" {...form.register("cost")} />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isPending}>
                {isPending ? "Publishing..." : "Publish to Premium"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-secondary/30 rounded-[2rem] animate-pulse" />)
        ) : content?.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground border-2 border-dashed rounded-[2rem]">No premium content available yet.</div>
        ) : (
          content?.map(item => {
            const isUnlocked = unlockedItems.includes(item.id) || item.authorId === user?.id;
            
            return (
              <Card key={item.id} className={`rounded-[2rem] border overflow-hidden transition-all duration-300 ${isUnlocked ? 'border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'border-border/60 hover:border-primary/30 hover:shadow-md'}`}>
                <div className={`p-8 ${isUnlocked ? 'bg-indigo-50/30' : 'bg-card'}`}>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0 shadow-none"><Unlock className="w-3 h-3 mr-1"/> Unlocked</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-secondary text-muted-foreground shadow-none"><Lock className="w-3 h-3 mr-1"/> Locked</Badge>
                        )}
                        <h3 className="text-2xl font-bold font-display leading-tight">{item.title}</h3>
                      </div>
                    </div>
                    {!isUnlocked && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-sm shrink-0 px-3 py-1.5 text-sm font-bold flex items-center gap-1.5">
                        <Coins className="w-4 h-4"/> {item.cost}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">{item.description}</p>
                  
                  {isUnlocked ? (
                    <div className="bg-card border border-indigo-100 rounded-xl p-6 relative">
                      <div className="absolute -top-3 -left-3 bg-indigo-500 text-white p-2 rounded-lg shadow-sm">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="prose prose-sm max-w-none text-foreground prose-p:leading-relaxed whitespace-pre-wrap font-serif mt-2">
                        {item.content}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10 rounded-xl" />
                      <div className="bg-secondary/20 border border-dashed rounded-xl p-6 filter blur-[2px] opacity-60">
                        <p className="font-mono text-sm text-muted-foreground">const unlock_premium = async () ={'>'} {'{\n'}  // Hidden valuable content here...\n  await learnNewSkills();\n{'}'}</p>
                      </div>
                      <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <Button 
                          onClick={() => handleUnlock(item)}
                          className="rounded-xl shadow-xl shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 hover:-translate-y-0.5 transition-all"
                        >
                          <Unlock className="w-4 h-4 mr-2" /> Unlock for {item.cost} Coins
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
