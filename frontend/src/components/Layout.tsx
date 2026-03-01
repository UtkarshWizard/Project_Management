import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import api from "../api/axios";
import { AlertCircle, ChevronRight } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data } = await api.get("/subscription");
        setSubscription(data);
      } catch (error) {
        console.log("Failed to fetch subscription");
      }
    };
    fetchSubscription();
  }, []);

  const isExpired = subscription?.status === "EXPIRED";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      {isExpired && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-[80px] z-40 bg-amber-500 text-amber-950 px-6 py-4 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3 max-w-5xl mx-auto w-full">
            <AlertCircle size={20} className="flex-shrink-0" />
            <div>
              <p className="font-bold">Your subscription has expired</p>
              <p className="text-sm text-amber-900">Please renew your subscription to continue using all features.</p>
            </div>
          </div>
          <Link to="/subscription" className="flex-shrink-0 ml-4">
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
              Renew Now
              <ChevronRight size={16} />
            </button>
          </Link>
        </motion.div>
      )}
      <main className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
