import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn, formatCurrency } from "@/lib/utils";
import { FileText, Plus, Search, Eye, Send, CheckCircle, XCircle, Clock, AlertTriangle, Copy, LayoutTemplate, Loader2, X, Edit3, Printer, Save, Trash2, Link2 } from "lucide-react";
import { proposalsService } from "@/lib/services/proposalsService";
import type { Proposal, ProposalTemplate, ProposalStatus } from "@/lib/operations-types";
import { BRAND } from "@/lib/mock-data";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { getBranding } from "@/store/branding-store";

const STATUS_CONFIG: Record<ProposalStatus, { label: string; variant: any; color: string }> = {
  draft: { label: 'Borrador', variant: 'secondary', color: 'bg-slate-100 border-slate-200' },
  sent: { label: 'Enviada', variant: 'default', color: 'bg-blue-50 border-blue-200' },
  viewed: { label: 'Vista', variant: 'high', color: 'bg-amber-50 border-amber-200' },
  accepted: { label: 'Aceptada', variant: 'success', color: 'bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Rechazada', variant: 'destructive', color: 'bg-red-50 border-red-200' },
  expired: { label: 'Expirada', variant: 'low', color: 'bg-slate-50 border-slate-200' },
};

const BLOCK_LABELS: Record<string, string> = {
  cover: 'Portada', intro: 'Introducción', problem: 'Problema/Oportunidad', solution: 'Solución', scope: 'Alcance', deliverables: 'Entregables', timeline: 'Timeline', pricing: 'Oferta/Precios', chart: 'Gráficas', gallery: 'Galería', testimonials: 'Testimonios', terms: 'Términos', signature: 'Firma',
};

function CreateProposalModal({ onSave, onCancel }: { onSave: (p: Proposal) => void; onCancel: () => void }) {
  const [clientName, setClientName] = useState('');
  const [title, setTitle] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [price, setPrice] = useState('');
  const [terms, setTerms] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    const proposal = await proposalsService.create({
      title: title || `Propuesta para ${clientName}`,
      clientName,
      totalValue: parseFloat(price) || 0,
      status: 'draft',
      owner: 'María Santos',
      blocks: [
        { id: `b-${Date.now()}-1`, type: 'cover', title: 'Portada', order: 1, content: { title: title || `Propuesta para ${clientName}`, subtitle: propertyAddress } },
        { id: `b-${Date.now()}-2`, type: 'pricing', title: 'Oferta/Precios', order: 2, content: { price, terms } },
        { id: `b-${Date.now()}-3`, type: 'terms', title: 'Términos', order: 3, content: { notes } },
      ],
    });
    onSave(proposal);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Nueva Propuesta</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Cliente *</label>
            <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nombre del cliente" className="h-10 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Título de la propuesta</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Oferta de compra - Calle Luna 123" className="h-10 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Propiedad / Dirección</label>
            <Input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Dirección de la propiedad" className="h-10 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Precio / Valor ($)</label>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="150000" className="h-10 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Términos</label>
            <Input value={terms} onChange={e => setTerms(e.target.value)} placeholder="Ej: Cash, cierre en 30 días" className="h-10 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Notas adicionales</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas o condiciones especiales..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none h-20" />
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancelar</Button>
          <Button className="flex-1" onClick={handleSave} disabled={!clientName}><Save className="h-4 w-4 mr-2" /> Crear Propuesta</Button>
        </div>
      </div>
    </div>
  );
}

function ProposalReadOnlyView({ proposal, onClose }: { proposal: Proposal; onClose: () => void }) {
  const branding = getBranding();
  const { toast } = useToast();

  const handleExportPDF = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    const baseUrl = window.location.origin + import.meta.env.BASE_URL;
    const url = `${baseUrl}propuesta/${proposal.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Enlace copiado", description: "El enlace de la propuesta ha sido copiado al portapapeles." });
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto print:relative">
      <div className="max-w-3xl mx-auto p-8 print:p-4">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h2 className="text-lg font-semibold">Vista de Propuesta</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyShareLink}><Link2 className="h-3.5 w-3.5 mr-1" /> Compartir</Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}><Printer className="h-3.5 w-3.5 mr-1" /> Exportar PDF</Button>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-8 print:border-none print:p-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">{branding.systemName}</h1>
              <p className="text-sm text-slate-500">{branding.tagline}</p>
              <p className="text-xs text-slate-400 mt-1">{BRAND.email}</p>
              <p className="text-xs text-slate-400">{BRAND.phones.metro}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-display font-bold" style={{ color: branding.primaryColor }}>PROPUESTA</h2>
              <p className="text-sm font-semibold text-slate-700 mt-1">{proposal.id}</p>
              <Badge variant={STATUS_CONFIG[proposal.status].variant} className="mt-2">{STATUS_CONFIG[proposal.status].label}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Preparada para:</h4>
              <p className="text-sm font-semibold text-slate-900">{proposal.clientName}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Fecha: <span className="font-medium text-slate-700">{format(new Date(proposal.createdAt), "d MMM yyyy", { locale: es })}</span></div>
              <div className="text-sm text-slate-500">Válida hasta: <span className="font-medium text-slate-700">{format(new Date(proposal.expiresAt), "d MMM yyyy", { locale: es })}</span></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-4">{proposal.title}</h3>
          </div>

          {proposal.blocks.map(block => (
            <div key={block.id} className="mb-6 pb-6 border-b border-slate-100 last:border-0">
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">{BLOCK_LABELS[block.type] || block.type}</h4>
              {block.type === 'pricing' ? (
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">{formatCurrency(proposal.totalValue)}</div>
                  {block.content?.terms && <p className="text-sm text-slate-500">{block.content.terms}</p>}
                </div>
              ) : block.type === 'cover' ? (
                <div>
                  {block.content?.subtitle && <p className="text-slate-600">{block.content.subtitle}</p>}
                </div>
              ) : (
                <div className="text-sm text-slate-600">
                  {block.content?.notes || block.content?.text || 'Contenido del bloque'}
                </div>
              )}
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            <p>{branding.systemName} · {BRAND.email} · {BRAND.phones.metro}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProposalsPage() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<ProposalStatus | 'all'>('all');
  const [selectedProp, setSelectedProp] = useState<Proposal | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showReadOnly, setShowReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ clientName: '', title: '', price: '', terms: '', notes: '' });

  useEffect(() => {
    Promise.all([proposalsService.getAll(), proposalsService.getTemplates()]).then(([props, tpls]) => {
      setProposals(props);
      setTemplates(tpls);
      setLoading(false);
    });
  }, []);

  const filtered = proposals.filter(p => activeStatus === 'all' || p.status === activeStatus);
  const statusCounts: Record<string, number> = { all: proposals.length };
  proposals.forEach(p => { statusCounts[p.status] = (statusCounts[p.status] || 0) + 1; });

  const handleCreateSave = (p: Proposal) => {
    setProposals(prev => [...prev, p]);
    setShowCreate(false);
    setSelectedProp(p);
    toast({ title: "Propuesta creada", description: `"${p.title}" guardada como borrador.` });
  };

  const startEditing = (prop: Proposal) => {
    setEditValues({
      clientName: prop.clientName,
      title: prop.title,
      price: prop.totalValue.toString(),
      terms: prop.blocks.find(b => b.type === 'pricing')?.content?.terms || '',
      notes: prop.blocks.find(b => b.type === 'terms')?.content?.notes || '',
    });
    setIsEditing(true);
  };

  const handleInlineSave = async () => {
    if (!selectedProp) return;
    const updated = await proposalsService.update(selectedProp.id, {
      title: editValues.title,
      clientName: editValues.clientName,
      totalValue: parseFloat(editValues.price) || 0,
      blocks: selectedProp.blocks.map(b => {
        if (b.type === 'pricing') return { ...b, content: { ...b.content, price: editValues.price, terms: editValues.terms } };
        if (b.type === 'terms') return { ...b, content: { ...b.content, notes: editValues.notes } };
        if (b.type === 'cover') return { ...b, content: { ...b.content, title: editValues.title } };
        return b;
      }),
      version: selectedProp.version + 1,
    });
    if (updated) {
      setProposals(prev => prev.map(x => x.id === updated.id ? updated : x));
      setSelectedProp(updated);
      setIsEditing(false);
      toast({ title: "Propuesta actualizada", description: `"${updated.title}" ha sido actualizada.` });
    }
  };

  const handleSend = async (prop: Proposal) => {
    const updated = await proposalsService.update(prop.id, { status: 'sent', sentAt: new Date().toISOString() });
    if (updated) {
      setProposals(prev => prev.map(p => p.id === prop.id ? updated : p));
      setSelectedProp(updated);
      toast({ title: "Propuesta enviada", description: `"${prop.title}" ha sido marcada como enviada.` });
    }
  };

  const handleArchive = async (prop: Proposal) => {
    await proposalsService.archive(prop.id);
    setProposals(prev => prev.filter(p => p.id !== prop.id));
    setSelectedProp(null);
    toast({ title: "Propuesta archivada", description: `"${prop.title}" ha sido archivada.` });
  };

  const handleUseTemplate = async (tpl: ProposalTemplate) => {
    const proposal = await proposalsService.create({
      title: `${tpl.name} - Nuevo`,
      clientName: '',
      totalValue: 0,
      status: 'draft',
      owner: 'María Santos',
      templateId: tpl.id,
      blocks: tpl.blocks,
    });
    setProposals(prev => [...prev, proposal]);
    setSelectedProp(proposal);
    setShowTemplates(false);
    startEditing(proposal);
    toast({ title: "Template aplicado", description: `Propuesta creada con template "${tpl.name}".` });
  };

  if (showReadOnly && selectedProp) {
    return <ProposalReadOnlyView proposal={selectedProp} onClose={() => setShowReadOnly(false)} />;
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Propuestas</h1>
            <p className="text-sm text-slate-500 mt-1">Crea y gestiona propuestas para vendedores.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}><LayoutTemplate className="h-4 w-4 mr-2" /> Templates ({templates.length})</Button>
            <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-2" /> Nueva Propuesta</Button>
          </div>
        </div>

        {showTemplates && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map(tpl => (
              <Card key={tpl.id} className="shadow-sm border-slate-200 hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-900">{tpl.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">{tpl.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{tpl.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tpl.blocks.map(b => (
                      <span key={b.id} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{BLOCK_LABELS[b.type]}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Usado {tpl.usageCount}x</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleUseTemplate(tpl)}><Copy className="h-3 w-3 mr-1" /> Usar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex gap-1 overflow-x-auto pb-1">
          {(['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'] as const).map(s => (
            <button key={s} onClick={() => setActiveStatus(s)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", activeStatus === s ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>
              {s === 'all' ? 'Todas' : STATUS_CONFIG[s].label} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <Card className="shadow-sm border-slate-200"><CardContent className="p-16 text-center text-slate-400">No hay propuestas.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(prop => {
                  const cfg = STATUS_CONFIG[prop.status];
                  return (
                    <Card key={prop.id} className={cn("shadow-sm border cursor-pointer transition-all hover:shadow-md", cfg.color, selectedProp?.id === prop.id && "ring-2 ring-primary")} onClick={() => setSelectedProp(prop)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge>
                          <span className="text-xs text-slate-400">{prop.id}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">{prop.title}</h3>
                        <div className="text-xs text-slate-500 mb-3">{prop.clientName}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">{formatCurrency(prop.totalValue)}</span>
                          <div className="text-right">
                            <div className="text-[11px] text-slate-400">{format(new Date(prop.createdAt), "d MMM yyyy", { locale: es })}</div>
                            {prop.viewCount > 0 && <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end"><Eye className="h-3 w-3" />{prop.viewCount} vistas</div>}
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
            {selectedProp ? (
              <Card className="shadow-sm border-slate-200 sticky top-20">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {isEditing ? 'Editando Propuesta' : selectedProp.title}
                    </CardTitle>
                    {isEditing && (
                      <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Título</label>
                        <Input value={editValues.title} onChange={e => setEditValues({ ...editValues, title: e.target.value })} className="h-9 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Cliente</label>
                        <Input value={editValues.clientName} onChange={e => setEditValues({ ...editValues, clientName: e.target.value })} className="h-9 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Precio / Valor ($)</label>
                        <Input type="number" value={editValues.price} onChange={e => setEditValues({ ...editValues, price: e.target.value })} className="h-9 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Términos</label>
                        <Input value={editValues.terms} onChange={e => setEditValues({ ...editValues, terms: e.target.value })} className="h-9 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Notas</label>
                        <textarea value={editValues.notes} onChange={e => setEditValues({ ...editValues, notes: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none h-20" />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        <Button size="sm" className="flex-1" onClick={handleInlineSave}><Save className="h-3.5 w-3.5 mr-1" /> Guardar</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center py-2">
                        <div className="text-3xl font-bold text-slate-900">{formatCurrency(selectedProp.totalValue)}</div>
                        <Badge variant={STATUS_CONFIG[selectedProp.status].variant} className="mt-2">{STATUS_CONFIG[selectedProp.status].label}</Badge>
                      </div>
                      <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                        <div className="flex justify-between"><span className="text-slate-500">Cliente</span><span className="font-medium">{selectedProp.clientName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Owner</span><span className="font-medium">{selectedProp.owner}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Versión</span><span className="font-medium">v{selectedProp.version}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Creada</span><span className="font-medium">{format(new Date(selectedProp.createdAt), "d MMM", { locale: es })}</span></div>
                        {selectedProp.sentAt && <div className="flex justify-between"><span className="text-slate-500">Enviada</span><span className="font-medium">{format(new Date(selectedProp.sentAt), "d MMM", { locale: es })}</span></div>}
                        {selectedProp.viewedAt && <div className="flex justify-between"><span className="text-slate-500">Vista</span><span className="font-medium">{format(new Date(selectedProp.viewedAt), "d MMM", { locale: es })}</span></div>}
                        {selectedProp.respondedAt && <div className="flex justify-between"><span className="text-slate-500">Respondida</span><span className="font-medium">{format(new Date(selectedProp.respondedAt), "d MMM", { locale: es })}</span></div>}
                        <div className="flex justify-between"><span className="text-slate-500">Expira</span><span className="font-medium">{format(new Date(selectedProp.expiresAt), "d MMM yyyy", { locale: es })}</span></div>
                      </div>
                      <div className="border-t border-slate-100 pt-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Bloques ({selectedProp.blocks.length})</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedProp.blocks.map(b => (
                            <span key={b.id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{BLOCK_LABELS[b.type] || b.type}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowReadOnly(true)}><Eye className="h-3.5 w-3.5 mr-1" /> Ver</Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditing(selectedProp)}><Edit3 className="h-3.5 w-3.5 mr-1" /> Editar</Button>
                        </div>
                        <div className="flex gap-2">
                          {selectedProp.status === 'draft' && (
                            <Button size="sm" className="flex-1" onClick={() => handleSend(selectedProp)}><Send className="h-3.5 w-3.5 mr-1" /> Enviar</Button>
                          )}
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => { setShowReadOnly(true); }}><Printer className="h-3.5 w-3.5 mr-1" /> Exportar PDF</Button>
                        </div>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleArchive(selectedProp)}><Trash2 className="h-3.5 w-3.5 mr-1" /> Archivar</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-8 text-center text-slate-400">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Selecciona una propuesta para ver detalles.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {showCreate && <CreateProposalModal onSave={handleCreateSave} onCancel={() => setShowCreate(false)} />}
    </AdminLayout>
  );
}
