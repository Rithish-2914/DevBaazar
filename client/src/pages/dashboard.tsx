import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import { useUsers } from "@/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Users, Rocket, ArrowRight, Code, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: users, isLoading: usersLoading } = useUsers();

  const openProjects = projects?.filter(p => p.isOpen) || [];
  const recentProjects = [...openProjects].sort((a, b) => 
    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  ).slice(0, 5);

  const stats = [
    { title: "Your Balance", value: user?.coins || 0, icon: Coins, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Active Projects", value: openProjects.length, icon: Rocket, color: "text-primary", bg: "bg-primary/10" },
    { title: "Community Members", value: users?.length || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
        <p className="text-muted-foreground mt-2 text-lg">Here's what's happening in the Dev Bazaar today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-bold font-display tracking-tight text-foreground">
                  {projectsLoading || usersLoading ? "..." : stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Open Projects</h2>
            <Button variant="outline" className="rounded-xl hidden sm:flex" asChild>
              <Link href="/projects" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {projectsLoading ? (
              <div className="h-32 bg-secondary/50 rounded-2xl animate-pulse" />
            ) : recentProjects.length === 0 ? (
              <Card className="rounded-2xl border-dashed bg-secondary/30">
                <CardContent className="p-12 text-center flex flex-col items-center">
                  <Code className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-foreground">No open projects yet</p>
                  <p className="text-muted-foreground">Be the first to post a project for the community.</p>
                </CardContent>
              </Card>
            ) : (
              recentProjects.map(project => (
                <Card key={project.id} className="rounded-2xl border-border/50 hover:border-primary/30 transition-colors hover-elevate group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Open</Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
                      </div>
                      <Button className="rounded-xl shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        Contribute
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {project.createdAt ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true }) : 'Recently'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold">Top Members</h2>
          <Card className="rounded-2xl border-border/50 overflow-hidden">
            <div className="divide-y divide-border/40">
              {usersLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-12 bg-secondary/50 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                users?.slice(0, 5).map(u => (
                  <div key={u.id} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.domain || 'Developer'}</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 px-2 py-0.5 rounded-md">
                      {u.coins} c
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-secondary/20 border-t border-border/40">
              <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5 rounded-xl" asChild>
                <Link href="/community">View All Members</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
