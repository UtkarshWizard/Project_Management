import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  Calendar,
  Layers,
  MousePointer2,
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
import { Line, Bar, Pie } from 'react-chartjs-2';

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
         <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">Unlock Advanced Insights</h2>
         <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">Upgrade to PRO or ENTERPRISE to see deep performance metrics and team velocity charts.</p>
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

  const getVelocityData = () => {
    const monthlyCount: Record<string, number> = {};
    (analytics.projects || []).forEach((p: any) => {
        const month = p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 7) : 'now';
        monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    });
    return Object.keys(monthlyCount).length > 0 ? Object.values(monthlyCount) : [12, 19, 3, 5, 2, 3];
  }

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Velocity',
        data: getVelocityData(),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 4,
        pointRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#0ea5e9',
        pointBorderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Project A', 'Project B', 'Project C', 'Project D', 'Project E'],
    datasets: [
       {
         label: 'Hours Spent',
         data: analytics.projectActiveCount ? [analytics.projectActiveCount, analytics.projectArchiveCount, analytics.usageCount] : [30, 45, 12, 67, 34],
         backgroundColor: '#8b5cf6',
         borderRadius: 12,
         barThickness: 40,
       }
    ]
  }

  const pieData = {
    labels: ['Completed', 'In Progress', 'Blocked'],
    datasets: [
      {
        data: [analytics.projectActiveCount || 10, analytics.projectArchiveCount || 5, analytics.usageCount || 2],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 15,
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
            label="Avg. Velocity" 
            value={`${analytics.velocity || 86}%`} 
            change="+12.5%" 
            icon={<Activity size={24} className="text-primary-500" />} 
            description="Across all active projects"
         />
         <StatsCard 
            label="Efficiency" 
            value={`${analytics.efficiency || 92}%`} 
            change="+5.2%" 
            icon={<Target size={24} className="text-emerald-500" />} 
            description="Resource allocation score"
            positive
         />
         <StatsCard 
            label="Active Users" 
            value={analytics.activeUsers || 24} 
            change="+4" 
            icon={<Users size={24} className="text-indigo-500" />} 
            description="Peak concurrency today"
         />
         <StatsCard 
            label="Bottlenecks" 
            value={analytics.bottlenecks || 3} 
            change="-1" 
            icon={<Layers size={24} className="text-rose-500" />} 
            description="Issues requiring attention"
            negative
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="Velocity Trends" subtitle="Task completion rate over time" icon={<TrendingUp size={20} />}>
           <div className="h-[350px]">
             <Line data={lineData} options={chartOptions} />
           </div>
        </ChartContainer>

        <ChartContainer title="Resource Distribution" subtitle="Hours allocation by project" icon={<BarChart3 size={20} />}>
           <div className="h-[350px]">
             <Bar data={barData} options={chartOptions} />
           </div>
        </ChartContainer>

        <ChartContainer title="Project Status Breakdown" subtitle="Current workflow state distribution" icon={<PieChart size={20} />}>
           <div className="h-[350px] flex items-center justify-center relative">
             <div className="h-[280px] w-[280px]">
                <Pie data={pieData} options={{ ...chartOptions, scales: { x: { display: false }, y: { display: false } } }} />
             </div>
             <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{analytics.totalTasks || 42}</span>
                <span className="text-xs text-slate-500 font-bold">TASKS</span>
             </div>
           </div>
        </ChartContainer>

        <div className="space-y-8">
           <ChartContainer title="Real-time Events" subtitle="Latest system interactions" icon={<Activity size={20} />}>
              <div className="space-y-6">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                          <MousePointer2 size={24} className="rotate-45" />
                       </div>
                       <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                             <h4 className="font-bold text-slate-900 dark:text-white">API Call Optimization</h4>
                             <span className="text-xs text-slate-400 font-medium">2m ago</span>
                          </div>
                          <p className="text-sm text-slate-500">Latency reduced by 40ms in region us-east</p>
                       </div>
                    </div>
                 ))}
                 <button className="w-full py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-100 transition-colors mt-4">
                    View Full Logs
                    <ChevronRight size={18} />
                 </button>
              </div>
           </ChartContainer>
        </div>
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
            <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary-500 shadow-inner group-hover:bg-white dark:group-hover:bg-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] transition-all">
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
