"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Plus, X, Bug } from "lucide-react";
import { formatDate, getSeverityColor, getStatusColor, cn } from "@/lib/utils";

interface TargetOption { id: string; name: string; }

interface FindingData {
  id: string;
  title: string;
  type: string;
  severity: string;
  impact: string | null;
  reproduction: string | null;
  status: string;
  createdAt: string;
  target: { name: string };
  _count: { evidences: number };
}

const FINDING_TYPES = [
  "Prompt Injection",
  "Context Leak",
  "Auth Bypass",
  "Permission Escalation",
  "Data Exposure",
  "Rate Limit Bypass",
  "Tool Misuse",
  "Memory Poisoning",
  "Role Confusion",
  "Other",
];

export default function FindingsPage() {
  const [findings, setFindings] = useState<FindingData[]>([]);
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    targetId: "",
    title: "",
    type: "Other",
    severity: "MEDIUM",
    impact: "",
    reproduction: "",
    status: "OPEN",
  });

  const fetchData = async () => {
    try {
      const [fRes, tRes] = await Promise.all([
        fetch("/api/findings"),
        fetch("/api/targets"),
      ]);
      const fData = await fRes.json();
      const tData = await tRes.json();
      setFindings(Array.isArray(fData) ? fData : []);
      setTargets(Array.isArray(tData) ? tData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({ targetId: "", title: "", type: "Other", severity: "MEDIUM", impact: "", reproduction: "", status: "OPEN" });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const severityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };
  const sortedFindings = [...findings].sort((a, b) => (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "var(--color-accent-amber)" }}>
              <AlertTriangle size={20} />
            </div>
            <span className="text-gradient">Findings</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Track and manage security findings across targets
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Finding
        </button>
      </div>

      {/* Severity Stats */}
      <div className="grid grid-cols-5 gap-3">
        {["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"].map((sev) => {
          const count = findings.filter((f) => f.severity === sev).length;
          return (
            <div key={sev} className="stat-card text-center py-3">
              <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{count}</p>
              <span className={cn("badge text-[10px] mt-1", getSeverityColor(sev))}>{sev}</span>
            </div>
          );
        })}
      </div>

      <div className="glow-line" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--color-accent-cyan)" }} />
        </div>
      ) : findings.length === 0 ? (
        <div className="empty-state">
          <Bug size={48} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--color-text-primary)" }}>No findings yet</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Document your first security finding</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedFindings.map((finding) => (
            <div key={finding.id} className="glass-card p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === finding.id ? null : finding.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn("badge text-[10px]", getSeverityColor(finding.severity))}>{finding.severity}</span>
                    <span className={cn("badge text-[10px]", getStatusColor(finding.status))}>{finding.status}</span>
                    <span className="badge bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-[10px]">{finding.type}</span>
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{finding.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <span>{finding.target.name}</span>
                    <span>📎 {finding._count.evidences} evidence</span>
                    <span>{formatDate(finding.createdAt)}</span>
                  </div>
                </div>
              </div>

              {expandedId === finding.id && (
                <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                  {finding.impact && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Impact</h4>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--color-text-secondary)" }}>{finding.impact}</p>
                    </div>
                  )}
                  {finding.reproduction && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Reproduction</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-secondary)" }}>{finding.reproduction}</pre>
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
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>New Finding</h2>
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
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Finding Title *</label>
                <input required className="input-field" placeholder="e.g. System prompt leaked via role confusion" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Type</label>
                  <select className="select-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {FINDING_TYPES.map((t) => (<option key={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Severity</label>
                  <select className="select-field" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                    {["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"].map((s) => (<option key={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Status</label>
                  <select className="select-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {["OPEN", "CONFIRMED", "MITIGATED", "CLOSED"].map((s) => (<option key={s}>{s}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Impact</label>
                <textarea className="textarea-field" rows={3} placeholder="Describe the security impact..." value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Reproduction Steps</label>
                <textarea className="textarea-field font-mono" rows={4} placeholder="Step-by-step reproduction..." value={form.reproduction} onChange={(e) => setForm({ ...form, reproduction: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Create Finding</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
