import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import RFQManagement from "@/pages/RFQManagement";
import CostEstimation from "@/pages/CostEstimation";
import RateMasters from "@/pages/RateMasters";
import QuotationHistory from "@/pages/QuotationHistory";
import Approvals from "@/pages/Approvals";
import Login from "@/pages/Login";
import { ROUTES } from "@/utils/helpers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: ROUTES.RFQ_MANAGEMENT,
    element: (
      <Layout>
        <RFQManagement />
      </Layout>
    ),
  },
  {
    path: ROUTES.COST_ESTIMATION,
    element: (
      <Layout>
        <CostEstimation />
      </Layout>
    ),
  },
  {
    path: ROUTES.RATE_MASTERS,
    element: (
      <Layout>
        <RateMasters />
      </Layout>
    ),
  },
  {
    path: ROUTES.QUOTATION_HISTORY,
    element: (
      <Layout>
        <QuotationHistory />
      </Layout>
    ),
  },
  {
    path: ROUTES.APPROVALS,
    element: (
      <Layout>
        <Approvals />
      </Layout>
    ),
  },
]);

export default router;
