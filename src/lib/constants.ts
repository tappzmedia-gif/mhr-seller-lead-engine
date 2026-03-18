export const REGIONS = ["Metro", "Norte", "Sur", "Este", "Oeste", "Centro"] as const;
export type Region = (typeof REGIONS)[number];

export const MUNICIPALITIES: Record<Region, string[]> = {
  Metro: ["San Juan", "Bayamón", "Carolina", "Guaynabo", "Cataño", "Trujillo Alto", "Canóvanas"],
  Norte: ["Arecibo", "Manatí", "Vega Baja", "Vega Alta", "Barceloneta", "Dorado", "Toa Baja", "Toa Alta"],
  Sur: ["Ponce", "Juana Díaz", "Peñuelas", "Guayanilla", "Yauco", "Coamo", "Santa Isabel"],
  Este: ["Humacao", "Caguas", "Juncos", "Las Piedras", "Naguabo", "Fajardo", "Luquillo", "Ceiba"],
  Oeste: ["Mayagüez", "Aguadilla", "Cabo Rojo", "San Germán", "Hormigueros", "Lajas", "Rincón"],
  Centro: ["Utuado", "Jayuya", "Lares", "Adjuntas", "Ciales", "Barranquitas", "Orocovis"],
};

export const PROPERTY_TYPES = ["Casa", "Apartamento", "Multifamiliar", "Terreno", "Comercial"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_CONDITIONS = ["Excelente", "Buena", "Regular", "Necesita reparaciones", "Deteriorada", "Muy deteriorada"] as const;
export type PropertyCondition = (typeof PROPERTY_CONDITIONS)[number];

export const SELLER_MOTIVATIONS = [
  "Herencia",
  "Divorcio",
  "Relocalización",
  "Problemas financieros",
  "Deudas",
  "Deteriorada",
  "Vender rápido",
  "Propiedad vacía",
  "Inversión",
  "Retiro",
  "Explorando opciones",
] as const;
export type SellerMotivation = (typeof SELLER_MOTIVATIONS)[number];

export const URGENCY_OPTIONS = ["Urgente", "7 días", "Este mes", "30-60 días", "Solo evaluando"] as const;
export type Urgency = (typeof URGENCY_OPTIONS)[number];

export const LEAD_STATUSES = [
  "New",
  "Attempted Contact",
  "Contacted",
  "Waiting on Seller",
  "Qualified",
  "Evaluation Pending",
  "Offer Review",
  "Negotiation",
  "Won",
  "Lost",
  "Not Qualified",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PIPELINE_STATUSES = ["New", "Contacted", "Qualified", "Evaluation Pending", "Offer Review", "Negotiation", "Won", "Lost"] as const;

export const PRIORITIES = ["Urgent", "High", "Normal", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const SCORE_CATEGORIES = ["Hot", "High", "Medium", "Low"] as const;
export type ScoreCategory = (typeof SCORE_CATEGORIES)[number];

export const LEAD_SOURCES = ["Facebook Ad", "Instagram Ad", "Website", "Referral", "Llamada Directa", "Landing Externa", "Google Ad", "Meta Lead Ad"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const DEFAULT_TAGS = ["urgente", "deteriorada", "vacía", "herencia", "deuda", "hot-lead", "no-contesta", "seguimiento", "evaluada", "oferta-enviada"] as const;

export const PREFERRED_CONTACTS = ["Llamada", "WhatsApp", "Email", "Texto"] as const;
export type PreferredContact = (typeof PREFERRED_CONTACTS)[number];

export const ESTIMATED_VALUES = ["Menos de $50k", "$50k - $100k", "$100k - $150k", "$150k - $200k", "$200k+", "No sé"] as const;

export const DEBT_OPTIONS = ["Sí", "No", "No sé"] as const;

export const OCCUPANCY_OPTIONS = ["Sí", "No"] as const;

export interface SellerProfile {
  name: string;
  phone: string;
  email: string;
  preferredContact: PreferredContact;
}

export interface Property {
  type: PropertyType;
  municipality: string;
  sector: string;
  region: Region;
  condition: PropertyCondition;
  estimatedValue: string;
  hasDebt: string;
  isOccupied: string;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  date: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  type: "Llamada" | "WhatsApp" | "Email" | "Visita" | "Evaluación";
  scheduledDate: string;
  assignedTo: string;
  notes: string;
  completed: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Agent" | "Viewer";
  avatar: string;
}

export interface Score {
  value: number;
  category: ScoreCategory;
  factors: { factor: string; points: number }[];
}

export const AGENTS: Agent[] = [
  { id: "agent-1", name: "María Santos", email: "maria@myhouserealty.com", role: "Admin", avatar: "MS" },
  { id: "agent-2", name: "Carlos Reyes", email: "carlos@myhouserealty.com", role: "Agent", avatar: "CR" },
  { id: "agent-3", name: "Juan Delgado", email: "juan@myhouserealty.com", role: "Agent", avatar: "JD" },
];

export const SCORING_FACTORS = [
  { factor: "Timeline = Urgente", points: 30 },
  { factor: "Condición deteriorada/muy deteriorada", points: 15 },
  { factor: "Situación: Herencia o Deudas", points: 15 },
  { factor: "Propiedad vacía", points: 10 },
  { factor: "Deuda/Hipoteca confirmada", points: 10 },
  { factor: "Timeline = Solo evaluando", points: -30 },
  { factor: "Condición excelente/buena", points: -10 },
] as const;
