import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VerificationWorkbench from './components/VerificationWorkbench';
import ConsultationInbox from './components/ConsultationInbox';
import KnowledgeBaseEditor from './components/KnowledgeBaseEditor';
import FarmerDirectory from './components/FarmerDirectory';
import Layout from './components/Layout';
import { Toaster } from './components/ui/sonner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [officerData, setOfficerData] = useState({
    name: '',
    region: '',
    officerId: ''
  });

  const handleLogin = (name: string, region: string, officerId: string) => {
    setIsAuthenticated(true);
    setOfficerData({ name, region, officerId });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setOfficerData({ name: '', region: '', officerId: '' });
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout officerData={officerData} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard officerData={officerData} />} />
          <Route path="verification" element={<VerificationWorkbench />} />
          <Route path="inbox" element={<ConsultationInbox />} />
          <Route path="knowledge-base" element={<KnowledgeBaseEditor />} />
          <Route path="farmers" element={<FarmerDirectory officerData={officerData} />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;