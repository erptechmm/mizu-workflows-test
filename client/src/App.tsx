import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset 
} from "@/components/ui/sidebar";
import { GitBranch, FileText, Settings, HelpCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SalesWorkflows from "@/pages/sales-workflows";
import ReplitToVercel from "@/pages/replit-to-vercel";

function AppSidebar() {
  const [location] = useLocation();
  const [techWorkflowsOpen, setTechWorkflowsOpen] = useState(false);
  
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold text-sidebar-foreground px-2 py-1">Navigation</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location === "/"}>
              <Link href="/">
                <GitBranch />
                <span>Git Replace Command</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location === "/sales-workflows"}>
              <Link href="/sales-workflows">
                <FileText />
                <span>Sales Workflows</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setTechWorkflowsOpen(!techWorkflowsOpen)}
              isActive={location === "/replit-to-vercel"}
            >
              <Settings />
              <span>Tech Workflows</span>
              <ChevronRight className={`ml-auto transition-transform ${techWorkflowsOpen ? 'rotate-90' : ''}`} />
            </SidebarMenuButton>
            {techWorkflowsOpen && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={location === "/replit-to-vercel"}>
                    <Link href="/replit-to-vercel">
                      <span>Replit Made to Vercel Ready</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle />
              <span>Add-hocs Workflows</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sales-workflows" component={SalesWorkflows} />
      <Route path="/replit-to-vercel" component={ReplitToVercel} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Toaster />
            <Router />
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
