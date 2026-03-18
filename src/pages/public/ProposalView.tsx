import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { getBranding } from "@/store/branding-store";
import { proposalsService } from "@/lib/services/proposalsService";
import { BRAND } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Printer } from "lucide-react";
import { Button, Badge } from "@/components/ui-components";
import type { Proposal, ProposalStatus } from "@/lib/operations-types";

const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: 'Borrador', sent: 'Enviada', viewed: 'Vista',
  accepted: 'Aceptada', rejected: 'Rechazada', expired: 'Expirada',
};

const BLOCK_LABELS: Record<string, string> = {
  cover: 'Portada', intro: 'Introducción', problem: 'Problema/Oportunidad',
  solution: 'Solución', scope: 'Alcance', deliverables: 'Entregables',
  timeline: 'Timeline', pricing: 'Oferta/Precios', chart: 'Gráficas',
  gallery: 'Galería', testimonials: 'Testimonios', terms: 'Términos', signature: 'Firma',
};

export default function ProposalView() {
  const params = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const branding = getBranding();

  useEffect(() => {
    if (params.id) {
      proposalsService.getAll().then(proposals => {
        const found = proposals.find(p => p.id === params.id);
        setProposal(found || null);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Propuesta no encontrada</h2>
          <p className="text-sm text-slate-500">El enlace puede haber expirado o la propuesta no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4 print:hidden">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5 mr-1" /> Imprimir / PDF
          </Button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-lg print:border-none print:shadow-none print:p-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: branding.fontFamily }}>
                {branding.systemName}
              </h1>
              <p className="text-sm text-slate-500">{branding.tagline}</p>
              <p className="text-xs text-slate-400 mt-1">{BRAND.email}</p>
              <p className="text-xs text-slate-400">{BRAND.phones.metro}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold" style={{ color: branding.primaryColor }}>PROPUESTA</h2>
              <p className="text-sm font-semibold text-slate-700 mt-1">{proposal.id}</p>
              <Badge className="mt-2">{STATUS_LABELS[proposal.status]}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Preparada para:</h4>
              <p className="text-sm font-semibold text-slate-900">{proposal.clientName}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">
                Fecha: <span className="font-medium text-slate-700">{format(new Date(proposal.createdAt), "d MMM yyyy", { locale: es })}</span>
              </div>
              <div className="text-sm text-slate-500">
                Válida hasta: <span className="font-medium text-slate-700">{format(new Date(proposal.expiresAt), "d MMM yyyy", { locale: es })}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{proposal.title}</h3>
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
