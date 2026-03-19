import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { Plug, Search, CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw, Settings, ExternalLink, Loader2, Wifi, WifiOff, Zap, Key, Eye, EyeOff } from "lucide-react";
import { integrationsService } from "@/lib/services/integrationsService";
import type { IntegrationConnection, IntegrationCategory } from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORY_KEYS: Record<IntegrationCategory, string> = {
  calendar: 'integrations.category.calendar',
  meetings: 'integrations.category.meetings',
  payments: 'integrations.category.payments',
  storage: 'integrations.category.storage',
  automation: 'integrations.category.automation',
  communications: 'integrations.category.communications',
  crm: 'integrations.category.crm',
  marketing: 'integrations.category.marketing',
};

const STATUS_KEYS: Record<string, { labelKey: string; variant: any; icon: any }> = {
  connected: { labelKey: 'integrations.status.connected', variant: 'success', icon: CheckCircle },
  disconnected: { labelKey: 'integrations.status.disconnected', variant: 'low', icon: WifiOff },
  error: { labelKey: 'integrations.status.error', variant: 'destructive', icon: AlertTriangle },
  'coming-soon': { labelKey: 'integrations.status.comingSoon', variant: 'secondary', icon: Clock },
};

export default function IntegrationsPage() {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;

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
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">{t("titleIntegrations")}</h1>
            <p className="text-sm text-slate-500 mt-1">{t("integrations.subtitle", { connected, total: integrations.length })}</p>
          </div>
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder={t("integrations.searchPlaceholder")} value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" />
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          <button onClick={() => setCategoryFilter('all')} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", categoryFilter === 'all' ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>{t("notifications.all")} ({integrations.length})</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", categoryFilter === c ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>{t(CATEGORY_KEYS[c])}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(int => {
                  const isConnecting = connectingId === int.id;
                  return (
                    <Card key={int.id} className={cn("shadow-sm border-slate-200 cursor-pointer transition-all hover:shadow-md", selectedInt?.id === int.id && "ring-2 ring-primary", int.status === 'connected' && "border-l-4 border-l-emerald-500")} onClick={() => setSelectedInt(int)}>
                      <CardContent className="p-4 min-w-0 overflow-hidden">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0", int.status === 'connected' ? 'bg-emerald-500' : int.status === 'error' ? 'bg-red-500' : int.status === 'coming-soon' ? 'bg-slate-300' : 'bg-slate-400')}>
                              <Zap className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 overflow-hidden">
                              <h3 className="text-sm font-semibold text-slate-900 truncate">{int.name}</h3>
                              <span className="text-[10px] text-slate-400 truncate block">{t(CATEGORY_KEYS[int.category])}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <div className={cn("w-2 h-2 rounded-full", int.status === 'connected' ? 'bg-emerald-500' : int.status === 'error' ? 'bg-red-500' : int.status === 'coming-soon' ? 'bg-slate-400' : 'bg-red-400')} />
                            <span className={cn("text-[10px] font-semibold uppercase", int.status === 'connected' ? 'text-emerald-600' : int.status === 'error' ? 'text-red-600' : int.status === 'coming-soon' ? 'text-slate-500' : 'text-red-500')}>
                              {int.status === 'connected' ? 'OK' : int.status === 'coming-soon' ? 'SOON' : 'OFF'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{int.description}</p>
                        <div className="flex items-center justify-between">
                          {int.lastSync ? (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {formatDistanceToNow(new Date(int.lastSync), { addSuffix: true, locale: dateLocale })}</span>
                          ) : <span />}
                          <Button size="sm" variant={int.status === 'connected' ? 'outline' : 'default'} className="h-7 text-xs" disabled={int.status === 'coming-soon' || isConnecting} onClick={(e) => { e.stopPropagation(); handleConnect(int); }}>
                            {isConnecting ? <Loader2 className="h-3 w-3 animate-spin" /> : int.status === 'connected' ? t("integrations.disconnected") : int.status === 'coming-soon' ? t("integrations.status.comingSoon") : t("integrations.connected")}
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
                      <Badge variant={STATUS_KEYS[selectedInt.status].variant}>{t(STATUS_KEYS[selectedInt.status].labelKey)}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{t(CATEGORY_KEYS[selectedInt.category])}</Badge>
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
                            placeholder={t("integrations.apiKeyPlaceholder")}
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
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{t("integrations.benefits")}</h4>
                        <ul className="space-y-1">
                          {selectedInt.benefits.map((b, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedInt.requiredPermissions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{t("integrations.requiredPermissions")}</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedInt.requiredPermissions.map((p, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedInt.connectedAt && (
                      <div className="text-xs text-slate-500">{t("integrations.connectedAgo", { time: formatDistanceToNow(new Date(selectedInt.connectedAt), { addSuffix: true, locale: dateLocale }) })}</div>
                    )}

                    {selectedInt.logs.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{t("integrations.recentLogs")}</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedInt.logs.map(log => (
                            <div key={log.id} className="text-[11px] flex items-start gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full mt-1 shrink-0", log.status === 'success' ? 'bg-emerald-500' : log.status === 'error' ? 'bg-red-500' : 'bg-amber-500')} />
                              <div className="min-w-0">
                                <span className="text-slate-700 truncate block">{log.action}</span>
                                <div className="text-slate-400 truncate">{log.details} · {formatDistanceToNow(new Date(log.date), { addSuffix: true, locale: dateLocale })}</div>
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
                            {connectingId === selectedInt.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><XCircle className="h-3.5 w-3.5 mr-1" /> {t("integrations.disconnected")}</>}
                          </Button>
                        </>
                      ) : selectedInt.status !== 'coming-soon' ? (
                        <Button size="sm" className="w-full" onClick={() => handleConnect(selectedInt)} disabled={connectingId === selectedInt.id}>
                          {connectingId === selectedInt.id ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Wifi className="h-3.5 w-3.5 mr-1" />}
                          {t("integrations.connected")}
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-8 text-center text-slate-400">
                    <Plug className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t("integrations.selectToView")}</p>
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
