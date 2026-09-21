import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const logo = "/justshare_logo.png";

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
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
      {/* 🌐 MOBILE HEADER */}
      <header className="w-full sm:hidden flex h-16 items-center justify-between border-b border-[var(--border-color)] dark:border-white/[0.08] bg-[var(--bg-color)]/95 dark:bg-[#090909]/95 px-4 fixed top-0 left-0 z-50 text-[var(--text-color)] dark:text-[#f5f5f5] backdrop-blur transition-colors duration-300">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-[20px] font-semibold tracking-[-0.02em] text-[var(--text-color)] dark:text-[#f5f5f5]">JustShare</span>
        </Link>
        <button onClick={() => setSidebarVisible(true)} className="rounded-md p-2 text-[var(--muted-text-color)] transition-colors hover:bg-black/5 dark:hover:bg-white/[0.06] hover:text-[var(--text-color)] dark:hover:text-[#f5f5f5] focus:outline-none">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* 📱 MOBILE SIDEBAR OVERLAY */}
      {sidebarVisible && (
        <div className="fixed inset-0 bg-black/80 z-40 sm:hidden transition-opacity" onClick={() => setSidebarVisible(false)}></div>
      )}

      {/* 📱 MOBILE SIDEBAR PANEL (RIGHT SLIDE) */}
      <aside className={`fixed top-0 right-0 w-64 h-full bg-[var(--bg-color)] text-[var(--text-color)] z-50 shadow-2xl border-l border-[var(--border-color)] dark:border-white/5 transform ${sidebarVisible ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-out sm:hidden`}>
        <div className="flex items-center justify-between border-b border-[var(--border-color)] dark:border-white/[0.08] px-5 py-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold text-[var(--text-color)] dark:text-[#f5f5f5]">Menu</span>
          </div>
          <button onClick={() => setSidebarVisible(false)} className="text-2xl font-normal text-[var(--muted-text-color)] transition-colors hover:text-[var(--text-color)] dark:hover:text-[#f5f5f5]">&times;</button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          {/* 🌙 Mode Toggle */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] dark:border-white/[0.08] pb-5">
            <span className="text-sm font-medium">Theme</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mode === "dark"}
                onChange={() => setMode(mode === "light" ? "dark" : "light")}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${mode === "dark" ? "bg-[#333333]" : "bg-gray-300"}`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${mode === "dark" ? "translate-x-5" : ""}`}></div>
            </label>
          </div>

          {/* 🔐 Auth Links */}
          <div className="flex flex-col gap-3 mt-4">
            <Link to="/signup" onClick={() => setSidebarVisible(false)} className="text-sm font-medium px-4 py-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-center transition-colors">Sign Up</Link>
            <Link to="/login" onClick={() => setSidebarVisible(false)} className="text-sm font-medium px-4 py-3 rounded-xl btn-primary text-center">Log In</Link>
          </div>
        </div>
      </aside>

      {/* 🖥 DESKTOP HEADER */}
      <div className="hidden sm:flex fixed left-0 top-0 z-50 w-full justify-center px-6 transition-all duration-300">
        <header className="flex h-16 w-full max-w-[1120px] items-center justify-between border-b border-[var(--border-color)] dark:border-white/[0.08] bg-[var(--bg-color)]/95 dark:bg-[#090909]/95 px-0 text-[var(--text-color)] dark:text-[#f5f5f5] backdrop-blur">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="Logo" className="h-8 w-8 transition-transform duration-300" />
              <div className="flex flex-col">
                <span className="text-[21px] font-semibold tracking-[-0.02em] text-[var(--text-color)] dark:text-[#f5f5f5]">JustShare</span>
              </div>
            </Link>
          </div>
          <span className="hidden text-[13px] font-normal tracking-wide text-[var(--muted-text-color)] md:block">Share Files Securely & Instantly</span>
          
          <div className="flex items-center space-x-5">
            {/* 🌙 Mode Toggle */}
            <label className="group relative inline-flex cursor-pointer items-center" title="Toggle Theme">
              <input
                type="checkbox"
                checked={mode === "dark"}
                onChange={() => setMode(mode === "light" ? "dark" : "light")}
                className="sr-only peer"
              />
              <div className={`h-5 w-9 rounded-full transition-colors duration-300 ${mode === "dark" ? "bg-[#333333]" : "bg-[#555]"}`}></div>
              <div className={`absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition-all duration-300 group-hover:scale-110 ${mode === "dark" ? "translate-x-4" : ""}`}></div>
            </label>

            <div className="h-5 w-px bg-[var(--border-color)] dark:bg-white/[0.08]"></div>

            {/* 🔐 Auth Buttons */}
            <Link to="/signup" className="rounded-md px-2 py-2 text-sm font-medium text-[var(--muted-text-color)] transition-colors hover:text-[var(--text-color)] dark:hover:text-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">Sign Up</Link>
            <Link to="/login" className="rounded-md border border-[var(--border-color)] dark:border-white/[0.12] px-3 py-2 text-sm font-medium text-[var(--text-color)] dark:text-[#d4d4d4] transition-colors hover:border-gray-300 dark:hover:border-white/[0.22] hover:bg-black/5 dark:hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">Log In</Link>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
