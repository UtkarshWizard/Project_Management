import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { Plus, UserPlus, Loader2} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: membersData }, { data: subData }] = await Promise.all([
        api.get("/members/all"),
        api.get("/subscription")
      ]);
      setMembers(membersData);
      setSubscription(subData);
    } catch (error: any) {
      toast.error("Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const limitReached = subscription?.limits?.maxMembers != null && members.length >= subscription.limits.maxMembers;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/members", { name, email, password });
      toast.success("Member added");
      setName(""); setEmail(""); setPassword(""); setShowAdd(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Members</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage team members and invitations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdd(true)}
            disabled={limitReached}
            className={`btn-primary flex items-center gap-2 h-12 px-6 ${limitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus />
            {limitReached ? 'Limit Reached' : 'Add Member'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {members.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800">
              <div>
                <div className="font-bold text-white">{m.name}</div>
                <div className="text-sm text-slate-500">{m.email}</div>
              </div>
              <div className="text-sm text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="py-12 text-center text-slate-500">No members found</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800">
              <h3 className="text-xl text-gray-200 font-bold mb-4">Add Member</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="Name" className="w-full h-11 px-3" />
                <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full h-11 px-3" />
                <input value={password} onChange={e => setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full h-11 px-3" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 h-11">Cancel</button>
                  <button type="submit" disabled={creating || limitReached} className="flex-1 btn-primary h-11 flex items-center justify-center gap-2">
                    {creating ? <Loader2 className="animate-spin" /> : <><UserPlus /> Add</>}
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
