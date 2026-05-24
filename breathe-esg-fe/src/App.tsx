import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthGate } from "@/components/auth/AuthGate";
import { RouteFallback } from "@/components/RouteFallback";
import { queryClient } from "@/lib/query-client";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const AppLayout = lazy(() =>
  import("@/layouts/AppLayout").then((m) => ({ default: m.AppLayout }))
);

const DashboardPage = lazy(() => import("@/pages/app/DashboardPage"));
const UploadPage = lazy(() => import("@/pages/app/UploadPage"));
const ReviewPage = lazy(() => import("@/pages/app/ReviewPage"));
const AuditPage = lazy(() => import("@/pages/app/AuditPage"));
const SourcesPage = lazy(() => import("@/pages/app/SourcesPage"));
const SettingsPage = lazy(() => import("@/pages/app/SettingsPage"));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/app"
              element={
                <AuthGate>
                  <AppLayout />
                </AuthGate>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="audit" element={<AuditPage />} />
              <Route path="sources" element={<SourcesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
