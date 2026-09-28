import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import PublicLayout from './components/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import TrustLayout from './components/trust/TrustLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import TrustsListPage from './pages/TrustsListPage';
import TrustDetailPage from './pages/TrustDetailPage';
import DonatePage from './pages/DonatePage';
import AboutPage from './pages/AboutPage';

// Trust Public Auth Pages
import TrustLogin from './pages/trust/TrustLogin';
import TrustRegister from './pages/trust/TrustRegister';

// Trust Protected Portal Pages
import TrustDashboard from './pages/trust/TrustDashboard';
import TrustCampaigns from './pages/trust/TrustCampaigns';
import TrustAddCause from './pages/trust/TrustAddCause';
import TrustDonations from './pages/trust/TrustDonations';
import TrustImpactUpdates from './pages/trust/TrustImpactUpdates';
import TrustProfile from './pages/trust/TrustProfile';
import TrustDocuments from './pages/trust/TrustDocuments';
import TrustSettings from './pages/trust/TrustSettings';

// Admin Private Auth
import AdminLogin from './pages/admin/AdminLogin';

// Admin Protected Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTrusts from './pages/admin/AdminTrusts';
import AdminCreateTrust from './pages/admin/AdminCreateTrust';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminCreateCampaign from './pages/admin/AdminCreateCampaign';
import AdminDonations from './pages/admin/AdminDonations';
import AdminImpactUpdates from './pages/admin/AdminImpactUpdates';
import AdminReports from './pages/admin/AdminReports';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ============================================================ */}
        {/* PUBLIC WEBSITE EXPERIENCE (With Public Navbar & Footer)      */}
        {/* ============================================================ */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/trusts" element={<TrustsListPage />} />
          <Route path="/trusts/:id" element={<TrustDetailPage />} />
          <Route path="/donate/:id" element={<DonatePage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Standalone Trust Public Authentication Pages */}
          <Route path="/trust/login" element={<TrustLogin />} />
          <Route path="/trust/register" element={<TrustRegister />} />
        </Route>

        {/* Private Unlinked Admin Login */}
        <Route path="/secure-admin-login" element={<AdminLogin />} />

        {/* ============================================================ */}
        {/* TRUST PORTAL EXPERIENCE (Dedicated Layout - NO Public Nav)   */}
        {/* ============================================================ */}
        <Route element={<ProtectedRoute allowedRoles={['trust']} />}>
          <Route path="/trust" element={<TrustLayout />}>
            <Route index element={<Navigate to="/trust/dashboard" replace />} />
            <Route path="dashboard" element={<TrustDashboard />} />
            <Route path="campaigns" element={<TrustCampaigns />} />
            <Route path="add-cause" element={<TrustAddCause />} />
            <Route path="donations" element={<TrustDonations />} />
            <Route path="impact-updates" element={<TrustImpactUpdates />} />
            <Route path="profile" element={<TrustProfile />} />
            <Route path="documents" element={<TrustDocuments />} />
            <Route path="settings" element={<TrustSettings />} />
          </Route>
        </Route>

        {/* ============================================================ */}
        {/* ADMIN PORTAL EXPERIENCE (Dedicated Layout - NO Public Nav)   */}
        {/* ============================================================ */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="trusts" element={<AdminTrusts />} />
            <Route path="create-trust" element={<AdminCreateTrust />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="create-campaign" element={<AdminCreateCampaign />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="impact-updates" element={<AdminImpactUpdates />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
