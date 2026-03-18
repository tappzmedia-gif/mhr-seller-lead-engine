export interface ContactSettings {
  phoneMetro: string;
  phoneIsla: string;
  email: string;
  address: string;
  businessHours: string;
  whatsapp: string;
  timezone: string;
  language: string;
  ctaLabel: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

let contactSettings: ContactSettings = {
  phoneMetro: "(787) 555-1000",
  phoneIsla: "(787) 555-2000",
  email: "compras@myhouserealtypr.com",
  address: "Ave. Muñoz Rivera 123, San Juan, PR 00917",
  businessHours: "Lun-Vie 8:00 AM - 6:00 PM",
  whatsapp: "https://wa.me/17875551000",
  timezone: "America/Puerto_Rico",
  language: "es",
  ctaLabel: "Evaluar mi propiedad",
  socialLinks: {
    facebook: "https://facebook.com/myhouserealty",
    instagram: "https://instagram.com/myhouserealty",
    linkedin: "https://linkedin.com/company/myhouserealty",
    youtube: "",
  },
};

export function getContactSettings(): ContactSettings {
  return { ...contactSettings };
}

export function updateContactSettings(updates: Partial<ContactSettings>): ContactSettings {
  contactSettings = { ...contactSettings, ...updates };
  window.dispatchEvent(new CustomEvent("contact-updated"));
  return { ...contactSettings };
}

export function getChatbotKnowledgeStub() {
  return {
    companyName: contactSettings.phoneMetro ? "My House Realty" : "",
    phone: contactSettings.phoneMetro,
    email: contactSettings.email,
    address: contactSettings.address,
    hours: contactSettings.businessHours,
    whatsapp: contactSettings.whatsapp,
    services: ["Compra directa de propiedades", "Evaluaciones gratuitas", "Cierre rápido en cash"],
  };
}
