import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, Store, Gem, User as UserIcon, Coins } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Community", url: "/community", icon: Users },
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "Premium Content", url: "/premium", icon: Gem },
  { title: "My Profile", url: "/profile", icon: UserIcon },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar variant="sidebar" className="border-r border-border/50 bg-card">
          <SidebarContent>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-primary font-display tracking-tight flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center text-lg">D</span>
                Dev Bazaar
              </h1>
            </div>
            
            <div className="px-6 py-4 mx-4 mb-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-0.5 gap-1 font-medium">
                  <Coins className="w-3 h-3 text-amber-500" />
                  {user.coins} coins
                </div>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-6">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-3 mt-2">
                  {navItems.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className={`my-1 px-4 py-5 rounded-xl transition-all duration-200 ${
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground hover-elevate"
                          }`}
                        >
                          <Link href={item.url} className="flex items-center gap-3 w-full">
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium text-[15px]">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 rounded-xl border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-16 flex items-center px-4 md:px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
            <SidebarTrigger className="md:hidden mr-4" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1.5 rounded-full font-medium flex items-center gap-2 bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Coins className="w-4 h-4" />
                Balance: {user.coins}
              </Badge>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// Inline Badge component to avoid creating extra files if not strictly needed, 
// but since we can use UI components, I will mock a quick local one just in case the generic one is weird.
// Wait, I should assume standard Shadcn components exist. I will just import it.
import { Badge } from "@/components/ui/badge";
