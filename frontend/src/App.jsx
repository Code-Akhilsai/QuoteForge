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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import "./App.css";

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
          <Route path="/rate-masters" element={<ProtectedRoute allowedRoles={["admin", "sales_head"]}><Layout><RateMasters /></Layout></ProtectedRoute>} />
          <Route path="/quotation-history" element={<ProtectedRoute><Layout><QuotationHistory /></Layout></ProtectedRoute>} />
          <Route path="/approvals" element={<ProtectedRoute allowedRoles={["admin", "sales_head"]}><Layout><Approvals /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;