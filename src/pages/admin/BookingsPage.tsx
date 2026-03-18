import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { CalendarCheck, Plus, Search, Clock, MapPin, User, Phone, Mail, Filter, Eye, XCircle, CheckCircle, AlertTriangle, Loader2, Video } from "lucide-react";
import { bookingService } from "@/lib/services/bookingService";
import type { Booking, BookingStatus, BookingEventType } from "@/lib/operations-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "wouter";

const STATUS_TABS: { key: BookingStatus | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'Todos', color: '' },
  { key: 'upcoming', label: 'Próximos', color: 'text-blue-600' },
  { key: 'completed', label: 'Completados', color: 'text-emerald-600' },
  { key: 'canceled', label: 'Cancelados', color: 'text-slate-500' },
  { key: 'no-show', label: 'No-show', color: 'text-red-600' },
];

const STATUS_BADGES: Record<BookingStatus, { variant: any; label: string }> = {
  upcoming: { variant: 'default', label: 'Próximo' },
  completed: { variant: 'success', label: 'Completado' },
  canceled: { variant: 'low', label: 'Cancelado' },
  'no-show': { variant: 'destructive', label: 'No-show' },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypes, setEventTypes] = useState<BookingEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([bookingService.getAll(), bookingService.getEventTypes()]).then(([bks, ets]) => {
      setBookings(bks);
      setEventTypes(ets);
      setLoading(false);
    });
  }, []);

  const filtered = bookings
    .filter(b => activeTab === 'all' || b.status === activeTab)
    .filter(b => !search || b.guestName.toLowerCase().includes(search.toLowerCase()) || b.eventTypeName.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: bookings.length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    canceled: bookings.filter(b => b.status === 'canceled').length,
    'no-show': bookings.filter(b => b.status === 'no-show').length,
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Reservaciones</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona citas y reservaciones de clientes.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/book">
              <Button variant="outline" className="bg-white"><Eye className="h-4 w-4 mr-2" /> Ver Página Pública</Button>
            </Link>
            <Button><Plus className="h-4 w-4 mr-2" /> Nueva Reservación</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {eventTypes.slice(0, 5).map(et => (
            <Card key={et.id} className="shadow-sm border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: et.color }} />
                  <span className="text-xs font-semibold text-slate-900">{et.name}</span>
                </div>
                <div className="text-xs text-slate-500">{et.duration} min · {et.location}</div>
                <Badge variant={et.isActive ? 'success' : 'low'} className="mt-2 text-[10px]">{et.isActive ? 'Activo' : 'Inactivo'}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex gap-1 overflow-x-auto">
                {STATUS_TABS.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", activeTab === tab.key ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>
                    {tab.label} ({counts[tab.key]})
                  </button>
                ))}
              </div>
              <div className="relative w-64 hidden sm:block">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">No hay reservaciones.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map(booking => {
                  const badge = STATUS_BADGES[booking.status];
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                          {booking.guestName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{booking.guestName}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{booking.eventTypeName}</div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(booking.date), "d MMM", { locale: es })} · {booking.startTime} – {booking.endTime}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {booking.status === 'upcoming' && (
                          <Link href={`/admin/meeting/${booking.id}`}>
                            <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors">
                              <Video className="h-3 w-3" /> Join
                            </button>
                          </Link>
                        )}
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-slate-500">{booking.owner}</div>
                        </div>
                        <Badge variant={badge.variant} className="text-[10px]">{badge.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
