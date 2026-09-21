import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import StatsGrid from "./StatesGrid";
import UserProfile from "./UserProfile";
import UploadPage from "./FileUpload/UploadPage";
import FileShow from "./FileShow";
import Logout from "./Logout";
import Footer from "../Footer";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-400 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] text-[var(--text-color)] pt-16 sm:pt-24 transition-colors duration-300 relative">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-6 my-6">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        <main className="flex-1 min-w-0">
          {activeTab === "upload" && <UploadPage />}
          {activeTab === "profile" && <UserProfile />}
          {activeTab === "settings" && <UserProfile />}
          {activeTab === "logout" && <Logout />}
          {activeTab === "home" && (
            <div className="space-y-6">
              <StatsGrid />
              <FileShow />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
