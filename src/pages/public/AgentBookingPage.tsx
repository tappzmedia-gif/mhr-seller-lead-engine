import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check, User, Mail, Phone, Video, PhoneCall, Users as UsersIcon, ArrowRight, Lock } from "lucide-react";
import { BRAND } from "@/lib/mock-data";
import { teamMembers } from "@/store";
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

const MEETING_TYPES = [
  { id: "video", label: "Video Call", icon: Video, description: "Reunión virtual por video", duration: 30 },
  { id: "phone", label: "Llamada Telefónica", icon: PhoneCall, description: "Consulta por teléfono", duration: 20 },
  { id: "in-person", label: "Presencial", icon: UsersIcon, description: "Visita en persona", duration: 45 },
];

const ALL_SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];

function getBookedSlotsForAgent(dateStr: string, agentSlug: string): string[] {
  const seed = (dateStr + agentSlug).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pseudoRandom = (n: number) => ((seed * 9301 + 49297 + n * 233) % 233280) / 233280;
  const numBooked = 1 + Math.floor(pseudoRandom(1) * 3);
  const booked: string[] = [];
  for (let i = 0; i < numBooked; i++) {
    const idx = Math.floor(pseudoRandom(i + 2) * ALL_SLOTS.length);
    if (!booked.includes(ALL_SLOTS[idx])) booked.push(ALL_SLOTS[idx]);
  }
  return booked;
}

export function AgentBookingPage() {
  const [, params] = useRoute("/book/agent/:agentSlug");
  const [, setLocation] = useLocation();
  const agentSlug = params?.agentSlug || "";

  const agent = teamMembers.find(m => {
    const slug = m.name.toLowerCase().replace(/\s+/g, "-").replace(/[áéíóú]/g, c => ({ á: "a", é: "e", í: "i", ó: "o", ú: "u" }[c as string] || c));
    return slug === agentSlug;
  });

  const [step, setStep] = useState<"type" | "time" | "details" | "success">("type");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const handleBack = () => {
    setLocation("/book");
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><User className="h-8 w-8 text-red-500" /></div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Agente No Encontrado</h2>
            <p className="text-slate-500 mb-6">No pudimos encontrar un agente con ese enlace. Verifica el link o agenda directamente.</p>
            <Button onClick={handleBack}>Ver Opciones de Cita</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const meetingType = MEETING_TYPES.find(t => t.id === selectedType);

  const bookedSlots = getBookedSlotsForAgent(format(selectedDate, 'yyyy-MM-dd'), agentSlug);
  const availableSlots = ALL_SLOTS.filter(s => !bookedSlots.includes(s));

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-emerald-600" /></div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">¡Cita Confirmada!</h2>
            <p className="text-slate-500 mb-4">Tu cita con {agent.name} ha sido agendada.</p>
            <div className="space-y-2 text-sm bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between"><span className="text-slate-500">Agente</span><span className="font-medium">{agent.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tipo</span><span className="font-medium">{meetingType?.label}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Fecha</span><span className="font-medium">{format(selectedDate, "d MMM yyyy", { locale: es })}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Hora</span><span className="font-medium">{selectedSlot}</span></div>
            </div>
            <Button variant="outline" onClick={handleBack}>Agendar otra cita</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <button onClick={handleBack} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4" /> Volver a opciones
        </button>

        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">{agent.avatar}</div>
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">{agent.name}</h2>
                <div className="text-sm text-slate-500">{agent.role} · {BRAND.name}</div>
              </div>
            </div>

            {step === "type" && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Selecciona el tipo de reunión</h3>
                <div className="grid gap-3">
                  {MEETING_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => { setSelectedType(type.id); setStep("time"); }}
                      className={cn("flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left hover:border-primary/30 hover:shadow-md", selectedType === type.id ? "border-primary bg-primary/5" : "border-slate-200")}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><type.icon className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">{type.label}</div>
                        <div className="text-xs text-slate-500">{type.description} · {type.duration} min</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "time" && (
              <div>
                <button onClick={() => setStep("type")} className="text-xs text-primary font-medium mb-4 flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> Cambiar tipo</button>
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
                        return (
                          <button key={day.toISOString()} onClick={() => { if (!isPast) { setSelectedDate(day); setSelectedSlot(null); } }} disabled={isPast}
                            className={cn("p-2 rounded-lg text-center transition-all", isSelected ? "bg-primary text-white" : isPast ? "text-slate-300 cursor-not-allowed" : "hover:bg-slate-100 text-slate-700")}>
                            <div className="text-[10px] font-medium">{format(day, "EEE", { locale: es })}</div>
                            <div className="text-lg font-bold">{format(day, "d")}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Horarios — {format(selectedDate, "d MMM", { locale: es })}</h3>
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                      {ALL_SLOTS.map(slot => {
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
                  </div>
                </div>
                {selectedSlot && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <Button onClick={() => setStep("details")} className="px-6">Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            )}

            {step === "details" && (
              <div>
                <button onClick={() => setStep("time")} className="text-xs text-primary font-medium mb-4 flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> Cambiar horario</button>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-1">Tus Datos</h3>
                <p className="text-sm text-slate-500 mb-6">Completa la información para confirmar tu cita con {agent.name}.</p>
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
                    <textarea className="flex min-h-[80px] w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all" placeholder="¿Algo que debamos saber?" />
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={() => setStep("success")}>
                  <Check className="h-4 w-4 mr-2" /> Confirmar Cita
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
