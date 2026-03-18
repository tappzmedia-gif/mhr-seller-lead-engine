import { useRoute, Link } from 'wouter';
import { useState, useMemo, useSyncExternalStore, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, BedDouble, Bath, Car, Maximize, Calendar, ArrowLeft, Share2, Heart, Check, X, AlertTriangle, ChevronLeft, ChevronRight, CalendarCheck, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPublicListingById } from '@/store/listings-store';
import { getAttributeById } from '@/lib/attribute-library';
import { BRAND } from '@/lib/mock-data';
import { DynamicIcon } from '@/components/catalog/icons';
import { AttributeIconGrid } from '@/components/catalog/AttributeIconGrid';
import { InclusionExclusionBlock } from '@/components/catalog/InclusionExclusionBlock';
import { RulesPillGroup } from '@/components/catalog/RulesPillGroup';
import { IdealFitCards } from '@/components/catalog/IdealFitCards';
import { PropertyHighlights } from '@/components/catalog/PropertyHighlights';
import { InquiryFormEngine } from '@/components/catalog/InquiryFormEngine';
import { ListingCTABlock } from '@/components/catalog/ListingCTABlock';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import type { CTAKey, DynamicInquiryFormConfig, InquiryFormType } from '@/lib/listing-types';

function useListingById(id: string | undefined) {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('listings-updated', cb);
    return () => window.removeEventListener('listings-updated', cb);
  }, []);
  const getSnapshot = useCallback(() => id ? getPublicListingById(id) : undefined, [id]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

const FORM_CONFIGS: Record<InquiryFormType, Partial<DynamicInquiryFormConfig>> = {
  general: {
    heading: 'Solicitar información',
    subheading: 'Complete el formulario y le contactaremos.',
    submitLabel: 'Enviar solicitud',
    successTitle: '¡Solicitud recibida!',
    successMessage: 'Le contactaremos pronto.',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com', required: true },
      { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 555-0000', required: true },
      { name: 'message', label: 'Mensaje', type: 'textarea', placeholder: 'Cuéntenos...', required: false },
    ],
  },
  sales: {
    heading: 'Solicitar información de compra',
    subheading: 'Un asesor de ventas le contactará.',
    submitLabel: 'Solicitar información',
    successTitle: '¡Solicitud de compra recibida!',
    successMessage: 'Un asesor de ventas le contactará pronto.',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com', required: true },
      { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 555-0000', required: true },
      { name: 'budget', label: 'Presupuesto aproximado', type: 'text', placeholder: '$000,000', required: true },
      { name: 'financing', label: 'Tipo de financiamiento', type: 'select', required: true, options: [
        { value: 'mortgage', label: 'Hipoteca convencional' },
        { value: 'fha', label: 'FHA' },
        { value: 'va', label: 'VA' },
        { value: 'cash', label: 'Efectivo' },
        { value: 'other', label: 'Otro' },
      ]},
      { name: 'message', label: 'Mensaje adicional', type: 'textarea', placeholder: 'Alguna pregunta o detalle...', required: false },
    ],
  },
  rental: {
    heading: 'Aplicar para alquiler',
    subheading: 'Envíe su solicitud de alquiler.',
    submitLabel: 'Enviar solicitud',
    successTitle: '¡Solicitud de alquiler recibida!',
    successMessage: 'Revisaremos su solicitud y le contactaremos.',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com', required: true },
      { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 555-0000', required: true },
      { name: 'moveInDate', label: 'Fecha de mudanza', type: 'date', required: true },
      { name: 'occupants', label: 'Número de ocupantes', type: 'number', placeholder: '2', required: true },
      { name: 'pets', label: '¿Tiene mascotas?', type: 'select', required: true, options: [
        { value: 'no', label: 'No' },
        { value: 'dog', label: 'Sí — perro' },
        { value: 'cat', label: 'Sí — gato' },
        { value: 'other', label: 'Sí — otro' },
      ]},
      { name: 'incomeSource', label: 'Fuente de ingresos', type: 'text', placeholder: 'Empleo, negocio propio...', required: true },
    ],
  },
  showing: {
    heading: 'Agendar visita',
    subheading: 'Seleccione fecha y hora para visitar la propiedad.',
    submitLabel: 'Agendar visita',
    successTitle: '¡Visita agendada!',
    successMessage: 'Confirmaremos su cita por teléfono o WhatsApp.',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com', required: true },
      { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 555-0000', required: true },
      { name: 'preferredDate', label: 'Fecha preferida', type: 'date', required: true },
      { name: 'preferredTime', label: 'Hora preferida', type: 'select', required: true, options: [
        { value: '9am', label: '9:00 AM' },
        { value: '10am', label: '10:00 AM' },
        { value: '11am', label: '11:00 AM' },
        { value: '1pm', label: '1:00 PM' },
        { value: '2pm', label: '2:00 PM' },
        { value: '3pm', label: '3:00 PM' },
        { value: '4pm', label: '4:00 PM' },
      ]},
      { name: 'attendees', label: '¿Cuántas personas asistirán?', type: 'number', placeholder: '2', required: false },
      { name: 'message', label: 'Notas adicionales', type: 'textarea', placeholder: 'Algún requerimiento especial...', required: false },
    ],
  },
  prequalification: {
    heading: 'Comenzar precalificación',
    subheading: 'Inicie su proceso de pre-aprobación hipotecaria.',
    submitLabel: 'Iniciar precalificación',
    successTitle: '¡Solicitud de precalificación recibida!',
    successMessage: 'Un especialista hipotecario le contactará en las próximas 24 horas.',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com', required: true },
      { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 555-0000', required: true },
      { name: 'annualIncome', label: 'Ingreso anual aproximado', type: 'text', placeholder: '$00,000', required: true },
      { name: 'employmentStatus', label: 'Estatus laboral', type: 'select', required: true, options: [
        { value: 'employed', label: 'Empleado' },
        { value: 'self-employed', label: 'Cuenta propia' },
        { value: 'retired', label: 'Retirado' },
        { value: 'other', label: 'Otro' },
      ]},
      { name: 'downPayment', label: 'Pronto disponible', type: 'text', placeholder: '$00,000', required: false },
      { name: 'creditScore', label: 'Puntuación de crédito aproximada', type: 'select', required: false, options: [
        { value: '750+', label: '750+' },
        { value: '700-749', label: '700-749' },
        { value: '650-699', label: '650-699' },
        { value: 'below650', label: 'Menos de 650' },
        { value: 'unknown', label: 'No sé' },
      ]},
      { name: 'message', label: 'Comentarios', type: 'textarea', placeholder: 'Información adicional...', required: false },
    ],
  },
  investor: {
    heading: 'Consulta de inversión',
    subheading: 'Solicite información detallada para inversión.',
    submitLabel: 'Enviar consulta',
    successTitle: '¡Consulta de inversión recibida!',
    successMessage: 'Un asesor de inversiones le contactará.',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com', required: true },
      { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 555-0000', required: true },
      { name: 'investmentType', label: 'Tipo de inversión', type: 'select', required: true, options: [
        { value: 'rental-income', label: 'Ingreso por renta' },
        { value: 'flip', label: 'Compra y reventa' },
        { value: 'development', label: 'Desarrollo' },
        { value: 'portfolio', label: 'Portafolio' },
      ]},
      { name: 'budget', label: 'Presupuesto de inversión', type: 'text', placeholder: '$000,000', required: true },
      { name: 'timeline', label: 'Timeline de inversión', type: 'select', required: false, options: [
        { value: 'immediate', label: 'Inmediato' },
        { value: '1-3months', label: '1-3 meses' },
        { value: '3-6months', label: '3-6 meses' },
        { value: 'exploring', label: 'Explorando' },
      ]},
      { name: 'expectedROI', label: 'ROI esperado', type: 'text', placeholder: 'Ej: 8-12%', required: false },
      { name: 'message', label: 'Comentarios', type: 'textarea', placeholder: 'Detalles adicionales sobre su interés...', required: false },
    ],
  },
  commercial: {
    heading: 'Consulta comercial',
    subheading: 'Envíe su consulta comercial.',
    submitLabel: 'Enviar consulta',
    successTitle: '¡Consulta comercial recibida!',
    successMessage: 'Un asesor comercial le contactará.',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Juan Pérez', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com', required: true },
      { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 555-0000', required: true },
      { name: 'companyName', label: 'Nombre de empresa', type: 'text', placeholder: 'Mi Empresa LLC', required: true },
      { name: 'businessType', label: 'Tipo de negocio', type: 'select', required: true, options: [
        { value: 'retail', label: 'Comercio al detal' },
        { value: 'office', label: 'Oficina' },
        { value: 'restaurant', label: 'Restaurante/Food' },
        { value: 'warehouse', label: 'Almacén/Logística' },
        { value: 'medical', label: 'Médico/Salud' },
        { value: 'other', label: 'Otro' },
      ]},
      { name: 'spaceRequirements', label: 'Requisitos de espacio', type: 'text', placeholder: 'Ej: 2,000 sq ft mínimo', required: false },
      { name: 'budget', label: 'Presupuesto mensual/total', type: 'text', placeholder: '$000,000', required: false },
      { name: 'message', label: 'Detalles adicionales', type: 'textarea', placeholder: 'Cuéntenos sobre su negocio...', required: false },
    ],
  },
};

function ImageGallery({ photos, title }: { photos: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = photos.length > 0 && !photos[0].startsWith('/placeholder');

  if (!hasImages) {
    return (
      <div className="relative h-64 sm:h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <Building2 className="h-24 w-24 opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-3">
      <div className="relative h-64 sm:h-[28rem] rounded-2xl overflow-hidden group">
        <img
          src={photos[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {photos.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(prev => prev === 0 ? photos.length - 1 : prev - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveIndex(prev => prev === photos.length - 1 ? 0 : prev + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    i === activeIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                i === activeIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogDetail() {
  const [, params] = useRoute('/catalogo/:id');
  const listing = useListingById(params?.id);
  const [activeCTA, setActiveCTA] = useState<CTAKey | null>(null);

  const currentFormConfig = useMemo(() => {
    if (!listing) return null;
    if (activeCTA) {
      const formType = listing.ctaConfig.formMapping[activeCTA] || listing.formConfig.formType;
      const listingOverride = listing.ctaConfig.ctaFormConfigs?.[formType];
      const defaultTemplate = FORM_CONFIGS[formType];
      const override = { ...defaultTemplate, ...listingOverride };
      const hasOverrides = listingOverride || formType !== listing.formConfig.formType;
      if (hasOverrides) {
        return {
          ...listing.formConfig,
          formType,
          ...(override.heading && { heading: override.heading }),
          ...(override.subheading && { subheading: override.subheading }),
          ...(override.submitLabel && { submitLabel: override.submitLabel }),
          ...(override.successTitle && { successTitle: override.successTitle }),
          ...(override.successMessage && { successMessage: override.successMessage }),
          ...(override.fields && { fields: override.fields }),
        };
      }
    }
    return listing.formConfig;
  }, [listing, activeCTA]);

  if (!listing) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700">Propiedad no encontrada</h2>
            <Link href="/catalogo" className="text-primary font-medium text-sm mt-2 inline-block hover:underline">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary font-medium mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>

        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <span className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide',
              listing.operationType === 'sale' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            )}>
              {listing.operationType === 'sale' ? 'Venta' : 'Alquiler'}
            </span>
            {listing.featured && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500 text-white">
                Destacada
              </span>
            )}
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-primary transition-all">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-red-500 transition-all">
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <ImageGallery photos={listing.photos} title={listing.title} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">{listing.title}</h1>
                <span className="text-2xl font-bold text-primary whitespace-nowrap">{listing.priceLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 mb-6">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{listing.address} — {listing.sector}, {listing.municipality}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                {listing.bedrooms !== undefined && (
                  <div className="text-center">
                    <BedDouble className="h-6 w-6 text-primary mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900">{listing.bedrooms}</p>
                    <p className="text-xs text-slate-500">Habitaciones</p>
                  </div>
                )}
                {listing.bathrooms !== undefined && (
                  <div className="text-center">
                    <Bath className="h-6 w-6 text-primary mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900">{listing.bathrooms}</p>
                    <p className="text-xs text-slate-500">Baños</p>
                  </div>
                )}
                <div className="text-center">
                  <Maximize className="h-6 w-6 text-primary mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-slate-900">{listing.area.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{listing.areaUnit}</p>
                </div>
                {listing.yearBuilt && (
                  <div className="text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900">{listing.yearBuilt}</p>
                    <p className="text-xs text-slate-500">Año construido</p>
                  </div>
                )}
                {listing.parkingSpaces !== undefined && listing.parkingSpaces > 0 && (
                  <div className="text-center">
                    <Car className="h-6 w-6 text-primary mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900">{listing.parkingSpaces}</p>
                    <p className="text-xs text-slate-500">Estacionamientos</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setActiveCTA('agendar-visita')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Agendar Visita
                </button>
                <button
                  onClick={() => setActiveCTA('solicitar-info')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary border-2 border-primary font-semibold rounded-xl hover:bg-primary/5 transition-all text-sm"
                >
                  <Phone className="h-4 w-4" />
                  Contactar Agente
                </button>
              </div>
            </motion.div>

            <PropertyHighlights amenities={listing.amenities} />

            <div>
              <h2 className="text-lg font-display font-bold text-slate-800 mb-3">Descripción</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{listing.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-display font-bold text-slate-800 mb-4">Características & Amenidades</h2>
              <AttributeIconGrid amenities={listing.amenities} />
            </div>

            {listing.utilities.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-800 mb-4">Servicios & Utilidades</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {listing.utilities.map(util => {
                    const attr = getAttributeById(util.attributeId);
                    return (
                      <div key={util.id} className={cn(
                        'flex items-center gap-2.5 p-2.5 rounded-lg border text-sm',
                        util.included ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                      )}>
                        <div className={cn(
                          'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
                          util.included ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        )}>
                          <DynamicIcon name={attr?.iconName || 'Zap'} className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium block">{attr?.label || util.attributeId}</span>
                          {util.details && <span className="text-xs opacity-75 block">{util.details}</span>}
                        </div>
                        {util.included ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {listing.appliances.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-800 mb-4">Electrodomésticos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {listing.appliances.map(appliance => {
                    const attr = getAttributeById(appliance.attributeId);
                    return (
                      <div key={appliance.id} className={cn(
                        'flex items-center gap-2.5 p-2.5 rounded-lg border text-sm',
                        appliance.included ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                      )}>
                        <div className={cn(
                          'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
                          appliance.included ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        )}>
                          <DynamicIcon name={attr?.iconName || 'Star'} className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{attr?.label || appliance.attributeId}</span>
                          {appliance.condition && <span className="text-xs opacity-75 block">{appliance.condition}</span>}
                        </div>
                        {appliance.included ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {listing.restrictions.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-800 mb-4">Restricciones</h2>
                <div className="space-y-2">
                  {listing.restrictions.map(restriction => (
                    <div key={restriction.id} className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border text-sm',
                      restriction.severity === 'hard' ? 'bg-red-50 border-red-100' :
                      restriction.severity === 'soft' ? 'bg-amber-50 border-amber-100' :
                      'bg-slate-50 border-slate-200'
                    )}>
                      <AlertTriangle className={cn(
                        'h-4 w-4 shrink-0 mt-0.5',
                        restriction.severity === 'hard' ? 'text-red-500' :
                        restriction.severity === 'soft' ? 'text-amber-500' : 'text-slate-400'
                      )} />
                      <div>
                        <span className="font-medium">{restriction.label}</span>
                        {restriction.description && <p className="text-xs text-slate-500 mt-0.5">{restriction.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(listing.inclusions.length > 0 || listing.exclusions.length > 0) && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-800 mb-4">¿Qué incluye?</h2>
                <InclusionExclusionBlock inclusions={listing.inclusions} exclusions={listing.exclusions} />
              </div>
            )}

            {(listing.rules.length > 0 || listing.conditions.length > 0) && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-800 mb-4">Reglas & Condiciones</h2>
                <RulesPillGroup rules={listing.rules} conditions={listing.conditions} />
              </div>
            )}

            {listing.idealFit.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-800 mb-4">Perfil Ideal</h2>
                <IdealFitCards profiles={listing.idealFit} />
              </div>
            )}
          </div>

          <aside className="lg:w-96 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <ListingCTABlock
                  config={listing.ctaConfig}
                  onCTAClick={key => setActiveCTA(key === activeCTA ? null : key)}
                  activeCTA={activeCTA}
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {currentFormConfig && <InquiryFormEngine config={currentFormConfig} />}
              </div>

              <div className="bg-slate-100 rounded-2xl p-5 text-center">
                <p className="text-xs text-slate-500 mb-1">¿Necesita ayuda?</p>
                <p className="text-sm font-semibold text-slate-700">{BRAND.phones.metro}</p>
                <p className="text-xs text-slate-400 mt-1">{BRAND.email}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
