import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Generator from "@/pages/generator";
import PackDetail from "@/pages/pack-detail";
import ImageView from "@/pages/image-view";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/generate" component={Generator}/>
      <Route path="/pack/:id" component={PackDetail}/>
      <Route path="/view/:id" component={ImageView}/>
      {/* Fallback to 404 */}
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
