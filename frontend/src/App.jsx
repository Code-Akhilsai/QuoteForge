import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/rfq" element={<Layout><RFQManagement /></Layout>} />
          <Route path="/cost-estimation" element={<Layout><CostEstimation /></Layout>} />
          <Route path="/rate-masters" element={<Layout><RateMasters /></Layout>} />
          <Route path="/quotation-history" element={<Layout><QuotationHistory /></Layout>} />
          <Route path="/approvals" element={<Layout><Approvals /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
