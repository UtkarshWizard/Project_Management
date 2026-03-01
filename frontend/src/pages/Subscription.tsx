import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { Check, Zap, Sparkles, Building, Rocket, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Subscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const { data } = await api.get("/subscription");
      setSubscription(data);
    } catch (error: any) {
      toast.error("Failed to load subscription details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleUpgrade = async (planName: string) => {
    try {
      await api.post("/subscription/upgrade", { planName });
      toast.success(`Successfully upgraded to ${planName} plan!`);
      fetchSubscription();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upgrade subscription");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-10 w-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for individuals and side-projects",
      features: ["Up to 3 Projects", "Basic Analytics", "Community Support", "Single User"],
      icon: <Rocket className="text-blue-500" />,
      color: "blue"
    },
    {
      name: "Pro",
      price: "$29",
      description: "Best for growing teams and startups",
      features: ["Up to 20 Projects", "Advanced Analytics", "Priority Support", "Team of 5", "Export Projects"],
      icon: <Zap className="text-amber-500" />,
      color: "amber",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large organizations and high volume",
      features: ["Unlimited Projects", "Custom Analytics", "Dedicated Account Manager", "Unlimited Team Support", "SSO Integration"],
      icon: <Sparkles className="text-indigo-500" />,
      color: "indigo"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b dark:border-slate-800">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Subscription</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your plan and billing details.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white dark:bg-slate-900 px-8 py-5 rounded-3xl border dark:border-slate-800 shadow-sm flex items-center gap-6">
             <div className="h-14 w-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={32} />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Plan</p>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white">{subscription?.plan || "NONE"}</h3>
             </div>
          </div>
          {subscription?.plan !== "Free" && subscription?.plan !== "BASIC" && subscription?.endDate && (
            <div className="bg-white dark:bg-slate-900 px-8 py-5 rounded-3xl border dark:border-slate-800 shadow-sm flex items-center gap-6">
              <div className="h-14 w-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                  <CreditCard size={32} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Renewal Date</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col ${
              subscription?.plan === plan.name 
                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-2xl ring-4 ring-primary-500/10" 
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-md"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg h-8 flex items-center justify-center">
                MOST POPULAR
              </div>
            )}
            
            <div className={`h-16 w-16 mb-6 rounded-3xl flex items-center justify-center shadow-xl ${
               plan.name === "BASIC" ? "bg-blue-500/10" : plan.name === "PRO" ? "bg-amber-500/10" : "bg-indigo-500/10"
            }`}>
               {plan.icon}
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 min-h-[40px] leading-relaxed">{plan.description}</p>
            
            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center ${subscription?.plan === plan.name ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-semibold">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade(plan.name)}
              disabled={subscription?.plan === plan.name}
              className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95 disabled:scale-100 flex items-center justify-center gap-2 group ${
                subscription?.plan === plan.name
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : plan.popular 
                    ? "bg-primary-500 text-white hover:bg-primary-600 shadow-xl shadow-primary-500/30"
                    : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90"
              }`}
            >
              {subscription?.plan === plan.name ? "Current Plan" : (
                <>
                  Select {plan.name}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-3xl -z-0 translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
           <div className="h-20 w-20 bg-primary-500 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 shrink-0">
              <Building size={40} className="text-white" />
           </div>
           <div className="relative z-10 space-y-2 flex-grow">
              <h2 className="text-3xl font-black">Need a custom enterprise solution?</h2>
              <p className="text-slate-400 dark:text-slate-600 text-lg">For teams with over 100 users and custom requirements, let's talk about tailored pricing.</p>
           </div>
           <button className="btn-primary bg-primary-500 text-white h-14 px-10 relative z-10 font-black shadow-2xl shadow-primary-500/50 hover:bg-primary-600 flex items-center gap-3">
              Contact Sales
              <ChevronRight size={20} />
           </button>
      </div>
    </div>
  );
}
