import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { LayoutTemplate, Plus, Search, Copy, Edit3, Eye, Star, FileText, Mail, MessageCircle, Video, DollarSign, Loader2, X, Info } from "lucide-react";
import { templatesService } from "@/lib/services/templatesService";
import type { Template, TemplateCategory } from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORY_CONFIG: Record<TemplateCategory, { label: string; icon: any; color: string }> = {
  proposals: { label: 'Propuestas', icon: FileText, color: 'bg-blue-500' },
  invoices: { label: 'Facturas', icon: DollarSign, color: 'bg-emerald-500' },
  emails: { label: 'Emails', icon: Mail, color: 'bg-purple-500' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
  meetings: { label: 'Reuniones', icon: Video, color: 'bg-amber-500' },
  quotes: { label: 'Cotizaciones', icon: DollarSign, color: 'bg-red-500' },
};

const USAGE_MAP: Record<TemplateCategory, string> = {
  proposals: "Módulo de Propuestas — se usa al crear propuestas para clientes",
  invoices: "Módulo de Facturación — se genera al cerrar un deal",
  emails: "Módulo de Comunicaciones — usado en campañas y follow-ups automáticos",
  whatsapp: "Módulo de WhatsApp — mensajes automatizados y respuestas rápidas",
  meetings: "Módulo de Reuniones — invitaciones y confirmaciones de citas",
  quotes: "Módulo de Cotizaciones — generación de cotizaciones para propiedades",
};

function TemplatePreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const cfg = CATEGORY_CONFIG[template.category];

  const renderPreview = () => {
    if (template.category === "emails") {
      return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <div className="text-white font-bold text-lg">My House Realty</div>
            <div className="text-white/70 text-xs mt-1">info@myhouserealty.com</div>
          </div>
          <div className="p-6">
            <div className="text-sm text-slate-500 mb-1">Para: <span className="text-slate-700">{"{{cliente_nombre}}"}</span></div>
            <div className="text-sm text-slate-500 mb-4">Asunto: <span className="text-slate-700 font-medium">{template.name}</span></div>
            <div className="border-t border-slate-100 pt-4">
              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{template.content}</div>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400 text-center">
            My House Realty — Puerto Rico
          </div>
        </div>
      );
    }

    if (template.category === "invoices" || template.category === "quotes") {
      return (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-xl font-bold text-slate-900">My House Realty</div>
              <div className="text-xs text-slate-500 mt-1">Puerto Rico</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{template.category === "invoices" ? "FACTURA" : "COTIZACIÓN"}</div>
              <div className="text-xs text-slate-500">#INV-2025-001</div>
              <div className="text-xs text-slate-500 mt-1">{format(new Date(), "d MMM yyyy", { locale: es })}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Facturar a</div>
              <div className="text-sm text-slate-700">{"{{cliente_nombre}}"}</div>
              <div className="text-xs text-slate-500">{"{{cliente_email}}"}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Propiedad</div>
              <div className="text-sm text-slate-700">{"{{propiedad_direccion}}"}</div>
              <div className="text-xs text-slate-500">{"{{propiedad_tipo}}"}</div>
            </div>
          </div>
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-2 text-slate-500 font-medium">Concepto</th>
                <th className="text-right py-2 text-slate-500 font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-700">Comisión de venta</td>
                <td className="py-2 text-right text-slate-700">{"{{monto}}"}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-700">Gastos administrativos</td>
                <td className="py-2 text-right text-slate-700">$500.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td className="py-2 font-bold text-slate-900">Total</td>
                <td className="py-2 text-right font-bold text-primary text-lg">{"{{total}}"}</td>
              </tr>
            </tfoot>
          </table>
          <div className="text-xs text-slate-400 border-t border-slate-100 pt-4">{template.content.substring(0, 200)}...</div>
        </div>
      );
    }

    if (template.category === "proposals") {
      return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-700 px-6 py-8 text-white">
            <div className="text-2xl font-bold">Propuesta de Compra</div>
            <div className="text-white/70 mt-2 text-sm">My House Realty — {"{{fecha}}"}</div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Cliente</div>
                <div className="text-sm font-semibold text-slate-900">{"{{cliente_nombre}}"}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Propiedad</div>
                <div className="text-sm font-semibold text-slate-900">{"{{propiedad_direccion}}"}</div>
              </div>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="text-xs text-primary font-semibold uppercase">Oferta</div>
              <div className="text-2xl font-bold text-primary mt-1">{"{{monto_oferta}}"}</div>
            </div>
            <div className="text-sm text-slate-600 whitespace-pre-wrap">{template.content.substring(0, 300)}...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", cfg.color)}>
            <cfg.icon className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">{template.name}</h3>
        </div>
        <div className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">{template.content}</div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-slate-200 max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", cfg.color)}>
                <cfg.icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">{template.name}</h3>
                <p className="text-xs text-slate-500">{cfg.label} · Usado {template.usageCount}x</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            {renderPreview()}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-blue-700">Usado en</div>
                <div className="text-xs text-blue-600 mt-0.5">{USAGE_MAP[template.category]}</div>
              </div>
            </div>
          </div>
          <div className="p-5 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
            <Button><Copy className="h-3.5 w-3.5 mr-1" /> Usar Template</Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');
  const [selectedTpl, setSelectedTpl] = useState<Template | null>(null);
  const [previewTpl, setPreviewTpl] = useState<Template | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    templatesService.getAll().then(t => { setTemplates(t); setLoading(false); });
  }, []);

  const filtered = templates
    .filter(t => categoryFilter === 'all' || t.category === categoryFilter)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const categoryCounts: Record<string, number> = { all: templates.length };
  templates.forEach(t => { categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1; });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Templates</h1>
            <p className="text-sm text-slate-500 mt-1">Biblioteca de plantillas reutilizables.</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Nuevo Template</Button>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          <button onClick={() => setCategoryFilter('all')} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", categoryFilter === 'all' ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>Todos ({templates.length})</button>
          {(Object.keys(CATEGORY_CONFIG) as TemplateCategory[]).map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", categoryFilter === c ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>
              {CATEGORY_CONFIG[c].label} ({categoryCounts[c] || 0})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-64">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Buscar template..." value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <Card className="shadow-sm border-slate-200"><CardContent className="p-16 text-center text-slate-400">No hay templates.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(tpl => {
                  const cfg = CATEGORY_CONFIG[tpl.category];
                  const Icon = cfg.icon;
                  return (
                    <Card key={tpl.id} className={cn("shadow-sm border-slate-200 cursor-pointer transition-all hover:shadow-md", selectedTpl?.id === tpl.id && "ring-2 ring-primary")} onClick={() => setSelectedTpl(tpl)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", cfg.color)}><Icon className="h-4 w-4" /></div>
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900">{tpl.name}</h3>
                              <span className="text-[10px] text-slate-400">{cfg.label}</span>
                            </div>
                          </div>
                          {tpl.isDefault && <Badge variant="default" className="text-[9px]"><Star className="h-2.5 w-2.5 mr-0.5" /> Default</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{tpl.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>Usado {tpl.usageCount}x</span>
                            <span>·</span>
                            <span>{tpl.variables.length} variables</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setPreviewTpl(tpl); }}><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Copy className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit3 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1 text-[10px] text-blue-600">
                            <Info className="h-3 w-3" />
                            <span>{USAGE_MAP[tpl.category].split("—")[0].trim()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            {selectedTpl ? (
              <Card className="shadow-sm border-slate-200 sticky top-20">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base">{selectedTpl.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{CATEGORY_CONFIG[selectedTpl.category].label}</Badge>
                    {selectedTpl.isDefault && <Badge variant="default" className="text-[10px]">Default</Badge>}
                  </div>
                  <p className="text-sm text-slate-600">{selectedTpl.description}</p>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Contenido</h4>
                    <pre className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap font-sans max-h-48 overflow-y-auto">{selectedTpl.content}</pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Variables ({selectedTpl.variables.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTpl.variables.map((v, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-mono">{`{{${v}}}`}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 mb-1">
                      <Info className="h-3 w-3" /> Usado en
                    </div>
                    <div className="text-xs text-blue-600">{USAGE_MAP[selectedTpl.category]}</div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex justify-between"><span>Owner</span><span className="font-medium text-slate-700">{selectedTpl.owner}</span></div>
                    <div className="flex justify-between"><span>Uso</span><span className="font-medium text-slate-700">{selectedTpl.usageCount} veces</span></div>
                    <div className="flex justify-between"><span>Actualizado</span><span className="font-medium text-slate-700">{formatDistanceToNow(new Date(selectedTpl.updatedAt), { addSuffix: true, locale: es })}</span></div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreviewTpl(selectedTpl)}><Eye className="h-3.5 w-3.5 mr-1" /> Vista previa</Button>
                    <Button size="sm" className="flex-1"><Copy className="h-3.5 w-3.5 mr-1" /> Usar</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-8 text-center text-slate-400">
                  <LayoutTemplate className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Selecciona un template para ver detalles.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {previewTpl && (
          <TemplatePreviewModal template={previewTpl} onClose={() => setPreviewTpl(null)} />
        )}
      </div>
    </AdminLayout>
  );
}
