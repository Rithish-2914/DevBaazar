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
import { Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center bg-primary/5">
            <CardTitle className="text-3xl">Dev Bazaar</CardTitle>
            <CardDescription>Connect, Share, Build Together</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit((d) => login(d))} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input 
                      id="login-username" 
                      placeholder="developer123" 
                      {...loginForm.register("username")} 
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••" 
                      {...loginForm.register("password")} 
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit((d) => register(d))} className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input id="reg-name" placeholder="John Doe" {...registerForm.register("name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <Input id="reg-username" placeholder="johndoe" {...registerForm.register("username")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" {...registerForm.register("password")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-domain">Domain</Label>
                    <Input id="reg-domain" placeholder="Web Development" {...registerForm.register("domain")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-skills">Top Skills</Label>
                    <Input id="reg-skills" placeholder="React, Node, UI/UX" {...registerForm.register("skills")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-linkedin">LinkedIn</Label>
                    <Input id="reg-linkedin" placeholder="linkedin.com/in/..." {...registerForm.register("linkedin")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-instagram">Instagram</Label>
                    <Input id="reg-instagram" placeholder="@handle" {...registerForm.register("instagram")} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isRegistering}>
                    {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}