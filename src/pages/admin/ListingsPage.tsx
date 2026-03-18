import { useState, useSyncExternalStore, useCallback } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui-components';
import { cn } from '@/lib/utils';
import {
  getPublicListings,
  getPublicListingById,
  updateListingAmenities,
  updateListingInclusions,
  updateListingRules,
  updateListingIdealFit,
  updateListingCTAConfig,
  getHomeCatalogConfig,
  updateHomeCatalogConfig,
  addPublicListing,
  updatePublicListing,
} from '@/store/listings-store';
import { PREDEFINED_ATTRIBUTES, ATTRIBUTE_CATEGORIES, IDEAL_FIT_PROFILES, getAttributesByCategory } from '@/lib/attribute-library';
import { DynamicIcon } from '@/components/catalog/icons';
import type { PublicListing, PropertyAmenity, PropertyInclusion, PropertyExclusion, PropertyRule, PropertyCondition, PropertyIdealFit, CTAKey, InquiryFormType, InquiryFormField, ListingCTAConfig, DynamicInquiryFormConfig, HomeCatalogConfig, CarouselBlockConfig, CarouselSourceLogic } from '@/lib/listing-types';
import {
  Building2, Plus, Search, Edit, Eye, ToggleLeft, ToggleRight, Star, Trash2, GripVertical,
  Check, X, ShieldAlert, AlertTriangle, Info, ChevronDown, ChevronUp, Settings2, MapPin, ArrowUp, ArrowDown,
  Home, Layout, Monitor, Sliders, ImageIcon
} from 'lucide-react';
import { ListingCreateEditModal, type ListingFormData } from '@/components/admin/ListingCreateEditModal';

function useListings() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('listings-updated', cb);
    return () => window.removeEventListener('listings-updated', cb);
  }, []);
  return useSyncExternalStore(subscribe, getPublicListings, getPublicListings);
}

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

type EditorTab = 'amenities' | 'inclusions' | 'rules' | 'idealfit' | 'cta';

function ListingRow({ listing, onEdit }: { listing: PublicListing; onEdit: () => void }) {
  const coverPhoto = listing.photos?.[0];
  const hasCover = coverPhoto && !coverPhoto.startsWith('/placeholder');
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
        {hasCover ? (
          <img src={coverPhoto} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-slate-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-800 truncate">{listing.title}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.municipality}</span>
          <Badge variant={listing.operationType === 'sale' ? 'default' : 'success'} className="text-[10px]">
            {listing.operationType === 'sale' ? 'Venta' : 'Alquiler'}
          </Badge>
          <Badge variant={listing.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
            {listing.status}
          </Badge>
        </div>
      </div>
      <span className="text-sm font-bold text-slate-700">{listing.priceLabel}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
        <a href={`/catalogo/${listing.id}`} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
        </a>
      </div>
    </div>
  );
}

function AttributeEditor({ listingId, onBack }: { listingId: string; onBack: () => void }) {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('listings-updated', cb);
    return () => window.removeEventListener('listings-updated', cb);
  }, []);
  const listing = useSyncExternalStore(
    subscribe,
    () => getPublicListingById(listingId),
    () => getPublicListingById(listingId)
  );

  const [activeTab, setActiveTab] = useState<EditorTab>('amenities');
  const [searchQuery, setSearchQuery] = useState('');
  const [saved, setSaved] = useState(false);

  const [amenities, setAmenities] = useState<PropertyAmenity[]>(() => listing ? [...listing.amenities] : []);
  const [inclusions, setInclusions] = useState<PropertyInclusion[]>(() => listing ? [...listing.inclusions] : []);
  const [exclusions, setExclusions] = useState<PropertyExclusion[]>(() => listing ? [...listing.exclusions] : []);
  const [rules, setRules] = useState<PropertyRule[]>(() => listing ? [...listing.rules] : []);
  const [conditions, setConditions] = useState<PropertyCondition[]>(() => listing ? [...listing.conditions] : []);
  const [idealFit, setIdealFit] = useState<PropertyIdealFit[]>(() => listing ? [...listing.idealFit] : []);
  const [primaryCTA, setPrimaryCTA] = useState<CTAKey>(() => listing ? listing.ctaConfig.primaryCTA : 'solicitar-info');
  const [secondaryCTAs, setSecondaryCTAs] = useState<CTAKey[]>(() => listing ? [...listing.ctaConfig.secondaryCTAs] : []);
  const [formMapping, setFormMapping] = useState<Partial<Record<CTAKey, InquiryFormType>>>(() => listing ? { ...listing.ctaConfig.formMapping } : {});
  const [microcopy, setMicrocopy] = useState<Partial<Record<CTAKey, { label?: string; description?: string }>>>(() => listing?.ctaConfig.microcopy ? { ...listing.ctaConfig.microcopy } : {});
  const [ctaFormConfigs, setCtaFormConfigs] = useState<Partial<Record<InquiryFormType, Partial<DynamicInquiryFormConfig>>>>(() => listing?.ctaConfig.ctaFormConfigs ? { ...listing.ctaConfig.ctaFormConfigs } : {});
  const [customAmenityName, setCustomAmenityName] = useState('');
  const [customAmenityIcon, setCustomAmenityIcon] = useState('Star');

  if (!listing) return null;

  const handleSave = () => {
    updateListingAmenities(listingId, amenities);
    updateListingInclusions(listingId, inclusions, exclusions);
    updateListingRules(listingId, rules, conditions);
    updateListingIdealFit(listingId, idealFit);
    updateListingCTAConfig(listingId, {
      primaryCTA,
      secondaryCTAs,
      formMapping,
      microcopy: Object.keys(microcopy).length > 0 ? microcopy : undefined,
      ctaFormConfigs: Object.keys(ctaFormConfigs).length > 0 ? ctaFormConfigs : undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { key: EditorTab; label: string }[] = [
    { key: 'amenities', label: 'Amenidades' },
    { key: 'inclusions', label: 'Inclusiones / Exclusiones' },
    { key: 'rules', label: 'Reglas & Condiciones' },
    { key: 'idealfit', label: 'Perfil Ideal' },
    { key: 'cta', label: 'CTAs & Formularios' },
  ];

  const toggleAmenity = (attributeId: string) => {
    const exists = amenities.find(a => a.attributeId === attributeId);
    if (exists) {
      setAmenities(prev => prev.filter(a => a.attributeId !== attributeId));
    } else {
      setAmenities(prev => [...prev, {
        id: `a-new-${Date.now()}`,
        attributeId,
        active: true,
        featured: false,
        order: prev.length + 1,
      }]);
    }
  };

  const toggleFeatured = (attributeId: string) => {
    setAmenities(prev => prev.map(a =>
      a.attributeId === attributeId ? { ...a, featured: !a.featured } : a
    ));
  };

  const toggleActive = (attributeId: string) => {
    setAmenities(prev => prev.map(a =>
      a.attributeId === attributeId ? { ...a, active: !a.active } : a
    ));
  };

  const moveAmenity = (index: number, direction: 'up' | 'down') => {
    setAmenities(prev => {
      const arr = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return arr.map((a, i) => ({ ...a, order: i + 1 }));
    });
  };

  const addCustomAmenity = () => {
    if (!customAmenityName.trim()) return;
    const customId = `custom-${Date.now()}`;
    setAmenities(prev => [...prev, {
      id: `a-${customId}`,
      attributeId: customId,
      active: true,
      featured: false,
      order: prev.length + 1,
      customLabel: customAmenityName.trim(),
      customIcon: customAmenityIcon,
    }]);
    setCustomAmenityName('');
    setCustomAmenityIcon('Star');
  };

  const addInclusion = (label: string, iconName: string, custom = true) => {
    setInclusions(prev => [...prev, { id: `i-new-${Date.now()}`, label, iconName, custom }]);
  };

  const addExclusion = (label: string, iconName: string, custom = true) => {
    setExclusions(prev => [...prev, { id: `e-new-${Date.now()}`, label, iconName, custom }]);
  };

  const addRule = (label: string, type: PropertyRule['type']) => {
    setRules(prev => [...prev, { id: `r-new-${Date.now()}`, label, type }]);
  };

  const addCondition = (label: string, type: PropertyCondition['type']) => {
    setConditions(prev => [...prev, { id: `c-new-${Date.now()}`, label, type }]);
  };

  const updateMicrocopy = (ctaKey: CTAKey, field: 'label' | 'description', value: string) => {
    setMicrocopy(prev => ({
      ...prev,
      [ctaKey]: {
        ...prev[ctaKey],
        [field]: value || undefined,
      },
    }));
  };

  const selectedAmenities = amenities.filter(a => {
    const attr = PREDEFINED_ATTRIBUTES.find(p => p.id === a.attributeId);
    return attr || a.customLabel;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            ← Volver a listados
          </Button>
          <h3 className="text-lg font-display font-bold text-slate-800">Atributos & Amenidades — {listing.title}</h3>
        </div>
        <Button onClick={handleSave} className={cn(saved && "bg-emerald-600 hover:bg-emerald-700")} size="sm">
          {saved ? <><Check className="h-3.5 w-3.5 mr-1.5" /> Guardado</> : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.key ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'amenities' && (
        <div className="space-y-6">
          {selectedAmenities.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Amenidades seleccionadas (arrastra para reordenar)</h4>
              <div className="space-y-1">
                {selectedAmenities.map((amenity, index) => {
                  const attr = PREDEFINED_ATTRIBUTES.find(p => p.id === amenity.attributeId);
                  const label = attr?.label || amenity.customLabel || amenity.attributeId;
                  const iconName = attr?.iconName || amenity.customIcon || 'Star';
                  return (
                    <div key={amenity.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                      <GripVertical className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveAmenity(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveAmenity(index, 'down')}
                          disabled={index === selectedAmenities.length - 1}
                          className="p-0.5 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary/10 text-primary shrink-0">
                        <DynamicIcon name={iconName} className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium text-primary flex-1">{label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">#{index + 1}</span>
                      <button
                        onClick={() => toggleActive(amenity.attributeId)}
                        className={cn('p-1 rounded', amenity.active ? 'text-emerald-500' : 'text-slate-400')}
                        title={amenity.active ? 'Activo' : 'Inactivo'}
                      >
                        {amenity.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleFeatured(amenity.attributeId)}
                        className={cn('p-1 rounded', amenity.featured ? 'text-amber-500' : 'text-slate-400')}
                        title={amenity.featured ? 'Destacado' : 'No destacado'}
                      >
                        <Star className={cn('h-4 w-4', amenity.featured && 'fill-amber-500')} />
                      </button>
                      <button onClick={() => toggleAmenity(amenity.attributeId)} className="p-1 text-slate-400 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Crear amenidad personalizada
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAmenityName}
                onChange={e => setCustomAmenityName(e.target.value)}
                placeholder="Nombre de la amenidad..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                onKeyDown={e => { if (e.key === 'Enter') addCustomAmenity(); }}
              />
              <select
                value={customAmenityIcon}
                onChange={e => setCustomAmenityIcon(e.target.value)}
                className="px-2 py-2 rounded-lg border border-slate-300 text-sm w-32"
              >
                <option value="Star">Estrella</option>
                <option value="Home">Casa</option>
                <option value="Building2">Edificio</option>
                <option value="Wifi">WiFi</option>
                <option value="Car">Auto</option>
                <option value="Trees">Jardín</option>
                <option value="Waves">Playa</option>
                <option value="Dumbbell">Gimnasio</option>
                <option value="ShieldCheck">Seguridad</option>
                <option value="Zap">Electricidad</option>
              </select>
              <Button size="sm" onClick={addCustomAmenity} disabled={!customAmenityName.trim()}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar amenidades del catálogo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {ATTRIBUTE_CATEGORIES.map(category => {
            const attrs = getAttributesByCategory(category.key).filter(a =>
              !searchQuery || a.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (attrs.length === 0) return null;
            return (
              <div key={category.key}>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <DynamicIcon name={category.iconName} className="h-4 w-4 text-primary" />
                  {category.label}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attrs.map(attr => {
                    const amenity = amenities.find(a => a.attributeId === attr.id);
                    const isSelected = !!amenity;
                    return (
                      <div
                        key={attr.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
                          isSelected ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-white hover:border-slate-300'
                        )}
                        onClick={() => toggleAmenity(attr.id)}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          isSelected ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                        )}>
                          <DynamicIcon name={attr.iconName} className="h-4 w-4" />
                        </div>
                        <span className={cn('text-sm font-medium flex-1', isSelected ? 'text-primary' : 'text-slate-700')}>
                          {attr.label}
                        </span>
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
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2"><Check className="h-4 w-4" /> Inclusiones actuales</h4>
            <div className="space-y-2 mb-3">
              {inclusions.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <DynamicIcon name={item.iconName} className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800 font-medium flex-1">{item.label}</span>
                  {item.custom && <Badge variant="secondary" className="text-[10px]">personalizada</Badge>}
                  <button onClick={() => setInclusions(prev => prev.filter(i => i.id !== item.id))} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2"><X className="h-4 w-4" /> Exclusiones actuales</h4>
            <div className="space-y-2 mb-3">
              {exclusions.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50 border border-red-100">
                  <DynamicIcon name={item.iconName} className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800 font-medium flex-1">{item.label}</span>
                  {item.custom && <Badge variant="secondary" className="text-[10px]">personalizada</Badge>}
                  <button onClick={() => setExclusions(prev => prev.filter(i => i.id !== item.id))} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Agregar desde catálogo predefinido</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PREDEFINED_ATTRIBUTES.filter(a => a.attributeType === 'inclusion' || a.attributeType === 'exclusion').map(attr => {
                const isInclusion = inclusions.some(i => i.label === attr.label);
                const isExclusion = exclusions.some(e => e.label === attr.label);
                return (
                  <div key={attr.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white">
                    <DynamicIcon name={attr.iconName} className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">{attr.label}</span>
                    <button
                      onClick={() => {
                        if (!isInclusion) addInclusion(attr.label, attr.iconName, false);
                      }}
                      disabled={isInclusion}
                      className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium border', isInclusion ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50')}
                    >
                      {isInclusion ? '✓ Incluido' : '+ Incluir'}
                    </button>
                    <button
                      onClick={() => {
                        if (!isExclusion) addExclusion(attr.label, attr.iconName, false);
                      }}
                      disabled={isExclusion}
                      className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium border', isExclusion ? 'bg-red-100 border-red-200 text-red-700' : 'border-red-300 text-red-600 hover:bg-red-50')}
                    >
                      {isExclusion ? '✓ Excluido' : '+ Excluir'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Agregar entrada personalizada</h4>
            <div className="flex gap-2 mb-2">
              <AddItemForm onAdd={(label) => addInclusion(label, 'Check')} placeholder="Agregar inclusión personalizada..." buttonLabel="+ Inclusión" />
            </div>
            <div className="flex gap-2">
              <AddItemForm onAdd={(label) => addExclusion(label, 'X')} placeholder="Agregar exclusión personalizada..." buttonLabel="+ Exclusión" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Reglas</h4>
            <div className="space-y-2 mb-3">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <RuleTypeIcon type={rule.type} />
                  <span className="text-sm font-medium text-slate-700 flex-1">{rule.label}</span>
                  <select
                    value={rule.type}
                    onChange={e => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, type: e.target.value as PropertyRule['type'] } : r))}
                    className="text-xs border border-slate-200 rounded px-2 py-1"
                  >
                    <option value="allowed">Permitido</option>
                    <option value="restricted">Restringido</option>
                    <option value="conditional">Condicional</option>
                    <option value="info">Info</option>
                  </select>
                  <button onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <AddItemForm onAdd={(label) => addRule(label, 'info')} placeholder="Agregar regla..." buttonLabel="Agregar" />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Condiciones</h4>
            <div className="space-y-2 mb-3">
              {conditions.map(cond => (
                <div key={cond.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <ConditionTypeIcon type={cond.type} />
                  <span className="text-sm font-medium text-slate-700 flex-1">{cond.label}</span>
                  <select
                    value={cond.type}
                    onChange={e => setConditions(prev => prev.map(c => c.id === cond.id ? { ...c, type: e.target.value as PropertyCondition['type'] } : c))}
                    className="text-xs border border-slate-200 rounded px-2 py-1"
                  >
                    <option value="requirement">Requisito</option>
                    <option value="warning">Advertencia</option>
                    <option value="info">Info</option>
                  </select>
                  <button onClick={() => setConditions(prev => prev.filter(c => c.id !== cond.id))} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <AddItemForm onAdd={(label) => addCondition(label, 'info')} placeholder="Agregar condición..." buttonLabel="Agregar" />
          </div>
        </div>
      )}

      {activeTab === 'idealfit' && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Perfiles Ideales</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {IDEAL_FIT_PROFILES.map(profile => {
              const isSelected = idealFit.some(f => f.profileKey === profile.key);
              return (
                <div
                  key={profile.key}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
                    isSelected ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                  onClick={() => {
                    if (isSelected) {
                      setIdealFit(prev => prev.filter(f => f.profileKey !== profile.key));
                    } else {
                      setIdealFit(prev => [...prev, {
                        id: `if-new-${Date.now()}`,
                        profileKey: profile.key,
                        label: profile.label,
                        description: profile.description,
                        iconName: profile.iconName,
                      }]);
                    }
                  }}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    isSelected ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                  )}>
                    <DynamicIcon name={profile.iconName} className="h-4.5 w-4.5" />
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

      {activeTab === 'cta' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">CTA Principal</h4>
            <select
              value={primaryCTA}
              onChange={e => setPrimaryCTA(e.target.value as CTAKey)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
            >
              {CTA_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <div className="mt-2 space-y-1">
              <input
                type="text"
                placeholder="Label personalizado para CTA principal (opcional)"
                value={microcopy[primaryCTA]?.label || ''}
                onChange={e => updateMicrocopy(primaryCTA, 'label', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <input
                type="text"
                placeholder="Descripción/microcopy (opcional)"
                value={microcopy[primaryCTA]?.description || ''}
                onChange={e => updateMicrocopy(primaryCTA, 'description', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Formulario del CTA principal</h4>
            <select
              value={formMapping[primaryCTA] || listing.formConfig.formType}
              onChange={e => setFormMapping(prev => ({ ...prev, [primaryCTA]: e.target.value as InquiryFormType }))}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm mb-2"
            >
              {FORM_TYPE_OPTIONS.map(ft => (
                <option key={ft.value} value={ft.value}>{ft.label}</option>
              ))}
            </select>
            <FormFieldsPreview formType={formMapping[primaryCTA] || listing.formConfig.formType} />
            <FormConfigOverrides
              formType={formMapping[primaryCTA] || listing.formConfig.formType}
              configs={ctaFormConfigs}
              onUpdate={setCtaFormConfigs}
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">CTAs Secundarios</h4>
            <div className="space-y-2">
              {CTA_OPTIONS.filter(o => o.key !== primaryCTA).map(opt => {
                const isSelected = secondaryCTAs.includes(opt.key);
                return (
                  <div key={opt.key} className={cn("rounded-lg border p-3 transition-all", isSelected ? "border-primary/20 bg-primary/5" : "border-slate-200 bg-white")}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setSecondaryCTAs(prev => prev.filter(k => k !== opt.key));
                          } else {
                            setSecondaryCTAs(prev => [...prev, opt.key]);
                          }
                        }}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-slate-700 flex-1">{opt.label}</span>
                      <select
                        value={formMapping[opt.key] || 'general'}
                        onChange={e => setFormMapping(prev => ({ ...prev, [opt.key]: e.target.value as InquiryFormType }))}
                        className="text-xs border border-slate-200 rounded px-2 py-1"
                        onClick={e => e.stopPropagation()}
                      >
                        {FORM_TYPE_OPTIONS.map(ft => (
                          <option key={ft.value} value={ft.value}>{ft.label}</option>
                        ))}
                      </select>
                    </label>
                    {isSelected && (
                      <div className="mt-2 pl-7 space-y-1">
                        <input
                          type="text"
                          placeholder="Label personalizado (opcional)"
                          value={microcopy[opt.key]?.label || ''}
                          onChange={e => updateMicrocopy(opt.key, 'label', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Microcopy/descripción (opcional)"
                          value={microcopy[opt.key]?.description || ''}
                          onChange={e => updateMicrocopy(opt.key, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <FormConfigOverrides
                          formType={formMapping[opt.key] || 'general'}
                          configs={ctaFormConfigs}
                          onUpdate={setCtaFormConfigs}
                          compact
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FORM_FIELD_DESCRIPTIONS: Record<InquiryFormType, string[]> = {
  general: ['Nombre completo', 'Email', 'Teléfono', 'Mensaje'],
  sales: ['Nombre completo', 'Email', 'Teléfono', 'Presupuesto', 'Financiamiento', 'Mensaje'],
  rental: ['Nombre completo', 'Email', 'Teléfono', 'Fecha mudanza', 'Ocupantes', 'Mascotas', 'Fuente de ingresos'],
  showing: ['Nombre completo', 'Email', 'Teléfono', 'Fecha preferida', 'Hora preferida', 'Asistentes', 'Notas'],
  prequalification: ['Nombre completo', 'Email', 'Teléfono', 'Ingreso anual', 'Estatus laboral', 'Pronto disponible', 'Puntuación crédito'],
  investor: ['Nombre completo', 'Email', 'Teléfono', 'Tipo inversión', 'Presupuesto', 'Timeline', 'ROI esperado'],
  commercial: ['Nombre completo', 'Email', 'Teléfono', 'Nombre empresa', 'Tipo negocio', 'Requisitos de espacio', 'Presupuesto'],
};

function FormFieldsPreview({ formType }: { formType: InquiryFormType }) {
  const fields = FORM_FIELD_DESCRIPTIONS[formType] || FORM_FIELD_DESCRIPTIONS.general;
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
      <p className="text-xs text-slate-500 mb-2 font-medium">Campos del formulario ({FORM_TYPE_OPTIONS.find(f => f.value === formType)?.label}):</p>
      <div className="flex flex-wrap gap-1.5">
        {fields.map(field => (
          <span key={field} className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">{field}</span>
        ))}
      </div>
    </div>
  );
}

function FormConfigOverrides({
  formType,
  configs,
  onUpdate,
  compact = false,
}: {
  formType: InquiryFormType;
  configs: Partial<Record<InquiryFormType, Partial<DynamicInquiryFormConfig>>>;
  onUpdate: React.Dispatch<React.SetStateAction<Partial<Record<InquiryFormType, Partial<DynamicInquiryFormConfig>>>>>;
  compact?: boolean;
}) {
  const current = configs[formType] || {};
  const update = (field: keyof DynamicInquiryFormConfig, value: string) => {
    onUpdate(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [field]: value || undefined,
      },
    }));
  };
  const inputClass = compact
    ? 'w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none'
    : 'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none';
  return (
    <div className={cn('space-y-1.5', compact ? 'mt-1.5' : 'mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200')}>
      {!compact && <p className="text-xs text-slate-500 font-medium mb-2">Personalizar formulario:</p>}
      <input type="text" placeholder="Título del formulario (opcional)" value={current.heading || ''} onChange={e => update('heading', e.target.value)} className={inputClass} />
      <input type="text" placeholder="Subtítulo (opcional)" value={current.subheading || ''} onChange={e => update('subheading', e.target.value)} className={inputClass} />
      <input type="text" placeholder="Texto del botón (opcional)" value={current.submitLabel || ''} onChange={e => update('submitLabel', e.target.value)} className={inputClass} />
      <input type="text" placeholder="Título de éxito (opcional)" value={current.successTitle || ''} onChange={e => update('successTitle', e.target.value)} className={inputClass} />
      <input type="text" placeholder="Mensaje de éxito (opcional)" value={current.successMessage || ''} onChange={e => update('successMessage', e.target.value)} className={inputClass} />
    </div>
  );
}

function AddItemForm({ onAdd, placeholder, buttonLabel }: { onAdd: (label: string) => void; placeholder: string; buttonLabel: string }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        onKeyDown={e => {
          if (e.key === 'Enter' && value.trim()) {
            onAdd(value.trim());
            setValue('');
          }
        }}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          if (value.trim()) {
            onAdd(value.trim());
            setValue('');
          }
        }}
      >
        <Plus className="h-3.5 w-3.5 mr-1" /> {buttonLabel}
      </Button>
    </div>
  );
}

function RuleTypeIcon({ type }: { type: PropertyRule['type'] }) {
  switch (type) {
    case 'allowed': return <Check className="h-4 w-4 text-emerald-500" />;
    case 'restricted': return <ShieldAlert className="h-4 w-4 text-red-500" />;
    case 'conditional': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'info': return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function ConditionTypeIcon({ type }: { type: PropertyCondition['type'] }) {
  switch (type) {
    case 'requirement': return <ShieldAlert className="h-4 w-4 text-purple-500" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'info': return <Info className="h-4 w-4 text-slate-500" />;
  }
}

function useHomeCatalogConfigAdmin() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('home-catalog-config-updated', cb);
    return () => window.removeEventListener('home-catalog-config-updated', cb);
  }, []);
  return useSyncExternalStore(subscribe, getHomeCatalogConfig, getHomeCatalogConfig);
}

function CarouselConfigEditor({ label, config, onChange }: {
  label: string;
  config: CarouselBlockConfig;
  onChange: (config: CarouselBlockConfig) => void;
}) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{label}</span>
          <button
            onClick={() => onChange({ ...config, visible: !config.visible })}
            className={cn('flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border transition-colors', config.visible ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500')}
          >
            {config.visible ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {config.visible ? 'Visible' : 'Oculto'}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Título</label>
            <Input value={config.title} onChange={e => onChange({ ...config, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Subtítulo</label>
            <Input value={config.subtitle} onChange={e => onChange({ ...config, subtitle: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Texto del CTA</label>
            <Input value={config.ctaLabel} onChange={e => onChange({ ...config, ctaLabel: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Destino del CTA</label>
            <Input value={config.ctaDestination} onChange={e => onChange({ ...config, ctaDestination: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Máximo de tarjetas</label>
            <Input type="number" min={1} max={20} value={config.maxCards} onChange={e => onChange({ ...config, maxCards: parseInt(e.target.value) || 4 })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Fuente de listings</label>
            <select
              value={config.sourceLogic}
              onChange={e => onChange({ ...config, sourceLogic: e.target.value as CarouselSourceLogic })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">Todas las activas</option>
              <option value="featured">Solo destacadas</option>
              <option value="latest">Más recientes</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={config.quickViewEnabled} onChange={e => onChange({ ...config, quickViewEnabled: e.target.checked })} className="rounded border-slate-300 text-primary focus:ring-primary" />
            Vista rápida habilitada
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

function HomepageSettingsPanel() {
  const config = useHomeCatalogConfigAdmin();
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<HomeCatalogConfig>) => {
    updateHomeCatalogConfig(partial);
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Configuración del Homepage</h1>
          <p className="text-sm text-slate-500 mt-1">Controla cómo se muestran las propiedades en la página principal.</p>
        </div>
        <Button onClick={showSaved} className={cn(saved && 'bg-emerald-600 hover:bg-emerald-700')}>
          {saved ? <><Check className="h-4 w-4 mr-1" /> Guardado</> : 'Aplicar cambios'}
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2"><Layout className="h-4 w-4 text-primary" /> Sección de Catálogo</span>
            <button
              onClick={() => update({ enabled: !config.enabled })}
              className={cn('flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border transition-colors', config.enabled ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700')}
            >
              {config.enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              {config.enabled ? 'Activa' : 'Desactivada'}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Título de la sección</label>
              <Input value={config.sectionTitle} onChange={e => update({ sectionTitle: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Subtítulo</label>
              <Input value={config.sectionSubtitle} onChange={e => update({ sectionSubtitle: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Microcopy</label>
            <Input value={config.sectionMicrocopy} onChange={e => update({ sectionMicrocopy: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Variante de fondo</label>
            <div className="flex gap-2">
              {(['white', 'light', 'dark'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => update({ backgroundVariant: v })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                    config.backgroundVariant === v ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200 text-slate-600 hover:border-primary/30'
                  )}
                >
                  {v === 'white' ? 'Blanco' : v === 'light' ? 'Claro' : 'Oscuro'}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <CarouselConfigEditor
        label="Carrusel de Propiedades en Venta"
        config={config.purchaseCarousel}
        onChange={purchaseCarousel => update({ purchaseCarousel })}
      />

      <CarouselConfigEditor
        label="Carrusel de Propiedades en Alquiler"
        config={config.rentalCarousel}
        onChange={rentalCarousel => update({ rentalCarousel })}
      />

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" /> Controles de Tarjeta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              ['showImage', 'Imagen'],
              ['showPrice', 'Precio'],
              ['showLocation', 'Ubicación'],
              ['showPropertyType', 'Tipo'],
              ['showStats', 'Estadísticas'],
              ['showBadges', 'Badges'],
              ['showHighlights', 'Highlights'],
              ['showQuickViewCTA', 'CTA Vista Rápida'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={config.cardDisplay[key]}
                  onChange={e => update({ cardDisplay: { ...config.cardDisplay, [key]: e.target.checked } })}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" /> Controles del Quick View Modal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={config.quickView.enabled}
                onChange={e => update({ quickView: { ...config.quickView, enabled: e.target.checked } })}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              Modal habilitado
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {([
              ['showGallery', 'Galería'],
              ['showSpecs', 'Especificaciones'],
              ['showInclusions', 'Inclusiones'],
              ['showDescription', 'Descripción'],
              ['showCTAs', 'Botones CTA'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={config.quickView[key]}
                  onChange={e => update({ quickView: { ...config.quickView, [key]: e.target.checked } })}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">CTA Primario</label>
              <Input value={config.quickView.primaryCTALabel} onChange={e => update({ quickView: { ...config.quickView, primaryCTALabel: e.target.value } })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">CTA Secundario</label>
              <Input value={config.quickView.secondaryCTALabel} onChange={e => update({ quickView: { ...config.quickView, secondaryCTALabel: e.target.value } })} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type PageView = 'listings' | 'homepage';

export default function ListingsPage() {
  const listings = useListings();
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [pageView, setPageView] = useState<PageView>('listings');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalListing, setEditModalListing] = useState<PublicListing | null>(null);

  return (
    <AdminLayout breadcrumbs={[{ label: 'Listings', href: '/admin/listings' }, ...(selectedListingId ? [{ label: 'Editor de Atributos' }] : [])]}>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
        {!selectedListingId && (
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setPageView('listings')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pageView === 'listings' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Building2 className="h-4 w-4" /> Catálogo
            </button>
            <button
              onClick={() => setPageView('homepage')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pageView === 'homepage' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Home className="h-4 w-4" /> Homepage
            </button>
          </div>
        )}

        {selectedListingId ? (
          <Card className="shadow-sm border-slate-200">
            <CardContent className="pt-6">
              <AttributeEditor listingId={selectedListingId} onBack={() => setSelectedListingId(null)} />
            </CardContent>
          </Card>
        ) : pageView === 'homepage' ? (
          <HomepageSettingsPanel />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-slate-900">Listados Públicos</h1>
                <p className="text-sm text-slate-500 mt-1">Administra los listados del catálogo público y sus atributos.</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{listings.length} listados</Badge>
                <Button onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Crear Listing</Button>
              </div>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Catálogo de Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {listings.map(listing => (
                  <ListingRow
                    key={listing.id}
                    listing={listing}
                    onEdit={() => setEditModalListing(listing)}
                  />
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ListingCreateEditModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={(data: ListingFormData) => {
          const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const amenities: PropertyAmenity[] = data.amenityIds.map((id, idx) => ({
            id: `amenity-${id}`,
            attributeId: id,
            active: true,
            featured: false,
            order: idx,
          }));
          const defaultFields: InquiryFormField[] = [
            { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Tu nombre', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com', required: true },
            { name: 'phone', label: 'Teléfono', type: 'phone', placeholder: '(787) 000-0000', required: false },
            { name: 'message', label: 'Mensaje', type: 'textarea', placeholder: 'Tu mensaje...', required: false },
          ];
          const newListing: PublicListing = {
            id: `listing-${Date.now()}`,
            title: data.title,
            slug,
            description: data.description || '',
            price: data.price,
            priceLabel: data.priceLabel,
            operationType: data.operationType,
            propertyCategory: 'residential',
            propertyType: data.propertyType,
            address: data.address || '',
            municipality: data.municipality || '',
            sector: data.sector || '',
            region: 'Puerto Rico',
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            parkingSpaces: data.parkingSpaces,
            area: data.area,
            areaUnit: data.areaUnit,
            yearBuilt: data.yearBuilt,
            photos: data.photos || [],
            amenities,
            inclusions: data.inclusions,
            exclusions: data.exclusions,
            rules: data.rules,
            conditions: data.conditions,
            idealFit: data.idealFit,
            utilities: [],
            appliances: [],
            restrictions: [],
            attributeGroups: [],
            ctaConfig: { primaryCTA: data.primaryCTA, secondaryCTAs: data.secondaryCTAs, formMapping: data.formMapping },
            formConfig: { formType: data.formType, heading: 'Solicitar Información', subheading: '', submitLabel: 'Enviar', successTitle: 'Enviado', successMessage: 'Gracias', fields: defaultFields },
            featured: false,
            status: data.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addPublicListing(newListing);
        }}
      />

      <ListingCreateEditModal
        listing={editModalListing}
        open={!!editModalListing}
        onClose={() => setEditModalListing(null)}
        onSave={(data: ListingFormData) => {
          if (!editModalListing) return;
          const amenities: PropertyAmenity[] = data.amenityIds.map((id, idx) => ({
            id: `amenity-${id}`,
            attributeId: id,
            active: true,
            featured: false,
            order: idx,
          }));
          updatePublicListing(editModalListing.id, {
            title: data.title,
            description: data.description,
            propertyType: data.propertyType,
            operationType: data.operationType,
            status: data.status,
            price: data.price,
            priceLabel: data.priceLabel,
            municipality: data.municipality,
            sector: data.sector,
            address: data.address,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            parkingSpaces: data.parkingSpaces,
            area: data.area,
            areaUnit: data.areaUnit,
            yearBuilt: data.yearBuilt,
            photos: data.photos || [],
            amenities,
            inclusions: data.inclusions,
            exclusions: data.exclusions,
            rules: data.rules,
            conditions: data.conditions,
            idealFit: data.idealFit,
            ctaConfig: { primaryCTA: data.primaryCTA, secondaryCTAs: data.secondaryCTAs, formMapping: data.formMapping },
            formConfig: { ...editModalListing.formConfig, formType: data.formType },
          });
        }}
      />
    </AdminLayout>
  );
}
