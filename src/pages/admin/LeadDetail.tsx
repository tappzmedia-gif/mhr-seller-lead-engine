import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useLead, useUpdateLead, useAddActivity } from "@/hooks/use-leads";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Select } from "@/components/ui-components";
import { scoreCategoryToBadgeVariant, priorityToBadgeVariant } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Phone, Mail, MessageCircle, MapPin, Home, Clock, AlertTriangle,
  DollarSign, User, Calendar, Tag, FileText, PhoneCall, CheckCircle2,
  ChevronDown, Edit3, Send, X, BarChart3, Users, Eye, FileCheck, Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { LeadStatus, Activity } from "@/lib/mock-data";
import type { LucideIcon } from "lucide-react";
import { evaluations, offers, teamMembers } from "@/store";

const STATUS_OPTIONS: LeadStatus[] = [
  "New", "Attempted Contact", "Contacted", "Waiting on Seller",
  "Qualified", "Evaluation Pending", "Offer Review", "Negotiation", "Won", "Lost", "Not Qualified"
];

const ACTIVITY_ICONS: Record<Activity["type"], LucideIcon> = {
  Call: PhoneCall,
  Email: Mail,
  WhatsApp: MessageCircle,
  Note: FileText,
  StatusChange: CheckCircle2,
  System: AlertTriangle,
  SiteVisit: Eye,
};

export default function LeadDetail() {
  const [, params] = useRoute("/admin/leads/:id");
  const id = params?.id || "";
  const { data: lead, isLoading } = useLead(id);
  const updateLead = useUpdateLead();
  const addActivity = useAddActivity();

  const [newNote, setNewNote] = useState("");
  const [activityType, setActivityType] = useState<Activity["type"]>("Note");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const leadEvaluations = useMemo(() =>
    lead ? evaluations.filter(e => e.leadId === lead.id) : [], [lead]
  );

  const leadOffers = useMemo(() =>
    lead ? offers.filter(o => o.leadId === lead.id) : [], [lead]
  );

  const handleStatusChange = (newStatus: LeadStatus) => {
    if (!lead) return;
    updateLead.mutate({ id: lead.id, status: newStatus });
    addActivity.mutate({
      leadId: lead.id,
      activity: {
        type: "StatusChange",
        description: `Estado cambiado a ${newStatus}`,
        author: lead.owner,
      },
    });
    setShowStatusDropdown(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-500 animate-pulse">Cargando lead...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Lead no encontrado</h2>
          <Link href="/admin/leads"><Button variant="outline">Volver a Lead Center</Button></Link>
        </div>
      </AdminLayout>
    );
  }

  const handleAddActivity = () => {
    if (!newNote.trim()) return;
    addActivity.mutate({
      leadId: lead.id,
      activity: { type: activityType, description: newNote, author: "María Santos" }
    });
    setNewNote("");
  };

  const handleAssign = (agentName: string) => {
    updateLead.mutate({ id: lead.id, owner: agentName });
    addActivity.mutate({
      leadId: lead.id,
      activity: { type: "System", description: `Lead reasignado a ${agentName}`, author: "María Santos" }
    });
    setShowAssignModal(false);
  };

  const isOverdue = lead.nextFollowUp && new Date(lead.nextFollowUp) < new Date();

  const scoreColor = lead.scoreCategory === "Hot" ? "from-red-500 to-orange-500" :
    lead.scoreCategory === "High" ? "from-orange-400 to-amber-400" :
    lead.scoreCategory === "Medium" ? "from-amber-400 to-yellow-400" :
    "from-slate-300 to-slate-400";

  return (
    <AdminLayout>
      <motion.div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-4">
          <Link href="/admin/leads">
            <Button variant="ghost" size="sm" className="text-slate-500">
              <ArrowLeft className="h-4 w-4 mr-1" /> Lead Center
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              {lead.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900">{lead.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span>{lead.id}</span>
                <span>·</span>
                <span>Creado {formatDistanceToNow(new Date(lead.entryDate), { addSuffix: true, locale: es })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)} className="text-sm px-3 py-1">
              {lead.scoreCategory} · {lead.score}
            </Badge>
            <div className="relative">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                {lead.status} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 max-h-72 overflow-y-auto">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors",
                          s === lead.status && "bg-primary/5 text-primary font-medium"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Button variant="outline" className="bg-white" onClick={() => setShowAssignModal(true)}><Users className="h-4 w-4 mr-2" /> Asignar</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className={cn("h-2 bg-gradient-to-r", scoreColor)} />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-bold text-slate-900">Lead Score</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-3xl font-display font-black",
                      lead.scoreCategory === "Hot" ? "text-red-600" :
                      lead.scoreCategory === "High" ? "text-orange-500" :
                      lead.scoreCategory === "Medium" ? "text-amber-500" : "text-slate-400"
                    )}>{lead.score}</span>
                    <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)} className="text-xs">{lead.scoreCategory}</Badge>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", scoreColor)}
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Timeline", value: lead.timeline, weight: lead.timeline === "Urgente" ? "+30" : lead.timeline === "Solo evaluando" ? "-30" : "+0" },
                    { label: "Condición", value: lead.condition, weight: ["Necesita reparaciones", "Muy deteriorada"].includes(lead.condition) ? "+15" : "+0" },
                    { label: "Situación", value: lead.situation.join(", "), weight: lead.situation.some(s => ["Herencia", "Deudas"].includes(s)) ? "+15" : "+0" },
                    { label: "Tipo", value: lead.propertyType, weight: ["Multifamiliar", "Comercial"].includes(lead.propertyType) ? "+10" : "+0" },
                    { label: "Región", value: lead.region, weight: lead.region === "Metro" ? "+5" : "+0" },
                    { label: "Deuda", value: lead.hasDebt, weight: lead.hasDebt === "Sí" ? "+5" : "+0" },
                  ].map(factor => (
                    <div key={factor.label} className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-[11px] text-slate-400 mb-1">{factor.label}</div>
                      <div className="text-sm font-semibold text-slate-700 truncate">{factor.value}</div>
                      <div className={cn("text-xs font-bold mt-1",
                        factor.weight.startsWith("+") && factor.weight !== "+0" ? "text-emerald-500" :
                        factor.weight.startsWith("-") ? "text-red-500" : "text-slate-400"
                      )}>{factor.weight}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary"><Phone className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">Teléfono</div>
                    <div className="font-semibold text-slate-900 truncate">{lead.phone}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Mail className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">Email</div>
                    <div className="font-semibold text-slate-900 truncate">{lead.email || "—"}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><MessageCircle className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">Contacto preferido</div>
                    <div className="font-semibold text-slate-900 truncate">{lead.preferredContact}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> Detalles de la Propiedad</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6">
                  <InfoItem icon={Home} label="Tipo" value={lead.propertyType} />
                  <InfoItem icon={MapPin} label="Municipio" value={lead.municipality} />
                  <InfoItem icon={MapPin} label="Sector" value={lead.sector || "—"} />
                  <InfoItem icon={MapPin} label="Región" value={lead.region} />
                  <InfoItem icon={AlertTriangle} label="Condición" value={lead.condition} />
                  <InfoItem icon={DollarSign} label="Valor Estimado" value={lead.estimatedValue} />
                  <InfoItem icon={Clock} label="Urgencia" value={lead.timeline} highlight={lead.timeline === "Urgente"} />
                  <InfoItem icon={DollarSign} label="Deuda/Hipoteca" value={lead.hasDebt} />
                  <InfoItem icon={User} label="Ocupada" value={lead.isOccupied} />
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="text-sm font-medium text-slate-500 mb-2">Situación</div>
                  <div className="flex flex-wrap gap-2">
                    {lead.situation.map((s, i) => (
                      <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700">{s}</Badge>
                    ))}
                  </div>
                </div>

                {lead.additionalMessage && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <div className="text-sm font-medium text-slate-500 mb-2">Mensaje del vendedor</div>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{lead.additionalMessage}"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {(leadEvaluations.length > 0 || leadOffers.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leadEvaluations.length > 0 && (
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="border-b border-slate-100 pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><FileCheck className="h-4 w-4 text-orange-500" /> Evaluaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                      {leadEvaluations.map(ev => (
                        <Link key={ev.id} href="/admin/evaluations" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{ev.id}</div>
                            <div className="text-xs text-slate-500">{ev.propertyType} — {ev.municipality}</div>
                          </div>
                          <Badge variant={
                            ev.status === "Completed" ? "high" :
                            ev.status === "In Progress" ? "hot" :
                            ev.status === "Cancelled" ? "low" : "secondary"
                          } className="text-[10px]">{ev.status}</Badge>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}
                {leadOffers.length > 0 && (
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="border-b border-slate-100 pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4 text-purple-500" /> Ofertas</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                      {leadOffers.map(of => (
                        <Link key={of.id} href="/admin/offers" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{of.id} — ${of.amount.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">{format(new Date(of.createdDate), "dd MMM yyyy", { locale: es })}</div>
                          </div>
                          <Badge variant={
                            of.status === "Accepted" ? "high" :
                            of.status === "Rejected" ? "low" :
                            of.status === "Countered" ? "hot" : "secondary"
                          } className="text-[10px]">{of.status}</Badge>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle>Actividad y Notas</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex gap-3 mb-6">
                  <div className="flex-1 flex gap-2">
                    <Select
                      value={activityType}
                      onChange={e => setActivityType(e.target.value as Activity["type"])}
                      className="w-36 h-10 shrink-0"
                    >
                      <option value="Note">Nota</option>
                      <option value="Call">Llamada</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="SiteVisit">Visita</option>
                    </Select>
                    <Input
                      placeholder="Agregar nota o registro de actividad..."
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddActivity()}
                      className="h-10"
                    />
                  </div>
                  <Button onClick={handleAddActivity} disabled={!newNote.trim()} className="h-10">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-0">
                  {lead.activities.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No hay actividad registrada aún.</div>
                  ) : (
                    lead.activities.map((act) => {
                      const IconComp = ACTIVITY_ICONS[act.type] || FileText;
                      return (
                        <div key={act.id} className="flex gap-4 py-3 border-b border-slate-50 last:border-0">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700">{act.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                              <span>{act.author}</span>
                              <span>·</span>
                              <span>{format(new Date(act.date), "dd MMM yyyy, h:mm a", { locale: es })}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-5 space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-500 block mb-1.5">Owner</span>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {lead.owner.split(" ").map(w => w[0]).join("").toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 flex-1">{lead.owner}</span>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowAssignModal(true)}>
                      <Edit3 className="h-3 w-3 mr-1" /> Cambiar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Fuente</span>
                  <span className="text-sm font-semibold text-slate-900">{lead.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Prioridad</span>
                  <Badge variant={priorityToBadgeVariant(lead.priority)}>
                    {lead.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-5 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Quick Status</h4>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  onClick={() => handleStatusChange("Qualified")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Marcar Calificado
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  onClick={() => handleStatusChange("Lost")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" /> Marcar Perdido
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  onClick={() => handleStatusChange("Not Qualified")}
                >
                  No Calificado
                </Button>
              </CardContent>
            </Card>

            <Card className={cn("shadow-sm", isOverdue ? "border-red-300 bg-red-50/50" : "border-slate-200")}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className={cn("h-5 w-5", isOverdue ? "text-red-500" : "text-primary")} />
                  <span className={cn("text-sm font-semibold", isOverdue ? "text-red-600" : "text-slate-900")}>
                    {isOverdue ? "Follow-up Vencido" : "Próximo Follow-up"}
                  </span>
                </div>
                {lead.nextFollowUp ? (
                  <div className={cn("text-lg font-display font-bold", isOverdue ? "text-red-700" : "text-slate-900")}>
                    {format(new Date(lead.nextFollowUp), "dd MMM yyyy", { locale: es })}
                    <div className={cn("text-xs mt-1", isOverdue ? "text-red-500" : "text-slate-500")}>
                      {formatDistanceToNow(new Date(lead.nextFollowUp), { addSuffix: true, locale: es })}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 mb-2">Sin follow-up programado</div>
                )}
                <Input
                  type="date"
                  className="h-9 mt-3 text-sm"
                  onChange={(e) => {
                    if (e.target.value) {
                      updateLead.mutate({ id: lead.id, nextFollowUp: new Date(e.target.value).toISOString() });
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-slate-900">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.length > 0 ? lead.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">#{tag}</span>
                  )) : (
                    <span className="text-sm text-slate-400">Sin tags</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-5 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Acciones Rápidas</h4>
                <Button variant="outline" className="w-full justify-start bg-white" onClick={() => { setActivityType("Call"); }}>
                  <PhoneCall className="h-4 w-4 mr-2 text-emerald-500" /> Registrar Llamada
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white" onClick={() => { setActivityType("WhatsApp"); }}>
                  <MessageCircle className="h-4 w-4 mr-2 text-green-500" /> Enviar WhatsApp
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white" onClick={() => { setActivityType("Email"); }}>
                  <Mail className="h-4 w-4 mr-2 text-blue-500" /> Enviar Email
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white" onClick={() => { setActivityType("SiteVisit"); }}>
                  <Eye className="h-4 w-4 mr-2 text-orange-500" /> Registrar Visita
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {showAssignModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowAssignModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-slate-900">Asignar Agente</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAssignModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 space-y-1">
                {teamMembers.filter(m => m.role !== "Viewer").map(member => (
                  <button
                    key={member.id}
                    onClick={() => handleAssign(member.name)}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-slate-50",
                      member.name === lead.owner && "bg-primary/5 ring-1 ring-primary/20"
                    )}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-slate-900">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-700">{member.assignedLeads}</div>
                      <div className="text-[10px] text-slate-400">leads</div>
                    </div>
                    <div className="w-16">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            member.assignedLeads > 15 ? "bg-red-400" :
                            member.assignedLeads > 10 ? "bg-amber-400" : "bg-emerald-400"
                          )}
                          style={{ width: `${Math.min(100, (member.assignedLeads / 20) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function InfoItem({ icon: Icon, label, value, highlight }: { icon: LucideIcon; label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={cn("text-sm font-semibold", highlight ? "text-red-600" : "text-slate-800")}>{value}</div>
    </div>
  );
}
