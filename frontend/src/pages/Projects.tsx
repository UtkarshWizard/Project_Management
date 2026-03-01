import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";
import { 
  Plus, 
  Archive, 
  Trash2, 
  FolderIcon, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Loader2,
  FileDown,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [view, setView] = useState<'all' | 'active' | 'archived'>('active');
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: projectsData }, { data: allProjectsData }, { data: subData }] = await Promise.all([
        api.get("/projects/all"),
        api.get("/projects/all?archived=true"),
        api.get("/subscription")
      ]);

      setProjects(projectsData);
      setAllProjects(allProjectsData);
      setSubscription(subData);
    } catch (error: any) {
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalProjectsCount = allProjects?.length ?? projects.length;
  const limitReached = subscription?.limits?.maxProjects != null && totalProjectsCount >= subscription.limits.maxProjects;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/projects", { name, description });
      toast.success("Project created successfully!");
      setName("");
      setDescription("");
      setShowCreate(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.patch(`/projects/${id}/archive`);
      toast.success("Project archived");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cannot archive project");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this project?")) {
        await api.delete(`/projects/${id}`);
        toast.success("Project deleted");
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cannot delete project");
    }
  };

  const handleExport = async () => {
     try {
       const { data } = await api.get("/projects/export");
       const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
       const url = window.URL.createObjectURL(blob);
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', 'projects_export.json');
       document.body.appendChild(link);
       link.click();
       link.remove();
       toast.success("Projects exported successfully!");
     } catch (error: any) {
       toast.error(error.response?.data?.message || "Cannot export projects");
     }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex rounded-xl bg-white/10 p-1">
          <button
            onClick={() => setView('active')}
            className={`px-4 py-2 rounded-lg font-medium ${view === 'active' ? 'bg-primary-500 text-white' : 'text-slate-500'}`}
          >
            Active
          </button>
          <button
            onClick={() => setView('archived')}
            className={`px-4 py-2 rounded-lg font-medium ${view === 'archived' ? 'bg-primary-500 text-white' : 'text-slate-500'}`}
          >
            Archived
          </button>
          <button
            onClick={() => setView('all')}
            className={`px-4 py-2 rounded-lg font-medium ${view === 'all' ? 'bg-primary-500 text-white' : 'text-slate-500'}`}
          >
            All
          </button>
        </div>
        <div className="text-sm text-slate-300">Total projects: {totalProjectsCount}</div>
      </div>
      {limitReached && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl shadow-primary-500/20"
        >
          <div className="flex items-center gap-3 font-semibold">
             <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShieldAlert size={20} />
             </div>
             <div>
                <p>Project Limit Reached</p>
                <p className="text-sm text-primary-100 font-normal">Upgrade your plan to create more projects and unlock team features.</p>
             </div>
          </div>
          <Link to="/subscription">
             <button className="bg-white text-primary-600 px-6 h-11 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-colors">
               Upgrade Now
             </button>
          </Link>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and organize your workspace.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="btn-outline text-white flex items-center gap-2 group h-12 px-6"
          >
            <FileDown size={18} />
            Export Data
          </button>
          <button 
            onClick={() => setShowCreate(true)}
            disabled={limitReached}
            className={`btn-primary flex items-center gap-2 group shadow-xl h-12 px-6 ${limitReached ? 'opacity-50 grayscale cursor-not-allowed bg-slate-400' : 'shadow-primary-500/10'}`}
          >
            <Plus size={18} />
            {limitReached ? "Limit Reached" : "New Project"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
             <div key={i} className="h-64 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border dark:border-slate-800" />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {
            (view === 'all' ? allProjects : (view === 'archived' ? allProjects.filter(p => p.isArchived) : projects)).map((project: any) => (
              <ProjectCard 
                 key={project.id} 
                 project={project} 
                 onArchive={() => handleArchive(project.id)} 
                 onDelete={() => handleDelete(project.id)}
              />
            ))
          }
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
               <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                 <FolderIcon size={40} />
               </div>
               <h3 className="font-bold text-xl dark:text-white">No projects found</h3>
               <p className="text-slate-500 mt-2">Start by creating your first project here.</p>
               <button onClick={() => setShowCreate(true)} className="btn-primary mt-6">Create New Project</button>
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm shadow-2xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass px-8 py-10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-8">
                 <button onClick={() => setShowCreate(false)} className="text-white hover:text-white/80 transition-colors">
                   <ChevronRight className="rotate-90" />
                 </button>
              </div>
              
              <div className="flex flex-col items-center mb-8">
                 <div className="h-16 w-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary-500/20">
                    <Plus size={32} />
                 </div>
                 <h2 className="text-3xl font-extrabold text-white">Create Project</h2>
                 <p className="text-primary-100/70 mt-2">Fill in the details to start your project</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">Project Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-white/10 border-white/20 text-white placeholder-white/40 h-12 px-4 shadow-inner" 
                    placeholder="E.g. Website Redesign" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full bg-white/10 border-white/20 text-white placeholder-white/40 px-4 py-3 min-h-[120px] shadow-inner" 
                    placeholder="Project details and scope..." 
                    required 
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 h-12 font-bold text-white/90 hover:bg-white/10 rounded-xl transition-all">Cancel</button>
                  <button type="submit" disabled={creating} className="flex-1 btn-primary bg-white text-primary-600 hover:bg-slate-100 font-bold h-12 flex items-center justify-center gap-2">
                    {creating ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, onArchive, onDelete }: any) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border dark:border-slate-800 transition-all group relative ${project.status === 'ARCHIVED' ? 'opacity-60 grayscale' : 'hover:shadow-2xl hover:-translate-y-2'}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${project.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-400' : 'bg-gradient-to-br from-primary-500 to-indigo-600 text-white'}`}>
           <FolderIcon size={28} />
        </div>
        <div className="flex gap-1 overflow-hidden">
           <button onClick={onArchive} disabled={project.status === 'ARCHIVED'} className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all disabled:opacity-30">
             <Archive size={20} />
           </button>
           <button onClick={onDelete} className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
             <Trash2 size={20} />
           </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold dark:text-white line-clamp-1">{project.name}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm line-clamp-2 min-h-[40px] leading-relaxed">{project.description}</p>
        </div>

        <div className="pt-4 border-t dark:border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-2 text-sm font-medium">
             {project.status === 'ACTIVE' ? (
                <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <CheckCircle size={14} /> Active
                </span>
             ) : (
                <span className="flex items-center gap-1.5 text-slate-500 bg-slate-500/10 px-3 py-1 rounded-full">
                  <Archive size={14} /> Archived
                </span>
             )}
           </div>
           <p className="text-xs text-slate-400 flex items-center gap-1">
             <Clock size={12} />
             {new Date(project.createdAt).toLocaleDateString()}
           </p>
        </div>


      </div>
    </motion.div>
  );
}
