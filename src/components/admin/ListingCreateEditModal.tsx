import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui-components';
import { MediaManager, type MediaItem } from './MediaManager';
import type { PublicListing, PropertyInclusion, PropertyExclusion, PropertyRule, PropertyCondition, PropertyIdealFit, OperationType, CTAKey, InquiryFormType } from '@/lib/listing-types';
import { PREDEFINED_ATTRIBUTES, ATTRIBUTE_CATEGORIES, IDEAL_FIT_PROFILES, getAttributesByCategory } from '@/lib/attribute-library';
import { DynamicIcon } from '@/components/catalog/icons';
import {
  X, Building2, Image, ListChecks, ShieldAlert, Users, Megaphone, FileText,
  BedDouble, Bath, Car, Maximize, MapPin, DollarSign, Calendar, Check, Plus,
  Search, Star, Trash2, Info
} from 'lucide-react';

type ModalTab = 'basic' | 'media' | 'amenities' | 'inclusions' | 'rules' | 'idealfit' | 'ctas' | 'forms';

const TABS: { key: ModalTab; label: string; icon: typeof Building2 }[] = [
  { key: 'basic', label: 'Info Básica', icon: Building2 },
  { key: 'media', label: 'Imágenes', icon: Image },
  { key: 'amenities', label: 'Amenidades', icon: ListChecks },
  { key: 'inclusions', label: 'Inclusiones', icon: ListChecks },
  { key: 'rules', label: 'Reglas', icon: ShieldAlert },
  { key: 'idealfit', label: 'Perfil Ideal', icon: Users },
  { key: 'ctas', label: 'CTAs', icon: Megaphone },
  { key: 'forms', label: 'Formularios', icon: FileText },
];

const PROPERTY_TYPES = ['Casa', 'Apartamento', 'Townhouse', 'Villa', 'Penthouse', 'Local Comercial', 'Oficina', 'Terreno', 'Finca'];
const OPERATION_TYPES: { value: OperationType; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'rental', label: 'Alquiler' },
];
const STATUS_OPTIONS: { value: PublicListing['status']; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Alquilado' },
];
const MUNICIPALITIES = ['San Juan', 'Bayamón', 'Carolina', 'Ponce', 'Caguas', 'Guaynabo', 'Mayagüez', 'Arecibo', 'Trujillo Alto', 'Dorado', 'Humacao', 'Río Grande'];

const CTA_OPTIONS: { key: CTAKey; label: string }[] = [
  { key: 'solicitar-info', label: 'Solicitar información' },
  { key: 'agendar-visita', label: 'Agendar visita' },
  { key: 'aplicar-alquiler', label: 'Aplicar para alquiler' },
  { key: 'comenzar-precalificacion', label: 'Comenzar precalificación' },
  { key: 'whatsapp', label: 'Hablar por WhatsApp' },
  { key: 'ver-requisitos', label: 'Ver requisitos' },
  { key: 'tour-virtual', label: 'Solicitar tour virtual' },
  { key: 'hablar-asesor', label: 'Hablar con asesor' },
];

const FORM_TYPE_OPTIONS: { value: InquiryFormType; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'sales', label: 'Compra' },
  { value: 'rental', label: 'Alquiler' },
  { value: 'showing', label: 'Visita' },
  { value: 'prequalification', label: 'Precalificación' },
  { value: 'investor', label: 'Inversión' },
  { value: 'commercial', label: 'Comercial' },
];

export interface ListingFormData {
  title: string;
  description: string;
  propertyType: string;
  operationType: OperationType;
  status: PublicListing['status'];
  price: number;
  priceLabel: string;
  municipality: string;
  sector: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces: number;
  area: number;
  areaUnit: string;
  yearBuilt?: number;
  photos: string[];
  amenityIds: string[];
  inclusions: PropertyInclusion[];
  exclusions: PropertyExclusion[];
  rules: PropertyRule[];
  conditions: PropertyCondition[];
  idealFit: PropertyIdealFit[];
  primaryCTA: CTAKey;
  secondaryCTAs: CTAKey[];
  formMapping: Partial<Record<CTAKey, InquiryFormType>>;
  formType: InquiryFormType;
}

interface ListingCreateEditModalProps {
  listing?: PublicListing | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: ListingFormData) => void;
}

function buildInitialImages(listing?: PublicListing | null): MediaItem[] {
  if (listing?.photos && listing.photos.length > 0) {
    return listing.photos.filter(p => !p.startsWith('/placeholder')).map((url, i) => ({
      id: `existing-${i}`,
      url,
      name: `Foto ${i + 1}`,
      isCover: i === 0,
    }));
  }
  return [];
}

interface FormState {
  title: string;
  description: string;
  propertyType: string;
  operationType: OperationType;
  status: PublicListing['status'];
  price: string;
  municipality: string;
  sector: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpaces: string;
  area: string;
  areaUnit: string;
  yearBuilt: string;
}

function buildInitialForm(listing?: PublicListing | null): FormState {
  return {
    title: listing?.title || '',
    description: listing?.description || '',
    propertyType: listing?.propertyType || 'Casa',
    operationType: listing?.operationType || 'sale',
    status: listing?.status || 'active',
    price: listing?.price?.toString() || '',
    municipality: listing?.municipality || '',
    sector: listing?.sector || '',
    address: listing?.address || '',
    bedrooms: listing?.bedrooms?.toString() || '',
    bathrooms: listing?.bathrooms?.toString() || '',
    parkingSpaces: listing?.parkingSpaces?.toString() || '0',
    area: listing?.area?.toString() || '',
    areaUnit: listing?.areaUnit || 'm²',
    yearBuilt: listing?.yearBuilt?.toString() || '',
  };
}

function InlineAddForm({ onAdd, placeholder, buttonLabel }: { onAdd: (label: string) => void; placeholder: string; buttonLabel: string }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        onKeyDown={e => { if (e.key === 'Enter' && value.trim()) { onAdd(value.trim()); setValue(''); } }}
      />
      <Button size="sm" variant="outline" onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(''); } }}>
        <Plus className="h-3.5 w-3.5 mr-1" /> {buttonLabel}
      </Button>
    </div>
  );
}

export function ListingCreateEditModal({ listing, open, onClose, onSave }: ListingCreateEditModalProps) {
  const isEdit = !!listing;
  const [activeTab, setActiveTab] = useState<ModalTab>('basic');
  const [images, setImages] = useState<MediaItem[]>(() => buildInitialImages(listing));
  const [form, setForm] = useState<FormState>(() => buildInitialForm(listing));
  const [amenitySearch, setAmenitySearch] = useState('');

  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(() =>
    listing?.amenities?.map(a => a.attributeId) || []
  );
  const [inclusions, setInclusions] = useState<PropertyInclusion[]>(() =>
    listing?.inclusions ? [...listing.inclusions] : []
  );
  const [exclusions, setExclusions] = useState<PropertyExclusion[]>(() =>
    listing?.exclusions ? [...listing.exclusions] : []
  );
  const [rules, setRules] = useState<PropertyRule[]>(() =>
    listing?.rules ? [...listing.rules] : []
  );
  const [conditions, setConditions] = useState<PropertyCondition[]>(() =>
    listing?.conditions ? [...listing.conditions] : []
  );
  const [idealFit, setIdealFit] = useState<PropertyIdealFit[]>(() =>
    listing?.idealFit ? [...listing.idealFit] : []
  );
  const [primaryCTA, setPrimaryCTA] = useState<CTAKey>(() =>
    listing?.ctaConfig?.primaryCTA || 'solicitar-info'
  );
  const [secondaryCTAs, setSecondaryCTAs] = useState<CTAKey[]>(() =>
    listing?.ctaConfig?.secondaryCTAs ? [...listing.ctaConfig.secondaryCTAs] : []
  );
  const [formMapping, setFormMapping] = useState<Partial<Record<CTAKey, InquiryFormType>>>(() =>
    listing?.ctaConfig?.formMapping ? { ...listing.ctaConfig.formMapping } : {}
  );
  const [formType, setFormType] = useState<InquiryFormType>(() =>
    listing?.formConfig?.formType || 'general'
  );

  useEffect(() => {
    if (open) {
      setForm(buildInitialForm(listing));
      setImages(buildInitialImages(listing));
      setActiveTab('basic');
      setAmenitySearch('');
      setSelectedAmenityIds(listing?.amenities?.map(a => a.attributeId) || []);
      setInclusions(listing?.inclusions ? [...listing.inclusions] : []);
      setExclusions(listing?.exclusions ? [...listing.exclusions] : []);
      setRules(listing?.rules ? [...listing.rules] : []);
      setConditions(listing?.conditions ? [...listing.conditions] : []);
      setIdealFit(listing?.idealFit ? [...listing.idealFit] : []);
      setPrimaryCTA(listing?.ctaConfig?.primaryCTA || 'solicitar-info');
      setSecondaryCTAs(listing?.ctaConfig?.secondaryCTAs ? [...listing.ctaConfig.secondaryCTAs] : []);
      setFormMapping(listing?.ctaConfig?.formMapping ? { ...listing.ctaConfig.formMapping } : {});
      setFormType(listing?.formConfig?.formType || 'general');
    }
  }, [open, listing?.id]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const price = parseFloat(form.price) || 0;
    const priceLabel = form.operationType === 'rental'
      ? `$${price.toLocaleString()}/mes`
      : `$${price.toLocaleString()}`;

    onSave({
      title: form.title,
      description: form.description,
      propertyType: form.propertyType,
      operationType: form.operationType,
      status: form.status,
      price,
      priceLabel,
      municipality: form.municipality,
      sector: form.sector,
      address: form.address,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      parkingSpaces: form.parkingSpaces ? parseInt(form.parkingSpaces) : 0,
      area: parseFloat(form.area) || 0,
      areaUnit: form.areaUnit,
      yearBuilt: form.yearBuilt ? parseInt(form.yearBuilt) : undefined,
      photos: [...images].sort((a, b) => (a.isCover ? -1 : b.isCover ? 1 : 0)).map(img => img.url),
      amenityIds: selectedAmenityIds,
      inclusions,
      exclusions,
      rules,
      conditions,
      idealFit,
      primaryCTA,
      secondaryCTAs,
      formMapping,
      formType,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex flex-col w-full h-full bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">
                {isEdit ? 'Editar Listing' : 'Crear Nuevo Listing'}
              </h2>
              <p className="text-xs text-slate-500">{isEdit ? listing.title : 'Completa la información de la propiedad'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>{isEdit ? 'Guardar Cambios' : 'Crear Listing'}</Button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-56 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto shrink-0">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1',
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-4">Información General</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Título de la propiedad *</label>
                      <Input value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="Ej: Casa moderna en Dorado Beach" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Descripción</label>
                      <textarea
                        value={form.description}
                        onChange={e => updateField('description', e.target.value)}
                        placeholder="Describe la propiedad en detalle..."
                        rows={4}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Tipo de Propiedad</label>
                        <select value={form.propertyType} onChange={e => updateField('propertyType', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Tipo de Operación</label>
                        <select value={form.operationType} onChange={e => updateField('operationType', e.target.value as OperationType)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                          {OPERATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Estado</label>
                        <select value={form.status} onChange={e => updateField('status', e.target.value as PublicListing['status'])} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><DollarSign className="h-3 w-3" /> Precio</label>
                        <Input type="number" value={form.price} onChange={e => updateField('price', e.target.value)} placeholder="250000" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Ubicación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Municipio</label>
                      <select value={form.municipality} onChange={e => updateField('municipality', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="">Seleccionar...</option>
                        {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Sector / Urbanización</label>
                      <Input value={form.sector} onChange={e => updateField('sector', e.target.value)} placeholder="Ej: Condado" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Dirección</label>
                      <Input value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="Dirección completa" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-base font-semibold text-slate-800 mb-4">Especificaciones</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><BedDouble className="h-3 w-3" /> Habitaciones</label>
                      <Input type="number" value={form.bedrooms} onChange={e => updateField('bedrooms', e.target.value)} placeholder="3" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><Bath className="h-3 w-3" /> Baños</label>
                      <Input type="number" value={form.bathrooms} onChange={e => updateField('bathrooms', e.target.value)} placeholder="2" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><Car className="h-3 w-3" /> Estacionamientos</label>
                      <Input type="number" value={form.parkingSpaces} onChange={e => updateField('parkingSpaces', e.target.value)} placeholder="1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><Maximize className="h-3 w-3" /> Área</label>
                      <div className="flex gap-2">
                        <Input type="number" value={form.area} onChange={e => updateField('area', e.target.value)} placeholder="150" className="flex-1" />
                        <select value={form.areaUnit} onChange={e => updateField('areaUnit', e.target.value)} className="w-20 px-2 py-2 rounded-lg border border-slate-300 text-sm">
                          <option value="m²">m²</option>
                          <option value="ft²">ft²</option>
                          <option value="cuerdas">cdas</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><Calendar className="h-3 w-3" /> Año Construcción</label>
                      <Input type="number" value={form.yearBuilt} onChange={e => updateField('yearBuilt', e.target.value)} placeholder="2020" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="max-w-3xl">
                <h3 className="text-base font-semibold text-slate-800 mb-1">Galería de Imágenes</h3>
                <p className="text-sm text-slate-500 mb-4">Sube fotos de la propiedad. La primera imagen marcada como cover se mostrará como thumbnail.</p>
                <MediaManager images={images} onChange={setImages} />
              </div>
            )}

            {activeTab === 'amenities' && (
              <div className="max-w-3xl space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Amenidades</h3>
                  <p className="text-sm text-slate-500 mb-4">Selecciona las amenidades de la propiedad.</p>
                </div>
                {selectedAmenityIds.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Seleccionadas ({selectedAmenityIds.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenityIds.map(id => {
                        const attr = PREDEFINED_ATTRIBUTES.find(a => a.id === id);
                        if (!attr) return null;
                        return (
                          <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                            <DynamicIcon name={attr.iconName} className="h-3.5 w-3.5" />
                            {attr.label}
                            <button onClick={() => setSelectedAmenityIds(prev => prev.filter(a => a !== id))} className="ml-0.5 hover:text-red-500"><X className="h-3 w-3" /></button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Buscar amenidades..." value={amenitySearch} onChange={e => setAmenitySearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                {ATTRIBUTE_CATEGORIES.map(category => {
                  const attrs = getAttributesByCategory(category.key).filter(a => !amenitySearch || a.label.toLowerCase().includes(amenitySearch.toLowerCase()));
                  if (attrs.length === 0) return null;
                  return (
                    <div key={category.key}>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <DynamicIcon name={category.iconName} className="h-4 w-4 text-primary" />
                        {category.label}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {attrs.map(attr => {
                          const isSelected = selectedAmenityIds.includes(attr.id);
                          return (
                            <div
                              key={attr.id}
                              className={cn('flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all', isSelected ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-white hover:border-slate-300')}
                              onClick={() => {
                                if (isSelected) setSelectedAmenityIds(prev => prev.filter(a => a !== attr.id));
                                else setSelectedAmenityIds(prev => [...prev, attr.id]);
                              }}
                            >
                              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', isSelected ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500')}>
                                <DynamicIcon name={attr.iconName} className="h-3.5 w-3.5" />
                              </div>
                              <span className={cn('text-sm font-medium flex-1', isSelected ? 'text-primary' : 'text-slate-700')}>{attr.label}</span>
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div className="max-w-3xl space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Inclusiones / Exclusiones</h3>
                  <p className="text-sm text-slate-500 mb-4">Define qué incluye y qué no incluye la propiedad.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2"><Check className="h-4 w-4" /> Inclusiones ({inclusions.length})</h4>
                  <div className="space-y-1.5 mb-3">
                    {inclusions.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                        <DynamicIcon name={item.iconName} className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-emerald-800 font-medium flex-1">{item.label}</span>
                        <button onClick={() => setInclusions(prev => prev.filter(i => i.id !== item.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                  <InlineAddForm onAdd={label => setInclusions(prev => [...prev, { id: `i-${Date.now()}`, label, iconName: 'Check', custom: true }])} placeholder="Agregar inclusión..." buttonLabel="Inclusión" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2"><X className="h-4 w-4" /> Exclusiones ({exclusions.length})</h4>
                  <div className="space-y-1.5 mb-3">
                    {exclusions.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50 border border-red-100">
                        <DynamicIcon name={item.iconName} className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-800 font-medium flex-1">{item.label}</span>
                        <button onClick={() => setExclusions(prev => prev.filter(e => e.id !== item.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                  <InlineAddForm onAdd={label => setExclusions(prev => [...prev, { id: `e-${Date.now()}`, label, iconName: 'X', custom: true }])} placeholder="Agregar exclusión..." buttonLabel="Exclusión" />
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="max-w-3xl space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Reglas y Condiciones</h3>
                  <p className="text-sm text-slate-500 mb-4">Establece las reglas de uso y condiciones especiales.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Reglas ({rules.length})</h4>
                  <div className="space-y-1.5 mb-3">
                    {rules.map(rule => (
                      <div key={rule.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-sm font-medium text-slate-700 flex-1">{rule.label}</span>
                        <select value={rule.type} onChange={e => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, type: e.target.value as PropertyRule['type'] } : r))} className="text-xs border border-slate-200 rounded px-2 py-1">
                          <option value="allowed">Permitido</option>
                          <option value="restricted">Restringido</option>
                          <option value="conditional">Condicional</option>
                          <option value="info">Info</option>
                        </select>
                        <button onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                  <InlineAddForm onAdd={label => setRules(prev => [...prev, { id: `r-${Date.now()}`, label, type: 'info' }])} placeholder="Agregar regla..." buttonLabel="Regla" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Condiciones ({conditions.length})</h4>
                  <div className="space-y-1.5 mb-3">
                    {conditions.map(cond => (
                      <div key={cond.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-sm font-medium text-slate-700 flex-1">{cond.label}</span>
                        <select value={cond.type} onChange={e => setConditions(prev => prev.map(c => c.id === cond.id ? { ...c, type: e.target.value as PropertyCondition['type'] } : c))} className="text-xs border border-slate-200 rounded px-2 py-1">
                          <option value="requirement">Requisito</option>
                          <option value="warning">Advertencia</option>
                          <option value="info">Info</option>
                        </select>
                        <button onClick={() => setConditions(prev => prev.filter(c => c.id !== cond.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                  <InlineAddForm onAdd={label => setConditions(prev => [...prev, { id: `c-${Date.now()}`, label, type: 'info' }])} placeholder="Agregar condición..." buttonLabel="Condición" />
                </div>
              </div>
            )}

            {activeTab === 'idealfit' && (
              <div className="max-w-3xl space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Perfil Ideal del Comprador</h3>
                  <p className="text-sm text-slate-500 mb-4">Selecciona los perfiles ideales para esta propiedad.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {IDEAL_FIT_PROFILES.map(profile => {
                    const isSelected = idealFit.some(f => f.profileKey === profile.key);
                    return (
                      <div
                        key={profile.key}
                        className={cn('flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all', isSelected ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-white hover:border-slate-300')}
                        onClick={() => {
                          if (isSelected) {
                            setIdealFit(prev => prev.filter(f => f.profileKey !== profile.key));
                          } else {
                            setIdealFit(prev => [...prev, { id: `if-${Date.now()}`, profileKey: profile.key, label: profile.label, description: profile.description, iconName: profile.iconName }]);
                          }
                        }}
                      >
                        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', isSelected ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500')}>
                          <DynamicIcon name={profile.iconName} className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={cn('text-sm font-medium block', isSelected ? 'text-primary' : 'text-slate-700')}>{profile.label}</span>
                          <span className="text-xs text-slate-500">{profile.description}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'ctas' && (
              <div className="max-w-3xl space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Calls to Action</h3>
                  <p className="text-sm text-slate-500 mb-4">Configura los botones de acción del listing.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">CTA Principal</h4>
                  <select value={primaryCTA} onChange={e => setPrimaryCTA(e.target.value as CTAKey)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm">
                    {CTA_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">CTAs Secundarios</h4>
                  <div className="space-y-2">
                    {CTA_OPTIONS.filter(o => o.key !== primaryCTA).map(opt => {
                      const isSelected = secondaryCTAs.includes(opt.key);
                      return (
                        <label key={opt.key} className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all", isSelected ? "border-primary/20 bg-primary/5" : "border-slate-200 bg-white")}>
                          <input type="checkbox" checked={isSelected} onChange={() => { if (isSelected) setSecondaryCTAs(prev => prev.filter(k => k !== opt.key)); else setSecondaryCTAs(prev => [...prev, opt.key]); }} className="rounded border-slate-300 text-primary focus:ring-primary" />
                          <span className="text-sm text-slate-700 flex-1">{opt.label}</span>
                          <select value={formMapping[opt.key] || 'general'} onChange={e => setFormMapping(prev => ({ ...prev, [opt.key]: e.target.value as InquiryFormType }))} onClick={e => e.stopPropagation()} className="text-xs border border-slate-200 rounded px-2 py-1">
                            {FORM_TYPE_OPTIONS.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                          </select>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'forms' && (
              <div className="max-w-3xl space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Formularios Asociados</h3>
                  <p className="text-sm text-slate-500 mb-4">Selecciona el tipo de formulario por defecto para este listing.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Tipo de Formulario</h4>
                  <select value={formType} onChange={e => setFormType(e.target.value as InquiryFormType)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm">
                    {FORM_TYPE_OPTIONS.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Mapeo CTA → Formulario</h4>
                  <p className="text-xs text-slate-500 mb-3">Asigna un tipo de formulario específico a cada CTA.</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <span className="text-sm text-primary font-medium flex-1">{CTA_OPTIONS.find(o => o.key === primaryCTA)?.label} (Principal)</span>
                      <select value={formMapping[primaryCTA] || formType} onChange={e => setFormMapping(prev => ({ ...prev, [primaryCTA]: e.target.value as InquiryFormType }))} className="text-xs border border-slate-200 rounded px-2 py-1">
                        {FORM_TYPE_OPTIONS.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                      </select>
                    </div>
                    {secondaryCTAs.map(ctaKey => (
                      <div key={ctaKey} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                        <span className="text-sm text-slate-700 font-medium flex-1">{CTA_OPTIONS.find(o => o.key === ctaKey)?.label}</span>
                        <select value={formMapping[ctaKey] || 'general'} onChange={e => setFormMapping(prev => ({ ...prev, [ctaKey]: e.target.value as InquiryFormType }))} className="text-xs border border-slate-200 rounded px-2 py-1">
                          {FORM_TYPE_OPTIONS.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
