# QuoteForge

### AI-Powered Manufacturing Cost Estimation & Quotation Platform

[![Live
Application](https://img.shields.io/badge/Live-Netlify-00C7B7?logo=netlify&logoColor=white)](https://quoteforge123.netlify.app)
[![Backend
API](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=white)](https://quoteforge-e9c0.onrender.com)
[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/Code-Akhilsai/QuoteForge)

QuoteForge is a web-based manufacturing RFQ, cost estimation, and
quotation management platform. It helps manufacturing teams organize
customer enquiries, extract RFQ details with AI assistance, estimate
material and machining costs, maintain centralized rate masters, and
manage quotation reviews through role-based access.

**Live application:** https://quoteforge123.netlify.app\
**Backend API:** https://quoteforge-e9c0.onrender.com\
**GitHub repository:** https://github.com/Code-Akhilsai/QuoteForge

------------------------------------------------------------------------

## Table of Contents

-   [Problem and Solution](#problem-and-solution)
-   [Key Features](#key-features)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Application Workflow](#application-workflow)
-   [AI Integration](#ai-integration)
-   [User Roles](#user-roles)
-   [Data Model](#data-model)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [Demo Accounts](#demo-accounts)
-   [Deployment](#deployment)
-   [Project Structure](#project-structure)
-   [Current Scope and Future
    Improvements](#current-scope-and-future-improvements)

------------------------------------------------------------------------

## Problem and Solution

Manufacturing quotation workflows often involve unstructured customer
enquiries, manually maintained material and machine rates, repeated cost
calculations, and approval steps. These activities can be time-consuming
and make it difficult to maintain consistent quotation data.

QuoteForge brings these activities into one application:

1.  Capture and manage customer Requests for Quotation (RFQs).
2.  Extract useful RFQ fields from unstructured text with Gemini AI
    assistance.
3.  Estimate material, machining, labour, power, freight, and
    scrap-related costs.
4.  Maintain material and machine rates in a central Rate Master.
5.  Create and track quotations with role-based review and approval.

## Key Features

### RFQ Management

-   Create and manage customer RFQs.
-   Track RFQ details, priorities, deadlines, and statuses.
-   Import RFQ information from spreadsheet files.
-   Use AI-assisted extraction to populate RFQ fields from text.

### Cost Estimation

-   Select materials and machine operations from configured rate data.
-   Calculate material and operation costs.
-   Account for labour, power, freight, and scrap-related costs.
-   Review calculated costs and volume-based pricing options.

### Quotation Management

-   Generate and manage quotations.
-   View quotation history and status.
-   Prepare AI-assisted customer quotation email drafts.
-   Route high-value quotations through the configured approval process.

### Rate Master

-   Maintain material and machine rate information.
-   Organize rate entries by type and category.
-   Restrict rate-master management to authorized roles.

### Dashboard and Access Control

-   Role-based application access.
-   Dashboard views for RFQ and quotation workflows.
-   Separate estimator, sales-head, and administrator responsibilities.

------------------------------------------------------------------------

## Technology Stack

  Layer                Technologies
  -------------------- -----------------------------------------
  Frontend             React, Vite, React Router, Tailwind CSS
  Backend              Node.js, Express.js
  Database             MongoDB Atlas, Mongoose
  Authentication       JWT, bcrypt
  AI integration       Google Gemini API
  HTTP communication   Axios
  Frontend hosting     Netlify
  Backend hosting      Render

## Architecture

QuoteForge uses a separated frontend and backend architecture.

``` text
                  ┌──────────────────────────┐
                  │       User / Browser     │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │   React + Vite Frontend  │
                  │ Dashboard, RFQs, Costing │
                  │ Rates, Quotations        │
                  └────────────┬─────────────┘
                               │ REST API
                               ▼
                  ┌──────────────────────────┐
                  │     Express Backend      │
                  │ Routes, Controllers,     │
                  │ Authentication, Services│
                  └───────┬──────────┬───────┘
                          │          │
                          ▼          ▼
                ┌──────────────┐  ┌────────────────┐
                │   MongoDB    │  │  Gemini API    │
                │ Application  │  │ RFQ extraction │
                │ data         │  │ Costing advice │
                └──────────────┘  │ Email drafting │
                                  └────────────────┘
```

-   The React frontend communicates with the backend through REST API
    endpoints.
-   The Express backend handles authentication, business logic,
    validation, and database operations.
-   MongoDB stores user, RFQ, quotation, and rate-master records.
-   Gemini API calls are made by the backend; the Gemini API key should
    not be exposed in frontend code.
-   The frontend and backend are deployed independently.

## Application Workflow

1.  **RFQ intake:** A user creates an RFQ manually, imports spreadsheet
    data, or provides unstructured enquiry text.
2.  **AI-assisted extraction:** The backend sends supported text to
    Gemini and uses the returned structured data to assist with RFQ
    entry. The user can review and edit the extracted fields.
3.  **Cost estimation:** An estimator selects material and machine-rate
    entries, enters the required production details, and reviews the
    calculated costs.
4.  **Quotation:** The user creates a quotation from the estimation
    workflow and tracks it in quotation history.
5.  **Review:** Quotations that meet the configured high-value threshold
    follow the sales-head/admin approval rules implemented by the
    application.

## AI Integration

QuoteForge integrates the Google Gemini API through a backend service.

The AI functionality supports:

-   **RFQ extraction:** Extracts standardized RFQ information from
    unstructured text.
-   **Costing suggestions:** Suggests costing-related assumptions such
    as scrap percentage, margins, and cycle-time guidance.
-   **Quotation drafting:** Produces a customer-facing quotation email
    draft using the supplied quotation information.

AI output is intended to assist users, not replace their review. Users
should verify extracted details and costing suggestions before relying
on them. The application should use the configured Gemini model and API
key on the backend.

## User Roles

  -----------------------------------------------------------------------
  Role                                Main responsibilities
  ----------------------------------- -----------------------------------
  Estimator                           Work with RFQs, use AI-assisted
                                      extraction, perform cost
                                      estimation, and prepare draft
                                      quotations.

  Sales Head                          Review the quotation pipeline and
                                      handle the configured high-value
                                      quotation approval workflow.

  System Admin                        Access administrative
                                      functionality, including
                                      rate-master management and user
                                      access controls.
  -----------------------------------------------------------------------

The application includes a high-value quotation approval rule configured
around **₹25,00,000**. Refer to the backend authorization logic for the
exact conditions applied to status changes.

## Data Model

The main MongoDB collections are:

  -----------------------------------------------------------------------
  Collection                          Purpose
  ----------------------------------- -----------------------------------
  `User`                              User account details, password
                                      hash, role, and account status.

  `RFQ`                               RFQ number, customer and product
                                      details, quantity, status,
                                      priority, deadline, and creator
                                      reference.

  `RateMaster`                        Material and machine rate entries,
                                      units, categories, and effective
                                      dates.

  `Quotation`                         Quotation number,
                                      RFQ/customer/product details, cost
                                      information, status, validity, and
                                      creator reference.
  -----------------------------------------------------------------------

Mongoose models define the application data structures and validation.

------------------------------------------------------------------------

## Getting Started

### Prerequisites

-   Node.js 18 or later (Node.js 20+ recommended)
-   npm 9 or later
-   MongoDB local instance or MongoDB Atlas database
-   Google Gemini API key from [Google AI
    Studio](https://aistudio.google.com/)

### 1. Clone the repository

``` bash
git clone https://github.com/Code-Akhilsai/QuoteForge.git
cd QuoteForge
```

### 2. Configure and run the backend

``` bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

``` env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

Seed the demo users:

``` bash
npm run seed
```

Start the backend:

``` bash
npm run dev
```

The backend will be available at:

``` text
http://localhost:3000
```

### 3. Configure and run the frontend

Open a second terminal:

``` bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

``` env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

``` bash
npm run dev
```

Open the local application at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## Environment Variables

### Backend

  Variable           Description
  ------------------ -------------------------------------------------
  `PORT`             Port used by the Express server.
  `MONGO_URI`        MongoDB connection string.
  `JWT_SECRET`       Secret used to sign and verify JWTs.
  `JWT_EXPIRE`       JWT expiration duration.
  `CLIENT_URL`       Frontend origin configured for the application.
  `GEMINI_API_KEY`   Google Gemini API key.
  `GEMINI_MODEL`     Gemini model identifier.
  `NODE_ENV`         Runtime environment, such as `production`.

### Frontend

  -----------------------------------------------------------------------
  Variable                            Description
  ----------------------------------- -----------------------------------
  `VITE_API_URL`                      Base URL of the backend API,
                                      including the `/api` path.

  -----------------------------------------------------------------------

Do not commit real API keys, database credentials, or JWT secrets to the
repository.

## Demo Accounts

The following seeded accounts are available for evaluation:

  Role           Email                       Password
  -------------- --------------------------- ----------------
  Estimator      `estimator@quoteforge.in`   `estimator123`
  Sales Head     `saleshead@quoteforge.in`   `saleshead123`
  System Admin   `admin@quoteforge.in`       `admin123`

You can also use the **Demo Accounts** option on the login screen, if
available in the deployed version.

**Security note:** These are evaluation credentials only. Do not use the
seeded demo passwords in a production environment. Change or disable
demo accounts before using the application with real business data.

## Deployment

QuoteForge is deployed as two separate services:

### Frontend --- Netlify

-   **Live URL:** https://quoteforge123.netlify.app
-   **Build command:** `npm run build`
-   **Publish directory:** `dist`
-   **Frontend environment variable:** `VITE_API_URL`
-   Set `VITE_API_URL` to the production backend API base URL.

### Backend --- Render

-   **API URL:** https://quoteforge-e9c0.onrender.com
-   **Build command:** `npm install`
-   **Start command:** `npm start`
-   Configure the backend environment variables listed above in the
    Render service settings.
-   Set `CLIENT_URL` to the deployed frontend origin.

The repository's deployment configuration should be used as the source
of truth for any provider-specific settings.

## Project Structure

``` text
QuoteForge/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers and application logic
│   ├── middleware/      # Authentication and authorization middleware
│   ├── models/          # Mongoose data models
│   ├── routes/          # REST API routes
│   ├── services/        # Gemini integration and supporting services
│   ├── .env.example     # Backend environment template
│   ├── seed.js          # Demo account seeding
│   └── server.js        # Express application entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/         # API client and request modules
│   │   ├── components/  # Shared UI and layout components
│   │   ├── context/     # Application context and authentication state
│   │   ├── pages/       # Application screens
│   │   └── utils/       # Frontend helper functions
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

## Current Scope and Future Improvements

The current project focuses on the core RFQ-to-quotation workflow. The
following items are possible future enhancements:

-   Branded PDF quotation export with company letterhead and signature
    blocks.
-   Win/loss analytics based on historical quotation data.
-   ERP integration with systems such as SAP, Tally, or ERPNext.
-   Audit trail and quotation version history.
-   Direct email dispatch after human review and approval.
-   Advanced CAD/STEP file parsing for automated part analysis.

------------------------------------------------------------------------

## License

No license information is specified here. Refer to the repository for
licensing details.
