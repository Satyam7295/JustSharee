import React from "react";

const WelcomeSection = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const greeting = getGreeting();

  return (
    <section className="glass-panel p-6 sm:p-8 mb-6 relative overflow-hidden text-[var(--text-color)] shadow-sm">
      <div className="relative z-10 flex items-center gap-6 flex-wrap">
        <div className="relative">
          <img
            src={user?.profilePic || "https://avatar.iran.liara.run/public/1"}
            alt="Profile"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-sm"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[var(--surface-color)] rounded-full"></span>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {greeting}, {user?.fullname || "User"}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Active Member
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.email} <span className="mx-1.5">•</span> @{user?.username}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
