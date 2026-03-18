import type { PublicListing, PropertyAmenity, PropertyInclusion, PropertyExclusion, PropertyRule, PropertyCondition, PropertyIdealFit, CTAKey, InquiryFormType, ListingCTAConfig, HomeCatalogConfig } from '@/lib/listing-types';
import { publicListings as seedListings } from '@/lib/listing-data';

let listingsSnapshot: PublicListing[] = seedListings.map(l => ({ ...l }));

const DEFAULT_HOME_CATALOG_CONFIG: HomeCatalogConfig = {
  enabled: true,
  sectionTitle: 'Propiedades Disponibles',
  sectionSubtitle: 'Explore nuestra selección de propiedades en Puerto Rico',
  sectionMicrocopy: 'Propiedades verificadas y listas para usted',
  backgroundVariant: 'light',
  purchaseCarousel: {
    visible: true,
    title: 'Propiedades en Venta',
    subtitle: 'Encuentre su próximo hogar o inversión',
    ctaLabel: 'Ver todas las propiedades en venta',
    ctaDestination: '/catalogo',
    maxCards: 8,
    sourceLogic: 'all',
    style: 'default',
    quickViewEnabled: true,
  },
  rentalCarousel: {
    visible: true,
    title: 'Propiedades en Alquiler',
    subtitle: 'Apartamentos, casas y locales disponibles',
    ctaLabel: 'Ver todos los alquileres',
    ctaDestination: '/catalogo',
    maxCards: 8,
    sourceLogic: 'all',
    style: 'default',
    quickViewEnabled: true,
  },
  cardDisplay: {
    showImage: true,
    showPrice: true,
    showLocation: true,
    showPropertyType: true,
    showStats: true,
    showBadges: true,
    showHighlights: true,
    showQuickViewCTA: true,
  },
  quickView: {
    enabled: true,
    showGallery: true,
    showSpecs: true,
    showInclusions: true,
    showDescription: true,
    showCTAs: true,
    primaryCTALabel: 'Ver propiedad completa',
    secondaryCTALabel: 'Solicitar información',
  },
};

let homeCatalogConfigSnapshot: HomeCatalogConfig = { ...DEFAULT_HOME_CATALOG_CONFIG };

export function getPublicListings(): PublicListing[] {
  return listingsSnapshot;
}

export function getPublicListingById(id: string): PublicListing | undefined {
  return listingsSnapshot.find(l => l.id === id || l.slug === id);
}

function replaceInSnapshot(listingId: string, updater: (listing: PublicListing) => PublicListing): void {
  listingsSnapshot = listingsSnapshot.map(l =>
    l.id === listingId ? updater({ ...l }) : l
  );
  window.dispatchEvent(new CustomEvent('listings-updated'));
}

export function updateListingAmenities(listingId: string, amenities: PropertyAmenity[]): void {
  replaceInSnapshot(listingId, l => ({
    ...l,
    amenities: [...amenities],
    updatedAt: new Date().toISOString(),
  }));
}

export function updateListingInclusions(listingId: string, inclusions: PropertyInclusion[], exclusions: PropertyExclusion[]): void {
  replaceInSnapshot(listingId, l => ({
    ...l,
    inclusions: [...inclusions],
    exclusions: [...exclusions],
    updatedAt: new Date().toISOString(),
  }));
}

export function updateListingRules(listingId: string, rules: PropertyRule[], conditions: PropertyCondition[]): void {
  replaceInSnapshot(listingId, l => ({
    ...l,
    rules: [...rules],
    conditions: [...conditions],
    updatedAt: new Date().toISOString(),
  }));
}

export function updateListingIdealFit(listingId: string, idealFit: PropertyIdealFit[]): void {
  replaceInSnapshot(listingId, l => ({
    ...l,
    idealFit: [...idealFit],
    updatedAt: new Date().toISOString(),
  }));
}

export function updateListingCTAConfig(listingId: string, ctaConfig: ListingCTAConfig): void {
  replaceInSnapshot(listingId, l => ({
    ...l,
    ctaConfig: { ...ctaConfig },
    updatedAt: new Date().toISOString(),
  }));
}

export function getHomeCatalogConfig(): HomeCatalogConfig {
  return homeCatalogConfigSnapshot;
}

export function updateHomeCatalogConfig(config: Partial<HomeCatalogConfig>): void {
  homeCatalogConfigSnapshot = { ...homeCatalogConfigSnapshot, ...config };
  window.dispatchEvent(new CustomEvent('home-catalog-config-updated'));
}

export function addPublicListing(listing: PublicListing): void {
  listingsSnapshot = [listing, ...listingsSnapshot];
  window.dispatchEvent(new CustomEvent('listings-updated'));
}

export function updatePublicListing(listingId: string, updates: Partial<PublicListing>): void {
  replaceInSnapshot(listingId, l => ({
    ...l,
    ...updates,
    updatedAt: new Date().toISOString(),
  }));
}

export function getListingsByOperation(operationType: 'sale' | 'rental'): PublicListing[] {
  return listingsSnapshot.filter(l => l.status === 'active' && l.operationType === operationType);
}

export function getFeaturedListings(): PublicListing[] {
  return listingsSnapshot.filter(l => l.status === 'active' && l.featured);
}
