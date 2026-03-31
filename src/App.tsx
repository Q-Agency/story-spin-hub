import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import DiscoverPage from "./pages/DiscoverPage.tsx";
import ContentList from "./pages/ContentList.tsx";
import ContentEditor from "./pages/ContentEditor.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";
import AnalyticsPage from "./pages/AnalyticsPage.tsx";
import BrandSettingsPage from "./pages/BrandSettingsPage.tsx";
import IntegrationsPage from "./pages/IntegrationsPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/content" element={<ContentList />} />
          <Route path="/content/:id" element={<ContentEditor />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/brand-settings" element={<BrandSettingsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
