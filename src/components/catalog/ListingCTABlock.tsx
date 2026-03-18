import { cn } from '@/lib/utils';
import { MessageCircle, Calendar, FileText, Shield, Video, Phone, Send, ClipboardCheck } from 'lucide-react';
import type { CTAKey, ListingCTAConfig } from '@/lib/listing-types';
import { BRAND } from '@/lib/mock-data';

const CTA_DEFINITIONS: Record<CTAKey, { label: string; icon: typeof Send; description: string }> = {
  'solicitar-info': { label: 'Solicitar información', icon: Send, description: 'Reciba detalles completos de esta propiedad' },
  'agendar-visita': { label: 'Agendar visita', icon: Calendar, description: 'Coordine una visita presencial' },
  'aplicar-alquiler': { label: 'Aplicar para alquiler', icon: ClipboardCheck, description: 'Envíe su solicitud de alquiler' },
  'comenzar-precalificacion': { label: 'Comenzar precalificación', icon: Shield, description: 'Inicie el proceso de pre-aprobación' },
  'whatsapp': { label: 'Hablar por WhatsApp', icon: MessageCircle, description: 'Contacte a un asesor al instante' },
  'ver-requisitos': { label: 'Ver requisitos', icon: FileText, description: 'Vea los documentos necesarios' },
  'tour-virtual': { label: 'Solicitar tour virtual', icon: Video, description: 'Recorra la propiedad desde su casa' },
  'hablar-asesor': { label: 'Hablar con asesor', icon: Phone, description: 'Llame a nuestro equipo' },
};

interface ListingCTABlockProps {
  config: ListingCTAConfig;
  onCTAClick: (ctaKey: CTAKey) => void;
  activeCTA: CTAKey | null;
  className?: string;
}

export function ListingCTABlock({ config, onCTAClick, activeCTA, className }: ListingCTABlockProps) {
  const primary = CTA_DEFINITIONS[config.primaryCTA];
  const PrimaryIcon = primary.icon;

  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <button
          onClick={() => onCTAClick(config.primaryCTA)}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all',
            activeCTA === config.primaryCTA
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0'
          )}
        >
          <PrimaryIcon className="h-4.5 w-4.5" />
          {config.microcopy?.[config.primaryCTA]?.label || primary.label}
        </button>
        {(config.microcopy?.[config.primaryCTA]?.description || primary.description) && (
          <p className="text-xs text-slate-500 text-center mt-1.5">
            {config.microcopy?.[config.primaryCTA]?.description || primary.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {config.secondaryCTAs.map(ctaKey => {
          if (ctaKey === 'whatsapp') {
            return (
              <a
                key={ctaKey}
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2.5 px-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-sm transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                {config.microcopy?.[ctaKey]?.label || CTA_DEFINITIONS[ctaKey].label}
              </a>
            );
          }

          const def = CTA_DEFINITIONS[ctaKey];
          const Icon = def.icon;
          const desc = config.microcopy?.[ctaKey]?.description;
          return (
            <button
              key={ctaKey}
              onClick={() => onCTAClick(ctaKey)}
              className={cn(
                'flex items-center gap-3 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left',
                activeCTA === ctaKey
                  ? 'border-primary/30 bg-primary/5 text-primary'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">
                {config.microcopy?.[ctaKey]?.label || def.label}
                {desc && <span className="block text-xs font-normal text-slate-500 mt-0.5">{desc}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
