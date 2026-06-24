"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  ExternalLink,
  Trash2,
  X,
  Globe,
  FlaskConical,
  Archive,
  AlertTriangle,
} from "lucide-react";
import { formatDate, getStatusColor, cn } from "@/lib/utils";

interface TargetData {
  id: string;
  name: string;
  baseUrl: string;
  scope: string | null;
  authFlowType: string | null;
  aiModelInfo: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  _count: {
    endpoints: number;
    findings: number;
    evidences: number;
    reports: number;
  };
}

export default function TargetsPage() {
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    baseUrl: "",
    scope: "",
    authFlowType: "",
    aiModelInfo: "",
    notes: "",
    status: "RESEARCHING",
  });

  const fetchTargets = async () => {
    try {
      const res = await fetch("/api/targets");
      const data = await res.json();
      setTargets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({
        name: "",
        baseUrl: "",
        scope: "",
        authFlowType: "",
        aiModelInfo: "",
        notes: "",
        status: "RESEARCHING",
      });
      fetchTargets();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this target and all related data?")) return;
    try {
      await fetch(`/api/targets/${id}`, { method: "DELETE" });
      fetchTargets();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg"
              style={{
                backgroundColor: "rgba(0, 229, 255, 0.1)",
                color: "var(--color-accent-cyan)",
              }}
            >
              <Target size={20} />
            </div>
            <span className="text-gradient">Target Registry</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Manage your research targets and track progress
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" id="add-target-btn">
          <Plus size={16} />
          Add Target
        </button>
      </div>

      <div className="glow-line" />

      {/* Target Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--color-accent-cyan)" }} />
        </div>
      ) : targets.length === 0 ? (
        <div className="empty-state">
          <Target size={48} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--color-text-primary)" }}>
            No targets yet
          </h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Add your first research target to get started
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
            <Plus size={16} />
            Add First Target
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {targets.map((target) => (
            <div key={target.id} className="glass-card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-base truncate"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {target.name}
                  </h3>
                  <a
                    href={target.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs mt-1 hover:underline"
                    style={{ color: "var(--color-accent-cyan)" }}
                  >
                    <ExternalLink size={11} />
                    {target.baseUrl}
                  </a>
                </div>
                <span className={cn("badge", getStatusColor(target.status))}>
                  {target.status}
                </span>
              </div>

              {target.aiModelInfo && (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  🤖 {target.aiModelInfo}
                </p>
              )}

              {target.scope && (
                <p
                  className="text-xs line-clamp-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {target.scope}
                </p>
              )}

              {/* Stats */}
              <div
                className="flex items-center gap-4 pt-3 border-t text-xs"
                style={{
                  borderColor: "var(--color-border-subtle)",
                  color: "var(--color-text-muted)",
                }}
              >
                <span className="flex items-center gap-1">
                  <Globe size={12} /> {target._count.endpoints}
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle size={12} /> {target._count.findings}
                </span>
                <span className="flex items-center gap-1">
                  <Archive size={12} /> {target._count.evidences}
                </span>
                <span className="flex items-center gap-1">
                  <FlaskConical size={12} /> {target._count.reports}
                </span>
                <span className="ml-auto">{formatDate(target.createdAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(target.id)}
                  className="btn-danger text-xs px-2 py-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                New Target
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-white/5"
                style={{ color: "var(--color-text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Target Name *
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="e.g. ChatGPT Plugin System"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Base URL *
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="https://example.com"
                  value={form.baseUrl}
                  onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    Auth Flow Type
                  </label>
                  <select
                    className="select-field"
                    value={form.authFlowType}
                    onChange={(e) => setForm({ ...form, authFlowType: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="OAuth2">OAuth2</option>
                    <option value="JWT">JWT</option>
                    <option value="API Key">API Key</option>
                    <option value="Session">Session</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    Status
                  </label>
                  <select
                    className="select-field"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="RESEARCHING">Researching</option>
                    <option value="TESTING">Testing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  AI Model Info
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. GPT-4, Claude 3.5"
                  value={form.aiModelInfo}
                  onChange={(e) => setForm({ ...form, aiModelInfo: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Scope
                </label>
                <textarea
                  className="textarea-field"
                  placeholder="Define scope / boundaries..."
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Notes
                </label>
                <textarea
                  className="textarea-field"
                  placeholder="Initial observations..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Create Target
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
