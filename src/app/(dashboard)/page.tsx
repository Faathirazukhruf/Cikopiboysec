"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Target,
  Globe,
  FlaskConical,
  KeyRound,
  Wrench,
  Archive,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Stats {
  targets: number;
  endpoints: number;
  promptTests: number;
  findings: number;
  evidences: number;
  reports: number;
  criticalFindings: number;
  openFindings: number;
}

const modules = [
  {
    name: "Target Registry",
    href: "/targets",
    icon: Target,
    desc: "Manage research targets",
    color: "var(--color-accent-cyan)",
  },
  {
    name: "Endpoint Discovery",
    href: "/discovery",
    icon: Globe,
    desc: "Map endpoints & APIs",
    color: "var(--color-accent-blue)",
  },
  {
    name: "Prompt Behavior Lab",
    href: "/prompt-lab",
    icon: FlaskConical,
    desc: "Test AI robustness",
    color: "var(--color-accent-violet)",
  },
  {
    name: "Auth Flow Inspector",
    href: "/auth-flow",
    icon: KeyRound,
    desc: "Analyze authentication",
    color: "var(--color-accent-amber)",
  },
  {
    name: "Tool Capability Mapper",
    href: "/tools-map",
    icon: Wrench,
    desc: "Audit tool permissions",
    color: "var(--color-accent-emerald)",
  },
  {
    name: "Evidence Vault",
    href: "/evidence",
    icon: Archive,
    desc: "Store research evidence",
    color: "var(--color-accent-red)",
  },
  {
    name: "Report Generator",
    href: "/reports",
    icon: FileText,
    desc: "Generate security reports",
    color: "var(--color-accent-blue)",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">Command Center</span>
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }} className="mt-1">
          AI Security Research Workspace — Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Active Targets
            </span>
            <Target size={16} style={{ color: "var(--color-accent-cyan)" }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            {stats?.targets ?? "—"}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} style={{ color: "var(--color-accent-emerald)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Research programs
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Open Findings
            </span>
            <AlertTriangle size={16} style={{ color: "var(--color-accent-amber)" }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            {stats?.openFindings ?? "—"}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Clock size={12} style={{ color: "var(--color-accent-amber)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Awaiting review
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Critical Issues
            </span>
            <AlertTriangle size={16} style={{ color: "var(--color-accent-red)" }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--color-accent-red)" }}>
            {stats?.criticalFindings ?? "—"}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <AlertTriangle size={12} style={{ color: "var(--color-accent-red)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              High priority
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Evidence Logged
            </span>
            <CheckCircle size={16} style={{ color: "var(--color-accent-emerald)" }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            {stats?.evidences ?? "—"}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Archive size={12} style={{ color: "var(--color-accent-emerald)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Total entries
            </span>
          </div>
        </div>
      </div>

      <div className="glow-line" />

      {/* Module Grid */}
      <div>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <Link key={mod.name} href={mod.href}>
              <div className="glass-card p-5 cursor-pointer group">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                >
                  <mod.icon size={22} />
                </div>
                <h3
                  className="font-semibold text-sm mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {mod.name}
                </h3>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {mod.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
