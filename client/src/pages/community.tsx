import { useUsers } from "@/hooks/use-users";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Instagram, MapPin, Globe, Code2 } from "lucide-react";

export default function Community() {
  const { data: users, isLoading } = useUsers();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Community</h1>
        <p className="text-muted-foreground mt-2 text-lg">Connect with talented developers and designers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="rounded-2xl h-[280px] bg-secondary/20 animate-pulse border-none" />
          ))
        ) : (
          users?.map((user) => (
            <Card key={user.id} className="rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
              <div className="h-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-sm overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl font-display font-bold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-14 pb-6 px-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                      <Globe className="w-3.5 h-3.5" />
                      {user.domain || "Enthusiast"}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 shadow-sm">
                    {user.coins} coins
                  </Badge>
                </div>

                <div className="space-y-4">
                  {user.skills && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" /> Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.skills.split(',').map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary rounded-md font-medium text-xs py-0.5 px-2">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-border/40 mt-4">
                    {user.linkedin && (
                      <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {user.instagram && (
                      <a href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-pink-50">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
