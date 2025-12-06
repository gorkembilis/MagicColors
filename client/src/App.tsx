import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { SoundProvider } from "@/lib/sounds";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Generator from "@/pages/generator";
import PackDetail from "@/pages/pack-detail";
import ImageView from "@/pages/image-view";
import Gallery from "@/pages/gallery";
import Premium from "@/pages/premium";
import Auth from "@/pages/auth";
import Onboarding from "@/pages/onboarding";
import Coloring from "@/pages/coloring";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Contests from "@/pages/contests";
import Admin from "@/pages/admin";

function OnboardingGuard() {
  const hasCompletedOnboarding = localStorage.getItem("magiccolors_onboarding_complete") === "true";
  
  if (!hasCompletedOnboarding) {
    return <Redirect to="/onboarding" />;
  }
  
  return <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={OnboardingGuard}/>
      <Route path="/onboarding" component={Onboarding}/>
      <Route path="/generate" component={Generator}/>
      <Route path="/auth" component={Auth}/>
      <Route path="/mc-management-2024" component={Admin}/>
      <Route path="/pack/:id" component={PackDetail}/>
      <Route path="/view/:id" component={ImageView}/>
      <Route path="/coloring/:id" component={Coloring}/>
      <Route path="/gallery" component={Gallery}/>
      <Route path="/premium" component={Premium}/>
      <Route path="/settings" component={Settings}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/contests" component={Contests}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <I18nProvider>
      <SoundProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </SoundProvider>
    </I18nProvider>
  );
}

export default App;
