import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  Zap, 
  Users, 
  Calendar,
  Layers,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Info,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/analytics/advanced");
        setAnalytics(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Higher plan required for Advanced Analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-10 w-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (!analytics) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-8 glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
      <div className="h-24 w-24 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 transition-transform hover:rotate-12 duration-500">
         <Zap size={50} className="text-white fill-white" />
      </div>
      <div className="relative z-10 space-y-4 max-w-lg">
         <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">Advanced Analytics</h2>
         <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">Advanced analytics are available on higher plans. Upgrade to Enterprise to unlock them.</p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-primary h-14 px-12 text-lg font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl shadow-primary-500/40 relative z-10 rounded-2xl flex items-center gap-4 group"
      >
        Upgrade Your Plan
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );


  const barData = {
    labels: ['Active Projects', 'Archived Projects', 'Usage Events'],
    datasets: [
      {
        label: 'Count',
        data: [analytics.projectActiveCount || 0, analytics.projectArchiveCount || 0, analytics.usageCount || 0],
        backgroundColor: ['#06b6d4', '#8b5cf6', '#f59e0b'],
        borderRadius: 12,
        barThickness: 36,
      },
    ],
  };

  const pieData = {
    labels: ['Active', 'Archived', 'Usage'],
    datasets: [
      {
        data: [analytics.projectActiveCount || 0, analytics.projectArchiveCount || 0, analytics.usageCount || 0],
        backgroundColor: ['#10b981', '#8b5cf6', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 12,
        displayColors: false,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } },
      y: { grid: { borderDash: [5, 5] }, ticks: { font: { weight: 'bold' } } },
    },
  };


  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
             Advanced Analytics
             <span className="text-xs bg-primary-500 text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-primary-500/20">Pro</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Real-time performance metrics and deep project insights.</p>
        </div>
        <div className="flex gap-4">
           <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-500 transition-colors hover:text-primary-500 shadow-sm"><Info size={24} /></button>
           <button className="btn-primary h-12 px-8 font-black flex items-center gap-3 shadow-xl shadow-primary-500/20">
              <Calendar size={18} />
              Last 30 Days
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Projects" 
          value={analytics.projectCount ?? 0} 
          change={undefined} 
          icon={<BarChart3 size={24} className="text-primary-500" />} 
          description="All projects in your organization"
        />
        <StatsCard 
          label="Active Projects" 
          value={analytics.projectActiveCount ?? 0} 
          icon={<Activity size={24} className="text-emerald-500" />} 
          description="Currently active projects"
        />
        <StatsCard 
          label="Archived Projects" 
          value={analytics.projectArchiveCount ?? 0} 
          icon={<Layers size={24} className="text-indigo-500" />} 
          description="Projects stored as archived"
        />
        <StatsCard 
          label="Members" 
          value={analytics.memberCount ?? 0} 
          icon={<Users size={24} className="text-rose-500" />} 
          description="Active members in org"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="Resource Distribution" subtitle="Projects vs Members" icon={<BarChart3 size={20} />}>
          <div className="h-[350px]">
           <Bar data={barData} options={chartOptions} />
          </div>
        </ChartContainer>

        <ChartContainer title="Project Status Breakdown" subtitle="Active vs Archived Projects" icon={<PieChart size={20} />}>
          <div className="h-[350px] flex items-center justify-center relative">
           <div className="h-[280px] w-[280px]">
             <Pie data={pieData} options={{ ...chartOptions, scales: { x: { display: false }, y: { display: false } } }} />
           </div>
           <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-black">{(analytics.projectActiveCount ?? 0) + (analytics.projectArchiveCount ?? 0)}</span>
             <span className="text-xs text-slate-500 font-bold">PROJECTS</span>
           </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}

function StatsCard({ label, value, change, icon, description, positive, negative }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50 dark:bg-slate-800/30 rounded-full group-hover:scale-125 transition-transform duration-500" />
      <div className="relative z-10 flex flex-col h-full">
         <div className="flex items-center justify-between mb-8">
            <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary-500 group-hover:bg-white dark:group-hover:bg-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] transition-all">
               {icon}
            </div>
            <div className={`flex items-center gap-1 font-black text-sm ${positive ? 'text-emerald-500' : negative ? 'text-rose-500' : 'text-primary-500'}`}>
               {change}
               <ArrowUpRight size={16} className={negative ? 'rotate-90' : ''} />
            </div>
         </div>
         <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{value}</h3>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
               <Clock size={12} />
               {description}
            </p>
         </div>
      </div>
    </motion.div>
  );
}

function ChartContainer({ title, subtitle, icon, children }: any) {
  return (
     <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-sm h-full"
     >
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-lg transition-transform hover:rotate-12">
                 {icon}
              </div>
              <div>
                 <h3 className="text-2xl font-black dark:text-white">{title}</h3>
                 <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
              </div>
           </div>
           <button className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><MoreVertical size={24} /></button>
        </div>
        {children}
     </motion.div>
  )
}
