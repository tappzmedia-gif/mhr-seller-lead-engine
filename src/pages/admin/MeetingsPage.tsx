import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { Video, Plus, Search, Users, ExternalLink, Phone, MessageCircle, Monitor, CheckCircle, ArrowRight, FileText, Loader2, X, Mic, MicOff, VideoOff, PhoneOff, Settings } from "lucide-react";
import { meetingsService } from "@/lib/services/meetingsService";
import type { Meeting, MeetingProvider, MeetingStatus } from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "wouter";

const PROVIDER_INFO: Record<MeetingProvider, { label: string; color: string; icon: typeof Video }> = {
  'zoom': { label: 'Zoom', color: '#2D8CFF', icon: Video },
  'google-meet': { label: 'Google Meet', color: '#00897B', icon: Video },
  'teams': { label: 'Teams', color: '#6264A7', icon: Monitor },
  'whatsapp': { label: 'WhatsApp', color: '#25D366', icon: MessageCircle },
  'phone': { label: 'Teléfono', color: '#F59E0B', icon: Phone },
  'in-person': { label: 'Presencial', color: '#8B5CF6', icon: Users },
};

const STATUS_LABELS: Record<MeetingStatus, { label: string; variant: any }> = {
  'scheduled': { label: 'Programada', variant: 'default' },
  'in-progress': { label: 'En curso', variant: 'high' },
  'completed': { label: 'Completada', variant: 'success' },
  'canceled': { label: 'Cancelada', variant: 'low' },
  'no-show': { label: 'No-show', variant: 'destructive' },
};

const OUTCOME_LABELS: Record<string, { label: string; color: string }> = {
  'positive': { label: 'Positivo', color: 'text-emerald-600 bg-emerald-50' },
  'neutral': { label: 'Neutral', color: 'text-slate-600 bg-slate-100' },
  'negative': { label: 'Negativo', color: 'text-red-600 bg-red-50' },
  'follow-up-needed': { label: 'Follow-up', color: 'text-amber-600 bg-amber-50' },
  'closed-won': { label: 'Won', color: 'text-emerald-600 bg-emerald-50' },
  'closed-lost': { label: 'Lost', color: 'text-red-600 bg-red-50' },
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerFilter, setProviderFilter] = useState<MeetingProvider | 'all'>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [search, setSearch] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    meetingsService.getAll().then(m => { setMeetings(m); setLoading(false); });
  }, []);

  const filtered = meetings
    .filter(m => providerFilter === 'all' || m.provider === providerFilter)
    .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()));

  const scheduled = meetings.filter(m => m.status === 'scheduled').length;
  const completed = meetings.filter(m => m.status === 'completed').length;

  const getMeetingLink = (meeting: Meeting): string => {
    return meeting.meetingLink || '';
  };

  const getMeetingTypeLabel = (meeting: Meeting): string => {
    const prov = PROVIDER_INFO[meeting.provider];
    return prov ? prov.label : 'Reunión';
  };

  const handleJoinClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowJoinModal(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Centro de Reuniones</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona reuniones virtuales y presenciales.</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Nueva Reunión</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{meetings.length}</div><div className="text-xs text-slate-500">Total Reuniones</div></CardContent></Card>
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-blue-600">{scheduled}</div><div className="text-xs text-slate-500">Programadas</div></CardContent></Card>
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-600">{completed}</div><div className="text-xs text-slate-500">Completadas</div></CardContent></Card>
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-red-600">{meetings.filter(m => m.status === 'no-show').length}</div><div className="text-xs text-slate-500">No-shows</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex gap-1 overflow-x-auto">
                    <button onClick={() => setProviderFilter('all')} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", providerFilter === 'all' ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>Todos</button>
                    {(Object.keys(PROVIDER_INFO) as MeetingProvider[]).map(p => (
                      <button key={p} onClick={() => setProviderFilter(p)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", providerFilter === p ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>{PROVIDER_INFO[p].label}</button>
                    ))}
                  </div>
                  <div className="relative w-48 hidden sm:block">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-9 text-xs" />
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">No hay reuniones.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filtered.map(meeting => {
                      const prov = PROVIDER_INFO[meeting.provider];
                      const stat = STATUS_LABELS[meeting.status];
                      const ProvIcon = prov?.icon || Video;
                      return (
                        <div key={meeting.id} className={cn("flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer", selectedMeeting?.id === meeting.id && "bg-primary/5")} onClick={() => setSelectedMeeting(meeting)}>
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: prov?.color || '#94A3B8' }}>
                              <ProvIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{meeting.title}</div>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                <span>{format(new Date(meeting.date), "d MMM", { locale: es })} · {meeting.startTime}</span>
                                <span>·</span>
                                <span>{meeting.duration} min</span>
                                {getMeetingLink(meeting) && (
                                  <>
                                    <span>·</span>
                                    <span className="text-primary truncate max-w-[120px]">{getMeetingLink(meeting)}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: (prov?.color || '#94A3B8') + '15', color: prov?.color || '#94A3B8' }}>
                                  {getMeetingTypeLabel(meeting)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {meeting.outcome && OUTCOME_LABELS[meeting.outcome] && (
                              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", OUTCOME_LABELS[meeting.outcome].color)}>
                                {OUTCOME_LABELS[meeting.outcome].label}
                              </span>
                            )}
                            <Badge variant={stat?.variant || 'default'} className="text-[10px]">{stat?.label || 'Desconocido'}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedMeeting ? (
              <Card className="shadow-sm border-slate-200 sticky top-20">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base">{selectedMeeting.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PROVIDER_INFO[selectedMeeting.provider]?.color || '#94A3B8' }}>
                      {(() => { const ProvIcon = PROVIDER_INFO[selectedMeeting.provider]?.icon || Video; return <ProvIcon className="h-4 w-4" />; })()}
                    </div>
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        {PROVIDER_INFO[selectedMeeting.provider]?.label || 'Reunión'}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: (PROVIDER_INFO[selectedMeeting.provider]?.color || '#94A3B8') + '15', color: PROVIDER_INFO[selectedMeeting.provider]?.color || '#94A3B8' }}>
                          {selectedMeeting.provider === 'in-person' ? 'Presencial' : selectedMeeting.provider === 'phone' ? 'Llamada' : 'Video'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{format(new Date(selectedMeeting.date), "EEEE d MMM, yyyy", { locale: es })}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Hora</span><span className="font-medium">{selectedMeeting.startTime} – {selectedMeeting.endTime}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Duración</span><span className="font-medium">{selectedMeeting.duration} min</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Owner</span><span className="font-medium">{selectedMeeting.owner}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Estado</span><Badge variant={STATUS_LABELS[selectedMeeting.status]?.variant || 'default'} className="text-[10px]">{STATUS_LABELS[selectedMeeting.status]?.label || 'Desconocido'}</Badge></div>
                    {getMeetingLink(selectedMeeting) && (
                      <div className="flex justify-between items-start">
                        <span className="text-slate-500">Enlace</span>
                        <span className="font-medium text-primary text-xs truncate max-w-[160px]">{getMeetingLink(selectedMeeting)}</span>
                      </div>
                    )}
                    {selectedMeeting.location && (
                      <div className="flex justify-between"><span className="text-slate-500">Ubicación</span><span className="font-medium">{selectedMeeting.location}</span></div>
                    )}
                  </div>

                  {(selectedMeeting.status === 'scheduled' || selectedMeeting.status === 'in-progress') && (
                    <Button onClick={() => handleJoinClick(selectedMeeting)} className="w-full justify-center text-sm">
                      <Video className="h-4 w-4 mr-2" /> Unirse a Reunión
                    </Button>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Asistentes</h4>
                    <div className="space-y-2">
                      {selectedMeeting.attendees.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">{a.name.substring(0, 2).toUpperCase()}</div>
                          <span className="text-slate-700">{a.name}</span>
                          <span className="text-xs text-slate-400">({a.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedMeeting.agenda && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Agenda</h4>
                      <p className="text-xs text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-lg">{selectedMeeting.agenda}</p>
                    </div>
                  )}

                  {selectedMeeting.notes && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Notas</h4>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedMeeting.notes}</p>
                    </div>
                  )}

                  {selectedMeeting.status === 'completed' && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Acciones Post-Reunión</h4>
                      <div className="space-y-1.5">
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs"><FileText className="h-3.5 w-3.5 mr-2" /> Agregar nota</Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs"><CheckCircle className="h-3.5 w-3.5 mr-2" /> Crear tarea</Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs"><FileText className="h-3.5 w-3.5 mr-2" /> Enviar propuesta</Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs"><ArrowRight className="h-3.5 w-3.5 mr-2" /> Mover en pipeline</Button>
                      </div>
                    </div>
                  )}

                  {selectedMeeting.activities && selectedMeeting.activities.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Actividad</h4>
                      <div className="space-y-2">
                        {selectedMeeting.activities.map(a => (
                          <div key={a.id} className="text-[11px] text-slate-500">
                            <span className="font-medium text-slate-700">{a.action}</span>
                            <div className="text-slate-400">{a.author} · {formatDistanceToNow(new Date(a.date), { addSuffix: true, locale: es })}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-8 text-center text-slate-400">
                  <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Selecciona una reunión para ver detalles.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {showJoinModal && selectedMeeting && (
        <JoinModal meeting={selectedMeeting} onClose={() => setShowJoinModal(false)} />
      )}
    </AdminLayout>
  );
}

function JoinModal({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [joined, setJoined] = useState(false);

  const prov = PROVIDER_INFO[meeting.provider] || { label: 'Reunión', color: '#94A3B8', icon: Video };
  const meetingLink = meeting.meetingLink || '';
  const ProvIcon = prov.icon;

  if (joined) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 z-50" />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="h-10 bg-slate-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-semibold">{meeting.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs font-mono">00:00:12</span>
                <span className="text-slate-400 text-xs flex items-center gap-1"><Users className="h-3 w-3" /> {meeting.attendees.length + 1}</span>
              </div>
            </div>

            <div className="p-6 flex items-center justify-center" style={{ minHeight: 300 }}>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center border-2 border-emerald-500">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">Tú</div>
                    <span className="text-white text-xs">Tú</span>
                  </div>
                </div>
                {meeting.attendees.slice(0, 3).map((a, i) => (
                  <div key={i} className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">{a.name.substring(0, 2).toUpperCase()}</div>
                      <span className="text-white text-xs">{a.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-14 bg-slate-800 flex items-center justify-center gap-3 border-t border-slate-700">
              <button onClick={() => setIsMuted(!isMuted)} className={cn("w-10 h-10 rounded-full flex items-center justify-center", isMuted ? "bg-red-500 text-white" : "bg-slate-700 text-white")}>
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button onClick={() => setIsVideoOn(!isVideoOn)} className={cn("w-10 h-10 rounded-full flex items-center justify-center", !isVideoOn ? "bg-red-500 text-white" : "bg-slate-700 text-white")}>
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700">
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: prov.color + '30' }}>
              <ProvIcon className="h-10 w-10" style={{ color: prov.color }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Unirse a Reunión</h2>
            <p className="text-slate-400 text-sm mb-1">{meeting.title}</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: prov.color }}>
                {prov.label}
              </span>
              <span className="text-xs text-slate-500">{meeting.startTime} – {meeting.endTime}</span>
            </div>

            {meetingLink && (
              <div className="bg-slate-800 rounded-lg p-3 mb-4 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-xs text-primary truncate flex-1">{meetingLink}</span>
              </div>
            )}

            <div className="bg-slate-800 rounded-xl p-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl">
                Tú
              </div>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setIsMuted(!isMuted)} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", isMuted ? "bg-red-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600")}>
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button onClick={() => setIsVideoOn(!isVideoOn)} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", !isVideoOn ? "bg-red-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600")}>
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4 text-xs text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <span>{meeting.attendees.length} participante{meeting.attendees.length > 1 ? 's' : ''} esperando</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onClose}>Cancelar</Button>
              <Button className="flex-1" onClick={() => setJoined(true)}>
                <Video className="h-4 w-4 mr-2" /> Unirse Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
