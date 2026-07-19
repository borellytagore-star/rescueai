import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/context/SettingsContext";
import { EmergencyProvider } from "@/context/EmergencyContext";
import { Navbar, Footer } from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/LoadingScreen";

const Landing = lazy(() => import("@/pages/Landing"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Emergency = lazy(() => import("@/pages/Emergency"));
const Analysis = lazy(() => import("@/pages/Analysis"));
const Hospitals = lazy(() => import("@/pages/Hospitals"));
const SOS = lazy(() => import("@/pages/SOS"));
const History = lazy(() => import("@/pages/History"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={<LoadingScreen label="Loading..." />}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/sos" element={<SOS />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      {isLanding && <Footer />}
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <EmergencyProvider>
            <BrowserRouter>
              <Shell />
            </BrowserRouter>
          </EmergencyProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
