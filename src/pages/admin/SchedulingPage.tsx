import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { Clock, Calendar, Save, Check, Copy, ExternalLink, Plus, Trash2, User, Link as LinkIcon, Settings2 } from "lucide-react";
import { teamMembers } from "@/store";
import { BRAND } from "@/lib/mock-data";

interface AgentSchedule {
  agentId: string;
  agentName: string;
  avatar: string;
  bookingSlug: string;
  workingHours: { day: string; dayIndex: number; enabled: boolean; start: string; end: string }[];
  bufferBefore: number;
  bufferAfter: number;
  meetingDurations: number[];
  maxPerDay: number;
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const initialSchedules: AgentSchedule[] = teamMembers
  .filter(m => m.role !== "Viewer")
  .map(m => ({
    agentId: m.id,
    agentName: m.name,
    avatar: m.avatar,
    bookingSlug: m.name.toLowerCase().replace(/\s+/g, "-").replace(/[áéíóú]/g, c => ({ á: "a", é: "e", í: "i", ó: "o", ú: "u" }[c] || c)),
    workingHours: DAYS.map((day, i) => ({
      day,
      dayIndex: i,
      enabled: i < 5,
      start: "09:00",
      end: i === 4 ? "17:00" : "18:00",
    })),
    bufferBefore: 15,
    bufferAfter: 10,
    meetingDurations: [30, 45, 60],
    maxPerDay: 8,
  }));

export default function SchedulingPage() {
  const [schedules, setSchedules] = useState<AgentSchedule[]>(initialSchedules);
  const [selectedAgent, setSelectedAgent] = useState<string>(schedules[0]?.agentId || "");
  const [saved, setSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const currentSchedule = schedules.find(s => s.agentId === selectedAgent);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSchedule = (agentId: string, updates: Partial<AgentSchedule>) => {
    setSchedules(prev => prev.map(s => s.agentId === agentId ? { ...s, ...updates } : s));
  };

  const toggleDay = (dayIndex: number) => {
    if (!currentSchedule) return;
    const newHours = currentSchedule.workingHours.map(h =>
      h.dayIndex === dayIndex ? { ...h, enabled: !h.enabled } : h
    );
    updateSchedule(selectedAgent, { workingHours: newHours });
  };

  const updateDayTime = (dayIndex: number, field: "start" | "end", value: string) => {
    if (!currentSchedule) return;
    const newHours = currentSchedule.workingHours.map(h =>
      h.dayIndex === dayIndex ? { ...h, [field]: value } : h
    );
    updateSchedule(selectedAgent, { workingHours: newHours });
  };

  const copyBookingLink = (slug: string) => {
    const link = `${window.location.origin}${import.meta.env.BASE_URL}book/agent/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(slug);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const addDuration = () => {
    if (!currentSchedule) return;
    updateSchedule(selectedAgent, { meetingDurations: [...currentSchedule.meetingDurations, 30] });
  };

  const removeDuration = (index: number) => {
    if (!currentSchedule) return;
    updateSchedule(selectedAgent, { meetingDurations: currentSchedule.meetingDurations.filter((_, i) => i !== index) });
  };

  const updateDuration = (index: number, value: number) => {
    if (!currentSchedule) return;
    const newDurations = [...currentSchedule.meetingDurations];
    newDurations[index] = value;
    updateSchedule(selectedAgent, { meetingDurations: newDurations });
  };

  return (
    <AdminLayout breadcrumbs={[{ label: "Scheduling" }]}>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-7 w-7 text-primary" />
              Scheduling & Availability
            </h1>
            <p className="text-sm text-slate-500 mt-1">Configura horarios de disponibilidad y links de reservación por agente.</p>
          </div>
          <Button onClick={handleSave} className={cn(saved && "bg-emerald-600 hover:bg-emerald-700")}>
            {saved ? <><Check className="h-4 w-4 mr-2" /> Guardado</> : <><Save className="h-4 w-4 mr-2" /> Guardar</>}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {schedules.map(s => (
            <div
              key={s.agentId}
              onClick={() => setSelectedAgent(s.agentId)}
              role="button"
              tabIndex={0}
              className={cn("p-4 rounded-xl border-2 transition-all text-left cursor-pointer", selectedAgent === s.agentId ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 bg-white hover:border-slate-300")}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">{s.avatar}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{s.agentName}</div>
                  <div className="text-[11px] text-slate-500">{s.workingHours.filter(h => h.enabled).length} días activos</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <LinkIcon className="h-3 w-3 text-slate-400" />
                <span className="text-[11px] text-primary font-medium truncate">/book/agent/{s.bookingSlug}</span>
                <button
                  onClick={e => { e.stopPropagation(); copyBookingLink(s.bookingSlug); }}
                  className="ml-auto p-1 text-slate-400 hover:text-primary"
                >
                  {copiedLink === s.bookingSlug ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentSchedule && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Horario de Trabajo — {currentSchedule.agentName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {currentSchedule.workingHours.map(wh => (
                    <div key={wh.dayIndex} className={cn("flex items-center gap-3 p-2.5 rounded-lg transition-colors", wh.enabled ? "bg-white" : "bg-slate-50 opacity-60")}>
                      <label className="flex items-center gap-2 w-28 shrink-0">
                        <input type="checkbox" checked={wh.enabled} onChange={() => toggleDay(wh.dayIndex)} className="accent-primary w-4 h-4" />
                        <span className="text-sm font-medium text-slate-700">{wh.day}</span>
                      </label>
                      {wh.enabled ? (
                        <div className="flex items-center gap-2">
                          <input type="time" value={wh.start} onChange={e => updateDayTime(wh.dayIndex, "start", e.target.value)} className="px-2 py-1 border border-slate-200 rounded-lg text-sm focus:border-primary focus:outline-none" />
                          <span className="text-slate-400 text-sm">—</span>
                          <input type="time" value={wh.end} onChange={e => updateDayTime(wh.dayIndex, "end", e.target.value)} className="px-2 py-1 border border-slate-200 rounded-lg text-sm focus:border-primary focus:outline-none" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No disponible</span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Duraciones de Reunión</CardTitle>
                    <Button size="sm" onClick={addDuration}><Plus className="h-3.5 w-3.5 mr-1" /> Agregar</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentSchedule.meetingDurations.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <input
                          type="number"
                          value={d}
                          onChange={e => updateDuration(i, parseInt(e.target.value) || 0)}
                          className="w-16 text-sm font-medium text-center border-none bg-transparent focus:outline-none"
                          min="15"
                          step="15"
                        />
                        <span className="text-xs text-slate-500">min</span>
                        <button onClick={() => removeDuration(i)} className="ml-1 p-0.5 text-slate-400 hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3"><CardTitle className="text-base">Buffer Times</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Buffer antes (minutos)</label>
                    <Input
                      type="number"
                      value={currentSchedule.bufferBefore}
                      onChange={e => updateSchedule(selectedAgent, { bufferBefore: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Buffer después (minutos)</label>
                    <Input
                      type="number"
                      value={currentSchedule.bufferAfter}
                      onChange={e => updateSchedule(selectedAgent, { bufferAfter: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Máx. reuniones por día</label>
                    <Input
                      type="number"
                      value={currentSchedule.maxPerDay}
                      onChange={e => updateSchedule(selectedAgent, { maxPerDay: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3"><CardTitle className="text-base">Booking Link</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Slug personalizado</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">/book/</span>
                      <Input
                        value={currentSchedule.bookingSlug}
                        onChange={e => updateSchedule(selectedAgent, { bookingSlug: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-[11px] text-slate-500 mb-1">Link completo:</div>
                    <div className="text-xs font-mono text-primary break-all">{window.location.origin}{import.meta.env.BASE_URL}book/agent/{currentSchedule.bookingSlug}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => copyBookingLink(currentSchedule.bookingSlug)}>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copiar
                    </Button>
                    <a href={`${import.meta.env.BASE_URL}book/agent/${currentSchedule.bookingSlug}`} target="_blank" rel="noopener">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
