import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./app/components/Navbar";
import HomePage from "./app/pages/HomePage";
import AboutUsPage from "./app/pages/AboutUsPage";
import FeedbackPage from "./app/pages/FeedbackPage";
import ContactUsPage from "./app/pages/ContactUsPage";
import PestDetailsPage from "./app/pages/PestDetailsPage";
import LoginPage from "./app/pages/LoginPage";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-govi-500 selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <footer className="py-8 bg-slate-950 text-slate-400 text-center border-t border-slate-900 px-6">
        <p>© {new Date().getFullYear()} ගොවි ගුරු (Govi Guru). All rights reserved.</p>
        <p className="text-sm mt-2">Smart Pest Identification System for Sri Lankan Paddy Cultivation.</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/pest-details" element={<PestDetailsPage />} />
        </Route>
        {/* Login Page goes outside MainLayout so it can have its own blank layout */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
