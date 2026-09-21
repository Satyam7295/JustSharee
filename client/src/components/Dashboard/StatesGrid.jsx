import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slice/auth/authThunk";
import WelcomeSection from "./WelcomeSection";

const StatsGrid = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (user && user.id && !hasFetched.current) {
      dispatch(getUser(user.id));
      hasFetched.current = true;
    }
  }, [user, dispatch]);

  const cards = [
    {
      title: "Total Uploads",
      value: user?.totalUploads ?? 0,
      icon: "📤",
    },
    {
      title: "Total Downloads",
      value: user?.totalDownloads ?? 0,
      icon: "📥",
    },
    {
      title: "Videos Uploaded",
      value: user?.videoCount ?? 0,
      icon: "🎬",
    },
    {
      title: "Images Uploaded",
      value: user?.imageCount ?? 0,
      icon: "🖼️",
    },
    {
      title: "Documents Uploaded",
      value: user?.documentCount ?? 0,
      icon: "📄",
    },
    {
      title: "Last Login",
      value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A",
      icon: "⏰",
    },
  ].filter((card) => card.value !== undefined);

  return (
    <div className="mt-6">
      {/* Welcome Message */}
      <WelcomeSection user={user} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="glass-panel p-5 rounded-2xl flex items-center justify-between hover:shadow-md transition-all group"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {card.value}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
