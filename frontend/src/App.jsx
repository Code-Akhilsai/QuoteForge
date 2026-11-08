import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import Layout from "@/components/layout/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import RFQManagement from "@/pages/RFQManagement";
import CostEstimation from "@/pages/CostEstimation";
import RateMasters from "@/pages/RateMasters";
import QuotationHistory from "@/pages/QuotationHistory";
import Approvals from "@/pages/Approvals";
import { useAuth } from "@/hooks/useAuth";
import "./App.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/rfq" element={<ProtectedRoute><Layout><RFQManagement /></Layout></ProtectedRoute>} />
          <Route path="/cost-estimation" element={<ProtectedRoute><Layout><CostEstimation /></Layout></ProtectedRoute>} />
          <Route path="/rate-masters" element={<ProtectedRoute><Layout><RateMasters /></Layout></ProtectedRoute>} />
          <Route path="/quotation-history" element={<ProtectedRoute><Layout><QuotationHistory /></Layout></ProtectedRoute>} />
          <Route path="/approvals" element={<ProtectedRoute><Layout><Approvals /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
