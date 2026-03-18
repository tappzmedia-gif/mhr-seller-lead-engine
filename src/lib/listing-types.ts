export type PropertyCategory = 'residential' | 'commercial' | 'land';
export type OperationType = 'sale' | 'rental';
export type AttributeType = 'inclusion' | 'exclusion' | 'neutral';

export type AttributeCategoryKey =
  | 'general'
  | 'utilities'
  | 'appliances'
  | 'residential-amenities'
  | 'rental-rules'
  | 'commercial'
  | 'land';

export interface ListingIconItem {
  id: string;
  label: string;
  iconName: string;
  category: AttributeCategoryKey;
  attributeType: AttributeType;
}

export interface PropertyAmenity {
  id: string;
  attributeId: string;
  active: boolean;
  featured: boolean;
  order: number;
  customLabel?: string;
  customIcon?: string;
}

export interface PropertyInclusion {
  id: string;
  label: string;
  iconName: string;
  custom: boolean;
}

export interface PropertyExclusion {
  id: string;
  label: string;
  iconName: string;
  custom: boolean;
}

export interface PropertyRule {
  id: string;
  label: string;
  type: 'allowed' | 'restricted' | 'conditional' | 'info';
  description?: string;
}

export interface PropertyCondition {
  id: string;
  label: string;
  type: 'requirement' | 'warning' | 'info';
  description?: string;
}

export interface PropertyIdealFit {
  id: string;
  profileKey: string;
  label: string;
  description: string;
  iconName: string;
}

export interface PropertyUtility {
  id: string;
  attributeId: string;
  included: boolean;
  details?: string;
}

export interface PropertyAppliance {
  id: string;
  attributeId: string;
  included: boolean;
  condition?: string;
}

export interface PropertyRestriction {
  id: string;
  label: string;
  severity: 'hard' | 'soft' | 'info';
  description?: string;
}

export type InquiryFormType =
  | 'general'
  | 'sales'
  | 'rental'
  | 'showing'
  | 'prequalification'
  | 'investor'
  | 'commercial';

export interface DynamicInquiryFormConfig {
  formType: InquiryFormType;
  heading: string;
  subheading: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  fields: InquiryFormField[];
}

export interface InquiryFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

export type CTAKey =
  | 'solicitar-info'
  | 'agendar-visita'
  | 'aplicar-alquiler'
  | 'comenzar-precalificacion'
  | 'whatsapp'
  | 'ver-requisitos'
  | 'tour-virtual'
  | 'hablar-asesor';

export interface ListingCTAConfig {
  primaryCTA: CTAKey;
  secondaryCTAs: CTAKey[];
  formMapping: Partial<Record<CTAKey, InquiryFormType>>;
  microcopy?: Partial<Record<CTAKey, { label?: string; description?: string }>>;
  ctaFormConfigs?: Partial<Record<InquiryFormType, Partial<DynamicInquiryFormConfig>>>;
}

export interface ListingAttributeGroup {
  id: string;
  label: string;
  category: AttributeCategoryKey;
  attributes: string[];
  order: number;
  visible: boolean;
}

export type CarouselSourceLogic = 'featured' | 'latest' | 'all';
export type CarouselStyle = 'default' | 'compact' | 'expanded';

export interface CarouselBlockConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaDestination: string;
  maxCards: number;
  sourceLogic: CarouselSourceLogic;
  style: CarouselStyle;
  quickViewEnabled: boolean;
}

export interface CardDisplayConfig {
  showImage: boolean;
  showPrice: boolean;
  showLocation: boolean;
  showPropertyType: boolean;
  showStats: boolean;
  showBadges: boolean;
  showHighlights: boolean;
  showQuickViewCTA: boolean;
}

export interface QuickViewConfig {
  enabled: boolean;
  showGallery: boolean;
  showSpecs: boolean;
  showInclusions: boolean;
  showDescription: boolean;
  showCTAs: boolean;
  primaryCTALabel: string;
  secondaryCTALabel: string;
}

export interface HomeCatalogConfig {
  enabled: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionMicrocopy: string;
  backgroundVariant: 'white' | 'light' | 'dark';
  purchaseCarousel: CarouselBlockConfig;
  rentalCarousel: CarouselBlockConfig;
  cardDisplay: CardDisplayConfig;
  quickView: QuickViewConfig;
}

export interface PublicListing {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceLabel: string;
  operationType: OperationType;
  propertyCategory: PropertyCategory;
  propertyType: string;
  address: string;
  municipality: string;
  sector: string;
  region: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  area: number;
  areaUnit: string;
  yearBuilt?: number;
  photos: string[];
  amenities: PropertyAmenity[];
  inclusions: PropertyInclusion[];
  exclusions: PropertyExclusion[];
  rules: PropertyRule[];
  conditions: PropertyCondition[];
  idealFit: PropertyIdealFit[];
  utilities: PropertyUtility[];
  appliances: PropertyAppliance[];
  restrictions: PropertyRestriction[];
  attributeGroups: ListingAttributeGroup[];
  ctaConfig: ListingCTAConfig;
  formConfig: DynamicInquiryFormConfig;
  featured: boolean;
  status: 'active' | 'pending' | 'sold' | 'rented' | 'draft';
  createdAt: string;
  updatedAt: string;
}
