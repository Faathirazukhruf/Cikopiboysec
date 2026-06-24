"use client";

import { useEffect, useState } from "react";
import { KeyRound, Plus, X, Clock, Key } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface TargetOption { id: string; name: string; }

interface AuthFlowData {
  id: string;
  tokenStructure: string | null;
  sessionDuration: number | null;
  stateChanges: string | null;
  notes: string | null;
  createdAt: string;
  target: { name: string };
}

export default function AuthFlowPage() {
  const [flows, setFlows] = useState<AuthFlowData[]>([]);
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    targetId: "",
    tokenStructure: "",
    sessionDuration: "",
    stateChanges: "",
    notes: "",
  });

  const fetchData = async () => {
    try {
      const [flowRes, targetRes] = await Promise.all([
        fetch("/api/auth-flows"),
        fetch("/api/targets"),
      ]);
      const flowData = await flowRes.json();
      const tData = await targetRes.json();
      setFlows(Array.isArray(flowData) ? flowData : []);
      setTargets(Array.isArray(tData) ? tData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/auth-flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sessionDuration: form.sessionDuration ? parseInt(form.sessionDuration) : null,
        }),
      });
      setShowModal(false);
      setForm({ targetId: "", tokenStructure: "", sessionDuration: "", stateChanges: "", notes: "" });
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "var(--color-accent-amber)" }}>
              <KeyRound size={20} />
            </div>
            <span className="text-gradient">Auth Flow Inspector</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Visualize JWT lifecycle, sessions, and auth state changes
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Log Flow
        </button>
      </div>

      <div className="glow-line" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--color-accent-cyan)" }} />
        </div>
      ) : flows.length === 0 ? (
        <div className="empty-state">
          <Key size={48} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--color-text-primary)" }}>No auth flows logged</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Start inspecting authentication patterns</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flows.map((flow) => (
            <div key={flow.id} className="glass-card p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === flow.id ? null : flow.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="badge bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">{flow.target.name}</span>
                  {flow.sessionDuration && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      <Clock size={12} /> {flow.sessionDuration}min
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatDateTime(flow.createdAt)}</span>
              </div>
              {flow.notes && (
                <p className="text-sm mt-2 line-clamp-1" style={{ color: "var(--color-text-secondary)" }}>{flow.notes}</p>
              )}
              {expandedId === flow.id && (
                <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                  {flow.tokenStructure && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Token Structure</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-accent-amber)" }}>{flow.tokenStructure}</pre>
                    </div>
                  )}
                  {flow.stateChanges && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>State Changes</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-secondary)" }}>{flow.stateChanges}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>Log Auth Flow</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/5" style={{ color: "var(--color-text-muted)" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Target *</label>
                <select required className="select-field" value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })}>
                  <option value="">Select target...</option>
                  {targets.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Token Structure (JWT claims, etc)</label>
                <textarea className="textarea-field font-mono" rows={4} placeholder='{"alg":"HS256","typ":"JWT"}...' value={form.tokenStructure} onChange={(e) => setForm({ ...form, tokenStructure: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Session Duration (minutes)</label>
                <input type="number" className="input-field" placeholder="30" value={form.sessionDuration} onChange={(e) => setForm({ ...form, sessionDuration: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>State Changes</label>
                <textarea className="textarea-field font-mono" rows={3} placeholder="Login → Token issued → Refresh..." value={form.stateChanges} onChange={(e) => setForm({ ...form, stateChanges: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Notes</label>
                <textarea className="textarea-field" rows={2} placeholder="Observations..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Log Flow</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
