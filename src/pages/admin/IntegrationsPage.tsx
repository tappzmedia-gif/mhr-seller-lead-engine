import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { Plug, Search, CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw, Settings, ExternalLink, Loader2, Wifi, WifiOff, Zap, Key, Eye, EyeOff } from "lucide-react";
import { integrationsService } from "@/lib/services/integrationsService";
import type { IntegrationConnection, IntegrationCategory } from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  calendar: 'Calendario', meetings: 'Reuniones', payments: 'Pagos', storage: 'Almacenamiento', automation: 'Automatización', communications: 'Comunicaciones', crm: 'CRM', marketing: 'Marketing',
};

const STATUS_CONFIG: Record<string, { label: string; variant: any; icon: any }> = {
  connected: { label: 'Conectado', variant: 'success', icon: CheckCircle },
  disconnected: { label: 'Desconectado', variant: 'low', icon: WifiOff },
  error: { label: 'Error', variant: 'destructive', icon: AlertTriangle },
  'coming-soon': { label: 'Próximamente', variant: 'secondary', icon: Clock },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | 'all'>('all');
  const [selectedInt, setSelectedInt] = useState<IntegrationConnection | null>(null);
  const [search, setSearch] = useState('');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    integrationsService.getAll().then(ints => { setIntegrations(ints); setLoading(false); });
  }, []);

  const filtered = integrations
    .filter(i => categoryFilter === 'all' || i.category === categoryFilter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const connected = integrations.filter(i => i.status === 'connected').length;
  const categories = [...new Set(integrations.map(i => i.category))];

  const handleConnect = async (int: IntegrationConnection) => {
    setConnectingId(int.id);
    await new Promise(r => setTimeout(r, 1500));
    const newStatus = int.status === 'connected' ? 'disconnected' : 'connected';
    const updated = await integrationsService.update(int.id, {
      status: newStatus,
      ...(newStatus === 'connected' ? { connectedAt: new Date().toISOString(), lastSync: new Date().toISOString() } : { connectedAt: undefined, lastSync: undefined }),
    });
    if (updated) {
      setIntegrations(prev => prev.map(i => i.id === int.id ? updated : i));
      if (selectedInt?.id === int.id) setSelectedInt(updated);
    }
    setConnectingId(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Centro de Integraciones</h1>
            <p className="text-sm text-slate-500 mt-1">{connected} de {integrations.length} integraciones conectadas.</p>
          </div>
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Buscar integración..." value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" />
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          <button onClick={() => setCategoryFilter('all')} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", categoryFilter === 'all' ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>Todas ({integrations.length})</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", categoryFilter === c ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>{CATEGORY_LABELS[c]}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(int => {
                  const cfg = STATUS_CONFIG[int.status];
                  const StatusIcon = cfg.icon;
                  const isConnecting = connectingId === int.id;
                  return (
                    <Card key={int.id} className={cn("shadow-sm border-slate-200 cursor-pointer transition-all hover:shadow-md", selectedInt?.id === int.id && "ring-2 ring-primary", int.status === 'connected' && "border-l-4 border-l-emerald-500")} onClick={() => setSelectedInt(int)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs", int.status === 'connected' ? 'bg-emerald-500' : int.status === 'error' ? 'bg-red-500' : int.status === 'coming-soon' ? 'bg-slate-300' : 'bg-slate-400')}>
                              <Zap className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900">{int.name}</h3>
                              <span className="text-[10px] text-slate-400">{CATEGORY_LABELS[int.category]}</span>
                            </div>
                          </div>
                          <Badge variant={cfg.variant} className="text-[10px] flex items-center gap-1"><StatusIcon className="h-3 w-3" />{cfg.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{int.description}</p>
                        <div className="flex items-center justify-between">
                          {int.lastSync ? (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {formatDistanceToNow(new Date(int.lastSync), { addSuffix: true, locale: es })}</span>
                          ) : <span />}
                          <Button size="sm" variant={int.status === 'connected' ? 'outline' : 'default'} className="h-7 text-xs" disabled={int.status === 'coming-soon' || isConnecting} onClick={(e) => { e.stopPropagation(); handleConnect(int); }}>
                            {isConnecting ? <Loader2 className="h-3 w-3 animate-spin" /> : int.status === 'connected' ? 'Desconectar' : int.status === 'coming-soon' ? 'Próximo' : 'Conectar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              {selectedInt ? (
                <Card className="shadow-sm border-slate-200 sticky top-20">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> {selectedInt.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_CONFIG[selectedInt.status].variant}>{STATUS_CONFIG[selectedInt.status].label}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{CATEGORY_LABELS[selectedInt.category]}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{selectedInt.description}</p>

                    {selectedInt.status !== 'coming-soon' && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><Key className="h-3 w-3" /> API Key</h4>
                        <div className="flex items-center gap-2">
                          <Input
                            type={showApiKey[selectedInt.id] ? 'text' : 'password'}
                            value={apiKeys[selectedInt.id] || (selectedInt.status === 'connected' ? 'sk_live_••••••••••••••••' : '')}
                            onChange={e => setApiKeys(prev => ({ ...prev, [selectedInt.id]: e.target.value }))}
                            placeholder="Ingresa tu API key..."
                            className="h-8 text-xs font-mono flex-1"
                          />
                          <button onClick={() => setShowApiKey(prev => ({ ...prev, [selectedInt.id]: !prev[selectedInt.id] }))} className="text-slate-400 hover:text-slate-600">
                            {showApiKey[selectedInt.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedInt.benefits.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Beneficios</h4>
                        <ul className="space-y-1">
                          {selectedInt.benefits.map((b, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedInt.requiredPermissions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Permisos Requeridos</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedInt.requiredPermissions.map((p, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedInt.connectedAt && (
                      <div className="text-xs text-slate-500">Conectado {formatDistanceToNow(new Date(selectedInt.connectedAt), { addSuffix: true, locale: es })}</div>
                    )}

                    {selectedInt.logs.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Logs Recientes</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedInt.logs.map(log => (
                            <div key={log.id} className="text-[11px] flex items-start gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full mt-1 shrink-0", log.status === 'success' ? 'bg-emerald-500' : log.status === 'error' ? 'bg-red-500' : 'bg-amber-500')} />
                              <div>
                                <span className="text-slate-700">{log.action}</span>
                                <div className="text-slate-400">{log.details} · {formatDistanceToNow(new Date(log.date), { addSuffix: true, locale: es })}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {selectedInt.status === 'connected' ? (
                        <>
                          <Button size="sm" variant="outline" className="flex-1"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Sync</Button>
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleConnect(selectedInt)} disabled={connectingId === selectedInt.id}>
                            {connectingId === selectedInt.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><XCircle className="h-3.5 w-3.5 mr-1" /> Desconectar</>}
                          </Button>
                        </>
                      ) : selectedInt.status !== 'coming-soon' ? (
                        <Button size="sm" className="w-full" onClick={() => handleConnect(selectedInt)} disabled={connectingId === selectedInt.id}>
                          {connectingId === selectedInt.id ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Wifi className="h-3.5 w-3.5 mr-1" />}
                          Conectar
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-8 text-center text-slate-400">
                    <Plug className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Selecciona una integración para ver detalles.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
