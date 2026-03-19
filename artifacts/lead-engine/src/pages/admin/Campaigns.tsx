import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button, Select } from "@/components/ui-components";
import { campaigns, type Campaign } from "@/store";
import { cn } from "@/lib/utils";
import { Megaphone, TrendingUp, DollarSign, Users, Plus, Pause, Play, Eye, X, BarChart2, Target, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function CampaignDetailModal({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;

  const STATUS_CONFIG: Record<Campaign["status"], { color: string; labelKey: string }> = {
    Active: { color: "bg-emerald-100 text-emerald-700", labelKey: "campaigns.status.active" },
    Paused: { color: "bg-amber-100 text-amber-700", labelKey: "campaigns.status.paused" },
    Completed: { color: "bg-slate-100 text-slate-700", labelKey: "campaigns.status.completed" },
    Draft: { color: "bg-blue-100 text-blue-700", labelKey: "campaigns.status.draft" },
  };

  const cfg = STATUS_CONFIG[campaign.status];
  const spentPct = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;

  const weeklyData = [
    { week: "Sem 1", leads: Math.round(campaign.leadsGenerated * 0.2), spend: Math.round(campaign.spent * 0.2) },
    { week: "Sem 2", leads: Math.round(campaign.leadsGenerated * 0.3), spend: Math.round(campaign.spent * 0.3) },
    { week: "Sem 3", leads: Math.round(campaign.leadsGenerated * 0.28), spend: Math.round(campaign.spent * 0.25) },
    { week: "Sem 4", leads: Math.round(campaign.leadsGenerated * 0.22), spend: Math.round(campaign.spent * 0.25) },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[95vw] max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">{campaign.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">{campaign.platform} · {campaign.source}</span>
                <Badge className={cn("border-0 text-xs", cfg.color)}>{t(cfg.labelKey)}</Badge>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-display font-bold text-blue-600">{campaign.leadsGenerated}</div>
              <div className="text-xs text-slate-500 mt-0.5">Leads generados</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-display font-bold text-emerald-600">{campaign.conversionRate}%</div>
              <div className="text-xs text-slate-500 mt-0.5">{t("campaigns.conversion")}</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-display font-bold text-primary">${campaign.cpl.toFixed(0)}</div>
              <div className="text-xs text-slate-500 mt-0.5">Costo por Lead (CPL)</div>
            </div>
          </div>

          {campaign.budget > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2">
                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-slate-400" /> {t("campaigns.budget")}</span>
                <span className={cn("font-bold", spentPct > 80 ? "text-red-600" : spentPct > 50 ? "text-amber-600" : "text-emerald-600")}>
                  ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className={cn("h-3 rounded-full transition-all", spentPct > 80 ? "bg-red-500" : spentPct > 50 ? "bg-amber-500" : "bg-emerald-500")}
                  style={{ width: `${Math.min(spentPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{Math.round(spentPct)}% ejecutado</span>
                <span>${(campaign.budget - campaign.spent).toLocaleString()} restante</span>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" /> Rendimiento semanal
            </h3>
            <div className="space-y-2">
              {weeklyData.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-12 shrink-0">{row.week}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${(row.leads / campaign.leadsGenerated) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-16 text-right">{row.leads} leads</span>
                  <span className="text-xs text-slate-500 w-20 text-right">${row.spend.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Fecha inicio
              </div>
              <div className="font-semibold text-slate-900">
                {format(new Date(campaign.startDate), "dd MMM yyyy", { locale: dateLocale })}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500 mb-1">Plataforma</div>
              <div className="font-semibold text-slate-900">{campaign.platform}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500 mb-1">Fuente</div>
              <div className="font-semibold text-slate-900">{campaign.source}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500 mb-1">ROI estimado</div>
              <div className="font-semibold text-emerald-600">
                {campaign.leadsGenerated > 0 ? `${Math.round((campaign.leadsGenerated * 150000 * 0.03 / Math.max(campaign.spent, 1)) * 100)}%` : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex gap-3 shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1 min-h-[44px]">Cerrar</Button>
          {campaign.status === "Active" && (
            <Button variant="outline" className="flex-1 min-h-[44px] text-amber-600 border-amber-200 hover:bg-amber-50">
              <Pause className="h-4 w-4 mr-2" /> {t("campaigns.pause")}
            </Button>
          )}
          {campaign.status === "Paused" && (
            <Button variant="outline" className="flex-1 min-h-[44px] text-emerald-600 border-emerald-200 hover:bg-emerald-50">
              <Play className="h-4 w-4 mr-2" /> {t("campaigns.resume")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default function Campaigns() {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const STATUS_CONFIG: Record<Campaign["status"], { color: string; labelKey: string }> = {
    Active: { color: "bg-emerald-100 text-emerald-700", labelKey: "campaigns.status.active" },
    Paused: { color: "bg-amber-100 text-amber-700", labelKey: "campaigns.status.paused" },
    Completed: { color: "bg-slate-100 text-slate-700", labelKey: "campaigns.status.completed" },
    Draft: { color: "bg-blue-100 text-blue-700", labelKey: "campaigns.status.draft" },
  };

  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = campaigns.filter(c => statusFilter === "All" || c.status === statusFilter);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);

  return (
    <AdminLayout breadcrumbs={[{ label: t("titleDashboard"), href: "/admin/dashboard" }, { label: t("titleCampaigns") }]}>
      <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">{t("titleCampaigns")}</h1>
            <p className="text-sm text-slate-500 mt-1">{t("subtitleCampaigns")}</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> {t("newCampaign")}</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Megaphone className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">{t("campaigns.count")}</div>
                <div className="text-xl font-display font-bold text-slate-900">{campaigns.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><DollarSign className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">{t("campaigns.totalBudget")}</div>
                <div className="text-xl font-display font-bold text-slate-900">${totalBudget.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">{t("campaigns.spent")}</div>
                <div className="text-xl font-display font-bold text-amber-600">${totalSpent.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">{t("campaigns.leadsGenerated")}</div>
                <div className="text-xl font-display font-bold text-blue-600">{totalLeads}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Select className="h-9 w-48 bg-white text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">{t("campaigns.allCampaigns")}</option>
          <option value="Active">{t("campaigns.status.allActive")}</option>
          <option value="Paused">{t("campaigns.status.allPaused")}</option>
          <option value="Completed">{t("campaigns.status.allCompleted")}</option>
          <option value="Draft">{t("campaigns.status.allDraft")}</option>
        </Select>

        <div className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
          {filtered.map(campaign => {
            const cfg = STATUS_CONFIG[campaign.status];
            const spentPct = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
            return (
              <div key={campaign.id} className="snap-start shrink-0 w-72">
                <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{campaign.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">{campaign.platform} · {campaign.source}</div>
                      </div>
                      <Badge className={cn("border-0 shrink-0 ml-2", cfg.color)}>{t(cfg.labelKey)}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="text-lg font-display font-bold text-slate-900">{campaign.leadsGenerated}</div>
                        <div className="text-[10px] text-slate-500">Leads</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="text-lg font-display font-bold text-emerald-600">{campaign.conversionRate}%</div>
                        <div className="text-[10px] text-slate-500">{t("campaigns.conversion")}</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="text-lg font-display font-bold text-primary">${campaign.cpl.toFixed(0)}</div>
                        <div className="text-[10px] text-slate-500">CPL</div>
                      </div>
                    </div>
                    {campaign.budget > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>{t("campaigns.budget")}</span>
                          <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className={cn("h-2 rounded-full transition-all", spentPct > 80 ? "bg-red-500" : spentPct > 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(spentPct, 100)}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{t("campaigns.startDate")}: {format(new Date(campaign.startDate), "dd MMM yyyy", { locale: dateLocale })}</span>
                      <div className="flex gap-1">
                        {campaign.status === "Active" && (
                          <Button variant="ghost" size="sm" className="h-8 min-h-[36px] text-xs text-amber-600 hover:bg-amber-50"><Pause className="h-3 w-3 mr-1" /> {t("campaigns.pause")}</Button>
                        )}
                        {campaign.status === "Paused" && (
                          <Button variant="ghost" size="sm" className="h-8 min-h-[36px] text-xs text-emerald-600 hover:bg-emerald-50"><Play className="h-3 w-3 mr-1" /> {t("campaigns.resume")}</Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 min-h-[36px] text-xs" onClick={() => setSelectedCampaign(campaign)}>
                          <Eye className="h-3 w-3 mr-1" /> {t("campaigns.details")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-4">
          {filtered.map(campaign => {
            const cfg = STATUS_CONFIG[campaign.status];
            const spentPct = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
            return (
              <Card key={campaign.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-bold text-slate-900">{campaign.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{campaign.platform} · {campaign.source}</div>
                    </div>
                    <Badge className={cn("border-0", cfg.color)}>{t(cfg.labelKey)}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <div className="text-lg font-display font-bold text-slate-900">{campaign.leadsGenerated}</div>
                      <div className="text-[10px] text-slate-500">Leads</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <div className="text-lg font-display font-bold text-emerald-600">{campaign.conversionRate}%</div>
                      <div className="text-[10px] text-slate-500">{t("campaigns.conversion")}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <div className="text-lg font-display font-bold text-primary">${campaign.cpl.toFixed(0)}</div>
                      <div className="text-[10px] text-slate-500">CPL</div>
                    </div>
                  </div>

                  {campaign.budget > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{t("campaigns.budget")}</span>
                        <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={cn("h-2 rounded-full transition-all", spentPct > 80 ? "bg-red-500" : spentPct > 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(spentPct, 100)}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{t("campaigns.startDate")}: {format(new Date(campaign.startDate), "dd MMM yyyy", { locale: dateLocale })}</span>
                    <div className="flex gap-1">
                      {campaign.status === "Active" && (
                        <Button variant="ghost" size="sm" className="h-8 min-h-[36px] text-xs text-amber-600 hover:bg-amber-50"><Pause className="h-3 w-3 mr-1" /> {t("campaigns.pause")}</Button>
                      )}
                      {campaign.status === "Paused" && (
                        <Button variant="ghost" size="sm" className="h-8 min-h-[36px] text-xs text-emerald-600 hover:bg-emerald-50"><Play className="h-3 w-3 mr-1" /> {t("campaigns.resume")}</Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 min-h-[36px] text-xs"
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <Eye className="h-3 w-3 mr-1" /> {t("campaigns.details")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </AdminLayout>
  );
}
