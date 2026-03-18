export interface BrandingSettings {
  systemName: string;
  tagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
  sidebarColor: string;
  fontFamily: string;
}

let brandingSettings: BrandingSettings = {
  systemName: "My House Realty",
  tagline: "Seller Lead Engine™",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#0059B3",
  accentColor: "#0D9488",
  sidebarColor: "#0f172a",
  fontFamily: "Inter",
};

export function getBranding(): BrandingSettings {
  return { ...brandingSettings };
}

export function updateBranding(updates: Partial<BrandingSettings>): BrandingSettings {
  brandingSettings = { ...brandingSettings, ...updates };
  window.dispatchEvent(new CustomEvent("branding-updated"));
  return { ...brandingSettings };
}
