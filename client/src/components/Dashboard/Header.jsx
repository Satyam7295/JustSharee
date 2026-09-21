import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const logo = "/justshare_logo.png";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const [mode, setModeState] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("mode") || "light";
    setModeState(savedMode);
    document.body.setAttribute("data-mode", savedMode);
  }, []);

  const setMode = (newMode) => {
    document.body.setAttribute("data-mode", newMode);
    localStorage.setItem("mode", newMode);
    setModeState(newMode);
  };

  return (
    <>
      {/* 📱 MOBILE HEADER */}
      <header className="w-full sm:hidden flex items-center justify-between px-4 py-3 fixed top-0 left-0 z-50 glass-header text-[var(--text-color)] transition-all duration-300">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-[var(--text-color)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">JustShare</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mode Toggle */}
          <label className="relative inline-flex items-center cursor-pointer group" title="Toggle Theme">
            <input
              type="checkbox"
              checked={mode === "dark"}
              onChange={() => setMode(mode === "light" ? "dark" : "light")}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full transition-colors duration-300 shadow-inner ${mode === "dark" ? "bg-[#333333]" : "bg-gray-300"}`}></div>
            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${mode === "dark" ? "translate-x-5" : ""}`}></div>
          </label>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-black dark:bg-[#1c1c1e] text-white dark:text-[#f5f5f5] border border-black/10 dark:border-white/10 flex items-center justify-center font-semibold text-xs">
            {user?.fullname?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {/* 🖥 DESKTOP FLOATING HEADER */}
      <div className="hidden sm:flex justify-center fixed top-4 left-0 w-full z-50 px-6 transition-all duration-300">
        <header className="w-full max-w-6xl items-center justify-between px-6 py-3 glass-panel flex text-[var(--text-color)]">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="Logo" className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">JustShare</span>
              </div>
            </Link>
          </div>

          <span className="hidden md:block text-sm font-medium text-gray-500 tracking-wide">
            Dashboard & File Manager
          </span>

          <div className="flex items-center space-x-5">
            {/* 🌙 Mode Toggle */}
            <label className="relative inline-flex items-center cursor-pointer group" title="Toggle Theme">
              <input
                type="checkbox"
                checked={mode === "dark"}
                onChange={() => setMode(mode === "light" ? "dark" : "light")}
                className="sr-only peer"
              />
              <div className={`w-12 h-6 rounded-full transition-colors duration-300 shadow-inner ${mode === "dark" ? "bg-[#333333]" : "bg-gray-300"}`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm group-hover:scale-110 ${mode === "dark" ? "translate-x-6" : ""}`}></div>
            </label>

            <div className="h-6 w-px bg-black/10 dark:bg-white/20"></div>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="w-7 h-7 rounded-full bg-black dark:bg-[#1c1c1e] text-white dark:text-[#f5f5f5] flex items-center justify-center font-bold text-xs">
                {user?.fullname?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{user?.fullname || "User"}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight truncate max-w-[120px]">{user?.email || "user@example.com"}</p>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
