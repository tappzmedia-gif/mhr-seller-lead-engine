import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Card, CardContent, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { Clock, MapPin, ChevronLeft, ChevronRight, Check, Building2, ArrowRight, User, Mail, Phone, Loader2, Lock } from "lucide-react";
import { bookingService } from "@/lib/services/bookingService";
import type { BookingEventType } from "@/lib/operations-types";
import { BRAND } from "@/lib/mock-data";
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

const BOOKED_SLOTS: Record<string, string[]> = {};

function getBookedSlotsForDate(dateStr: string): string[] {
  if (BOOKED_SLOTS[dateStr]) return BOOKED_SLOTS[dateStr];
  const seed = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);
  const pseudoRandom = (n: number) => ((seed * 9301 + 49297 + n * 233) % 233280) / 233280;
  const allSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  const numBooked = 2 + Math.floor(pseudoRandom(1) * 4);
  const booked: string[] = [];
  for (let i = 0; i < numBooked; i++) {
    const idx = Math.floor(pseudoRandom(i + 2) * allSlots.length);
    if (!booked.includes(allSlots[idx])) booked.push(allSlots[idx]);
  }
  BOOKED_SLOTS[dateStr] = booked;
  return booked;
}

export function BookingSelect() {
  const [eventTypes, setEventTypes] = useState<BookingEventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getEventTypes().then(ets => { setEventTypes(ets.filter(e => e.isActive)); setLoading(false); });
  }, []);

  const consultationTypes = eventTypes.filter(et => et.slug === 'evaluacion' || et.slug === 'consulta');
  const otherTypes = eventTypes.filter(et => et.slug !== 'evaluacion' && et.slug !== 'consulta');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-display font-bold text-2xl text-slate-900">
              {BRAND.name}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Agenda tu Consulta</h1>
          <p className="text-slate-500">Selecciona el tipo de consulta que necesitas.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <>
            {consultationTypes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Consultas Principales
                </h2>
                <div className="grid gap-4">
                  {consultationTypes.map(et => (
                    <Link key={et.id} href={`/book/${et.slug}`}>
                      <Card className="shadow-sm border-slate-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-12 rounded-full" style={{ backgroundColor: et.color }} />
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{et.name}</h3>
                              <p className="text-sm text-slate-500">{et.description}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {et.duration} min</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {et.location}</span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {otherTypes.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Otras Opciones</h2>
                <div className="grid gap-4">
                  {otherTypes.map(et => (
                    <Link key={et.id} href={`/book/${et.slug}`}>
                      <Card className="shadow-sm border-slate-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-12 rounded-full" style={{ backgroundColor: et.color }} />
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{et.name}</h3>
                              <p className="text-sm text-slate-500">{et.description}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {et.duration} min</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {et.location}</span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function BookingTimePicker() {
  const [, params] = useRoute("/book/:eventType");
  const slug = params?.eventType || "";
  const [eventTypes, setEventTypes] = useState<BookingEventType[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const eventType = eventTypes.find(e => e.slug === slug);

  useEffect(() => {
    bookingService.getEventTypes().then(ets => { setEventTypes(ets); setLoading(false); });
  }, []);

  useEffect(() => {
    if (eventType) {
      bookingService.getAvailableSlots(eventType.id, selectedDate.toISOString()).then(s => setSlots(s));
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setBookedSlots(getBookedSlotsForDate(dateStr));
      setSelectedSlot(null);
    }
  }, [eventType, selectedDate]);

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!eventType) return <div className="min-h-screen flex items-center justify-center text-slate-500">Tipo de evento no encontrado.</div>;

  const availableSlots = slots.filter(s => !bookedSlots.includes(s));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <Link href="/book" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6"><ChevronLeft className="h-4 w-4" /> Volver</Link>

        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-3 h-10 rounded-full" style={{ backgroundColor: eventType.color }} />
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">{eventType.name}</h2>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {eventType.duration} min</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {eventType.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} className="p-1 hover:bg-slate-100 rounded" disabled={weekOffset === 0}><ChevronLeft className="h-4 w-4" /></button>
                  <h3 className="text-sm font-semibold text-slate-900">{format(weekDays[0], "d MMM", { locale: es })} — {format(weekDays[6], "d MMM yyyy", { locale: es })}</h3>
                  <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map(day => {
                    const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                    const dayBooked = getBookedSlotsForDate(format(day, 'yyyy-MM-dd'));
                    const hasAvailability = 15 - dayBooked.length > 0;
                    return (
                      <button key={day.toISOString()} onClick={() => !isPast && setSelectedDate(day)} disabled={isPast}
                        className={cn("p-2 rounded-lg text-center transition-all relative", isSelected ? "bg-primary text-white" : isPast ? "text-slate-300 cursor-not-allowed" : "hover:bg-slate-100 text-slate-700")}>
                        <div className="text-[10px] font-medium">{format(day, "EEE", { locale: es })}</div>
                        <div className="text-lg font-bold">{format(day, "d")}</div>
                        {!isPast && !isSelected && hasAvailability && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-slate-400">
                  Zona horaria: America/Puerto_Rico (AST)
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Disponible</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-300" /> Reservado</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Horarios — {format(selectedDate, "d MMM", { locale: es })}</h3>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {slots.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium border transition-all relative",
                          isBooked
                            ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed line-through"
                            : selectedSlot === slot
                              ? "bg-primary text-white border-primary"
                              : "border-slate-200 text-slate-700 hover:border-primary/30"
                        )}
                      >
                        {isBooked && <Lock className="h-2.5 w-2.5 absolute top-1 right-1 text-red-300" />}
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {availableSlots.length === 0 && (
                  <div className="text-center py-6 text-sm text-slate-400">No hay horarios disponibles para este día.</div>
                )}
              </div>
            </div>

            {selectedSlot && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <Link href={`/book/${slug}/details`}>
                  <Button className="px-6">Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function BookingDetails() {
  const [, params] = useRoute("/book/:eventType/details");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-emerald-600" /></div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">¡Cita Confirmada!</h2>
            <p className="text-slate-500 mb-6">Te enviaremos un email de confirmación con los detalles.</p>
            <div className="space-y-3 text-sm bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between"><span className="text-slate-500">Fecha</span><span className="font-medium">Próxima fecha disponible</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Hora</span><span className="font-medium">Horario seleccionado</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Zona horaria</span><span className="font-medium">AST (Puerto Rico)</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" disabled>Google Calendar</Button>
              <Button variant="outline" className="flex-1" disabled>Outlook</Button>
              <Button variant="outline" className="flex-1" disabled>iCal</Button>
            </div>
            <Link href="/book"><Button variant="link" className="mt-4">Agendar otra cita</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link href={`/book/${params?.eventType}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6"><ChevronLeft className="h-4 w-4" /> Volver</Link>

        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-1">Tus Datos</h2>
            <p className="text-sm text-slate-500 mb-6">Completa la información para confirmar tu cita.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo *</label>
                <div className="relative"><User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><Input placeholder="Tu nombre completo" className="pl-9" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                <div className="relative"><Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><Input type="email" placeholder="tu@email.com" className="pl-9" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono *</label>
                <div className="relative"><Phone className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><Input placeholder="(787) 555-0000" className="pl-9" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Notas adicionales</label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all" placeholder="¿Algo que debamos saber antes de la reunión?" />
              </div>
            </div>

            <Button className="w-full mt-6" onClick={() => setSubmitted(true)}>
              <Check className="h-4 w-4 mr-2" /> Confirmar Cita
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function BookingSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-emerald-600" /></div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">¡Cita Confirmada!</h2>
          <p className="text-slate-500 mb-6">Te enviaremos un email de confirmación con los detalles y un enlace para la reunión.</p>
          <Link href="/book"><Button variant="outline">Agendar otra cita</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
