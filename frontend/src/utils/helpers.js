import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateQuotationNumber() {
  const prefix = "QT";
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
}

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  RFQ_MANAGEMENT: "/rfq",
  COST_ESTIMATION: "/cost-estimation",
  RATE_MASTERS: "/rate-masters",
  QUOTATION_HISTORY: "/quotation-history",
  APPROVALS: "/approvals",
};

export const ROLES = {
  ADMIN: "admin",
  SALES_HEAD: "sales_head",
  ESTIMATOR: "estimator",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard", roles: [ROLES.ADMIN, ROLES.SALES_HEAD, ROLES.ESTIMATOR] },
  { label: "RFQ Management", href: ROUTES.RFQ_MANAGEMENT, icon: "FileText", roles: [ROLES.ADMIN, ROLES.SALES_HEAD, ROLES.ESTIMATOR] },
  { label: "Cost Estimation", href: ROUTES.COST_ESTIMATION, icon: "Calculator", roles: [ROLES.ADMIN, ROLES.SALES_HEAD, ROLES.ESTIMATOR] },
  { label: "Rate Masters", href: ROUTES.RATE_MASTERS, icon: "Sliders", roles: [ROLES.ADMIN, ROLES.SALES_HEAD] },
  { label: "Quotation History", href: ROUTES.QUOTATION_HISTORY, icon: "History", roles: [ROLES.ADMIN, ROLES.SALES_HEAD, ROLES.ESTIMATOR] },
  { label: "Approvals", href: ROUTES.APPROVALS, icon: "CheckCircle2", roles: [ROLES.ADMIN, ROLES.SALES_HEAD] },
];
