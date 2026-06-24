"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Target,
  Globe,
  FlaskConical,
  KeyRound,
  Wrench,
  AlertTriangle,
  Archive,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Targets", href: "/targets", icon: Target },
  { name: "Discovery", href: "/discovery", icon: Globe },
  { name: "Prompt Lab", href: "/prompt-lab", icon: FlaskConical },
  { name: "Auth Flow", href: "/auth-flow", icon: KeyRound },
  { name: "Tools Map", href: "/tools-map", icon: Wrench },
  { name: "Findings", href: "/findings", icon: AlertTriangle },
  { name: "Evidence", href: "/evidence", icon: Archive },
  { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r transition-all duration-300 ease-in-out ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
      style={{
        borderColor: "var(--color-border-default)",
        background:
          "linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-violet))",
          }}
        >
          <Shield size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1
              className="text-sm font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Cikopiboysec
            </h1>
            <p
              className="text-[10px] font-medium tracking-wider uppercase"
              style={{ color: "var(--color-text-muted)" }}
            >
              Security Workspace
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div
        className="px-3 py-3 border-t"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-link w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
