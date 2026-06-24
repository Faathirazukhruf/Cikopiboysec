"use client";

import { useEffect, useState } from "react";
import { Wrench, Plus, X, Cpu } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TargetOption { id: string; name: string; }

interface ToolData {
  id: string;
  name: string;
  callableFuncs: string[] | null;
  paramSchema: Record<string, unknown> | null;
  permissionModel: string | null;
  createdAt: string;
  target: { name: string };
}

export default function ToolsMapPage() {
  const [tools, setTools] = useState<ToolData[]>([]);
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    targetId: "",
    name: "",
    callableFuncs: "",
    paramSchema: "",
    permissionModel: "",
  });

  const fetchData = async () => {
    try {
      const [toolRes, targetRes] = await Promise.all([
        fetch("/api/tools"),
        fetch("/api/targets"),
      ]);
      const toolData = await toolRes.json();
      const tData = await targetRes.json();
      setTools(Array.isArray(toolData) ? toolData : []);
      setTargets(Array.isArray(tData) ? tData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let callableFuncs = null;
      let paramSchema = null;
      if (form.callableFuncs) {
        try { callableFuncs = JSON.parse(form.callableFuncs); } catch { callableFuncs = form.callableFuncs.split(",").map((s) => s.trim()); }
      }
      if (form.paramSchema) {
        try { paramSchema = JSON.parse(form.paramSchema); } catch { /* ignore */ }
      }
      await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, callableFuncs, paramSchema }),
      });
      setShowModal(false);
      setForm({ targetId: "", name: "", callableFuncs: "", paramSchema: "", permissionModel: "" });
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--color-accent-emerald)" }}>
              <Wrench size={20} />
            </div>
            <span className="text-gradient">Tool Capability Mapper</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Audit tool permissions and callable functions
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Map Tool
        </button>
      </div>

      <div className="glow-line" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--color-accent-cyan)" }} />
        </div>
      ) : tools.length === 0 ? (
        <div className="empty-state">
          <Cpu size={48} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--color-text-primary)" }}>No tools mapped</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Start mapping AI tool capabilities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="glass-card p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === tool.id ? null : tool.id)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{tool.name}</h3>
                  <span className="badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] mt-1">{tool.target.name}</span>
                </div>
                <div className="text-right">
                  {tool.permissionModel && (
                    <span className="badge bg-violet-500/20 text-violet-400 border-violet-500/30 text-[10px]">{tool.permissionModel}</span>
                  )}
                  <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>{formatDate(tool.createdAt)}</p>
                </div>
              </div>

              {/* Function chips */}
              {Array.isArray(tool.callableFuncs) && tool.callableFuncs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tool.callableFuncs.map((fn, i) => (
                    <code key={i} className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-accent-cyan)", border: "1px solid var(--color-border-subtle)" }}>
                      {String(fn)}
                    </code>
                  ))}
                </div>
              )}

              {expandedId === tool.id && tool.paramSchema && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                  <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Parameter Schema</h4>
                  <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-secondary)" }}>
                    {JSON.stringify(tool.paramSchema, null, 2)}
                  </pre>
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
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>Map Tool</h2>
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
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Tool Name *</label>
                <input required className="input-field" placeholder="e.g. web_search, code_interpreter" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Callable Functions (comma-separated or JSON array)</label>
                <textarea className="textarea-field font-mono" rows={3} placeholder='["search", "fetch_url"] or search, fetch_url' value={form.callableFuncs} onChange={(e) => setForm({ ...form, callableFuncs: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Parameter Schema (JSON)</label>
                <textarea className="textarea-field font-mono" rows={4} placeholder='{"query": "string", "limit": "number"}' value={form.paramSchema} onChange={(e) => setForm({ ...form, paramSchema: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Permission Model</label>
                <input className="input-field" placeholder="e.g. read-only, full-access, sandboxed" value={form.permissionModel} onChange={(e) => setForm({ ...form, permissionModel: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Map Tool</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
