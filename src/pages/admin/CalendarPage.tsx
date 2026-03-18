import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Video, X, Loader2 } from "lucide-react";
import { calendarService } from "@/lib/services/calendarService";
import type { CalendarEvent, CalendarView, CalendarIntegration } from "@/lib/operations-types";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";

const VIEW_OPTIONS: { key: CalendarView; label: string }[] = [
  { key: 'day', label: 'Día' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'agenda', label: 'Agenda' },
];

const EVENT_TYPE_LABELS: Record<string, string> = {
  'property-viewing': 'Visita',
  'seller-meeting': 'Reunión',
  'follow-up': 'Follow-up',
  'evaluation': 'Evaluación',
  'closing': 'Cierre',
  'team-meeting': 'Equipo',
  'other': 'Otro',
};

const EVENT_COLORS: Record<string, string> = {
  'property-viewing': '#3B82F6',
  'seller-meeting': '#8B5CF6',
  'follow-up': '#F59E0B',
  'evaluation': '#10B981',
  'closing': '#EF4444',
  'team-meeting': '#6366F1',
  'other': '#94A3B8',
};

const BLOCKED_HOURS = [12, 13, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7];

function generateEventsForMonth(year: number, month: number, baseEvents: CalendarEvent[]): CalendarEvent[] {
  const seed = year * 100 + month;
  const pseudoRandom = (n: number) => ((seed * 9301 + 49297 + n * 233) % 233280) / 233280;

  const eventTemplates = [
    { title: 'Visita propiedad', type: 'property-viewing' as const, duration: 60 },
    { title: 'Reunión con vendedor', type: 'seller-meeting' as const, duration: 60 },
    { title: 'Follow-up lead', type: 'follow-up' as const, duration: 30 },
    { title: 'Evaluación propiedad', type: 'evaluation' as const, duration: 90 },
    { title: 'Cierre de venta', type: 'closing' as const, duration: 120 },
    { title: 'Reunión de equipo', type: 'team-meeting' as const, duration: 60 },
  ];

  const names = ['Carlos Rivera', 'María López', 'Ana Martínez', 'Pedro Morales', 'Isabel Torres', 'Diana Cruz', 'José Santos', 'Roberto Hernández', 'Miguel Colón', 'Carmen Díaz'];
  const locations = ['Bayamón', 'Ponce', 'Carolina', 'Guaynabo', 'Mayagüez', 'San Juan', 'Arecibo', 'Oficina'];
  const owners = ['María Santos', 'Carlos Reyes', 'Juan Delgado'];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (month === currentMonth && year === currentYear) {
    return baseEvents;
  }

  const numEvents = 6 + Math.floor(pseudoRandom(0) * 8);
  const generated: CalendarEvent[] = [];

  for (let i = 0; i < numEvents; i++) {
    const tmpl = eventTemplates[Math.floor(pseudoRandom(i * 7 + 1) * eventTemplates.length)];
    const day = 1 + Math.floor(pseudoRandom(i * 7 + 2) * 28);
    const hour = 8 + Math.floor(pseudoRandom(i * 7 + 3) * 9);
    const name = names[Math.floor(pseudoRandom(i * 7 + 4) * names.length)];
    const location = locations[Math.floor(pseudoRandom(i * 7 + 5) * locations.length)];
    const owner = owners[Math.floor(pseudoRandom(i * 7 + 6) * owners.length)];
    const statusOpts: ('confirmed' | 'tentative')[] = ['confirmed', 'tentative'];
    const status = statusOpts[Math.floor(pseudoRandom(i * 7 + 7) * 2)];

    const startDate = new Date(year, month, day, hour, 0, 0);
    const endDate = new Date(year, month, day, hour + Math.floor(tmpl.duration / 60), tmpl.duration % 60, 0);

    generated.push({
      id: `gen-${year}-${month}-${i}`,
      title: `${tmpl.title} - ${name}`,
      type: tmpl.type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      allDay: false,
      location,
      attendees: [name],
      owner,
      color: EVENT_COLORS[tmpl.type],
      status,
      reminderMinutes: 30,
      createdAt: new Date().toISOString(),
    });
  }

  return generated;
}

export default function CalendarPage() {
  const [baseEvents, setBaseEvents] = useState<CalendarEvent[]>([]);
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CalendarView>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    Promise.all([calendarService.getAll(), calendarService.getIntegrations()]).then(([evts, ints]) => {
      setBaseEvents(evts);
      setIntegrations(ints);
      setLoading(false);
    });
  }, []);

  const events = useMemo(() => {
    return generateEventsForMonth(currentDate.getFullYear(), currentDate.getMonth(), baseEvents);
  }, [currentDate.getFullYear(), currentDate.getMonth(), baseEvents]);

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + dir);
    else if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const upcomingEvents = events
    .filter(e => new Date(e.startDate) >= new Date() && e.status !== 'cancelled')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const getEventsForDay = (day: Date) =>
    events.filter(e => isSameDay(new Date(e.startDate), day) && e.status !== 'cancelled');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: monthWeekStart, end: monthWeekEnd });

  const agendaEvents = events
    .filter(e => e.status !== 'cancelled')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const isBlockedHour = (hour: number) => BLOCKED_HOURS.includes(hour);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Calendario</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona citas, evaluaciones y reuniones.</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Nueva Cita</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
                    <h2 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
                      {view === 'day' && format(currentDate, "EEEE, d MMMM yyyy", { locale: es })}
                      {view === 'week' && `${format(weekDays[0], "d MMM", { locale: es })} — ${format(weekDays[6], "d MMM yyyy", { locale: es })}`}
                      {(view === 'month' || view === 'agenda') && format(currentDate, "MMMM yyyy", { locale: es })}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => navigate(1)}><ChevronRight className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoy</Button>
                  </div>
                  <div className="flex bg-slate-100 rounded-lg p-0.5">
                    {VIEW_OPTIONS.map(v => (
                      <button key={v.key} onClick={() => setView(v.key)} className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", view === v.key ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}>{v.label}</button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : view === 'day' ? (
                  <div className="space-y-1">
                    {Array.from({ length: 12 }, (_, i) => i + 7).map(hour => {
                      const dayEvents = getEventsForDay(currentDate).filter(e => new Date(e.startDate).getHours() === hour);
                      const blocked = isBlockedHour(hour);
                      return (
                        <div key={hour} className={cn("flex items-stretch gap-2 min-h-[48px] group", blocked && "opacity-40")}>
                          <div className="w-14 text-right text-xs text-slate-400 pt-1 shrink-0">{`${hour}:00`}</div>
                          <div className={cn("flex-1 border-t border-slate-100 relative", blocked && "bg-slate-100 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.03)_4px,rgba(0,0,0,0.03)_8px)]")}>
                            {blocked && <span className="absolute top-1 right-2 text-[9px] text-slate-400 font-medium">No disponible</span>}
                            {dayEvents.map(evt => (
                              <button key={evt.id} onClick={() => setSelectedEvent(evt)} className="w-full text-left">
                                <EventCard event={evt} compact onSelect={setSelectedEvent} />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : view === 'week' ? (
                  <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
                    {weekDays.map(day => (
                      <div key={day.toISOString()} className={cn("bg-white min-h-[140px] p-2", isToday(day) && "bg-blue-50/50")}>
                        <div className={cn("text-xs font-medium mb-1", isToday(day) ? "text-primary" : "text-slate-500")}>
                          {format(day, "EEE d", { locale: es })}
                        </div>
                        <div className="space-y-1">
                          {getEventsForDay(day).map(evt => (
                            <button key={evt.id} onClick={() => setSelectedEvent(evt)} className="w-full text-left text-[11px] p-1.5 rounded-md truncate font-medium cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: evt.color + '20', color: evt.color, borderLeft: `3px solid ${evt.color}` }}>
                              {format(new Date(evt.startDate), "HH:mm")} {evt.title.split(' - ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : view === 'month' ? (
                  <div>
                    <div className="grid grid-cols-7 gap-px mb-px">
                      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                        <div key={d} className="text-xs font-semibold text-slate-500 text-center py-2">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
                      {monthDays.map(day => {
                        const dayEvents = getEventsForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        return (
                          <div key={day.toISOString()} className={cn("bg-white min-h-[80px] p-1.5", !isCurrentMonth && "bg-slate-50", isToday(day) && "bg-blue-50/50")}>
                            <div className={cn("text-xs font-medium", isToday(day) ? "text-primary font-bold" : isCurrentMonth ? "text-slate-700" : "text-slate-300")}>{format(day, "d")}</div>
                            {dayEvents.slice(0, 2).map(evt => (
                              <button key={evt.id} onClick={() => setSelectedEvent(evt)} className="w-full text-left text-[10px] mt-0.5 px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: evt.color + '20', color: evt.color }}>{evt.title.split(' - ')[0]}</button>
                            ))}
                            {dayEvents.length > 2 && <div className="text-[10px] text-slate-400 px-1">+{dayEvents.length - 2} más</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {agendaEvents.length === 0 ? (
                      <div className="text-center py-16 text-slate-400">No hay eventos en la agenda.</div>
                    ) : agendaEvents.map(evt => (
                      <button key={evt.id} onClick={() => setSelectedEvent(evt)} className="w-full text-left">
                        <EventCard event={evt} onSelect={setSelectedEvent} />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Próximos</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4">Sin eventos próximos</div>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map(evt => (
                      <button key={evt.id} onClick={() => setSelectedEvent(evt)} className="w-full text-left p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors cursor-pointer">
                        <div className="text-xs font-semibold text-slate-900 truncate">{evt.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{format(new Date(evt.startDate), "EEE d MMM, HH:mm", { locale: es })}</div>
                        <Badge variant="secondary" className="mt-1 text-[10px]">{EVENT_TYPE_LABELS[evt.type]}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base">Integraciones</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-3">
                  {integrations.map(int => (
                    <div key={int.provider} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{int.name}</div>
                        {int.email && <div className="text-[11px] text-slate-400">{int.email}</div>}
                      </div>
                      <Badge variant={int.status === 'connected' ? 'success' : int.status === 'error' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {int.status === 'connected' ? 'Conectado' : int.status === 'error' ? 'Error' : int.status === 'coming-soon' ? 'Próximamente' : 'Desconectado'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedEvent(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg shadow-2xl border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-10 rounded-full" style={{ backgroundColor: selectedEvent.color }} />
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">{selectedEvent.title}</h3>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">{EVENT_TYPE_LABELS[selectedEvent.type]}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedEvent(null)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Horario</div>
                    <div className="text-sm font-semibold text-slate-900">{format(new Date(selectedEvent.startDate), "HH:mm")} – {format(new Date(selectedEvent.endDate), "HH:mm")}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{format(new Date(selectedEvent.startDate), "EEEE d MMM yyyy", { locale: es })}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Ubicación</div>
                    <div className="text-sm font-semibold text-slate-900">{selectedEvent.location || "Sin ubicación"}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Estado</div>
                  <Badge variant={selectedEvent.status === 'confirmed' ? 'success' : selectedEvent.status === 'tentative' ? 'medium' : 'low'} className="text-[10px]">
                    {selectedEvent.status === 'confirmed' ? 'Confirmado' : selectedEvent.status === 'tentative' ? 'Tentativo' : 'Cancelado'}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><Users className="h-3 w-3" /> Participantes ({selectedEvent.attendees.length})</h4>
                  <div className="space-y-2">
                    {selectedEvent.attendees.map((attendee, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                          {(typeof attendee === 'string' ? attendee : attendee).substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-slate-700">{typeof attendee === 'string' ? attendee : attendee}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        {selectedEvent.owner.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-slate-700">{selectedEvent.owner}</span>
                      <span className="text-[10px] text-slate-400">(Organizador)</span>
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-[11px] text-slate-500 mb-1">Descripción</div>
                    <p className="text-sm text-slate-700">{selectedEvent.description}</p>
                  </div>
                )}

                {selectedEvent.location && (selectedEvent.location.toLowerCase().includes('zoom') || selectedEvent.location.toLowerCase().includes('virtual') || selectedEvent.location.toLowerCase().includes('meet')) ? (
                  <Button className="w-full">
                    <Video className="h-4 w-4 mr-2" /> Unirse a la Reunión
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" /> Ver Detalles de Ubicación
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function EventCard({ event, compact, onSelect }: { event: CalendarEvent; compact?: boolean; onSelect?: (e: CalendarEvent) => void }) {
  const isPast = isBefore(new Date(event.endDate), new Date());
  return (
    <div
      onClick={() => onSelect?.(event)}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer",
        isPast ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200 hover:border-primary/30"
      )}
    >
      <div className="w-1.5 h-14 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(event.startDate), "HH:mm")} – {format(new Date(event.endDate), "HH:mm")}</span>
              <span>{format(new Date(event.startDate), "d MMM", { locale: es })}</span>
            </div>
          </div>
          <Badge variant={event.status === 'confirmed' ? 'success' : event.status === 'tentative' ? 'medium' : 'low'} className="text-[10px] shrink-0">
            {event.status === 'confirmed' ? 'Confirmado' : event.status === 'tentative' ? 'Tentativo' : 'Cancelado'}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
          {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.attendees.length}</span>
          <Badge variant="secondary" className="text-[10px]">{EVENT_TYPE_LABELS[event.type]}</Badge>
        </div>
      </div>
    </div>
  );
}
