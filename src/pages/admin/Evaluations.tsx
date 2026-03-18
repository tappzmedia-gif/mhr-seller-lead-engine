import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Select } from "@/components/ui-components";
import { evaluations as initialEvaluations, type Evaluation } from "@/store";
import { cn } from "@/lib/utils";
import { FileCheck, Calendar, MapPin, Camera, Clock, CheckCircle2, X, AlertTriangle, Eye, Plus, ImageIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { EvaluationCreateModal, type EvaluationFormData } from "@/components/admin/EvaluationCreateModal";

const STATUS_CONFIG: Record<Evaluation["status"], { color: string; label: string }> = {
  Pending: { color: "bg-slate-100 text-slate-700", label: "Pendiente" },
  Scheduled: { color: "bg-blue-100 text-blue-700", label: "Agendada" },
  "In Progress": { color: "bg-amber-100 text-amber-700", label: "En Progreso" },
  Completed: { color: "bg-emerald-100 text-emerald-700", label: "Completada" },
  Cancelled: { color: "bg-red-100 text-red-700", label: "Cancelada" },
};

const DEMO_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop',
];

function EvalGallery({ ev, getGalleryImages }: { ev: Evaluation; getGalleryImages: (ev: Evaluation) => string[] }) {
  const galleryImages = getGalleryImages(ev);
  if (ev.photos > 0 && galleryImages.length > 0) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {galleryImages.map((url, i) => (
          <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200">
            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
        {ev.photos > galleryImages.length && (
          <div className="aspect-[4/3] rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
            <span className="text-xs text-slate-500 font-medium">+{ev.photos - galleryImages.length} más</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
      <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
      <p className="text-sm text-slate-400">Sin imágenes disponibles</p>
    </div>
  );
}

export default function Evaluations() {
  const [allEvaluations, setAllEvaluations] = useState(initialEvaluations);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filtered = allEvaluations.filter(e => statusFilter === "All" || e.status === statusFilter);
  const stats = {
    total: allEvaluations.length,
    pending: allEvaluations.filter(e => e.status === "Pending").length,
    scheduled: allEvaluations.filter(e => e.status === "Scheduled").length,
    inProgress: allEvaluations.filter(e => e.status === "In Progress").length,
    completed: allEvaluations.filter(e => e.status === "Completed").length,
  };

  const handleCreateEvaluation = (data: EvaluationFormData) => {
    const newEval: Evaluation = {
      id: `EV-${String(allEvaluations.length + 1).padStart(3, '0')}`,
      leadId: `LD-NEW-${Date.now()}`,
      leadName: data.leadName,
      propertyType: data.propertyType,
      municipality: data.municipality,
      status: data.scheduledDate ? 'Scheduled' : 'Pending',
      scheduledDate: data.scheduledDate || null,
      completedDate: null,
      estimatedValue: data.estimatedValue || 'Pendiente',
      marketValue: null,
      condition: data.condition,
      notes: data.notes,
      evaluator: data.evaluator,
      photos: data.photos || 0,
      photoUrls: data.photoUrls || [],
    };
    setAllEvaluations(prev => [newEval, ...prev]);
  };

  const getGalleryImages = (ev: Evaluation): string[] => {
    if (ev.photoUrls && ev.photoUrls.length > 0) {
      return ev.photoUrls;
    }
    if (ev.photos === 0) return [];
    return DEMO_GALLERY_IMAGES.slice(0, Math.min(ev.photos, DEMO_GALLERY_IMAGES.length));
  };

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Evaluations" }]}>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Evaluations</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona evaluaciones de propiedades.</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Nueva Evaluación</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total", value: stats.total, icon: FileCheck, color: "text-slate-600 bg-slate-50" },
            { label: "Pendientes", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Agendadas", value: stats.scheduled, icon: Calendar, color: "text-blue-600 bg-blue-50" },
            { label: "En Progreso", value: stats.inProgress, icon: AlertTriangle, color: "text-orange-600 bg-orange-50" },
            { label: "Completadas", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          ].map(s => (
            <Card key={s.label} className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                  <div className="text-xl font-display font-bold text-slate-900">{s.value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Select className="h-9 w-48 bg-white text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">Todos los estados</option>
            <option value="Pending">Pendiente</option>
            <option value="Scheduled">Agendada</option>
            <option value="In Progress">En Progreso</option>
            <option value="Completed">Completada</option>
            <option value="Cancelled">Cancelada</option>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.map(ev => {
            const cfg = STATUS_CONFIG[ev.status];
            return (
              <Card key={ev.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEval(ev)}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {ev.leadName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{ev.leadName}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{ev.propertyType}</span>
                        <span>·</span>
                        <MapPin className="h-3 w-3" />
                        <span>{ev.municipality}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:shrink-0">
                    <Badge className={cn("border-0", cfg.color)}>{cfg.label}</Badge>
                    {ev.scheduledDate && (
                      <div className="text-sm text-slate-600">
                        <div className="font-medium">{format(new Date(ev.scheduledDate), "dd MMM", { locale: es })}</div>
                      </div>
                    )}
                    {ev.marketValue && <span className="text-sm font-bold text-emerald-600">{ev.marketValue}</span>}
                    {ev.photos > 0 && (
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Camera className="h-3 w-3" />{ev.photos}</span>
                    )}
                    <span className="text-xs text-slate-400">{ev.evaluator.split(" ")[0]}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedEval && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedEval(null)} />
            <div className="fixed right-0 top-0 h-full w-[480px] max-w-full bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-display font-bold text-lg text-slate-900">Evaluación {selectedEval.id}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedEval(null)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <Badge className={cn("border-0", STATUS_CONFIG[selectedEval.status].color)}>{STATUS_CONFIG[selectedEval.status].label}</Badge>
                  <Link href={`/admin/leads/${selectedEval.leadId}`} className="text-sm text-primary hover:underline font-medium">Ver Lead →</Link>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Lead", value: selectedEval.leadName },
                    { label: "Propiedad", value: `${selectedEval.propertyType} en ${selectedEval.municipality}` },
                    { label: "Condición", value: selectedEval.condition },
                    { label: "Valor Estimado", value: selectedEval.estimatedValue },
                    { label: "Valor de Mercado", value: selectedEval.marketValue || "Pendiente" },
                    { label: "Evaluador", value: selectedEval.evaluator },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary" /> Galería de Fotos
                    </div>
                    {selectedEval.photos > 0 && (
                      <Badge variant="secondary" className="text-[10px]">{selectedEval.photos} fotos</Badge>
                    )}
                  </div>
                  <EvalGallery ev={selectedEval} getGalleryImages={getGalleryImages} />
                </div>

                {selectedEval.notes && (
                  <div className="border-t border-slate-100 pt-4">
                    <div className="text-sm font-medium text-slate-500 mb-2">Notas</div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedEval.notes}</p>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-4 flex gap-2">
                  <Button className="flex-1">Completar</Button>
                  <Button variant="outline" className="flex-1">Reprogramar</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <EvaluationCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateEvaluation}
      />
    </AdminLayout>
  );
}
