"use client";

import { useEffect, useState } from "react";
import { FlaskConical, Plus, X, Beaker, Star } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface TargetOption {
  id: string;
  name: string;
}

interface PromptTestData {
  id: string;
  inputPrompt: string;
  systemContext: string | null;
  variant: string | null;
  score: number | null;
  aiResponse: string;
  behaviorObserved: string | null;
  safetyFlags: string | null;
  createdAt: string;
  target: { name: string };
}

export default function PromptLabPage() {
  const [tests, setTests] = useState<PromptTestData[]>([]);
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    targetId: "",
    inputPrompt: "",
    systemContext: "",
    variant: "",
    score: "",
    aiResponse: "",
    behaviorObserved: "",
    safetyFlags: "",
  });

  const fetchData = async () => {
    try {
      const [testRes, targetRes] = await Promise.all([
        fetch("/api/prompt-tests"),
        fetch("/api/targets"),
      ]);
      const testData = await testRes.json();
      const tData = await targetRes.json();
      setTests(Array.isArray(testData) ? testData : []);
      setTargets(Array.isArray(tData) ? tData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/prompt-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          score: form.score ? parseInt(form.score) : null,
        }),
      });
      setShowModal(false);
      setForm({ targetId: "", inputPrompt: "", systemContext: "", variant: "", score: "", aiResponse: "", behaviorObserved: "", safetyFlags: "" });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const renderScoreBar = (score: number | null) => {
    if (score === null) return null;
    const clamped = Math.min(10, Math.max(0, score));
    const pct = clamped * 10;
    const color = clamped <= 3 ? "var(--color-accent-emerald)" : clamped <= 6 ? "var(--color-accent-amber)" : "var(--color-accent-red)";
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-bg-primary)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
        <span className="text-xs font-mono font-bold" style={{ color }}>{score}/10</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "var(--color-accent-violet)" }}>
              <FlaskConical size={20} />
            </div>
            <span className="text-gradient">Prompt Behavior Lab</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Test AI robustness, compare outputs, and analyze behavior
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Test
        </button>
      </div>

      <div className="glow-line" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent" style={{ borderTopColor: "var(--color-accent-cyan)" }} />
        </div>
      ) : tests.length === 0 ? (
        <div className="empty-state">
          <Beaker size={48} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--color-text-primary)" }}>No tests yet</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Run your first prompt behavior test</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className="glass-card p-5 cursor-pointer"
              onClick={() => setExpandedId(expandedId === test.id ? null : test.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge bg-violet-500/20 text-violet-400 border-violet-500/30 text-[10px]">
                      {test.target.name}
                    </span>
                    {test.variant && (
                      <span className="badge bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-[10px]">
                        {test.variant}
                      </span>
                    )}
                    {test.safetyFlags && (
                      <span className="badge bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                        ⚠ {test.safetyFlags}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono line-clamp-1" style={{ color: "var(--color-text-primary)" }}>
                    {test.inputPrompt}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {test.score !== null && (
                    <div className="flex items-center gap-1">
                      <Star size={12} style={{ color: "var(--color-accent-amber)" }} />
                      <span className="text-xs font-bold" style={{ color: "var(--color-accent-amber)" }}>{test.score}</span>
                    </div>
                  )}
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {formatDateTime(test.createdAt)}
                  </span>
                </div>
              </div>

              {test.score !== null && (
                <div className="mt-2 max-w-xs">
                  {renderScoreBar(test.score)}
                </div>
              )}

              {/* Expanded Detail */}
              {expandedId === test.id && (
                <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Input Prompt</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-accent-cyan)" }}>
                        {test.inputPrompt}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>AI Response</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-secondary)" }}>
                        {test.aiResponse}
                      </pre>
                    </div>
                  </div>
                  {test.systemContext && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>System Context</h4>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap" style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-muted)" }}>
                        {test.systemContext}
                      </pre>
                    </div>
                  )}
                  {test.behaviorObserved && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Behavior Observed</h4>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{test.behaviorObserved}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>New Prompt Test</h2>
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
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Input Prompt *</label>
                <textarea required className="textarea-field font-mono" rows={4} placeholder="Enter the test prompt..." value={form.inputPrompt} onChange={(e) => setForm({ ...form, inputPrompt: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>System Context</label>
                <textarea className="textarea-field font-mono" rows={3} placeholder="System prompt / context..." value={form.systemContext} onChange={(e) => setForm({ ...form, systemContext: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>AI Response *</label>
                <textarea required className="textarea-field font-mono" rows={4} placeholder="What the AI responded..." value={form.aiResponse} onChange={(e) => setForm({ ...form, aiResponse: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Variant</label>
                  <input className="input-field" placeholder="v1, baseline, etc" value={form.variant} onChange={(e) => setForm({ ...form, variant: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Score (0-10)</label>
                  <input type="number" min="0" max="10" className="input-field" placeholder="0-10" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Behavior Observed</label>
                <textarea className="textarea-field" rows={2} placeholder="Observed behavior patterns..." value={form.behaviorObserved} onChange={(e) => setForm({ ...form, behaviorObserved: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Safety Flags</label>
                <input className="input-field" placeholder="e.g. context_leak, role_override" value={form.safetyFlags} onChange={(e) => setForm({ ...form, safetyFlags: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Save Test</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
