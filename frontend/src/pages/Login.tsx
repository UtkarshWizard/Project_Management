import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signin", { email, password });
      login(data.token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-primary-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary-500/30">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">Enter your credentials to access your workspace</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full pl-10 h-11"
                  placeholder="name@example.com"
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <Link to="#" className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  className="w-full pl-10 h-11"
                  placeholder="••••••••"
                  defaultValue={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary h-11 flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
