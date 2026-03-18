import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button, Input, Select } from "@/components/ui-components";
import { teamMembers } from "@/store";
import { cn } from "@/lib/utils";
import {
  UserCog, Mail, Phone, Calendar, Users, Trophy, Plus, X, Shield, Eye,
  MapPin, Activity, TrendingUp, Target, Clock, ChevronLeft, Edit3, Save, Check,
  BarChart3, Star
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-700",
  Agent: "bg-blue-100 text-blue-700",
  Viewer: "bg-slate-100 text-slate-700",
};

const ROLE_ICONS: Record<string, typeof Shield> = {
  Admin: Shield,
  Agent: Users,
  Viewer: Eye,
};

const MOCK_ACTIVITY = [
  { id: "a1", action: "Cerró deal con cliente Rivera", time: "Hace 2 horas", type: "deal" },
  { id: "a2", action: "Llamó a lead Martínez", time: "Hace 4 horas", type: "call" },
  { id: "a3", action: "Actualizó estado de lead Ortiz a Qualified", time: "Hace 6 horas", type: "update" },
  { id: "a4", action: "Envió propuesta a García", time: "Ayer", type: "email" },
  { id: "a5", action: "Completó evaluación de propiedad en Bayamón", time: "Ayer", type: "evaluation" },
  { id: "a6", action: "Agendó visita con lead Colón", time: "Hace 2 días", type: "meeting" },
  { id: "a7", action: "Recibió 3 nuevos leads asignados", time: "Hace 3 días", type: "assignment" },
];

const ACTIVITY_COLORS: Record<string, string> = {
  deal: "bg-emerald-500",
  call: "bg-blue-500",
  update: "bg-amber-500",
  email: "bg-purple-500",
  evaluation: "bg-teal-500",
  meeting: "bg-indigo-500",
  assignment: "bg-pink-500",
};

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);
  const [members, setMembers] = useState(teamMembers);
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "", role: "" });

  const [inviteForm, setInviteForm] = useState({
    name: "", phone: "", email: "", address: "", role: "Agent",
  });

  const totalLeads = members.reduce((sum, m) => sum + m.assignedLeads, 0);
  const totalDeals = members.reduce((sum, m) => sum + m.closedDeals, 0);

  const handleOpenProfile = (member: typeof teamMembers[0]) => {
    setSelectedMember(member);
    setEditData({ name: member.name, email: member.email, phone: member.phone, role: member.role });
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    if (selectedMember) {
      const updated = { ...selectedMember, name: editData.name, email: editData.email, phone: editData.phone, role: editData.role as "Admin" | "Agent" | "Viewer" };
      setMembers(prev => prev.map(m => m.id === selectedMember.id ? updated : m));
      setSelectedMember(updated);
    }
    setEditMode(false);
  };

  const handleInviteSubmit = () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
    const newMember = {
      id: `tm-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone || "(787) 000-0000",
      role: inviteForm.role as "Admin" | "Agent" | "Viewer",
      avatar: inviteForm.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase(),
      assignedLeads: 0,
      closedDeals: 0,
      joinDate: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);
    setShowInvite(false);
    setInviteForm({ name: "", phone: "", email: "", address: "", role: "Agent" });
  };

  if (selectedMember) {
    const conversionRate = selectedMember.assignedLeads > 0
      ? Math.round((selectedMember.closedDeals / selectedMember.assignedLeads) * 100) : 0;

    return (
      <AdminLayout breadcrumbs={[{ label: "Team", href: "/admin/team" }, { label: selectedMember.name }]}>
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
          <button onClick={() => setSelectedMember(null)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> Volver al equipo
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20 mx-auto mb-4">
                    {selectedMember.avatar}
                  </div>
                  {editMode ? (
                    <Input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} className="text-center font-bold mb-2" />
                  ) : (
                    <h2 className="text-xl font-display font-bold text-slate-900">{editData.name}</h2>
                  )}
                  <Badge className={cn("border-0 mt-2", ROLE_COLORS[editData.role])}>
                    {editData.role}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    {editMode ? (
                      <Input value={editData.email} onChange={e => setEditData(p => ({ ...p, email: e.target.value }))} className="h-8 text-sm" />
                    ) : (
                      <span className="text-slate-600 truncate">{editData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    {editMode ? (
                      <Input value={editData.phone} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} className="h-8 text-sm" />
                    ) : (
                      <span className="text-slate-600">{editData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-slate-600">Desde {format(new Date(selectedMember.joinDate), "d MMM yyyy", { locale: es })}</span>
                  </div>
                  {editMode && (
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                      <Select value={editData.role} onChange={e => setEditData(p => ({ ...p, role: e.target.value }))} className="h-8 text-sm flex-1">
                        <option>Agent</option>
                        <option>Admin</option>
                        <option>Viewer</option>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-2">
                  {editMode ? (
                    <>
                      <Button size="sm" className="flex-1" onClick={handleSaveEdit}><Save className="h-3.5 w-3.5 mr-1" /> Guardar</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditMode(false)}>Cancelar</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full" onClick={() => setEditMode(true)}><Edit3 className="h-3.5 w-3.5 mr-1" /> Editar Perfil</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-4 text-center">
                    <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-2xl font-display font-bold text-primary">{selectedMember.assignedLeads}</div>
                    <div className="text-[11px] text-slate-500">Leads Asignados</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                    <div className="text-2xl font-display font-bold text-emerald-600">{selectedMember.closedDeals}</div>
                    <div className="text-[11px] text-slate-500">Deals Cerrados</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-2xl font-display font-bold text-amber-600">{conversionRate}%</div>
                    <div className="text-[11px] text-slate-500">Tasa Conversión</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-4 text-center">
                    <Star className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-2xl font-display font-bold text-purple-600">{(4.5 + (selectedMember.closedDeals % 5) * 0.1).toFixed(1)}</div>
                    <div className="text-[11px] text-slate-500">Rating</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-bold text-slate-900">Métricas de Rendimiento</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Tiempo de Respuesta Promedio", value: "12 min", bar: 85, color: "bg-emerald-500" },
                      { label: "Leads Contactados (Mes)", value: `${Math.floor(selectedMember.assignedLeads * 0.8)}`, bar: 80, color: "bg-blue-500" },
                      { label: "Tasa de Cierre", value: `${conversionRate}%`, bar: conversionRate, color: "bg-amber-500" },
                      { label: "Satisfacción del Cliente", value: "92%", bar: 92, color: "bg-purple-500" },
                    ].map((metric, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-700">{metric.label}</span>
                          <span className="text-sm font-bold text-slate-900">{metric.value}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={cn("rounded-full h-2 transition-all", metric.color)} style={{ width: `${metric.bar}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-bold text-slate-900">Actividad Reciente</h3>
                  </div>
                  <div className="space-y-3">
                    {MOCK_ACTIVITY.map(activity => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", ACTIVITY_COLORS[activity.type])} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-700">{activity.action}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Team" }]}>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Team</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona el equipo y roles.</p>
          </div>
          <Button onClick={() => setShowInvite(true)}><Plus className="h-4 w-4 mr-2" /> Invitar Miembro</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Miembros</div>
              <div className="text-2xl font-display font-bold text-slate-900">{members.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Leads Asignados</div>
              <div className="text-2xl font-display font-bold text-primary">{totalLeads}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Deals Cerrados</div>
              <div className="text-2xl font-display font-bold text-emerald-600">{totalDeals}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Admins</div>
              <div className="text-2xl font-display font-bold text-purple-600">{members.filter(m => m.role === "Admin").length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => {
            const RoleIcon = ROLE_ICONS[member.role] || Users;
            return (
              <Card key={member.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOpenProfile(member)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 shrink-0">
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900">{member.name}</div>
                      <Badge className={cn("border-0 mt-1", ROLE_COLORS[member.role])}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Desde {format(new Date(member.joinDate), "MMM yyyy", { locale: es })}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-display font-bold text-primary">{member.assignedLeads}</div>
                      <div className="text-[11px] text-slate-500">Leads Asignados</div>
                    </div>
                    <div>
                      <div className="text-lg font-display font-bold text-emerald-600">{member.closedDeals}</div>
                      <div className="text-[11px] text-slate-500">Deals Cerrados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {showInvite && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowInvite(false)} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md shadow-2xl border-slate-200">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-slate-900">Invitar Miembro</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowInvite(false)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                    <Input placeholder="Nombre completo" className="bg-slate-50" value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
                    <Input type="tel" placeholder="(787) 000-0000" className="bg-slate-50" value={inviteForm.phone} onChange={e => setInviteForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <Input type="email" placeholder="email@myhouserealty.com" className="bg-slate-50" value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección</label>
                    <Input placeholder="Dirección completa" className="bg-slate-50" value={inviteForm.address} onChange={e => setInviteForm(p => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Rol</label>
                    <Select className="h-10 bg-slate-50" value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))}>
                      <option>Agent</option>
                      <option>Admin</option>
                      <option>Viewer</option>
                    </Select>
                  </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowInvite(false)}>Cancelar</Button>
                  <Button onClick={handleInviteSubmit}>Enviar Invitación</Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
