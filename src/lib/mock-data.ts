export type LeadStatus = 'New' | 'Attempted Contact' | 'Contacted' | 'Waiting on Seller' | 'Qualified' | 'Evaluation Pending' | 'Offer Review' | 'Negotiation' | 'Won' | 'Lost' | 'Not Qualified';
export type Priority = 'Urgent' | 'High' | 'Normal' | 'Low';
export type ScoreCategory = 'Hot' | 'High' | 'Medium' | 'Low';

export interface Activity {
  id: string;
  type: 'Note' | 'StatusChange' | 'Call' | 'Email' | 'WhatsApp' | 'System' | 'SiteVisit';
  description: string;
  date: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredContact: string;
  propertyType: string;
  municipality: string;
  sector: string;
  region: string;
  situation: string[];
  condition: string;
  timeline: string;
  estimatedValue: string;
  hasDebt: string;
  isOccupied: string;
  additionalMessage: string;
  status: LeadStatus;
  priority: Priority;
  score: number;
  scoreCategory: ScoreCategory;
  owner: string;
  source: string;
  entryDate: string;
  nextFollowUp: string | null;
  tags: string[];
  activities: Activity[];
}

export const initialLeads: Lead[] = [
  {
    id: "LD-1001",
    name: "Carlos Rivera",
    phone: "(787) 555-0123",
    email: "carlos.r@email.com",
    preferredContact: "WhatsApp",
    propertyType: "Casa",
    municipality: "Bayamón",
    sector: "Santa Rosa",
    region: "Metro",
    situation: ["Deteriorada", "Vender rápido"],
    condition: "Necesita reparaciones",
    timeline: "Urgente",
    estimatedValue: "$100k - $150k",
    hasDebt: "Sí",
    isOccupied: "No",
    additionalMessage: "La casa lleva cerrada 2 años y tiene filtraciones. Necesito salir de ella ya.",
    status: "New",
    priority: "Urgent",
    score: 87,
    scoreCategory: "Hot",
    owner: "María Santos",
    source: "Facebook Ad",
    entryDate: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    nextFollowUp: new Date(Date.now() + 24 * 3600000).toISOString(),
    tags: ["urgente", "deteriorada", "vacía"],
    activities: [
      { id: "A1", type: "System", description: "Lead captured via Formulario Multi-step", date: new Date(Date.now() - 2 * 3600000).toISOString(), author: "System" }
    ]
  },
  {
    id: "LD-1002",
    name: "María López",
    phone: "(787) 555-0456",
    email: "m.lopez88@email.com",
    preferredContact: "Llamada",
    propertyType: "Casa",
    municipality: "Ponce",
    sector: "La Rambla",
    region: "Sur",
    situation: ["Herencia", "Explorando"],
    condition: "Buena",
    timeline: "30-60 días",
    estimatedValue: "$150k - $200k",
    hasDebt: "No",
    isOccupied: "Sí",
    additionalMessage: "Mi madre falleció y mis hermanos y yo queremos vender, pero no sabemos el proceso.",
    status: "Contacted",
    priority: "High",
    score: 72,
    scoreCategory: "High",
    owner: "Juan Delgado",
    source: "Instagram Ad",
    entryDate: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    nextFollowUp: new Date(Date.now() + 48 * 3600000).toISOString(),
    tags: ["herencia", "seguimiento"],
    activities: [
      { id: "A2", type: "Call", description: "Hablé con María. Están reuniendo declaratoria de herederos.", date: new Date(Date.now() - 86400000).toISOString(), author: "Juan Delgado" }
    ]
  },
  {
    id: "LD-1003",
    name: "José Santos",
    phone: "(939) 555-0789",
    email: "jsantos@email.com",
    preferredContact: "Email",
    propertyType: "Apartamento",
    municipality: "San Juan",
    sector: "Hato Rey",
    region: "Metro",
    situation: ["Explorando"],
    condition: "Excelente",
    timeline: "Solo evaluando",
    estimatedValue: "$200k+",
    hasDebt: "Sí",
    isOccupied: "Sí",
    additionalMessage: "",
    status: "New",
    priority: "Normal",
    score: 45,
    scoreCategory: "Medium",
    owner: "Carlos Reyes",
    source: "Website",
    entryDate: new Date(Date.now() - 5 * 3600000).toISOString(),
    nextFollowUp: null,
    tags: ["explorando", "alto_valor"],
    activities: []
  },
  {
    id: "LD-1004",
    name: "Ana Martínez",
    phone: "(787) 555-0321",
    email: "ana.mart@email.com",
    preferredContact: "Llamada",
    propertyType: "Multifamiliar",
    municipality: "Carolina",
    sector: "Valle Arriba",
    region: "Metro",
    situation: ["Vender rápido", "Mudanza"],
    condition: "Regular",
    timeline: "7 días",
    estimatedValue: "$200k+",
    hasDebt: "No",
    isOccupied: "Parcialmente",
    additionalMessage: "Me mudo a Orlando el mes que viene. Son 3 unidades.",
    status: "Qualified",
    priority: "Urgent",
    score: 91,
    scoreCategory: "Hot",
    owner: "María Santos",
    source: "Facebook Ad",
    entryDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 2 * 3600000).toISOString(),
    tags: ["multifamiliar", "cash_fit", "urgente"],
    activities: [
      { id: "A3", type: "Call", description: "Muy motivada. Quiere oferta cash rápida.", date: new Date(Date.now() - 2 * 86400000).toISOString(), author: "María Santos" },
      { id: "A4", type: "StatusChange", description: "Moved to Qualified", date: new Date(Date.now() - 2 * 86400000).toISOString(), author: "María Santos" }
    ]
  },
  {
    id: "LD-1005",
    name: "Luis García",
    phone: "(787) 555-0654",
    email: "lgarcia@email.com",
    preferredContact: "WhatsApp",
    propertyType: "Casa",
    municipality: "Arecibo",
    sector: "Miraflores",
    region: "Norte",
    situation: ["CRIM", "Vacía"],
    condition: "Muy deteriorada",
    timeline: "Este mes",
    estimatedValue: "$50k - $100k",
    hasDebt: "No sé",
    isOccupied: "No",
    additionalMessage: "Debe $8,000 de CRIM y no la voy a pagar.",
    status: "Evaluation Pending",
    priority: "High",
    score: 68,
    scoreCategory: "High",
    owner: "Carlos Reyes",
    source: "Referral",
    entryDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 24 * 3600000).toISOString(),
    tags: ["CRIM", "vacía", "deteriorada"],
    activities: []
  },
  {
    id: "LD-1006",
    name: "Carmen Díaz",
    phone: "(407) 555-0987",
    email: "carmen.fl@email.com",
    preferredContact: "Email",
    propertyType: "Casa",
    municipality: "Caguas",
    sector: "Villa Blanca",
    region: "Centro",
    situation: ["No invertir más"],
    condition: "Regular",
    timeline: "30-60 días",
    estimatedValue: "$150k - $200k",
    hasDebt: "Sí",
    isOccupied: "Sí (Inquilino)",
    additionalMessage: "Vivo en FL hace 5 años y el inquilino me está dando problemas.",
    status: "Contacted",
    priority: "Normal",
    score: 55,
    scoreCategory: "Medium",
    owner: "Juan Delgado",
    source: "Instagram Ad",
    entryDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() - 3600000).toISOString(), // Overdue
    tags: ["fuera_pr", "inquilino"],
    activities: []
  },
  {
    id: "LD-1007",
    name: "Roberto Hernández",
    phone: "(787) 555-1111",
    email: "roberto.h@email.com",
    preferredContact: "Llamada",
    propertyType: "Terreno",
    municipality: "Humacao",
    sector: "Punta Santiago",
    region: "Este",
    situation: ["Explorando"],
    condition: "No aplica",
    timeline: "Solo evaluando",
    estimatedValue: "Menos de $50k",
    hasDebt: "No",
    isOccupied: "No",
    additionalMessage: "Tengo una cuerda que quiero vender si me dan buen precio.",
    status: "New",
    priority: "Low",
    score: 32,
    scoreCategory: "Low",
    owner: "Carlos Reyes",
    source: "Website",
    entryDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextFollowUp: null,
    tags: ["terreno", "baja_prioridad"],
    activities: []
  },
  {
    id: "LD-1008",
    name: "Isabel Torres",
    phone: "(787) 555-2222",
    email: "isa.torres@email.com",
    preferredContact: "WhatsApp",
    propertyType: "Casa",
    municipality: "Mayagüez",
    sector: "Guanajibo",
    region: "Oeste",
    situation: ["Deudas", "Vender rápido"],
    condition: "Buena",
    timeline: "Urgente",
    estimatedValue: "$100k - $150k",
    hasDebt: "Sí",
    isOccupied: "Sí",
    additionalMessage: "El banco me avisó de ejecución la semana pasada.",
    status: "Evaluation Pending",
    priority: "Urgent",
    score: 83,
    scoreCategory: "Hot",
    owner: "María Santos",
    source: "Facebook Ad",
    entryDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 1 * 3600000).toISOString(),
    tags: ["deuda", "urgente", "foreclosure_risk"],
    activities: []
  },
  {
    id: "LD-1009",
    name: "Pedro Morales",
    phone: "(939) 555-3333",
    email: "pmorales@email.com",
    preferredContact: "Llamada",
    propertyType: "Casa",
    municipality: "Guaynabo",
    sector: "Los Filtros",
    region: "Metro",
    situation: ["Mudanza"],
    condition: "Excelente",
    timeline: "Este mes",
    estimatedValue: "$200k+",
    hasDebt: "No",
    isOccupied: "No",
    additionalMessage: "Propiedad custom, busco oferta seria sin intermediarios.",
    status: "Negotiation",
    priority: "High",
    score: 78,
    scoreCategory: "High",
    owner: "Juan Delgado",
    source: "Referral",
    entryDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 24 * 3600000).toISOString(),
    tags: ["alto_valor", "lista_para_venta"],
    activities: []
  },
  {
    id: "LD-1010",
    name: "Diana Cruz",
    phone: "(787) 555-4444",
    email: "dianac@email.com",
    preferredContact: "WhatsApp",
    propertyType: "Apartamento",
    municipality: "Bayamón",
    sector: "Hermanas Dávila",
    region: "Metro",
    situation: ["Herencia"],
    condition: "Regular",
    timeline: "30-60 días",
    estimatedValue: "$50k - $100k",
    hasDebt: "No sé",
    isOccupied: "No",
    additionalMessage: "",
    status: "Waiting on Seller",
    priority: "Normal",
    score: 40,
    scoreCategory: "Medium",
    owner: "María Santos",
    source: "Facebook Ad",
    entryDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() - 48 * 3600000).toISOString(), // Overdue
    tags: ["herencia", "apartamento"],
    activities: []
  },
  {
    id: "LD-1011",
    name: "Miguel Colón",
    phone: "(787) 555-5555",
    email: "mcolon.biz@email.com",
    preferredContact: "Email",
    propertyType: "Comercial",
    municipality: "Ponce",
    sector: "Centro",
    region: "Sur",
    situation: ["Vender rápido", "Vacía"],
    condition: "Necesita reparaciones",
    timeline: "Este mes",
    estimatedValue: "$200k+",
    hasDebt: "Sí",
    isOccupied: "No",
    additionalMessage: "Local comercial antiguo, ideal para almacén.",
    status: "Evaluation Pending",
    priority: "High",
    score: 62,
    scoreCategory: "High",
    owner: "Carlos Reyes",
    source: "Website",
    entryDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 24 * 3600000).toISOString(),
    tags: ["comercial", "centro_pueblo"],
    activities: []
  },
  {
    id: "LD-1012",
    name: "Sofía Vega",
    phone: "(939) 555-6666",
    email: "svega@email.com",
    preferredContact: "WhatsApp",
    propertyType: "Casa",
    municipality: "Trujillo Alto",
    sector: "Carraízo",
    region: "Metro",
    situation: ["Explorando"],
    condition: "Excelente",
    timeline: "Solo evaluando",
    estimatedValue: "$150k - $200k",
    hasDebt: "Sí",
    isOccupied: "Sí",
    additionalMessage: "Quiero vender para comprar más grande, pero necesito vender al precio máximo del mercado.",
    status: "Not Qualified",
    priority: "Low",
    score: 15,
    scoreCategory: "Low",
    owner: "Juan Delgado",
    source: "Instagram Ad",
    entryDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    nextFollowUp: null,
    tags: ["retail_price", "no_cash_fit"],
    activities: []
  }
];

export function scoreCategoryToBadgeVariant(category: ScoreCategory): "hot" | "high" | "medium" | "low" {
  const map: Record<ScoreCategory, "hot" | "high" | "medium" | "low"> = {
    Hot: "hot",
    High: "high",
    Medium: "medium",
    Low: "low",
  };
  return map[category];
}

export function priorityToBadgeVariant(priority: Priority): "destructive" | "high" | "secondary" | "low" {
  const map: Record<Priority, "destructive" | "high" | "secondary" | "low"> = {
    Urgent: "destructive",
    High: "high",
    Normal: "secondary",
    Low: "low",
  };
  return map[priority];
}

export const BRAND = {
  name: "My House Realty",
  tagline: "Seller Lead Engine™",
  phones: {
    metro: "(787) 555-1000",
    isla: "(787) 555-2000"
  },
  email: "compras@myhouserealtypr.com",
  whatsapp: "https://wa.me/17875551000"
};
