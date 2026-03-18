import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button, Select, Input } from "@/components/ui-components";
import { activityLog, type ActivityLogEntry } from "@/store";
import { cn } from "@/lib/utils";
import {
  Activity, Users, Phone, Mail, MessageCircle, FileCheck, DollarSign,
  CheckSquare, Megaphone, AlertTriangle, Search, ArrowRight, FileText,
  Calendar, X, Download
} from "lucide-react";
import { format, formatDistanceToNow, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";

const TYPE_CONFIG: Record<ActivityLogEntry["type"], { icon: typeof Activity; color: string; label: string }> = {
  lead_created: { icon: Users, color: "bg-blue-50 text-blue-600", label: "Lead Creado" },
  status_change: { icon: ArrowRight, color: "bg-indigo-50 text-indigo-600", label: "Cambio Estado" },
  note_added: { icon: FileText, color: "bg-amber-50 text-amber-600", label: "Nota" },
  call_logged: { icon: Phone, color: "bg-emerald-50 text-emerald-600", label: "Llamada" },
  email_sent: { icon: Mail, color: "bg-purple-50 text-purple-600", label: "Email" },
  whatsapp_sent: { icon: MessageCircle, color: "bg-green-50 text-green-600", label: "WhatsApp" },
  evaluation_scheduled: { icon: FileCheck, color: "bg-orange-50 text-orange-600", label: "Evaluación" },
  offer_sent: { icon: DollarSign, color: "bg-pink-50 text-pink-600", label: "Oferta Enviada" },
  offer_accepted: { icon: CheckSquare, color: "bg-emerald-50 text-emerald-600", label: "Oferta Aceptada" },
  follow_up_completed: { icon: CheckSquare, color: "bg-teal-50 text-teal-600", label: "Follow-up" },
  lead_reassigned: { icon: Users, color: "bg-violet-50 text-violet-600", label: "Reasignado" },
  campaign_started: { icon: Megaphone, color: "bg-cyan-50 text-cyan-600", label: "Campaña" },
  system: { icon: AlertTriangle, color: "bg-slate-50 text-slate-600", label: "Sistema" },
};

export default function ActivityLogPage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const users = Array.from(new Set(activityLog.map(a => a.user)));
  const hasActiveFilters = typeFilter !== "All" || userFilter !== "All" || searchTerm || dateFrom || dateTo;

  const filtered = activityLog
    .filter(a => typeFilter === "All" || a.type === typeFilter)
    .filter(a => userFilter === "All" || a.user === userFilter)
    .filter(a => !searchTerm || a.description.toLowerCase().includes(searchTerm.toLowerCase()) || (a.entityName || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(a => {
      if (dateFrom) {
        const from = startOfDay(new Date(dateFrom));
        if (isBefore(new Date(a.date), from)) return false;
      }
      if (dateTo) {
        const to = endOfDay(new Date(dateTo));
        if (isAfter(new Date(a.date), to)) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const clearFilters = () => {
    setTypeFilter("All");
    setUserFilter("All");
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Activity Log" }]}>
      <div className="p-6 lg:p-8 max-w-[1000px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Activity Log</h1>
            <p className="text-sm text-slate-500 mt-1">Registro cronológico de todas las acciones del sistema.</p>
          </div>
        </div>

        <Card className="p-4 shadow-sm border-slate-200">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Buscar actividad..." className="pl-9 h-9 bg-slate-50" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select className="h-9 w-44 bg-slate-50 text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">Todos los tipos</option>
                <option value="lead_created">Lead Creado</option>
                <option value="status_change">Cambio Estado</option>
                <option value="call_logged">Llamada</option>
                <option value="email_sent">Email</option>
                <option value="whatsapp_sent">WhatsApp</option>
                <option value="note_added">Nota</option>
                <option value="evaluation_scheduled">Evaluación</option>
                <option value="offer_sent">Oferta</option>
                <option value="offer_accepted">Oferta Aceptada</option>
                <option value="follow_up_completed">Follow-up</option>
                <option value="lead_reassigned">Reasignado</option>
                <option value="campaign_started">Campaña</option>
                <option value="system">Sistema</option>
              </Select>
              <Select className="h-9 w-40 bg-slate-50 text-sm" value={userFilter} onChange={e => setUserFilter(e.target.value)}>
                <option value="All">Todos los usuarios</option>
                {users.map(u => <option key={u}>{u}</option>)}
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <Input type="date" className="h-9 bg-slate-50 text-sm flex-1" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="Desde" />
                <span className="text-xs text-slate-400">a</span>
                <Input type="date" className="h-9 bg-slate-50 text-sm flex-1" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="Hasta" />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-slate-500 shrink-0">
                  <X className="h-3 w-3 mr-1" /> Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="text-sm text-slate-500">{filtered.length} actividades</div>

        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200" />
          <div className="space-y-0">
            {filtered.map(entry => {
              const cfg = TYPE_CONFIG[entry.type];
              const Icon = cfg.icon;
              const entityLink = entry.entityType === "lead" && entry.entityId ? `/admin/leads/${entry.entityId}` : null;
              return (
                <div key={entry.id} className="relative flex gap-4 py-3 pl-1">
                  <div className={cn("w-[46px] h-[46px] rounded-lg flex items-center justify-center shrink-0 z-10 border-2 border-white", cfg.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-slate-700">{entry.description}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 flex-wrap">
                      <Badge className={cn("border-0 text-[10px]", cfg.color)}>{cfg.label}</Badge>
                      <span>·</span>
                      <span>{entry.user}</span>
                      <span>·</span>
                      <span>{format(new Date(entry.date), "dd MMM yyyy, h:mm a", { locale: es })}</span>
                      <span className="text-slate-300">({formatDistanceToNow(new Date(entry.date), { addSuffix: true, locale: es })})</span>
                      {entityLink && entry.entityName && (
                        <>
                          <span>·</span>
                          <Link href={entityLink} className="text-primary hover:underline font-medium">{entry.entityName}</Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Activity className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No se encontraron actividades con los filtros seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
