"use client";

import { useEffect, useState } from "react";
import { Globe, Plus, X, ExternalLink, ShieldAlert } from "lucide-react";
import { formatDate, getStatusColor, getSeverityColor, cn } from "@/lib/utils";

interface TargetOption {
  id: string;
  name: string;
}

interface EndpointData {
  id: string;
  targetId: string;
  path: string;
  method: string;
  type: string;
  status: string;
  riskLevel: string | null;
  exposed: boolean;
  notes: string | null;
  createdAt: string;
  target: { name: string };
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PATCH: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DiscoveryPage() {
  const [endpoints, setEndpoints] = useState<EndpointData[]>([]);
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterTarget, setFilterTarget] = useState("");
  const [form, setForm] = useState({
    targetId: "",
    path: "",
    method: "GET",
    type: "API",
    status: "ACTIVE",
    riskLevel: "",
    exposed: false,
    notes: "",
  });

  const fetchData = async () => {
    try {
      const url = filterTarget
        ? `/api/endpoints?targetId=${filterTarget}`
        : "/api/endpoints";
      const [endpointRes, targetRes] = await Promise.all([
        fetch(url),
        fetch("/api/targets"),
      ]);
      const epData = await endpointRes.json();
      const tData = await targetRes.json();
      setEndpoints(Array.isArray(epData) ? epData : []);
      setTargets(Array.isArray(tData) ? tData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({ targetId: "", path: "", method: "GET", type: "API", status: "ACTIVE", riskLevel: "", exposed: false, notes: "" });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "var(--color-accent-blue)" }}>
              <Globe size={20} />
            </div>
            <span className="text-gradient">Endpoint Discovery</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Map and inventory all discovered endpoints
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="select-field w-auto"
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
          >
            <option value="">All Targets</option>
            {targets.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} /> Add Endpoint
          </button>
        </div>
      </div>

      <div className="glow-line" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--color-accent-cyan)" }} />
        </div>
      ) : endpoints.length === 0 ? (
        <div className="empty-state">
          <Globe size={48} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--color-text-primary)" }}>No endpoints discovered</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Start mapping endpoints for your targets</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Path</th>
                  <th>Target</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Risk</th>
                  <th>Exposed</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep) => (
                  <tr key={ep.id}>
                    <td>
                      <span className={cn("badge text-[10px]", METHOD_COLORS[ep.method] || METHOD_COLORS.GET)}>
                        {ep.method}
                      </span>
                    </td>
                    <td>
                      <code className="text-xs font-mono" style={{ color: "var(--color-accent-cyan)" }}>
                        {ep.path}
                      </code>
                    </td>
                    <td className="text-xs">{ep.target.name}</td>
                    <td>
                      <span className="badge bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-[10px]">
                        {ep.type}
                      </span>
                    </td>
                    <td>
                      <span className={cn("badge text-[10px]", getStatusColor(ep.status))}>
                        {ep.status}
                      </span>
                    </td>
                    <td>
                      {ep.riskLevel ? (
                        <span className={cn("badge text-[10px]", getSeverityColor(ep.riskLevel))}>
                          {ep.riskLevel}
                        </span>
                      ) : (
                        <span style={{ color: "var(--color-text-muted)" }}>—</span>
                      )}
                    </td>
                    <td>
                      {ep.exposed && (
                        <ShieldAlert size={14} style={{ color: "var(--color-accent-red)" }} />
                      )}
                    </td>
                    <td className="text-xs">{formatDate(ep.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>Add Endpoint</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/5" style={{ color: "var(--color-text-muted)" }}>
                <X size={18} />
              </button>
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
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Path *</label>
                <input required className="input-field font-mono" placeholder="/api/v1/users" value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Method</label>
                  <select className="select-field" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (<option key={m}>{m}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Type</label>
                  <select className="select-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {["API", "SITEMAP", "ASSET", "WEBSOCKET", "GRAPHQL"].map((t) => (<option key={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Risk Level</label>
                  <select className="select-field" value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}>
                    <option value="">None</option>
                    {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((r) => (<option key={r}>{r}</option>))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="exposed" checked={form.exposed} onChange={(e) => setForm({ ...form, exposed: e.target.checked })} className="rounded" />
                <label htmlFor="exposed" className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Publicly exposed</label>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Notes</label>
                <textarea className="textarea-field" placeholder="Observations..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Add Endpoint</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
