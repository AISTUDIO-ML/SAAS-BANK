import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import CryptoSubscriptions from "./pages/CryptoSubscriptions";
import StripeSubscriptions from "./pages/StripeSubscriptions";
import AdminStreamDashboard from "./pages/AdminStreamDashboard";
import CryptoIntegrationGuide from "./components/CryptoIntegrationGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/crypto-subscriptions" element={<CryptoSubscriptions />} />
                <Route path="/subscriptions" element={<StripeSubscriptions />} />
                <Route path="/admin/streams" element={<AdminStreamDashboard />} />
                <Route path="/guide" element={<CryptoIntegrationGuide />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>);

}

export default App;