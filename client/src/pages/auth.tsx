import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertUserSchema } from "@shared/schema";
import { Loader2, Code2 } from "lucide-react";
import { useLocation } from "wouter";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      domain: "",
      skills: "",
      linkedin: "",
      instagram: "",
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary/20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-background to-background relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-card rounded-[2rem] shadow-2xl overflow-hidden z-10 border border-white/50">
        
        {/* Branding Section */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-primary text-primary-foreground md:w-[45%] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl border border-white/30">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold font-display mb-4 leading-tight">Join the<br/>Dev Bazaar.</h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Connect with developers, share your projects, and access premium resources in our exclusive community.
            </p>
          </div>
        </div>

        {/* Forms Section */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/50 rounded-xl p-1">
              <TabsTrigger value="login" className="rounded-lg font-medium text-base py-2.5">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg font-medium text-base py-2.5">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground font-display">Welcome back</h2>
                <p className="text-muted-foreground mt-1 text-sm">Enter your credentials to access your account</p>
              </div>
              <form onSubmit={loginForm.handleSubmit((d) => login(d))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input 
                    id="login-username" 
                    placeholder="developer123" 
                    className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:bg-card transition-colors"
                    {...loginForm.register("username")} 
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:bg-card transition-colors"
                    {...loginForm.register("password")} 
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4" disabled={isLoggingIn}>
                  {isLoggingIn ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground font-display">Create Account</h2>
                <p className="text-muted-foreground mt-1 text-sm">Join the community and start building</p>
              </div>
              <form onSubmit={registerForm.handleSubmit((d) => register(d))} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input id="reg-name" placeholder="John Doe" className="h-11 rounded-xl" {...registerForm.register("name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <Input id="reg-username" placeholder="johndoe" className="h-11 rounded-xl" {...registerForm.register("username")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" className="h-11 rounded-xl" {...registerForm.register("password")} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-domain">Domain</Label>
                    <Input id="reg-domain" placeholder="e.g. Web Development" className="h-11 rounded-xl" {...registerForm.register("domain")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-skills">Top Skills</Label>
                    <Input id="reg-skills" placeholder="React, Node, UI/UX" className="h-11 rounded-xl" {...registerForm.register("skills")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-linkedin">LinkedIn (Optional)</Label>
                    <Input id="reg-linkedin" placeholder="linkedin.com/in/..." className="h-11 rounded-xl" {...registerForm.register("linkedin")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-insta">Instagram (Optional)</Label>
                    <Input id="reg-insta" placeholder="@handle" className="h-11 rounded-xl" {...registerForm.register("instagram")} />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all mt-6" disabled={isRegistering}>
                  {isRegistering ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
