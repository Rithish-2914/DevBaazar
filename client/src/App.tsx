import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components
import { AppLayout } from "@/components/layout";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Community from "@/pages/community";
import Marketplace from "@/pages/marketplace";
import Premium from "@/pages/premium";
import Profile from "@/pages/profile";

// Authentication Wrapper
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth if not logged in. Note: useLocation setter inside render 
    // is technically an anti-pattern but works cleanly in simple wouter setups.
    // Setting a timeout prevents React state update warnings during render.
    setTimeout(() => setLocation("/auth"), 0);
    return null;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" render={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/community" render={() => <ProtectedRoute component={Community} />} />
      <Route path="/marketplace" render={() => <ProtectedRoute component={Marketplace} />} />
      <Route path="/premium" render={() => <ProtectedRoute component={Premium} />} />
      <Route path="/profile" render={() => <ProtectedRoute component={Profile} />} />
      
      {/* Provide an empty project page route to prevent 404 from dashboard links */}
      <Route path="/projects" render={() => <ProtectedRoute component={Dashboard} />} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
