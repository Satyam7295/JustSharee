import React from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, setActiveTab, activeTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close on mobile
  };

  const tabs = [
    { name: "Overview", icon: "📊", id: "home" },
    { name: "Upload Files", icon: "📤", id: "upload" },
    { name: "Account Settings", icon: "⚙️", id: "settings" },
    { name: "Logout", icon: "🚪", id: "logout" },
  ];

  return (
    <>
      {/* 📱 MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR PANEL */}
      <aside
        className={`fixed md:sticky top-0 md:top-24 left-0 h-full md:h-[calc(100vh-7rem)] w-64 z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-out flex flex-col pt-20 md:pt-0`}
      >
        <div className="flex-1 glass-panel p-4 flex flex-col gap-2 mx-3 md:mx-0 shadow-lg md:shadow-none">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Navigation
          </div>

          <nav className="space-y-1.5 flex-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-black dark:bg-[#1c1c1e] text-white dark:text-[#f5f5f5] border border-black dark:border-[#2c2c2e] font-semibold shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-color)] font-medium"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
