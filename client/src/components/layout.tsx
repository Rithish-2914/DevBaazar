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
import { Badge } from "@/components/ui/badge";
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
        <Sidebar variant="sidebar" className="border-r border-border">
          <SidebarContent>
            <div className="p-6 pb-2">
              <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded flex items-center justify-center text-lg">D</span>
                Dev Bazaar
              </h1>
            </div>
            
            <div className="px-6 py-3 mx-4 mb-4 bg-primary/5 rounded border border-primary/20 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-0.5 gap-1">
                  <Coins className="w-3 h-3" />
                  <span>{user.coins} coins</span>
                </div>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold px-6">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-3 mt-2">
                  {navItems.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className={`my-1 px-4 py-2.5 rounded transition-all ${
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <Link href={item.url} className="flex items-center gap-3 w-full">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium text-sm">{item.title}</span>
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
                className="w-full justify-start gap-3 rounded text-xs"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-16 flex items-center px-4 md:px-8 border-b border-border bg-card sticky top-0 z-30">
            <SidebarTrigger className="md:hidden mr-4" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-xs gap-1.5 flex items-center">
                <Coins className="w-3.5 h-3.5" />
                {user.coins}
              </Badge>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}