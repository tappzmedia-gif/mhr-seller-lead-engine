import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button } from "@/components/ui-components";
import { notifications as initialNotifications, type Notification } from "@/store";
import { cn } from "@/lib/utils";
import { Bell, Flame, Clock, Users, FileCheck, DollarSign, Megaphone, AlertTriangle, CheckCheck, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const TYPE_CONFIG: Record<Notification["type"], { icon: typeof Bell; color: string; label: string }> = {
  new_lead: { icon: Users, color: "bg-blue-50 text-blue-600", label: "Nuevo Lead" },
  hot_lead: { icon: Flame, color: "bg-red-50 text-red-600", label: "Lead Hot" },
  overdue: { icon: Clock, color: "bg-amber-50 text-amber-600", label: "Vencido" },
  reassigned: { icon: Users, color: "bg-indigo-50 text-indigo-600", label: "Reasignado" },
  evaluation_done: { icon: FileCheck, color: "bg-emerald-50 text-emerald-600", label: "Evaluación" },
  offer_updated: { icon: DollarSign, color: "bg-purple-50 text-purple-600", label: "Oferta" },
  campaign_alert: { icon: Megaphone, color: "bg-orange-50 text-orange-600", label: "Campaña" },
  system: { icon: AlertTriangle, color: "bg-slate-50 text-slate-600", label: "Sistema" },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifications);
  const [filter, setFilter] = useState<string>("all");

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    initialNotifications.forEach(n => { n.read = true; });
    window.dispatchEvent(new Event("notifications-updated"));
  };

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const found = initialNotifications.find(n => n.id === id);
    if (found) found.read = true;
    window.dispatchEvent(new Event("notifications-updated"));
  };

  const filtered = notifs
    .filter(n => filter === "all" || (filter === "unread" && !n.read) || n.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEntityLink = (n: Notification): string | null => {
    if (!n.entityId) return null;
    if (n.entityType === "lead") return `/admin/leads/${n.entityId}`;
    if (n.entityType === "evaluation") return `/admin/evaluations`;
    if (n.entityType === "offer") return `/admin/offers`;
    if (n.entityType === "campaign") return `/admin/campaigns`;
    return null;
  };

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Notifications" }]}>
      <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Notifications</h1>
            <p className="text-sm text-slate-500 mt-1">{unreadCount} sin leer</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllRead}><CheckCheck className="h-4 w-4 mr-2" /> Marcar todas como leídas</Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Todas" },
            { key: "unread", label: `Sin Leer (${unreadCount})` },
            { key: "new_lead", label: "Nuevos Leads" },
            { key: "hot_lead", label: "Hot Leads" },
            { key: "overdue", label: "Vencidos" },
            { key: "offer_updated", label: "Ofertas" },
            { key: "evaluation_done", label: "Evaluaciones" },
            { key: "campaign_alert", label: "Campañas" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filter === f.key ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-200 hover:border-primary/50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <Card className="shadow-sm border-slate-200">
              <CardContent className="py-16 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Sin notificaciones</h3>
                <p className="text-slate-500 text-sm">No hay notificaciones en esta categoría.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map(notif => {
              const cfg = TYPE_CONFIG[notif.type];
              const Icon = cfg.icon;
              const link = getEntityLink(notif);
              return (
                <Card
                  key={notif.id}
                  className={cn(
                    "shadow-sm transition-all cursor-pointer hover:shadow-md",
                    !notif.read ? "border-primary/30 bg-primary/[0.02]" : "border-slate-200"
                  )}
                  onClick={() => markRead(notif.id)}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{notif.title}</span>
                        {!notif.read && <span className="w-2 h-2 bg-primary rounded-full shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{notif.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                        <Badge className={cn("border-0 text-[10px]", cfg.color)}>{cfg.label}</Badge>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(notif.date), { addSuffix: true, locale: es })}</span>
                      </div>
                    </div>
                    {link && (
                      <Link href={link} onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs shrink-0"><Eye className="h-3 w-3 mr-1" /> Ver</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
