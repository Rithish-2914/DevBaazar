import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, MapPin, Mail, Code2, Coins, Calendar, Edit3 } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Cover & Avatar Header */}
      <Card className="rounded-[2rem] overflow-hidden border-none shadow-lg">
        <div className="h-48 md:h-64 bg-primary/20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/40 via-primary/20 to-background relative">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        <CardContent className="px-6 md:px-12 pb-12 relative -mt-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end">
            
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-card border-[6px] border-card shadow-xl flex items-center justify-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl font-display font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Title & Actions */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">{user.name}</h1>
                  <p className="text-lg text-muted-foreground font-medium mt-1">@{user.username}</p>
                </div>
                <div className="flex gap-3">
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 px-4 py-2 text-sm rounded-xl shadow-sm flex items-center gap-2">
                    <Coins className="w-4 h-4"/> {user.coins} Balance
                  </Badge>
                  <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-border/60">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-[2rem] border-border/50 shadow-sm">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display mb-4 text-foreground flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary" /> About
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  Passionate developer focused on {user.domain || 'building great software'}. 
                  Active member of the Dev Bazaar community since {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'recently'}.
                </p>
              </div>

              <div className="pt-6 border-t border-border/40">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Core Skills
                </h3>
                {user.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.split(',').map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-secondary/60 hover:bg-secondary text-secondary-foreground rounded-lg px-4 py-1.5 text-[13px] font-medium shadow-sm">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-6">
              
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Focus Area</h3>
                <Badge variant="default" className="w-full justify-center bg-primary/10 text-primary hover:bg-primary/20 border-0 rounded-xl py-2.5 text-sm">
                  {user.domain || 'General Tech'}
                </Badge>
              </div>

              <div className="pt-6 border-t border-border/40 space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Connect</h3>
                
                {user.linkedin && (
                  <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-foreground group transition-colors border border-transparent hover:border-blue-100">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-blue-700">LinkedIn Profile</span>
                  </a>
                )}

                {user.instagram && (
                  <a href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 text-foreground group transition-colors border border-transparent hover:border-pink-100">
                    <div className="bg-pink-100 text-pink-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-pink-700">Instagram</span>
                  </a>
                )}

                {!user.linkedin && !user.instagram && (
                  <p className="text-sm text-muted-foreground py-2">No social links added.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
