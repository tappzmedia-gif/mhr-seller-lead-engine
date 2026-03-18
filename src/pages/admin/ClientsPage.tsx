import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, type BadgeVariant } from "@/components/ui-components";
import { cn, formatCurrency } from "@/lib/utils";
import { UserCircle, Plus, Search, Phone, Mail, MapPin, FileText, Receipt, Video, FolderOpen, DollarSign, Clock, ArrowRight, Loader2, Home, Calendar, MessageSquare, Building2, FileCheck } from "lucide-react";
import { clientsService } from "@/lib/services/clientsService";
import type { ClientRecord, ClientType } from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ClientCreateModal } from "@/components/admin/ClientCreateModal";

const TYPE_CONFIG: Record<ClientType, { label: string; variant: BadgeVariant; color: string }> = {
  lead: { label: 'Lead', variant: 'default', color: 'bg-blue-500' },
  prospect: { label: 'Prospecto', variant: 'high', color: 'bg-amber-500' },
  client: { label: 'Cliente', variant: 'success', color: 'bg-emerald-500' },
  'past-client': { label: 'Ex-Cliente', variant: 'low', color: 'bg-slate-400' },
};

const LIFECYCLE_STAGES = ['Lead', 'Prospecto', 'Cliente', 'Ex-Cliente'];

const TABS = ['profile', 'history', 'communications', 'properties', 'evaluations'] as const;
const TAB_LABELS: Record<string, string> = {
  profile: 'Perfil', history: 'Historial', communications: 'Comunicaciones', properties: 'Propiedades', evaluations: 'Evaluaciones',
};
const TAB_ICONS: Record<string, typeof Clock> = {
  profile: UserCircle, history: Clock, communications: MessageSquare, properties: Building2, evaluations: FileCheck,
};

const MOCK_COMMUNICATIONS = [
  { id: 'comm-1', type: 'email', subject: 'Seguimiento de propuesta', date: new Date(Date.now() - 86400000).toISOString(), status: 'sent' },
  { id: 'comm-2', type: 'whatsapp', subject: 'Confirmación de visita', date: new Date(Date.now() - 172800000).toISOString(), status: 'delivered' },
  { id: 'comm-3', type: 'call', subject: 'Consulta inicial', date: new Date(Date.now() - 432000000).toISOString(), status: 'completed' },
  { id: 'comm-4', type: 'sms', subject: 'Recordatorio de reunión', date: new Date(Date.now() - 604800000).toISOString(), status: 'sent' },
];

const MOCK_PROPERTIES = [
  { id: 'prop-1', title: 'Casa en Bayamón', type: 'Casa', status: 'En evaluación', value: '$185,000' },
  { id: 'prop-2', title: 'Apartamento en Condado', type: 'Apartamento', status: 'Listada', value: '$275,000' },
];

const MOCK_EVALUATIONS = [
  { id: 'eval-1', property: 'Casa en Bayamón', date: new Date(Date.now() - 259200000).toISOString(), status: 'Completada', value: '$185,000' },
  { id: 'eval-2', property: 'Terreno en Dorado', date: new Date(Date.now() - 604800000).toISOString(), status: 'Pendiente', value: 'Pendiente' },
];

const COMM_TYPE_STYLES: Record<string, { icon: string; color: string }> = {
  email: { icon: '📧', color: 'bg-blue-50 text-blue-700' },
  whatsapp: { icon: '💬', color: 'bg-emerald-50 text-emerald-700' },
  call: { icon: '📞', color: 'bg-purple-50 text-purple-700' },
  sms: { icon: '📱', color: 'bg-amber-50 text-amber-700' },
};

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<ClientType | 'all'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    clientsService.getAll().then(c => { setClients(c); setLoading(false); });
  }, []);

  const filtered = clients
    .filter(c => typeFilter === 'all' || c.type === typeFilter)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const typeCounts: Record<string, number> = { all: clients.length };
  clients.forEach(c => { typeCounts[c.type] = (typeCounts[c.type] || 0) + 1; });

  const handleCreateClient = async (data: { name: string; phone: string; email: string; address: string; municipality: string; region: string }) => {
    const newClient = await clientsService.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      municipality: data.municipality,
      region: data.region,
    });
    setClients(prev => [newClient, ...prev]);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Clientes</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona registros de clientes, prospectos y leads.</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Nuevo Cliente</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(['lead', 'prospect', 'client', 'past-client'] as ClientType[]).map(t => (
            <Card key={t} className={cn("shadow-sm border-slate-200 cursor-pointer hover:border-primary/30 transition-all", typeFilter === t && "ring-2 ring-primary")} onClick={() => setTypeFilter(typeFilter === t ? 'all' : t)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", TYPE_CONFIG[t].color)}>{typeCounts[t] || 0}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{TYPE_CONFIG[t].label}</div>
                  <div className="text-[11px] text-slate-400">registros</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex gap-1">
                    {(['all', 'lead', 'prospect', 'client', 'past-client'] as const).map(t => (
                      <button key={t} onClick={() => setTypeFilter(t)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", typeFilter === t ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>
                        {t === 'all' ? 'Todos' : TYPE_CONFIG[t].label} ({typeCounts[t] || 0})
                      </button>
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
                  <div className="text-center py-16 text-slate-400">No hay clientes.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filtered.map(client => (
                      <div key={client.id} className={cn("flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer", selectedClient?.id === client.id && "bg-primary/5")} onClick={() => { setSelectedClient(client); setActiveTab('profile'); }}>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0", TYPE_CONFIG[client.type].color)}>
                            {client.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{client.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{client.email}</div>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                              {client.municipality && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{client.municipality}</span>}
                              <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{client.totalProposals}</span>
                              <span className="flex items-center gap-1"><Receipt className="h-3 w-3" />{client.totalInvoices}</span>
                              <span className="flex items-center gap-1"><Video className="h-3 w-3" />{client.totalMeetings}</span>
                              <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" />{client.totalDocuments}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={TYPE_CONFIG[client.type].variant} className="text-[10px]">{TYPE_CONFIG[client.type].label}</Badge>
                          {client.outstandingBalance > 0 && <div className="text-[11px] text-red-600 mt-1 font-medium">{formatCurrency(client.outstandingBalance)} pendiente</div>}
                          {client.totalRevenue > 0 && <div className="text-[11px] text-emerald-600 font-medium">{formatCurrency(client.totalRevenue)} total</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedClient ? (
              <Card className="shadow-sm border-slate-200 sticky top-20">
                <CardHeader className="pb-0 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold", TYPE_CONFIG[selectedClient.type].color)}>
                      {selectedClient.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{selectedClient.name}</h3>
                      <Badge variant={TYPE_CONFIG[selectedClient.type].variant} className="text-[10px]">{TYPE_CONFIG[selectedClient.type].label}</Badge>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    <div className="flex items-center w-full">
                      {LIFECYCLE_STAGES.map((stage, i) => (
                        <div key={stage} className="flex items-center flex-1">
                          <div className={cn("w-full h-1.5 rounded-full", i < selectedClient.lifecycleStage ? TYPE_CONFIG[selectedClient.type].color : "bg-slate-200")} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-0.5 overflow-x-auto pb-0">
                    {TABS.map(tab => {
                      const Icon = TAB_ICONS[tab];
                      return (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={cn("flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-t-lg whitespace-nowrap transition-all border-b-2", activeTab === tab ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-400 hover:text-slate-600")}>
                          <Icon className="h-3 w-3" />
                          {TAB_LABELS[tab]}
                        </button>
                      );
                    })}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 max-h-[500px] overflow-y-auto">
                  {activeTab === 'profile' && (
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /><span>{selectedClient.phone}</span></div>
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /><span>{selectedClient.email}</span></div>
                      {selectedClient.municipality && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /><span>{selectedClient.municipality}, {selectedClient.region}</span></div>}
                      <div className="flex items-center gap-2"><UserCircle className="h-4 w-4 text-slate-400" /><span>Owner: {selectedClient.owner}</span></div>
                      <div className="border-t border-slate-100 pt-3 space-y-2">
                        <div className="flex justify-between"><span className="text-slate-500">Propuestas</span><span className="font-medium">{selectedClient.totalProposals}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Facturas</span><span className="font-medium">{selectedClient.totalInvoices}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Reuniones</span><span className="font-medium">{selectedClient.totalMeetings}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Documentos</span><span className="font-medium">{selectedClient.totalDocuments}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Revenue</span><span className="font-medium text-emerald-600">{formatCurrency(selectedClient.totalRevenue)}</span></div>
                        {selectedClient.outstandingBalance > 0 && <div className="flex justify-between"><span className="text-slate-500">Balance</span><span className="font-medium text-red-600">{formatCurrency(selectedClient.outstandingBalance)}</span></div>}
                      </div>
                      {selectedClient.tags.length > 0 && (
                        <div className="border-t border-slate-100 pt-3">
                          <div className="flex flex-wrap gap-1">
                            {selectedClient.tags.map(t => <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">#{t}</span>)}
                          </div>
                        </div>
                      )}
                      {selectedClient.notes && (
                        <div className="border-t border-slate-100 pt-3">
                          <div className="text-xs font-medium text-slate-500 mb-1">Notas</div>
                          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedClient.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="space-y-3">
                      {selectedClient.timeline.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">Sin actividad registrada.</div>
                      ) : selectedClient.timeline.map(entry => (
                        <div key={entry.id} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-0.5"><Clock className="h-3 w-3" /></div>
                          <div>
                            <div className="text-xs font-medium text-slate-900">{entry.title}</div>
                            <div className="text-[11px] text-slate-500">{entry.description}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{entry.author} · {formatDistanceToNow(new Date(entry.date), { addSuffix: true, locale: es })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'communications' && (
                    <div className="space-y-2">
                      {MOCK_COMMUNICATIONS.map(comm => {
                        const style = COMM_TYPE_STYLES[comm.type] || COMM_TYPE_STYLES.email;
                        return (
                          <div key={comm.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm", style.color)}>{style.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-slate-900 truncate">{comm.subject}</div>
                              <div className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(comm.date), { addSuffix: true, locale: es })}</div>
                            </div>
                            <Badge variant="secondary" className="text-[9px]">{comm.status}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeTab === 'properties' && (
                    <div className="space-y-2">
                      {MOCK_PROPERTIES.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">Sin propiedades vinculadas.</div>
                      ) : MOCK_PROPERTIES.map(prop => (
                        <div key={prop.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-900">{prop.title}</div>
                            <div className="text-[10px] text-slate-500">{prop.type} · {prop.status}</div>
                          </div>
                          <span className="text-xs font-bold text-emerald-600">{prop.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'evaluations' && (
                    <div className="space-y-2">
                      {MOCK_EVALUATIONS.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">Sin evaluaciones vinculadas.</div>
                      ) : MOCK_EVALUATIONS.map(ev => (
                        <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FileCheck className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-900">{ev.property}</div>
                            <div className="text-[10px] text-slate-500">{formatDistanceToNow(new Date(ev.date), { addSuffix: true, locale: es })} · {ev.status}</div>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{ev.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-8 text-center text-slate-400">
                  <UserCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Selecciona un cliente para ver detalles.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ClientCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateClient}
      />
    </AdminLayout>
  );
}
