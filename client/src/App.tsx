import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Generator from "@/pages/generator";
import PackDetail from "@/pages/pack-detail";
import ImageView from "@/pages/image-view";
import Gallery from "@/pages/gallery";
import Premium from "@/pages/premium";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/generate" component={Generator}/>
      <Route path="/pack/:id" component={PackDetail}/>
      <Route path="/view/:id" component={ImageView}/>
      <Route path="/gallery" component={Gallery}/>
      <Route path="/premium" component={Premium}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}

export default App;
