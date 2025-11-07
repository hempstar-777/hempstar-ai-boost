import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { SecurityWrapper } from "@/components/SecurityWrapper";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from 'react';
import { watchdogManager } from './utils/watchdog/WatchdogManager';
import { hivemind } from './lib/hivemind';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize watchdogs when app starts
    watchdogManager.startAll();
    
    // Register with HiveMind only in local development to avoid failed calls in preview/prod
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocal) {
      hivemind.registerApp().then(() => {
        console.log('🤝 Connected to HiveMind');
      });
    } else {
      console.log('🧠 HiveMind registration skipped (non-local environment)');
    }
    
    // Also setup global error handling for network failures
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          watchdogManager.recordNetworkFailure();
        }
        return response;
      } catch (error) {
        watchdogManager.recordNetworkFailure();
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SecurityWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SecurityWrapper>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
