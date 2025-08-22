import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import Assets from "./pages/Assets";
import WorkOrders from "./pages/WorkOrders";
import Interventions from "./pages/Interventions";
import Plannings from "./pages/Plannings";
import Rapports from "./pages/Rapports";
import Archive from "./pages/Archive";
import Activity from "./pages/Activity";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import ChefOperateur from "./pages/ChefOperateur";
import ChefTechnicien from "./pages/ChefTechnicien";
import Technicien from "./pages/Technicien";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/assets" element={<Assets />} />
          <Route path="/admin/work-orders" element={<WorkOrders />} />
          <Route path="/admin/interventions" element={<Interventions />} />
          <Route path="/admin/plannings" element={<Plannings />} />
          <Route path="/admin/rapports" element={<Rapports />} />
          <Route path="/admin/archive" element={<Archive />} />
          <Route path="/admin/activity" element={<Activity />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/chef-operateur" element={<ChefOperateur />} />
          <Route path="/chef-technicien" element={<ChefTechnicien />} />
          <Route path="/technicien" element={<Technicien />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
