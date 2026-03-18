import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { leadsStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  Search, LayoutDashboard, Users, SquareKanban, BarChart3,
  CheckSquare, Settings, FileCheck, DollarSign, MessageSquare,
  UserCog, Megaphone, Zap, Activity, Bell, X, ArrowRight, Command
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: typeof Search;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePalette = useCallback(() => {
    setOpen(prev => !prev);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handler = () => togglePalette();
    window.addEventListener("toggle-command-palette", handler);
    return () => window.removeEventListener("toggle-command-palette", handler);
  }, [togglePalette]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, togglePalette]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navItems: CommandItem[] = [
    { id: "nav-dash", label: "Dashboard", category: "Navegación", icon: LayoutDashboard, action: () => navigate("/admin/dashboard"), keywords: "inicio home" },
    { id: "nav-leads", label: "Lead Center", category: "Navegación", icon: Users, action: () => navigate("/admin/leads"), keywords: "leads centro" },
    { id: "nav-pipeline", label: "Pipeline", category: "Navegación", icon: SquareKanban, action: () => navigate("/admin/pipeline"), keywords: "kanban tablero" },
    { id: "nav-analytics", label: "Analytics", category: "Navegación", icon: BarChart3, action: () => navigate("/admin/analytics"), keywords: "estadísticas métricas" },
    { id: "nav-followups", label: "Follow-ups", category: "Navegación", icon: CheckSquare, action: () => navigate("/admin/follow-ups"), keywords: "seguimientos tareas" },
    { id: "nav-evals", label: "Evaluations", category: "Navegación", icon: FileCheck, action: () => navigate("/admin/evaluations"), keywords: "evaluaciones propiedades" },
    { id: "nav-offers", label: "Offers", category: "Navegación", icon: DollarSign, action: () => navigate("/admin/offers"), keywords: "ofertas negociación" },
    { id: "nav-comms", label: "Communications", category: "Navegación", icon: MessageSquare, action: () => navigate("/admin/communications"), keywords: "comunicaciones mensajes" },
    { id: "nav-campaigns", label: "Campaigns", category: "Navegación", icon: Megaphone, action: () => navigate("/admin/campaigns"), keywords: "campañas marketing" },
    { id: "nav-team", label: "Team", category: "Navegación", icon: UserCog, action: () => navigate("/admin/team"), keywords: "equipo miembros" },
    { id: "nav-auto", label: "Automations", category: "Navegación", icon: Zap, action: () => navigate("/admin/automations"), keywords: "automatizaciones reglas" },
    { id: "nav-activity", label: "Activity Log", category: "Navegación", icon: Activity, action: () => navigate("/admin/activity-log"), keywords: "actividad historial" },
    { id: "nav-notif", label: "Notifications", category: "Navegación", icon: Bell, action: () => navigate("/admin/notifications"), keywords: "notificaciones alertas" },
    { id: "nav-settings", label: "Settings", category: "Navegación", icon: Settings, action: () => navigate("/admin/settings"), keywords: "configuración ajustes" },
  ];

  const leadItems: CommandItem[] = leadsStore.slice(0, 20).map(lead => ({
    id: `lead-${lead.id}`,
    label: `${lead.name} — ${lead.municipality}`,
    category: "Leads",
    icon: Users,
    action: () => navigate(`/admin/leads/${lead.id}`),
    keywords: `${lead.phone} ${lead.email} ${lead.propertyType} ${lead.status} ${lead.region}`,
  }));

  const allItems = [...navItems, ...leadItems];

  const filtered = query.trim()
    ? allItems.filter(item => {
        const q = query.toLowerCase();
        return item.label.toLowerCase().includes(q) ||
               item.category.toLowerCase().includes(q) ||
               (item.keywords || "").toLowerCase().includes(q);
      })
    : navItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      setOpen(false);
    }
  };

  if (!open) return null;

  const groupedItems: Record<string, CommandItem[]> = {};
  filtered.forEach(item => {
    if (!groupedItems[item.category]) groupedItems[item.category] = [];
    groupedItems[item.category].push(item);
  });

  let flatIndex = 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[61]">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mx-4">
          <div className="flex items-center gap-3 px-4 border-b border-slate-100">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar leads, páginas, acciones..."
              className="flex-1 h-12 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No se encontraron resultados.</div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{category}</div>
                  {items.map(item => {
                    const idx = flatIndex++;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { item.action(); setOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                          idx === selectedIndex ? "bg-primary/5 text-primary" : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-60" />
                        <span className="flex-1 truncate">{item.label}</span>
                        <ArrowRight className={cn("h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity", idx === selectedIndex && "opacity-60")} />
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">↑↓</kbd> navegar</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">↵</kbd> seleccionar</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">esc</kbd> cerrar</span>
          </div>
        </div>
      </div>
    </>
  );
}
