"use client";

import { useEffect, useState } from "react";
import { Archive, Plus, X, FileImage, AlertTriangle } from "lucide-react";
import { formatDateTime, getSeverityColor, cn } from "@/lib/utils";

interface TargetOption { id: string; name: string; }
interface FindingOption { id: string; title: string; severity: string; }

interface EvidenceData {
  id: string;
  title: string;
  requestLog: string | null;
  responseLog: string | null;
  fileUrl: string | null;
  severity: string;
  notes: string | null;
  createdAt: string;
  target: { name: string };
  finding: { title: string; severity: string } | null;
}

export default function EvidencePage() {
  const [evidences, setEvidences] = useState<EvidenceData[]>([]);
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [findings, setFindings] = useState<FindingOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    targetId: "",
    findingId: "",
    title: "",
    requestLog: "",
    responseLog: "",
    fileUrl: "",
    severity: "INFO",
    notes: "",
  });

  const fetchData = async () => {
    try {
      const [evRes, tRes, fRes] = await Promise.all([
        fetch("/api/evidence"),
        fetch("/api/targets"),
        fetch("/api/findings"),
      ]);
      const evData = await evRes.json();
      const tData = await tRes.json();
      const fData = await fRes.json();
      setEvidences(Array.isArray(evData) ? evData : []);
      setTargets(Array.isArray(tData) ? tData : []);
      setFindings(Array.isArray(fData) ? fData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          findingId: form.findingId || null,
          fileUrl: form.fileUrl || null,
        }),
      });
      setShowModal(false);
      setForm({ targetId: "", findingId: "", title: "", requestLog: "", responseLog: "", fileUrl: "", severity: "INFO", notes: "" });
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-accent-red)" }}>
              <Archive size={20} />
            </div>
            <span className="text-gradient">Evidence Vault</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Store requests, responses, and screenshots
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add Evidence
        </button>
      </div>

      <div className="glow-line" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--color-accent-cyan)" }} />
        </div>
      ) : evidences.length === 0 ? (
        <div className="empty-state">
          <FileImage size={48} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--color-text-primary)" }}>No evidence stored</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Start documenting your findings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {evidences.map((ev) => (
            <div key={ev.id} className="glass-card p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("badge text-[10px]", getSeverityColor(ev.severity))}>
                      {ev.severity}
                    </span>
                    <span className="badge bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-[10px]">
                      {ev.target.name}
                    </span>
                    {ev.finding && (
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--color-accent-amber)" }}>
                        <AlertTriangle size={10} /> {ev.finding.title}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{ev.title}</h3>
                </div>
                <span className="text-xs ml-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>{formatDateTime(ev.createdAt)}</span>
              </div>

              {ev.notes && (
                <p className="text-xs mt-2 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>{ev.notes}</p>
              )}

              {expandedId === ev.id && (
                <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                  {ev.requestLog && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Request</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-accent-cyan)" }}>{ev.requestLog}</pre>
                    </div>
                  )}
                  {ev.responseLog && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Response</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-secondary)" }}>{ev.responseLog}</pre>
                    </div>
                  )}
                  {ev.fileUrl && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Attachment</h4>
                      <a href={ev.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: "var(--color-accent-cyan)" }}>
                        📎 {ev.fileUrl}
                      </a>
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
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>Add Evidence</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/5" style={{ color: "var(--color-text-muted)" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Target *</label>
                  <select required className="select-field" value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })}>
                    <option value="">Select target...</option>
                    {targets.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Link to Finding</label>
                  <select className="select-field" value={form.findingId} onChange={(e) => setForm({ ...form, findingId: e.target.value })}>
                    <option value="">None</option>
                    {findings.map((f) => (<option key={f.id} value={f.id}>{f.title} ({f.severity})</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Title *</label>
                <input required className="input-field" placeholder="Evidence title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Severity</label>
                <select className="select-field" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                  {["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (<option key={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Request Log</label>
                <textarea className="textarea-field font-mono" rows={4} placeholder="HTTP request..." value={form.requestLog} onChange={(e) => setForm({ ...form, requestLog: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Response Log</label>
                <textarea className="textarea-field font-mono" rows={4} placeholder="HTTP response..." value={form.responseLog} onChange={(e) => setForm({ ...form, responseLog: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>File URL (Screenshot)</label>
                <input className="input-field" placeholder="https://..." value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Notes</label>
                <textarea className="textarea-field" rows={2} placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Save Evidence</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
