import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CreditCard, 
  LogOut, 
  User, 
  Box,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Subscription", path: "/subscription", icon: CreditCard },
    { name: "Advanced Analytics", path: "/analytics/advanced", icon: TrendingUp },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 px-6 flex items-center justify-between border-b dark:border-slate-800">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-primary-500 rounded flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Box size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
            ProjectWizard
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                  : "text-slate-600 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400"
              }`}
            >
              <item.icon size={18} />
              {item.name}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary-500/10 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <User size={20} />
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 h-10 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
