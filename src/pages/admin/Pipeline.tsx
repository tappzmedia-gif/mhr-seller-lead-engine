import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useLeads, useUpdateLead, useAddActivity } from "@/hooks/use-leads";
import { Card, Badge, Button } from "@/components/ui-components";
import { scoreCategoryToBadgeVariant } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { GripVertical, Clock, DollarSign, X, Phone, Mail, MapPin } from "lucide-react";
import type { LeadStatus, Lead } from "@/lib/mock-data";

const PIPELINE_STAGES: { key: LeadStatus; label: string; color: string }[] = [
  { key: "New", label: "Nuevo", color: "border-t-blue-400" },
  { key: "Contacted", label: "Contactado", color: "border-t-indigo-400" },
  { key: "Qualified", label: "Calificado", color: "border-t-amber-400" },
  { key: "Evaluation Pending", label: "En Evaluación", color: "border-t-orange-400" },
  { key: "Offer Review", label: "Oferta Enviada", color: "border-t-purple-400" },
  { key: "Negotiation", label: "Negociación", color: "border-t-pink-400" },
  { key: "Won", label: "Cerrado", color: "border-t-emerald-500" },
  { key: "Lost", label: "Perdido", color: "border-t-slate-400" },
];

export default function Pipeline() {
  const { data: leads, isLoading } = useLeads();
  const updateLead = useUpdateLead();
  const addActivity = useAddActivity();
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);

  const getStageLeads = (status: LeadStatus) =>
    (leads || []).filter(l => l.status === status);

  const handleDragStart = (leadId: string) => setDraggedLead(leadId);

  const handleDrop = (newStatus: LeadStatus) => {
    if (draggedLead) {
      const lead = (leads || []).find(l => l.id === draggedLead);
      const oldStatus = lead?.status;
      updateLead.mutate({ id: draggedLead, status: newStatus });
      if (lead && oldStatus !== newStatus) {
        addActivity.mutate({
          leadId: draggedLead,
          activity: {
            type: "StatusChange",
            description: `Pipeline: ${oldStatus} → ${newStatus}`,
            author: "System",
          },
        });
      }
      setDraggedLead(null);
    }
  };

  const stageValue = (status: LeadStatus) => getStageLeads(status).length;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 h-[calc(100vh-64px)] flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Pipeline de Ventas</h1>
            <p className="text-sm text-slate-500">Arrastra leads entre columnas para mover por el pipeline.</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>{getStageLeads("Won").length} Cerrados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span>{getStageLeads("Lost").length} Perdidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>{(leads || []).filter(l => !["Won", "Lost", "Not Qualified"].includes(l.status)).length} Activos</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">Cargando pipeline...</div>
        ) : (
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max h-full">
              {PIPELINE_STAGES.map(stage => (
                <div
                  key={stage.key}
                  className={cn(
                    "w-72 bg-slate-100/70 rounded-xl border-t-4 flex flex-col",
                    stage.color
                  )}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(stage.key)}
                >
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{stage.label}</h3>
                      <span className="text-xs text-slate-400">{stageValue(stage.key)} leads</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-600">
                      {stageValue(stage.key)}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
                    {getStageLeads(stage.key).map(lead => (
                      <PipelineCard
                        key={lead.id}
                        lead={lead}
                        onDragStart={() => handleDragStart(lead.id)}
                        isDragging={draggedLead === lead.id}
                        onPreview={() => setPreviewLead(lead)}
                      />
                    ))}
                    {getStageLeads(stage.key).length === 0 && (
                      <div className="text-center py-8 text-slate-300 text-sm italic">
                        Sin leads en esta etapa
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {previewLead && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setPreviewLead(null)} />
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-display font-bold text-lg text-slate-900">{previewLead.name}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewLead(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <Badge variant={scoreCategoryToBadgeVariant(previewLead.scoreCategory)}>
                    {previewLead.scoreCategory} {previewLead.score}
                  </Badge>
                  <Badge variant="outline">{previewLead.status}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{previewLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{previewLead.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{previewLead.municipality}, {previewLead.region}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Propiedad</span>
                    <span className="font-medium text-slate-900">{previewLead.propertyType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Condición</span>
                    <span className="font-medium text-slate-900">{previewLead.condition}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Valor Estimado</span>
                    <span className="font-medium text-slate-900">{previewLead.estimatedValue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Urgencia</span>
                    <span className={cn("font-medium", previewLead.timeline === "Urgente" ? "text-red-600" : "text-slate-900")}>{previewLead.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Owner</span>
                    <span className="font-medium text-slate-900">{previewLead.owner}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Fuente</span>
                    <span className="font-medium text-slate-900">{previewLead.source}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="text-sm font-medium text-slate-500 mb-2">Situación</div>
                  <div className="flex flex-wrap gap-1.5">
                    {previewLead.situation.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                {previewLead.additionalMessage && (
                  <div className="border-t border-slate-100 pt-4">
                    <div className="text-sm font-medium text-slate-500 mb-2">Mensaje</div>
                    <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"{previewLead.additionalMessage}"</p>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <Link href={`/admin/leads/${previewLead.id}`}>
                    <Button className="w-full">Ver Detalle Completo</Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

interface PipelineCardProps {
  lead: Lead;
  onDragStart: () => void;
  isDragging: boolean;
  onPreview: () => void;
}

function PipelineCard({ lead, onDragStart, isDragging, onPreview }: PipelineCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onPreview}
      className={cn(
        "bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing transition-all hover:shadow-md group",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-semibold text-sm text-slate-900 hover:text-primary transition-colors">
          {lead.name}
        </span>
        <GripVertical className="h-4 w-4 text-slate-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-xs text-slate-500 mb-2.5">{lead.propertyType} · {lead.municipality}</div>
      <div className="flex items-center justify-between">
        <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)} className="text-[10px]">
          {lead.scoreCategory} {lead.score}
        </Badge>
        <div className="flex items-center gap-1">
          {lead.priority === "Urgent" && <Clock className="h-3.5 w-3.5 text-red-500" />}
          <div className="w-5 h-5 rounded-full bg-slate-100 text-[9px] flex items-center justify-center font-bold text-slate-500">
            {lead.owner.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
      {lead.estimatedValue && (
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
          <DollarSign className="h-3 w-3" /> {lead.estimatedValue}
        </div>
      )}
    </div>
  );
}
