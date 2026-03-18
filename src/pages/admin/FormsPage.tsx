import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import {
  ClipboardList, Plus, Search, Eye, Copy, Trash2, Settings, Save,
  Type, AlignLeft, Hash, Phone, Mail, ChevronDown, List, CheckSquare,
  Calendar, Upload, Radio, Loader2, Code, ToggleLeft, X, ExternalLink, Link2
} from "lucide-react";
import { formsService } from "@/lib/services/formsService";
import type { FormDefinition, FormField, FormFieldType, FormStatus } from "@/lib/operations-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const STATUS_BADGES: Record<FormStatus, { variant: any; label: string }> = {
  active: { variant: 'success', label: 'Activo' },
  inactive: { variant: 'low', label: 'Inactivo' },
  draft: { variant: 'secondary', label: 'Borrador' },
};

const FIELD_TYPE_CONFIG: Record<FormFieldType, { icon: any; label: string }> = {
  'text': { icon: Type, label: 'Texto Corto' },
  'long-text': { icon: AlignLeft, label: 'Texto Largo' },
  'number': { icon: Hash, label: 'Número' },
  'phone': { icon: Phone, label: 'Teléfono' },
  'email': { icon: Mail, label: 'Email' },
  'dropdown': { icon: ChevronDown, label: 'Dropdown' },
  'multi-select': { icon: List, label: 'Multi-Select' },
  'radio': { icon: Radio, label: 'Radio' },
  'checkbox': { icon: CheckSquare, label: 'Checkbox' },
  'date': { icon: Calendar, label: 'Fecha' },
  'file-upload': { icon: Upload, label: 'Archivo' },
};

function FieldPalette({ onAdd }: { onAdd: (type: FormFieldType) => void }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2"><CardTitle className="text-sm">Campos</CardTitle></CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.entries(FIELD_TYPE_CONFIG) as [FormFieldType, { icon: any; label: string }][]).map(([type, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button key={type} onClick={() => onAdd(type)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-primary/5 hover:text-primary border border-slate-100 hover:border-primary/20 transition-all">
                <Icon className="h-3.5 w-3.5" /> {cfg.label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function FieldSettingsPanel({ field, onUpdate, onRemove }: { field: FormField; onUpdate: (f: FormField) => void; onRemove: () => void }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Configuración del Campo</CardTitle>
          <button onClick={onRemove} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">Label</label>
          <Input value={field.label} onChange={e => onUpdate({ ...field, label: e.target.value })} className="h-8 text-xs" />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">Placeholder</label>
          <Input value={field.placeholder} onChange={e => onUpdate({ ...field, placeholder: e.target.value })} className="h-8 text-xs" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Requerido</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={field.required} onChange={() => onUpdate({ ...field, required: !field.required })} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Activo</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={field.active} onChange={() => onUpdate({ ...field, active: !field.active })} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>
        {(field.type === 'dropdown' || field.type === 'multi-select' || field.type === 'radio') && field.options && (
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">Opciones</label>
            <div className="space-y-1">
              {field.options.map((opt, idx) => (
                <div key={idx} className="flex gap-1">
                  <Input
                    value={opt.label}
                    onChange={e => {
                      const newOpts = [...(field.options || [])];
                      newOpts[idx] = { ...newOpts[idx], label: e.target.value, value: e.target.value.toLowerCase().replace(/\s/g, '-') };
                      onUpdate({ ...field, options: newOpts });
                    }}
                    className="h-7 text-xs flex-1"
                  />
                  <button onClick={() => {
                    const newOpts = (field.options || []).filter((_, i) => i !== idx);
                    onUpdate({ ...field, options: newOpts });
                  }} className="text-red-400 hover:text-red-600"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="h-6 text-[10px] w-full" onClick={() => {
                const newOpts = [...(field.options || []), { label: `Opción ${(field.options?.length || 0) + 1}`, value: `opt-${Date.now()}` }];
                onUpdate({ ...field, options: newOpts });
              }}><Plus className="h-2.5 w-2.5 mr-1" /> Agregar opción</Button>
            </div>
          </div>
        )}
        {field.validation && (
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">Validación</label>
            <Input value={field.validation} onChange={e => onUpdate({ ...field, validation: e.target.value })} className="h-8 text-xs" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FormPreview({ form }: { form: FormDefinition }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base">{form.name}</CardTitle>
        <p className="text-xs text-slate-500 mt-1">{form.description}</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {form.fields.filter(f => f.active).sort((a, b) => a.order - b.order).map(field => {
          const cfg = FIELD_TYPE_CONFIG[field.type];
          return (
            <div key={field.id} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'long-text' ? (
                <textarea placeholder={field.placeholder} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none h-20" disabled />
              ) : field.type === 'dropdown' || field.type === 'multi-select' ? (
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-400" disabled>
                  <option>{field.placeholder || 'Seleccionar...'}</option>
                  {field.options?.map(o => <option key={o.value}>{o.label}</option>)}
                </select>
              ) : field.type === 'radio' ? (
                <div className="space-y-1.5">
                  {field.options?.map(o => (
                    <label key={o.value} className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="radio" name={field.id} disabled className="accent-primary" /> {o.label}
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" disabled className="accent-primary" /> {field.label}
                </label>
              ) : field.type === 'file-upload' ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-xs text-slate-400">
                  <Upload className="h-5 w-5 mx-auto mb-1 opacity-50" />
                  {field.placeholder || 'Arrastra archivos aquí'}
                </div>
              ) : (
                <input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} placeholder={field.placeholder} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" disabled />
              )}
            </div>
          );
        })}
        <Button className="w-full mt-4" disabled>Enviar</Button>
      </CardContent>
    </Card>
  );
}

export default function FormsPage() {
  const { toast } = useToast();
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showEmbed, setShowEmbed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    formsService.getAll().then(f => { setForms(f); setLoading(false); });
  }, []);

  const filtered = forms.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));
  const selectedField = selectedForm?.fields.find(f => f.id === selectedFieldId) || null;

  const getShareableUrl = (form: FormDefinition) => {
    const base = window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    return `${base}/formulario/${form.id}`;
  };

  const addField = (type: FormFieldType) => {
    if (!selectedForm) return;
    const newField: FormField = {
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type, label: FIELD_TYPE_CONFIG[type].label, placeholder: '', required: false, active: true,
      order: selectedForm.fields.length + 1,
      ...((['dropdown', 'multi-select', 'radio'].includes(type)) ? { options: [{ label: 'Opción 1', value: 'opt-1' }, { label: 'Opción 2', value: 'opt-2' }] } : {}),
    };
    const updated = { ...selectedForm, fields: [...selectedForm.fields, newField] };
    setSelectedForm(updated);
    setSelectedFieldId(newField.id);
  };

  const updateField = (updatedField: FormField) => {
    if (!selectedForm) return;
    const updated = { ...selectedForm, fields: selectedForm.fields.map(f => f.id === updatedField.id ? updatedField : f) };
    setSelectedForm(updated);
  };

  const removeField = () => {
    if (!selectedForm || !selectedFieldId) return;
    const updated = { ...selectedForm, fields: selectedForm.fields.filter(f => f.id !== selectedFieldId) };
    setSelectedForm(updated);
    setSelectedFieldId(null);
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    if (!selectedForm) return;
    const sorted = [...selectedForm.fields].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(f => f.id === fieldId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const tempOrder = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
    sorted[swapIdx] = { ...sorted[swapIdx], order: tempOrder };
    setSelectedForm({ ...selectedForm, fields: sorted });
  };

  const handleDuplicate = async (form: FormDefinition) => {
    const dup = await formsService.duplicate(form.id);
    if (dup) {
      setForms(prev => [...prev, dup]);
      toast({ title: "Formulario duplicado", description: `"${dup.name}" creado.` });
    }
  };

  const handleDelete = async (form: FormDefinition) => {
    await formsService.delete(form.id);
    setForms(prev => prev.filter(f => f.id !== form.id));
    if (selectedForm?.id === form.id) { setSelectedForm(null); }
  };

  const handleToggleStatus = async (form: FormDefinition) => {
    const newStatus = form.status === 'active' ? 'inactive' : 'active';
    const updated = await formsService.update(form.id, { status: newStatus });
    if (updated) setForms(prev => prev.map(f => f.id === form.id ? updated : f));
  };

  const handleCopyShareLink = (form: FormDefinition) => {
    const url = getShareableUrl(form);
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Enlace copiado", description: "El enlace del formulario ha sido copiado al portapapeles." });
    });
  };

  const handleSaveForm = async () => {
    if (!selectedForm) return;
    const updated = await formsService.update(selectedForm.id, {
      fields: selectedForm.fields,
      name: selectedForm.name,
      description: selectedForm.description,
      landingTitle: selectedForm.landingTitle,
      landingInstructions: selectedForm.landingInstructions,
      landingBgColor: selectedForm.landingBgColor,
    });
    if (updated) {
      setForms(prev => prev.map(f => f.id === updated.id ? updated : f));
      toast({ title: "Formulario guardado", description: `"${updated.name}" actualizado.` });
    }
  };

  const embedCode = selectedForm ? `<iframe src="${getShareableUrl(selectedForm)}" width="100%" height="600" frameborder="0"></iframe>` : '';

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Forms" }]}>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Form Builder</h1>
            <p className="text-sm text-slate-500 mt-1">Crea y gestiona formularios para captura de datos.</p>
          </div>
          <Button onClick={async () => {
            const f = await formsService.create({ name: 'Nuevo Formulario', description: 'Formulario sin título' });
            setForms(prev => [...prev, f]);
            setSelectedForm(f);
            setSelectedFieldId(null);
          }}><Plus className="h-4 w-4 mr-2" /> Nuevo Formulario</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{forms.length}</div><div className="text-xs text-slate-500">Total</div></CardContent></Card>
          <Card className="shadow-sm border-emerald-200 bg-emerald-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-700">{forms.filter(f => f.status === 'active').length}</div><div className="text-xs text-emerald-600">Activos</div></CardContent></Card>
          <Card className="shadow-sm border-amber-200 bg-amber-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-amber-700">{forms.reduce((s, f) => s + f.submissions, 0)}</div><div className="text-xs text-amber-600">Total Envíos</div></CardContent></Card>
          <Card className="shadow-sm border-blue-200 bg-blue-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-blue-700">{forms.reduce((s, f) => s + f.fields.length, 0)}</div><div className="text-xs text-blue-600">Total Campos</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-3">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filtered.map(form => (
                  <div
                    key={form.id}
                    onClick={() => { setSelectedForm(form); setSelectedFieldId(null); setShowPreview(false); setShowEmbed(false); }}
                    className={cn("p-3 rounded-lg border cursor-pointer transition-all", selectedForm?.id === form.id ? "border-primary bg-primary/5 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:shadow-sm")}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate flex-1">{form.name}</h3>
                      <Badge variant={STATUS_BADGES[form.status].variant} className="text-[9px] ml-2 shrink-0">{STATUS_BADGES[form.status].label}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{form.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{form.fields.length} campos · {form.submissions} envíos</span>
                      <span>{format(new Date(form.updatedAt), "d MMM", { locale: es })}</span>
                    </div>
                    <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] flex-1 px-1" onClick={() => handleCopyShareLink(form)}><Link2 className="h-3 w-3 mr-0.5" /> Link</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] flex-1 px-1" onClick={() => handleDuplicate(form)}><Copy className="h-3 w-3 mr-0.5" /> Duplicar</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1" onClick={() => handleToggleStatus(form)}><ToggleLeft className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1 text-red-500" onClick={() => handleDelete(form)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No hay formularios.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedForm ? (
            <div className="lg:col-span-9 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900">{selectedForm.name}</h2>
                  <p className="text-xs text-slate-500">{selectedForm.fields.length} campos · {selectedForm.submissions} envíos</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopyShareLink(selectedForm)}><Link2 className="h-3.5 w-3.5 mr-1" /> Copiar Link</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowEmbed(!showEmbed)}><Code className="h-3.5 w-3.5 mr-1" /> Embed</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}><Eye className="h-3.5 w-3.5 mr-1" /> Preview</Button>
                  <Button size="sm" onClick={handleSaveForm}><Save className="h-3.5 w-3.5 mr-1" /> Guardar</Button>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">URL pública:</span>
                  <code className="text-[11px] bg-emerald-100 px-2 py-0.5 rounded">{getShareableUrl(selectedForm)}</code>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-[10px] border-emerald-300 text-emerald-700 hover:bg-emerald-100" onClick={() => handleCopyShareLink(selectedForm)}>
                  <Copy className="h-3 w-3 mr-1" /> Copiar
                </Button>
              </div>

              {showEmbed && (
                <Card className="shadow-sm border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">Código de Embed</h4>
                      <button onClick={() => setShowEmbed(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                    </div>
                    <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs overflow-x-auto">{embedCode}</pre>
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(embedCode); toast({ title: "Código copiado" }); }}><Copy className="h-3 w-3 mr-1" /> Copiar</Button>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <FieldPalette onAdd={addField} />

                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Configuración</CardTitle></CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Nombre</label>
                        <Input value={selectedForm.name} onChange={e => setSelectedForm({ ...selectedForm, name: e.target.value })} className="h-8 text-xs" />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Descripción</label>
                        <Input value={selectedForm.description} onChange={e => setSelectedForm({ ...selectedForm, description: e.target.value })} className="h-8 text-xs" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Landing Page</CardTitle></CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Título público</label>
                        <Input value={selectedForm.landingTitle || ''} onChange={e => setSelectedForm({ ...selectedForm, landingTitle: e.target.value })} className="h-8 text-xs" placeholder={selectedForm.name} />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Instrucciones</label>
                        <Input value={selectedForm.landingInstructions || ''} onChange={e => setSelectedForm({ ...selectedForm, landingInstructions: e.target.value })} className="h-8 text-xs" placeholder="Instrucciones para el usuario..." />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Color de fondo</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={selectedForm.landingBgColor || '#f0f4ff'} onChange={e => setSelectedForm({ ...selectedForm, landingBgColor: e.target.value })} className="w-8 h-8 rounded border border-slate-200 cursor-pointer" />
                          <Input value={selectedForm.landingBgColor || '#f0f4ff'} onChange={e => setSelectedForm({ ...selectedForm, landingBgColor: e.target.value })} className="h-8 text-xs flex-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Campos del Formulario</CardTitle></CardHeader>
                    <CardContent className="pt-0">
                      {selectedForm.fields.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Agrega campos desde la paleta.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedForm.fields.sort((a, b) => a.order - b.order).map(field => {
                            const cfg = FIELD_TYPE_CONFIG[field.type];
                            const Icon = cfg.icon;
                            return (
                              <div
                                key={field.id}
                                onClick={() => setSelectedFieldId(field.id)}
                                className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all", selectedFieldId === field.id ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-slate-200", !field.active && "opacity-50")}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <button onClick={e => { e.stopPropagation(); moveField(field.id, 'up'); }} className="text-slate-300 hover:text-slate-500 h-3">
                                    <ChevronDown className="h-3 w-3 rotate-180" />
                                  </button>
                                  <button onClick={e => { e.stopPropagation(); moveField(field.id, 'down'); }} className="text-slate-300 hover:text-slate-500 h-3">
                                    <ChevronDown className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                  <Icon className="h-4 w-4 text-slate-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-900 truncate">{field.label}</div>
                                  <div className="text-[11px] text-slate-400">{cfg.label} {field.required && '· Requerido'}</div>
                                </div>
                                {!field.active && <Badge variant="low" className="text-[9px]">Off</Badge>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {selectedField ? (
                    <FieldSettingsPanel field={selectedField} onUpdate={updateField} onRemove={removeField} />
                  ) : showPreview && selectedForm ? (
                    <FormPreview form={selectedForm} />
                  ) : (
                    <Card className="shadow-sm border-slate-200">
                      <CardContent className="p-8 text-center text-slate-400">
                        <Settings className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">Selecciona un campo para editarlo.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-9">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-16 text-center text-slate-400">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Selecciona un formulario para editarlo</p>
                  <p className="text-xs mt-1">O crea uno nuevo con el botón superior.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
