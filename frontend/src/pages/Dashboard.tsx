import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { 
  FolderKanban, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Plus,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subscription and projects first, handle analytics separately
        const [subRes, projectsRes] = await Promise.all([
          api.get("/subscription"),
          api.get("/projects/all").catch(() => ({ data: [] }))
        ]);
        
        setSubscription(subRes.data);
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data.slice(0, 5) : []);

        // Attempt to fetch stats, but don't toast on failure (likely plan restriction)
        try {
          const statsRes = await api.get("/analytics");
          setStats(statsRes.data);
        } catch (e) {
          console.log("Analytics restricted or failed");
        }
      } catch (error: any) {
        // Only toast if basic dashboard data (subscription) fails
        toast.error("Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const isFreePlan = subscription?.plan === "Free" || subscription?.plan === "BASIC";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-10 w-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/projects">
          <button className="btn-primary flex items-center gap-2 group shadow-xl shadow-primary-500/20 px-6 h-12">
            <Plus size={20} />
            <span className="font-semibold">Create New Project</span>
          </button>
        </Link>
      </div>

      <div className="relative">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isFreePlan ? 'blur-md pointer-events-none' : ''}`}
        >
          <MetricCard 
            title="Total Projects" 
            value={stats?.projectCount || 0} 
            icon={<FolderKanban className="text-blue-500" />} 
            color="blue"
          />
          <MetricCard 
            title="Active Members" 
            value={stats?.memberCount || 0} 
            icon={<Users className="text-indigo-500" />} 
            color="indigo"
          />
          <MetricCard 
            title="Active Projects" 
            value={stats?.projectCount || 0} 
            icon={<CheckCircle2 className="text-emerald-500" />} 
            color="emerald"
          />
          <MetricCard 
            title="In Progress" 
            value={stats?.projectCount || 0} 
            icon={<Clock className="text-amber-500" />} 
            color="amber"
          />
        </motion.div>

        {isFreePlan && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-primary-500/20 shadow-2xl text-center max-w-sm">
              <div className="h-16 w-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-bold dark:text-white mb-2">Upgrade to Pro</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Unlock detailed stats and advanced analytics to supercharge your workflow.</p>
              <Link to="/subscription" className="w-full btn-primary h-12 flex items-center justify-center gap-2 group">
                Upgrade Now
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold dark:text-white">Recent Projects</h2>
            <Link to="/projects" className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1 group">
              View All Projects 
              <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6 shadow-sm min-h-[400px]">
            {projects.length > 0 ? projects.map((project: any) => (
              <div key={project.id} className="flex items-center justify-between pb-4 border-b dark:border-slate-800 last:border-0 group">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <FolderKanban size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold dark:text-white">{project.name}</h3>
                     <p className="text-sm text-slate-500">{new Date(project.createdAt).toLocaleDateString()} • {project.status}</p>
                   </div>
                 </div>
                 <Link to="/projects">
                   <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-primary-500 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <ExternalLink size={18}/>
                   </button>
                 </Link>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                <FolderKanban size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-lg">No projects found</p>
                <Link to="/projects" className="text-primary-500 hover:underline mt-2">Create your first project</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold dark:text-white">Plan Summary</h2>
          {!isFreePlan && (
            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-white/10 rounded-full h-32 w-32 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-primary-100 font-bold uppercase tracking-widest text-[10px] mb-1">Current Plan</h3>
                <p className="text-4xl font-black mb-10">{subscription?.plan || "Free"}</p>
                
                <div className="space-y-6 mb-10">
                  <UsageProgress 
                    label="Projects" 
                    current={stats?.projectCount || 0} 
                    limit={subscription?.limits?.maxProjects || 3} 
                  />
                  <UsageProgress 
                    label="Members" 
                    current={stats?.memberCount || 0} 
                    limit={subscription?.limits?.maxMembers || 1} 
                  />
                </div>
                
                <Link to="/subscription">
                  <button className="w-full bg-white text-primary-600 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-lg active:scale-95">
                    Manage Subscription
                  </button>
                </Link>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                  <ShieldAlert size={20} />
               </div>
               <h3 className="font-bold dark:text-white">Plan Insights</h3>
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
               {isFreePlan 
                 ? "You are currently on a limited plan. Upgrade to remove restrictions and access advanced features."
                 : "Your plan is active and healthy. You have full access to all professional management tools."}
             </p>
             <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
      }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 card-hover shadow-sm"
    >
      <div className={`h-14 w-14 mb-6 rounded-2xl flex items-center justify-center bg-${color}-500/10`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{title}</p>
        <h3 className="text-4xl font-black dark:text-white">{value}</h3>
      </div>
    </motion.div>
  );
}

function UsageProgress({ label, current, limit }: any) {
  const percentage = Math.min((current / limit) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
        <span className="text-primary-100">{label} Used</span>
        <span className="text-white">{current} / {limit}</span>
      </div>
      <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] ${percentage > 90 ? 'bg-rose-400' : ''}`} 
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

