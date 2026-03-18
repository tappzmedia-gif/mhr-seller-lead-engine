import { initialLeads, type Lead, type LeadStatus, type Activity } from "@/lib/mock-data";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Agent" | "Viewer";
  avatar: string;
  phone: string;
  assignedLeads: number;
  closedDeals: number;
  joinDate: string;
}

export interface Evaluation {
  id: string;
  leadId: string;
  leadName: string;
  propertyType: string;
  municipality: string;
  status: "Pending" | "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  scheduledDate: string | null;
  completedDate: string | null;
  estimatedValue: string;
  marketValue: string | null;
  condition: string;
  notes: string;
  evaluator: string;
  photos: number;
  photoUrls?: string[];
}

export interface Offer {
  id: string;
  leadId: string;
  leadName: string;
  propertyType: string;
  municipality: string;
  amount: number;
  status: "Draft" | "Sent" | "Under Review" | "Countered" | "Accepted" | "Rejected" | "Expired";
  createdDate: string;
  expiryDate: string;
  counterAmount: number | null;
  notes: string;
  owner: string;
}

export interface Campaign {
  id: string;
  name: string;
  source: string;
  status: "Active" | "Paused" | "Completed" | "Draft";
  startDate: string;
  endDate: string | null;
  budget: number;
  spent: number;
  leadsGenerated: number;
  conversionRate: number;
  cpl: number;
  platform: string;
}

export interface Communication {
  id: string;
  leadId: string;
  leadName: string;
  type: "Email" | "WhatsApp" | "SMS" | "Call";
  direction: "Inbound" | "Outbound";
  subject: string;
  body: string;
  date: string;
  author: string;
  status: "Sent" | "Delivered" | "Read" | "Failed" | "Received";
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: "Email" | "WhatsApp" | "SMS";
  subject: string;
  body: string;
  category: string;
}

export interface Notification {
  id: string;
  type: "new_lead" | "hot_lead" | "overdue" | "reassigned" | "evaluation_done" | "offer_updated" | "campaign_alert" | "system";
  title: string;
  message: string;
  date: string;
  read: boolean;
  entityId: string | null;
  entityType: "lead" | "evaluation" | "offer" | "campaign" | null;
}

export interface ActivityLogEntry {
  id: string;
  type: "lead_created" | "status_change" | "note_added" | "call_logged" | "email_sent" | "whatsapp_sent" | "evaluation_scheduled" | "offer_sent" | "offer_accepted" | "follow_up_completed" | "lead_reassigned" | "campaign_started" | "system";
  description: string;
  date: string;
  user: string;
  entityId: string | null;
  entityType: "lead" | "evaluation" | "offer" | "campaign" | null;
  entityName: string | null;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  lastTriggered: string | null;
  triggerCount: number;
}

export interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  type: "Llamada" | "WhatsApp" | "Email" | "Visita" | "Evaluación";
  scheduledDate: string;
  assignedTo: string;
  notes: string;
  completed: boolean;
  completedDate: string | null;
  priority: "High" | "Normal" | "Low";
}

const now = Date.now();
const hour = 3600000;
const day = 86400000;

export const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "María Santos", email: "maria@myhouserealty.com", role: "Admin", avatar: "MS", phone: "(787) 555-1001", assignedLeads: 18, closedDeals: 12, joinDate: new Date(now - 365 * day).toISOString() },
  { id: "tm-2", name: "Carlos Reyes", email: "carlos@myhouserealty.com", role: "Agent", avatar: "CR", phone: "(787) 555-1002", assignedLeads: 14, closedDeals: 8, joinDate: new Date(now - 200 * day).toISOString() },
  { id: "tm-3", name: "Juan Delgado", email: "juan@myhouserealty.com", role: "Agent", avatar: "JD", phone: "(787) 555-1003", assignedLeads: 12, closedDeals: 6, joinDate: new Date(now - 150 * day).toISOString() },
  { id: "tm-4", name: "Ana Rodríguez", email: "ana@myhouserealty.com", role: "Agent", avatar: "AR", phone: "(787) 555-1004", assignedLeads: 8, closedDeals: 3, joinDate: new Date(now - 60 * day).toISOString() },
  { id: "tm-5", name: "Pedro Ortiz", email: "pedro@myhouserealty.com", role: "Viewer", avatar: "PO", phone: "(787) 555-1005", assignedLeads: 0, closedDeals: 0, joinDate: new Date(now - 30 * day).toISOString() },
];

export const evaluations: Evaluation[] = [
  { id: "EV-001", leadId: "LD-1004", leadName: "Ana Martínez", propertyType: "Multifamiliar", municipality: "Carolina", status: "Completed", scheduledDate: new Date(now - 2 * day).toISOString(), completedDate: new Date(now - 1 * day).toISOString(), estimatedValue: "$200k+", marketValue: "$215,000", condition: "Regular", notes: "3 unidades, buen potencial de renta. Necesita techo nuevo.", evaluator: "Carlos Reyes", photos: 12 },
  { id: "EV-002", leadId: "LD-1005", leadName: "Luis García", propertyType: "Casa", municipality: "Arecibo", status: "Scheduled", scheduledDate: new Date(now + 1 * day).toISOString(), completedDate: null, estimatedValue: "$50k - $100k", marketValue: null, condition: "Muy deteriorada", notes: "Pendiente visita. Deuda de CRIM.", evaluator: "María Santos", photos: 0 },
  { id: "EV-003", leadId: "LD-1008", leadName: "Isabel Torres", propertyType: "Casa", municipality: "Mayagüez", status: "In Progress", scheduledDate: new Date(now - 3 * hour).toISOString(), completedDate: null, estimatedValue: "$100k - $150k", marketValue: null, condition: "Buena", notes: "Evaluación en progreso. Foreclosure risk.", evaluator: "Juan Delgado", photos: 6 },
  { id: "EV-004", leadId: "LD-1011", leadName: "Miguel Colón", propertyType: "Comercial", municipality: "Ponce", status: "Pending", scheduledDate: null, completedDate: null, estimatedValue: "$200k+", marketValue: null, condition: "Necesita reparaciones", notes: "Local comercial antiguo, pendiente coordinar visita.", evaluator: "Carlos Reyes", photos: 0 },
  { id: "EV-005", leadId: "LD-1001", leadName: "Carlos Rivera", propertyType: "Casa", municipality: "Bayamón", status: "Completed", scheduledDate: new Date(now - 5 * day).toISOString(), completedDate: new Date(now - 4 * day).toISOString(), estimatedValue: "$100k - $150k", marketValue: "$95,000", condition: "Necesita reparaciones", notes: "Filtraciones confirmadas. Casa cerrada 2 años.", evaluator: "María Santos", photos: 18 },
  { id: "EV-006", leadId: "LD-1009", leadName: "Pedro Morales", propertyType: "Casa", municipality: "Guaynabo", status: "Completed", scheduledDate: new Date(now - 10 * day).toISOString(), completedDate: new Date(now - 9 * day).toISOString(), estimatedValue: "$200k+", marketValue: "$280,000", condition: "Excelente", notes: "Propiedad custom en excelente estado.", evaluator: "Juan Delgado", photos: 24 },
  { id: "EV-007", leadId: "LD-1002", leadName: "María López", propertyType: "Casa", municipality: "Ponce", status: "Pending", scheduledDate: new Date(now + 3 * day).toISOString(), completedDate: null, estimatedValue: "$150k - $200k", marketValue: null, condition: "Buena", notes: "Herencia. Esperando documentos.", evaluator: "Carlos Reyes", photos: 0 },
  { id: "EV-008", leadId: "LD-1006", leadName: "Carmen Díaz", propertyType: "Casa", municipality: "Caguas", status: "Cancelled", scheduledDate: new Date(now - 7 * day).toISOString(), completedDate: null, estimatedValue: "$150k - $200k", marketValue: null, condition: "Regular", notes: "Seller no disponible. Reprogramar.", evaluator: "María Santos", photos: 0 },
];

export const offers: Offer[] = [
  { id: "OF-001", leadId: "LD-1004", leadName: "Ana Martínez", propertyType: "Multifamiliar", municipality: "Carolina", amount: 185000, status: "Sent", createdDate: new Date(now - 1 * day).toISOString(), expiryDate: new Date(now + 6 * day).toISOString(), counterAmount: null, notes: "Oferta basada en evaluación completada.", owner: "María Santos" },
  { id: "OF-002", leadId: "LD-1009", leadName: "Pedro Morales", propertyType: "Casa", municipality: "Guaynabo", amount: 245000, status: "Countered", createdDate: new Date(now - 8 * day).toISOString(), expiryDate: new Date(now + 2 * day).toISOString(), counterAmount: 260000, notes: "Seller pide $260k. En negociación.", owner: "Juan Delgado" },
  { id: "OF-003", leadId: "LD-1001", leadName: "Carlos Rivera", propertyType: "Casa", municipality: "Bayamón", amount: 78000, status: "Under Review", createdDate: new Date(now - 3 * day).toISOString(), expiryDate: new Date(now + 4 * day).toISOString(), counterAmount: null, notes: "Oferta enviada. Seller muy motivado.", owner: "María Santos" },
  { id: "OF-004", leadId: "LD-1008", leadName: "Isabel Torres", propertyType: "Casa", municipality: "Mayagüez", amount: 110000, status: "Draft", createdDate: new Date(now - 1 * hour).toISOString(), expiryDate: new Date(now + 7 * day).toISOString(), counterAmount: null, notes: "Pendiente aprobación interna antes de enviar.", owner: "Juan Delgado" },
  { id: "OF-005", leadId: "LD-1005", leadName: "Luis García", propertyType: "Casa", municipality: "Arecibo", amount: 55000, status: "Accepted", createdDate: new Date(now - 12 * day).toISOString(), expiryDate: new Date(now - 5 * day).toISOString(), counterAmount: null, notes: "Aceptada. Pendiente cierre.", owner: "Carlos Reyes" },
  { id: "OF-006", leadId: "LD-1010", leadName: "Diana Cruz", propertyType: "Apartamento", municipality: "Bayamón", amount: 62000, status: "Rejected", createdDate: new Date(now - 15 * day).toISOString(), expiryDate: new Date(now - 8 * day).toISOString(), counterAmount: null, notes: "Seller rechazó. Busca precio de mercado.", owner: "María Santos" },
];

export const campaigns: Campaign[] = [
  { id: "CP-001", name: "Facebook — Compramos Tu Casa PR", source: "Facebook Ad", status: "Active", startDate: new Date(now - 30 * day).toISOString(), endDate: null, budget: 3000, spent: 1850, leadsGenerated: 45, conversionRate: 6.7, cpl: 41.11, platform: "Meta Ads" },
  { id: "CP-002", name: "Instagram — Historias Reels PR", source: "Instagram Ad", status: "Active", startDate: new Date(now - 20 * day).toISOString(), endDate: null, budget: 2000, spent: 1200, leadsGenerated: 30, conversionRate: 5.2, cpl: 40.00, platform: "Meta Ads" },
  { id: "CP-003", name: "Google — Vender Casa Puerto Rico", source: "Google Ad", status: "Paused", startDate: new Date(now - 45 * day).toISOString(), endDate: new Date(now - 5 * day).toISOString(), budget: 1500, spent: 1500, leadsGenerated: 12, conversionRate: 3.8, cpl: 125.00, platform: "Google Ads" },
  { id: "CP-004", name: "Referidos — Programa Boca a Boca", source: "Referral", status: "Active", startDate: new Date(now - 90 * day).toISOString(), endDate: null, budget: 500, spent: 200, leadsGenerated: 10, conversionRate: 15.0, cpl: 20.00, platform: "Orgánico" },
  { id: "CP-005", name: "Landing Page — Evaluación Gratis", source: "Website", status: "Active", startDate: new Date(now - 60 * day).toISOString(), endDate: null, budget: 0, spent: 0, leadsGenerated: 15, conversionRate: 8.5, cpl: 0, platform: "Orgánico" },
  { id: "CP-006", name: "FB — Herencias y Sucesiones", source: "Facebook Ad", status: "Draft", startDate: new Date(now + 5 * day).toISOString(), endDate: null, budget: 2500, spent: 0, leadsGenerated: 0, conversionRate: 0, cpl: 0, platform: "Meta Ads" },
];

export const communications: Communication[] = [
  { id: "CM-001", leadId: "LD-1001", leadName: "Carlos Rivera", type: "WhatsApp", direction: "Outbound", subject: "", body: "Hola Carlos, soy María de My House Realty. Recibimos tu solicitud sobre la propiedad en Bayamón. ¿Tienes disponibilidad para hablar hoy?", date: new Date(now - 2 * hour).toISOString(), author: "María Santos", status: "Delivered" },
  { id: "CM-002", leadId: "LD-1001", leadName: "Carlos Rivera", type: "WhatsApp", direction: "Inbound", subject: "", body: "Sí, puedo hablar después de las 3pm.", date: new Date(now - 1 * hour).toISOString(), author: "Carlos Rivera", status: "Received" },
  { id: "CM-003", leadId: "LD-1002", leadName: "María López", type: "Call", direction: "Outbound", subject: "Llamada inicial", body: "Hablé con María. Están reuniendo declaratoria de herederos. Tiene 2 hermanos co-dueños.", date: new Date(now - 1 * day).toISOString(), author: "Juan Delgado", status: "Sent" },
  { id: "CM-004", leadId: "LD-1004", leadName: "Ana Martínez", type: "Email", direction: "Outbound", subject: "Oferta para su propiedad en Carolina", body: "Estimada Ana, adjunto encontrará nuestra oferta formal para la propiedad multifamiliar en Valle Arriba, Carolina...", date: new Date(now - 1 * day).toISOString(), author: "María Santos", status: "Read" },
  { id: "CM-005", leadId: "LD-1009", leadName: "Pedro Morales", type: "Call", direction: "Outbound", subject: "Negociación de precio", body: "Pedro pide $260k. Le expliqué nuestra posición. Quedó en pensarlo y llamar mañana.", date: new Date(now - 2 * day).toISOString(), author: "Juan Delgado", status: "Sent" },
  { id: "CM-006", leadId: "LD-1006", leadName: "Carmen Díaz", type: "Email", direction: "Outbound", subject: "Seguimiento — Propiedad en Caguas", body: "Hola Carmen, le escribo para darle seguimiento. ¿Pudo resolver el tema con el inquilino?", date: new Date(now - 5 * day).toISOString(), author: "Juan Delgado", status: "Delivered" },
  { id: "CM-007", leadId: "LD-1008", leadName: "Isabel Torres", type: "WhatsApp", direction: "Outbound", subject: "", body: "Isabel, queremos confirmar la evaluación de mañana. ¿Sigue disponible a las 10am?", date: new Date(now - 4 * hour).toISOString(), author: "María Santos", status: "Read" },
  { id: "CM-008", leadId: "LD-1005", leadName: "Luis García", type: "Call", direction: "Inbound", subject: "Consulta sobre cierre", body: "Luis llamó preguntando sobre timeline del cierre. Le confirmé que está en proceso.", date: new Date(now - 3 * day).toISOString(), author: "Carlos Reyes", status: "Received" },
];

export const communicationTemplates: CommunicationTemplate[] = [
  { id: "TPL-001", name: "Contacto Inicial", type: "WhatsApp", subject: "", body: "Hola {nombre}, soy {agente} de My House Realty. Recibimos tu solicitud sobre tu propiedad en {municipio}. ¿Tienes un momento para hablar?", category: "Primer Contacto" },
  { id: "TPL-002", name: "Follow-up Post Llamada", type: "Email", subject: "Resumen de nuestra conversación — {nombre}", body: "Estimado/a {nombre},\n\nGracias por tu tiempo hoy. Como conversamos, el siguiente paso es...", category: "Seguimiento" },
  { id: "TPL-003", name: "Recordatorio Evaluación", type: "WhatsApp", subject: "", body: "Hola {nombre}, le recordamos que su evaluación de propiedad está programada para {fecha}. ¿Confirma la cita?", category: "Evaluaciones" },
  { id: "TPL-004", name: "Envío de Oferta", type: "Email", subject: "Oferta para su propiedad en {municipio}", body: "Estimado/a {nombre},\n\nDespués de evaluar su propiedad, nos complace presentarle nuestra oferta formal...", category: "Ofertas" },
  { id: "TPL-005", name: "Reactivación", type: "WhatsApp", subject: "", body: "Hola {nombre}, hace tiempo hablamos sobre su propiedad en {municipio}. ¿Todavía está interesado/a en vender?", category: "Reactivación" },
];

export const notifications: Notification[] = [
  { id: "NT-001", type: "new_lead", title: "Nuevo Lead Capturado", message: "Carlos Rivera envió formulario — Casa en Bayamón, urgente.", date: new Date(now - 2 * hour).toISOString(), read: false, entityId: "LD-1001", entityType: "lead" },
  { id: "NT-002", type: "hot_lead", title: "Lead Hot Detectado", message: "Ana Martínez — Score 91, Multifamiliar en Carolina. Acción inmediata.", date: new Date(now - 3 * hour).toISOString(), read: false, entityId: "LD-1004", entityType: "lead" },
  { id: "NT-003", type: "overdue", title: "Follow-up Vencido", message: "Carmen Díaz tiene un follow-up vencido desde hace 2 días.", date: new Date(now - 1 * hour).toISOString(), read: false, entityId: "LD-1006", entityType: "lead" },
  { id: "NT-004", type: "evaluation_done", title: "Evaluación Completada", message: "La evaluación de Carlos Rivera en Bayamón fue completada. Valor de mercado: $95,000.", date: new Date(now - 4 * day).toISOString(), read: true, entityId: "EV-005", entityType: "evaluation" },
  { id: "NT-005", type: "offer_updated", title: "Contraoferta Recibida", message: "Pedro Morales contraofertó $260,000 por la propiedad en Guaynabo.", date: new Date(now - 2 * day).toISOString(), read: true, entityId: "OF-002", entityType: "offer" },
  { id: "NT-006", type: "campaign_alert", title: "Presupuesto de Campaña al 60%", message: "Facebook — Compramos Tu Casa PR ha consumido el 60% del presupuesto.", date: new Date(now - 1 * day).toISOString(), read: false, entityId: "CP-001", entityType: "campaign" },
  { id: "NT-007", type: "reassigned", title: "Lead Reasignado", message: "José Santos fue reasignado de Carlos Reyes a Ana Rodríguez.", date: new Date(now - 5 * hour).toISOString(), read: false, entityId: "LD-1003", entityType: "lead" },
  { id: "NT-008", type: "new_lead", title: "Nuevo Lead — Instagram", message: "Nuevo lead desde Instagram Ad: propiedad en Humacao.", date: new Date(now - 6 * hour).toISOString(), read: true, entityId: "LD-1007", entityType: "lead" },
  { id: "NT-009", type: "hot_lead", title: "Lead Hot — Foreclosure", message: "Isabel Torres — Score 83, riesgo de ejecución en Mayagüez.", date: new Date(now - 2 * day).toISOString(), read: true, entityId: "LD-1008", entityType: "lead" },
  { id: "NT-010", type: "system", title: "Backup Completado", message: "El backup semanal de datos fue completado exitosamente.", date: new Date(now - 3 * day).toISOString(), read: true, entityId: null, entityType: null },
  { id: "NT-011", type: "offer_updated", title: "Oferta Aceptada", message: "Luis García aceptó la oferta de $55,000 por la propiedad en Arecibo.", date: new Date(now - 12 * day).toISOString(), read: true, entityId: "OF-005", entityType: "offer" },
  { id: "NT-012", type: "overdue", title: "Follow-up Vencido", message: "Diana Cruz tiene un follow-up vencido desde hace 48 horas.", date: new Date(now - 2 * day).toISOString(), read: true, entityId: "LD-1010", entityType: "lead" },
  { id: "NT-013", type: "new_lead", title: "Nuevo Lead — Referido", message: "Referido recibido: propiedad comercial en Ponce Centro.", date: new Date(now - 7 * day).toISOString(), read: true, entityId: "LD-1011", entityType: "lead" },
  { id: "NT-014", type: "evaluation_done", title: "Evaluación Completada", message: "Evaluación de Pedro Morales en Guaynabo completada. Valor: $280,000.", date: new Date(now - 9 * day).toISOString(), read: true, entityId: "EV-006", entityType: "evaluation" },
  { id: "NT-015", type: "campaign_alert", title: "Campaña Google Pausada", message: "Google — Vender Casa Puerto Rico pausada por presupuesto agotado.", date: new Date(now - 5 * day).toISOString(), read: true, entityId: "CP-003", entityType: "campaign" },
  { id: "NT-016", type: "new_lead", title: "Nuevo Lead Capturado", message: "Formulario recibido: apartamento en San Juan, Hato Rey.", date: new Date(now - 5 * hour).toISOString(), read: false, entityId: "LD-1003", entityType: "lead" },
  { id: "NT-017", type: "hot_lead", title: "Lead Hot — Deuda CRIM", message: "Lead con deuda CRIM significativa requiere atención urgente.", date: new Date(now - 8 * hour).toISOString(), read: false, entityId: "LD-1005", entityType: "lead" },
  { id: "NT-018", type: "system", title: "Actualización del Sistema", message: "Se aplicaron mejoras de rendimiento al pipeline.", date: new Date(now - 4 * day).toISOString(), read: true, entityId: null, entityType: null },
  { id: "NT-019", type: "offer_updated", title: "Oferta Rechazada", message: "Diana Cruz rechazó la oferta de $62,000.", date: new Date(now - 15 * day).toISOString(), read: true, entityId: "OF-006", entityType: "offer" },
  { id: "NT-020", type: "reassigned", title: "Lead Reasignado", message: "Roberto Hernández reasignado a Juan Delgado para seguimiento.", date: new Date(now - 10 * hour).toISOString(), read: true, entityId: "LD-1007", entityType: "lead" },
];

export const activityLog: ActivityLogEntry[] = [
  { id: "AL-001", type: "lead_created", description: "Nuevo lead capturado vía formulario web", date: new Date(now - 2 * hour).toISOString(), user: "System", entityId: "LD-1001", entityType: "lead", entityName: "Carlos Rivera" },
  { id: "AL-002", type: "call_logged", description: "Llamada inicial realizada a María López sobre herencia", date: new Date(now - 1 * day).toISOString(), user: "Juan Delgado", entityId: "LD-1002", entityType: "lead", entityName: "María López" },
  { id: "AL-003", type: "status_change", description: "Estado cambiado de New a Qualified", date: new Date(now - 2 * day).toISOString(), user: "María Santos", entityId: "LD-1004", entityType: "lead", entityName: "Ana Martínez" },
  { id: "AL-004", type: "evaluation_scheduled", description: "Evaluación programada para propiedad en Arecibo", date: new Date(now - 3 * day).toISOString(), user: "María Santos", entityId: "EV-002", entityType: "evaluation", entityName: "Luis García" },
  { id: "AL-005", type: "offer_sent", description: "Oferta de $185,000 enviada para propiedad multifamiliar", date: new Date(now - 1 * day).toISOString(), user: "María Santos", entityId: "OF-001", entityType: "offer", entityName: "Ana Martínez" },
  { id: "AL-006", type: "note_added", description: "Nota: 'Seller muy motivada, quiere oferta cash rápida'", date: new Date(now - 2 * day).toISOString(), user: "María Santos", entityId: "LD-1004", entityType: "lead", entityName: "Ana Martínez" },
  { id: "AL-007", type: "whatsapp_sent", description: "WhatsApp enviado: confirmación de evaluación", date: new Date(now - 4 * hour).toISOString(), user: "María Santos", entityId: "LD-1008", entityType: "lead", entityName: "Isabel Torres" },
  { id: "AL-008", type: "offer_accepted", description: "Oferta de $55,000 aceptada por seller", date: new Date(now - 12 * day).toISOString(), user: "Carlos Reyes", entityId: "OF-005", entityType: "offer", entityName: "Luis García" },
  { id: "AL-009", type: "lead_reassigned", description: "Lead reasignado de Carlos Reyes a Ana Rodríguez", date: new Date(now - 5 * hour).toISOString(), user: "María Santos", entityId: "LD-1003", entityType: "lead", entityName: "José Santos" },
  { id: "AL-010", type: "campaign_started", description: "Campaña 'Facebook — Compramos Tu Casa PR' activada", date: new Date(now - 30 * day).toISOString(), user: "María Santos", entityId: "CP-001", entityType: "campaign", entityName: "Facebook — Compramos Tu Casa PR" },
  { id: "AL-011", type: "email_sent", description: "Email de oferta enviado a Ana Martínez", date: new Date(now - 1 * day).toISOString(), user: "María Santos", entityId: "LD-1004", entityType: "lead", entityName: "Ana Martínez" },
  { id: "AL-012", type: "follow_up_completed", description: "Follow-up completado: llamada a Pedro Morales sobre negociación", date: new Date(now - 2 * day).toISOString(), user: "Juan Delgado", entityId: "LD-1009", entityType: "lead", entityName: "Pedro Morales" },
  { id: "AL-013", type: "status_change", description: "Estado cambiado de Evaluation Pending a Offer Review", date: new Date(now - 3 * day).toISOString(), user: "Carlos Reyes", entityId: "LD-1005", entityType: "lead", entityName: "Luis García" },
  { id: "AL-014", type: "lead_created", description: "Lead capturado vía Instagram Ad", date: new Date(now - 6 * hour).toISOString(), user: "System", entityId: "LD-1007", entityType: "lead", entityName: "Roberto Hernández" },
  { id: "AL-015", type: "call_logged", description: "Llamada de negociación con Pedro Morales. Pide $260k.", date: new Date(now - 2 * day).toISOString(), user: "Juan Delgado", entityId: "LD-1009", entityType: "lead", entityName: "Pedro Morales" },
  { id: "AL-016", type: "system", description: "Backup semanal completado exitosamente", date: new Date(now - 3 * day).toISOString(), user: "System", entityId: null, entityType: null, entityName: null },
  { id: "AL-017", type: "lead_created", description: "Nuevo lead referido — comercial en Ponce", date: new Date(now - 7 * day).toISOString(), user: "System", entityId: "LD-1011", entityType: "lead", entityName: "Miguel Colón" },
  { id: "AL-018", type: "whatsapp_sent", description: "WhatsApp de contacto inicial enviado", date: new Date(now - 2 * hour).toISOString(), user: "María Santos", entityId: "LD-1001", entityType: "lead", entityName: "Carlos Rivera" },
  { id: "AL-019", type: "evaluation_scheduled", description: "Evaluación de Isabel Torres programada", date: new Date(now - 1 * day).toISOString(), user: "Juan Delgado", entityId: "EV-003", entityType: "evaluation", entityName: "Isabel Torres" },
  { id: "AL-020", type: "status_change", description: "Lead marcado como Not Qualified — busca precio retail", date: new Date(now - 25 * day).toISOString(), user: "Juan Delgado", entityId: "LD-1012", entityType: "lead", entityName: "Sofía Vega" },
  { id: "AL-021", type: "lead_created", description: "Nuevo lead vía Facebook Ad — casa en Mayagüez", date: new Date(now - 2 * day).toISOString(), user: "System", entityId: "LD-1008", entityType: "lead", entityName: "Isabel Torres" },
  { id: "AL-022", type: "note_added", description: "Nota: 'Banco avisó de ejecución. Caso urgente.'", date: new Date(now - 2 * day).toISOString(), user: "María Santos", entityId: "LD-1008", entityType: "lead", entityName: "Isabel Torres" },
  { id: "AL-023", type: "call_logged", description: "Llamada inicial a Luis García sobre propiedad en Arecibo", date: new Date(now - 4 * day).toISOString(), user: "Carlos Reyes", entityId: "LD-1005", entityType: "lead", entityName: "Luis García" },
  { id: "AL-024", type: "offer_sent", description: "Oferta de $245,000 enviada a Pedro Morales", date: new Date(now - 8 * day).toISOString(), user: "Juan Delgado", entityId: "OF-002", entityType: "offer", entityName: "Pedro Morales" },
  { id: "AL-025", type: "email_sent", description: "Email de seguimiento enviado a Carmen Díaz", date: new Date(now - 5 * day).toISOString(), user: "Juan Delgado", entityId: "LD-1006", entityType: "lead", entityName: "Carmen Díaz" },
  { id: "AL-026", type: "lead_created", description: "Lead capturado vía formulario web — Guaynabo", date: new Date(now - 15 * day).toISOString(), user: "System", entityId: "LD-1009", entityType: "lead", entityName: "Pedro Morales" },
  { id: "AL-027", type: "status_change", description: "Estado cambiado a Negotiation", date: new Date(now - 7 * day).toISOString(), user: "Juan Delgado", entityId: "LD-1009", entityType: "lead", entityName: "Pedro Morales" },
  { id: "AL-028", type: "lead_created", description: "Nuevo lead: Diana Cruz, apartamento en Bayamón", date: new Date(now - 20 * day).toISOString(), user: "System", entityId: "LD-1010", entityType: "lead", entityName: "Diana Cruz" },
  { id: "AL-029", type: "campaign_started", description: "Campaña Instagram — Historias Reels PR activada", date: new Date(now - 20 * day).toISOString(), user: "María Santos", entityId: "CP-002", entityType: "campaign", entityName: "Instagram — Historias Reels PR" },
  { id: "AL-030", type: "system", description: "Se activó nuevo scoring factor: Propiedad vacía +10pts", date: new Date(now - 14 * day).toISOString(), user: "System", entityId: null, entityType: null, entityName: null },
];

export const automationRules: AutomationRule[] = [
  { id: "AUTO-001", name: "Auto-asignar leads Hot", trigger: "Lead score >= 85", condition: "Status = New", action: "Asignar a María Santos + notificar", enabled: true, lastTriggered: new Date(now - 2 * hour).toISOString(), triggerCount: 23 },
  { id: "AUTO-002", name: "WhatsApp automático — nuevo lead", trigger: "Nuevo lead creado", condition: "Preferred contact = WhatsApp", action: "Enviar template 'Contacto Inicial'", enabled: true, lastTriggered: new Date(now - 3 * hour).toISOString(), triggerCount: 67 },
  { id: "AUTO-003", name: "Alerta follow-up vencido", trigger: "Follow-up vencido > 24h", condition: "Lead status ≠ Won, Lost, Not Qualified", action: "Notificar al owner + escalar a admin", enabled: true, lastTriggered: new Date(now - 1 * hour).toISOString(), triggerCount: 15 },
  { id: "AUTO-004", name: "Marcar lead inactivo", trigger: "Sin actividad por 14 días", condition: "Status ≠ Won, Lost", action: "Cambiar status a Waiting on Seller + crear follow-up", enabled: true, lastTriggered: new Date(now - 2 * day).toISOString(), triggerCount: 8 },
  { id: "AUTO-005", name: "Email de oferta expirada", trigger: "Oferta expirada", condition: "Status = Sent o Under Review", action: "Enviar email de seguimiento + notificar owner", enabled: false, lastTriggered: null, triggerCount: 0 },
  { id: "AUTO-006", name: "Notificar evaluación completada", trigger: "Evaluación status = Completed", condition: "", action: "Notificar admin + crear tarea de oferta", enabled: true, lastTriggered: new Date(now - 1 * day).toISOString(), triggerCount: 6 },
  { id: "AUTO-007", name: "Lead routing por región", trigger: "Nuevo lead creado", condition: "Region = Metro", action: "Asignar round-robin entre agentes Metro", enabled: false, lastTriggered: null, triggerCount: 0 },
  { id: "AUTO-008", name: "Alerta presupuesto campaña", trigger: "Gasto campaña >= 80% presupuesto", condition: "", action: "Notificar admin con resumen de ROI", enabled: true, lastTriggered: new Date(now - 1 * day).toISOString(), triggerCount: 3 },
];

export const followUpTasks: FollowUpTask[] = [
  { id: "FT-001", leadId: "LD-1001", leadName: "Carlos Rivera", type: "Llamada", scheduledDate: new Date(now + 1 * day).toISOString(), assignedTo: "María Santos", notes: "Primera llamada después de contacto WhatsApp", completed: false, completedDate: null, priority: "High" },
  { id: "FT-002", leadId: "LD-1002", leadName: "María López", type: "Email", scheduledDate: new Date(now + 2 * day).toISOString(), assignedTo: "Juan Delgado", notes: "Enviar resumen de proceso de herencia", completed: false, completedDate: null, priority: "Normal" },
  { id: "FT-003", leadId: "LD-1004", leadName: "Ana Martínez", type: "Llamada", scheduledDate: new Date(now + 2 * hour).toISOString(), assignedTo: "María Santos", notes: "Discutir oferta enviada", completed: false, completedDate: null, priority: "High" },
  { id: "FT-004", leadId: "LD-1006", leadName: "Carmen Díaz", type: "WhatsApp", scheduledDate: new Date(now - 1 * hour).toISOString(), assignedTo: "Juan Delgado", notes: "Seguimiento sobre problema con inquilino", completed: false, completedDate: null, priority: "Normal" },
  { id: "FT-005", leadId: "LD-1008", leadName: "Isabel Torres", type: "Evaluación", scheduledDate: new Date(now + 1 * hour).toISOString(), assignedTo: "María Santos", notes: "Confirmar evaluación programada", completed: false, completedDate: null, priority: "High" },
  { id: "FT-006", leadId: "LD-1009", leadName: "Pedro Morales", type: "Llamada", scheduledDate: new Date(now + 1 * day).toISOString(), assignedTo: "Juan Delgado", notes: "Seguimiento contraoferta — espera respuesta", completed: false, completedDate: null, priority: "High" },
  { id: "FT-007", leadId: "LD-1010", leadName: "Diana Cruz", type: "WhatsApp", scheduledDate: new Date(now - 48 * hour).toISOString(), assignedTo: "María Santos", notes: "Recordar documentos de herencia", completed: false, completedDate: null, priority: "Normal" },
  { id: "FT-008", leadId: "LD-1005", leadName: "Luis García", type: "Llamada", scheduledDate: new Date(now + 1 * day).toISOString(), assignedTo: "Carlos Reyes", notes: "Coordinar cierre — oferta aceptada", completed: false, completedDate: null, priority: "High" },
  { id: "FT-009", leadId: "LD-1011", leadName: "Miguel Colón", type: "Visita", scheduledDate: new Date(now + 3 * day).toISOString(), assignedTo: "Carlos Reyes", notes: "Visita a local comercial en Ponce", completed: false, completedDate: null, priority: "Normal" },
  { id: "FT-010", leadId: "LD-1003", leadName: "José Santos", type: "Email", scheduledDate: new Date(now + 4 * day).toISOString(), assignedTo: "Ana Rodríguez", notes: "Enviar info sobre proceso de evaluación", completed: false, completedDate: null, priority: "Low" },
  { id: "FT-011", leadId: "LD-1001", leadName: "Carlos Rivera", type: "Visita", scheduledDate: new Date(now - 3 * day).toISOString(), assignedTo: "María Santos", notes: "Visita a propiedad completada", completed: true, completedDate: new Date(now - 3 * day).toISOString(), priority: "High" },
  { id: "FT-012", leadId: "LD-1009", leadName: "Pedro Morales", type: "Llamada", scheduledDate: new Date(now - 5 * day).toISOString(), assignedTo: "Juan Delgado", notes: "Llamada de negociación inicial completada", completed: true, completedDate: new Date(now - 5 * day).toISOString(), priority: "High" },
];

const additionalLeads: Lead[] = [
  { id: "LD-2001", name: "Fernando Acosta", phone: "(787) 555-7001", email: "facosta@email.com", preferredContact: "Llamada", propertyType: "Casa", municipality: "Caguas", sector: "Bairoa", region: "Este", situation: ["Herencia", "Vender rápido"], condition: "Regular", timeline: "Este mes", estimatedValue: "$100k - $150k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Somos 4 herederos y queremos vender.", status: "Contacted", priority: "High", score: 70, scoreCategory: "High", owner: "Ana Rodríguez", source: "Facebook Ad", entryDate: new Date(now - 4 * day).toISOString(), nextFollowUp: new Date(now + 1 * day).toISOString(), tags: ["herencia", "múltiples_dueños"], activities: [{ id: "X1", type: "Call", description: "Llamada inicial. 4 herederos.", date: new Date(now - 3 * day).toISOString(), author: "Ana Rodríguez" }] },
  { id: "LD-2002", name: "Gabriela Nieves", phone: "(939) 555-7002", email: "gnieves@email.com", preferredContact: "WhatsApp", propertyType: "Apartamento", municipality: "San Juan", sector: "Condado", region: "Metro", situation: ["Mudanza"], condition: "Excelente", timeline: "30-60 días", estimatedValue: "$200k+", hasDebt: "No", isOccupied: "Sí", additionalMessage: "Me mudo a Texas por trabajo.", status: "Qualified", priority: "Normal", score: 58, scoreCategory: "Medium", owner: "Carlos Reyes", source: "Instagram Ad", entryDate: new Date(now - 8 * day).toISOString(), nextFollowUp: new Date(now + 2 * day).toISOString(), tags: ["alto_valor", "relocalización"], activities: [] },
  { id: "LD-2003", name: "Ramón Figueroa", phone: "(787) 555-7003", email: "rfigueroa@email.com", preferredContact: "Llamada", propertyType: "Multifamiliar", municipality: "Río Piedras", sector: "Puerto Nuevo", region: "Metro", situation: ["No invertir más", "Deteriorada"], condition: "Muy deteriorada", timeline: "Urgente", estimatedValue: "$150k - $200k", hasDebt: "Sí", isOccupied: "Parcialmente", additionalMessage: "2 de 4 unidades están vacías. No quiero invertir más.", status: "Evaluation Pending", priority: "Urgent", score: 88, scoreCategory: "Hot", owner: "María Santos", source: "Facebook Ad", entryDate: new Date(now - 6 * day).toISOString(), nextFollowUp: new Date(now + 1 * day).toISOString(), tags: ["multifamiliar", "deteriorada", "urgente"], activities: [{ id: "X2", type: "StatusChange", description: "Moved to Evaluation Pending", date: new Date(now - 4 * day).toISOString(), author: "María Santos" }] },
  { id: "LD-2004", name: "Luz María Ortiz", phone: "(787) 555-7004", email: "lmortiz@email.com", preferredContact: "Email", propertyType: "Casa", municipality: "Guaynabo", sector: "Garden Hills", region: "Metro", situation: ["Explorando"], condition: "Excelente", timeline: "Solo evaluando", estimatedValue: "$200k+", hasDebt: "No", isOccupied: "Sí", additionalMessage: "", status: "Contacted", priority: "Low", score: 22, scoreCategory: "Low", owner: "Juan Delgado", source: "Website", entryDate: new Date(now - 12 * day).toISOString(), nextFollowUp: null, tags: ["alto_valor", "explorando"], activities: [] },
  { id: "LD-2005", name: "Ángel Mercado", phone: "(939) 555-7005", email: "amercado@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Toa Baja", sector: "Levittown", region: "Norte", situation: ["Deudas", "Vender rápido"], condition: "Necesita reparaciones", timeline: "7 días", estimatedValue: "$100k - $150k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Debo $15k de CRIM. Banco me presiona.", status: "New", priority: "Urgent", score: 85, scoreCategory: "Hot", owner: "María Santos", source: "Facebook Ad", entryDate: new Date(now - 1 * day).toISOString(), nextFollowUp: null, tags: ["urgente", "CRIM", "deuda"], activities: [{ id: "X3", type: "System", description: "Lead capturado vía formulario web", date: new Date(now - 1 * day).toISOString(), author: "System" }] },
  { id: "LD-2006", name: "Patricia Collazo", phone: "(787) 555-7006", email: "pcollazo@email.com", preferredContact: "Llamada", propertyType: "Terreno", municipality: "Cabo Rojo", sector: "Boquerón", region: "Oeste", situation: ["Herencia"], condition: "No aplica", timeline: "30-60 días", estimatedValue: "$50k - $100k", hasDebt: "No sé", isOccupied: "No", additionalMessage: "Terreno heredado de mi abuelo.", status: "Waiting on Seller", priority: "Normal", score: 42, scoreCategory: "Medium", owner: "Carlos Reyes", source: "Referral", entryDate: new Date(now - 18 * day).toISOString(), nextFollowUp: new Date(now + 5 * day).toISOString(), tags: ["terreno", "herencia"], activities: [] },
  { id: "LD-2007", name: "Marcos Santiago", phone: "(787) 555-7007", email: "msantiago@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Dorado", sector: "Mameyal", region: "Norte", situation: ["Vender rápido"], condition: "Buena", timeline: "Este mes", estimatedValue: "$150k - $200k", hasDebt: "No", isOccupied: "No", additionalMessage: "Casa en buen estado, quiero vender antes de fin de mes.", status: "Offer Review", priority: "High", score: 73, scoreCategory: "High", owner: "Juan Delgado", source: "Facebook Ad", entryDate: new Date(now - 10 * day).toISOString(), nextFollowUp: new Date(now + 1 * day).toISOString(), tags: ["lista_para_venta", "buen_estado"], activities: [{ id: "X4", type: "StatusChange", description: "Oferta enviada", date: new Date(now - 3 * day).toISOString(), author: "Juan Delgado" }] },
  { id: "LD-2008", name: "Yolanda Ramos", phone: "(939) 555-7008", email: "yramos@email.com", preferredContact: "Email", propertyType: "Apartamento", municipality: "Carolina", sector: "Isla Verde", region: "Metro", situation: ["No invertir más"], condition: "Regular", timeline: "30-60 días", estimatedValue: "$100k - $150k", hasDebt: "Sí", isOccupied: "Sí (Inquilino)", additionalMessage: "El inquilino tiene contrato hasta diciembre.", status: "Contacted", priority: "Normal", score: 50, scoreCategory: "Medium", owner: "Ana Rodríguez", source: "Instagram Ad", entryDate: new Date(now - 14 * day).toISOString(), nextFollowUp: new Date(now + 7 * day).toISOString(), tags: ["inquilino", "contrato_vigente"], activities: [] },
  { id: "LD-2009", name: "Héctor Maldonado", phone: "(787) 555-7009", email: "hmaldonado@email.com", preferredContact: "Llamada", propertyType: "Comercial", municipality: "Mayagüez", sector: "Centro", region: "Oeste", situation: ["Deteriorada", "Vacía"], condition: "Muy deteriorada", timeline: "Urgente", estimatedValue: "$50k - $100k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Negocio cerrado hace 3 años. Propiedad se cae.", status: "New", priority: "High", score: 75, scoreCategory: "High", owner: "Carlos Reyes", source: "Website", entryDate: new Date(now - 2 * day).toISOString(), nextFollowUp: null, tags: ["comercial", "deteriorada", "vacía"], activities: [{ id: "X5", type: "System", description: "Lead capturado vía formulario web", date: new Date(now - 2 * day).toISOString(), author: "System" }] },
  { id: "LD-2010", name: "Nélida Vázquez", phone: "(787) 555-7010", email: "nvazquez@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Fajardo", sector: "Las Croabas", region: "Este", situation: ["Herencia", "Deudas"], condition: "Necesita reparaciones", timeline: "Este mes", estimatedValue: "$100k - $150k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Mi madre falleció y no puedo pagar la hipoteca.", status: "Qualified", priority: "Urgent", score: 82, scoreCategory: "High", owner: "María Santos", source: "Facebook Ad", entryDate: new Date(now - 9 * day).toISOString(), nextFollowUp: new Date(now + 1 * day).toISOString(), tags: ["herencia", "hipoteca", "urgente"], activities: [{ id: "X6", type: "Call", description: "Muy motivada. Necesita resolver hipoteca.", date: new Date(now - 7 * day).toISOString(), author: "María Santos" }] },
  { id: "LD-2011", name: "Ricardo Pérez", phone: "(939) 555-7011", email: "rperez@email.com", preferredContact: "Llamada", propertyType: "Casa", municipality: "Manatí", sector: "Mar Chiquita", region: "Norte", situation: ["Explorando"], condition: "Buena", timeline: "Solo evaluando", estimatedValue: "$150k - $200k", hasDebt: "No", isOccupied: "Sí", additionalMessage: "Solo quiero saber cuánto vale mi casa.", status: "Not Qualified", priority: "Low", score: 18, scoreCategory: "Low", owner: "Juan Delgado", source: "Website", entryDate: new Date(now - 25 * day).toISOString(), nextFollowUp: null, tags: ["retail_price", "explorando"], activities: [] },
  { id: "LD-2012", name: "Evelyn Castro", phone: "(787) 555-7012", email: "ecastro@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Vega Alta", sector: "Cerro Gordo", region: "Norte", situation: ["Mudanza", "Vender rápido"], condition: "Buena", timeline: "7 días", estimatedValue: "$100k - $150k", hasDebt: "No", isOccupied: "No", additionalMessage: "Ya me mudé. La casa está cerrada.", status: "Negotiation", priority: "High", score: 77, scoreCategory: "High", owner: "Carlos Reyes", source: "Instagram Ad", entryDate: new Date(now - 11 * day).toISOString(), nextFollowUp: new Date(now + 1 * day).toISOString(), tags: ["vacía", "mudanza", "negociación"], activities: [{ id: "X7", type: "StatusChange", description: "Moved to Negotiation", date: new Date(now - 4 * day).toISOString(), author: "Carlos Reyes" }] },
  { id: "LD-2013", name: "Jorge Meléndez", phone: "(787) 555-7013", email: "jmelendez@email.com", preferredContact: "Email", propertyType: "Multifamiliar", municipality: "Ponce", sector: "La Playa", region: "Sur", situation: ["No invertir más", "Deteriorada"], condition: "Necesita reparaciones", timeline: "Este mes", estimatedValue: "$100k - $150k", hasDebt: "Sí", isOccupied: "Parcialmente", additionalMessage: "6 unidades, solo 2 generan renta.", status: "Evaluation Pending", priority: "High", score: 67, scoreCategory: "High", owner: "Juan Delgado", source: "Referral", entryDate: new Date(now - 13 * day).toISOString(), nextFollowUp: new Date(now + 2 * day).toISOString(), tags: ["multifamiliar", "parcialmente_ocupada"], activities: [] },
  { id: "LD-2014", name: "Mireya González", phone: "(939) 555-7014", email: "mgonzalez@email.com", preferredContact: "Llamada", propertyType: "Casa", municipality: "Juncos", sector: "Ceiba Norte", region: "Este", situation: ["CRIM", "Vacía"], condition: "Deteriorada", timeline: "Urgente", estimatedValue: "$50k - $100k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Debo $12,000 de CRIM.", status: "New", priority: "Urgent", score: 86, scoreCategory: "Hot", owner: "Ana Rodríguez", source: "Facebook Ad", entryDate: new Date(now - 8 * hour).toISOString(), nextFollowUp: null, tags: ["CRIM", "urgente", "deteriorada"], activities: [{ id: "X8", type: "System", description: "Lead capturado vía formulario web", date: new Date(now - 8 * hour).toISOString(), author: "System" }] },
  { id: "LD-2015", name: "Andrés Rivera", phone: "(787) 555-7015", email: "arivera2@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Adjuntas", sector: "Centro", region: "Centro", situation: ["Herencia"], condition: "Regular", timeline: "30-60 días", estimatedValue: "Menos de $50k", hasDebt: "No", isOccupied: "No", additionalMessage: "Casa en el campo de mi padre.", status: "Contacted", priority: "Normal", score: 48, scoreCategory: "Medium", owner: "Carlos Reyes", source: "Referral", entryDate: new Date(now - 16 * day).toISOString(), nextFollowUp: new Date(now + 3 * day).toISOString(), tags: ["campo", "herencia", "bajo_valor"], activities: [] },
  { id: "LD-2016", name: "Sandra Vélez", phone: "(787) 555-7016", email: "svelez@email.com", preferredContact: "Llamada", propertyType: "Apartamento", municipality: "Cataño", sector: "Centro", region: "Metro", situation: ["Vender rápido", "Deudas"], condition: "Regular", timeline: "7 días", estimatedValue: "$50k - $100k", hasDebt: "Sí", isOccupied: "Sí", additionalMessage: "Necesito dinero para pagar deudas médicas.", status: "Qualified", priority: "Urgent", score: 84, scoreCategory: "High", owner: "María Santos", source: "Facebook Ad", entryDate: new Date(now - 5 * day).toISOString(), nextFollowUp: new Date(now + 4 * hour).toISOString(), tags: ["deuda", "urgente", "médico"], activities: [{ id: "X9", type: "Call", description: "Habló con Sandra. Situación médica urgente.", date: new Date(now - 4 * day).toISOString(), author: "María Santos" }] },
  { id: "LD-2017", name: "Luis Enrique Torres", phone: "(939) 555-7017", email: "letorres@email.com", preferredContact: "Email", propertyType: "Terreno", municipality: "Rincón", sector: "Barrio Pueblo", region: "Oeste", situation: ["Explorando"], condition: "No aplica", timeline: "Solo evaluando", estimatedValue: "$100k - $150k", hasDebt: "No", isOccupied: "No", additionalMessage: "Terreno con vista al mar, quiero evaluar opciones.", status: "Contacted", priority: "Low", score: 28, scoreCategory: "Low", owner: "Juan Delgado", source: "Website", entryDate: new Date(now - 22 * day).toISOString(), nextFollowUp: null, tags: ["terreno", "vista_mar", "explorando"], activities: [] },
  { id: "LD-2018", name: "Carmen Rosa Díaz", phone: "(787) 555-7018", email: "crdiaz@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Coamo", sector: "Los Baños", region: "Sur", situation: ["Herencia", "Deteriorada"], condition: "Muy deteriorada", timeline: "Este mes", estimatedValue: "Menos de $50k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Casa antigua de los abuelos, nadie la usa.", status: "New", priority: "High", score: 72, scoreCategory: "High", owner: "Ana Rodríguez", source: "Instagram Ad", entryDate: new Date(now - 3 * day).toISOString(), nextFollowUp: null, tags: ["herencia", "deteriorada", "vacía"], activities: [{ id: "X10", type: "System", description: "Lead capturado vía Instagram Ad", date: new Date(now - 3 * day).toISOString(), author: "System" }] },
  { id: "LD-2019", name: "Wilfredo Santiago", phone: "(787) 555-7019", email: "wsantiago@email.com", preferredContact: "Llamada", propertyType: "Casa", municipality: "Yauco", sector: "Centro", region: "Sur", situation: ["No invertir más"], condition: "Necesita reparaciones", timeline: "30-60 días", estimatedValue: "$50k - $100k", hasDebt: "No", isOccupied: "Sí", additionalMessage: "Ya no quiero ser landlord.", status: "Contacted", priority: "Normal", score: 55, scoreCategory: "Medium", owner: "Carlos Reyes", source: "Referral", entryDate: new Date(now - 19 * day).toISOString(), nextFollowUp: new Date(now + 4 * day).toISOString(), tags: ["landlord_cansado"], activities: [] },
  { id: "LD-2020", name: "Mariana Ríos", phone: "(939) 555-7020", email: "mrios@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Trujillo Alto", sector: "St. Just", region: "Metro", situation: ["Divorcio"], condition: "Buena", timeline: "Este mes", estimatedValue: "$150k - $200k", hasDebt: "Sí", isOccupied: "Sí", additionalMessage: "En proceso de divorcio, ambos queremos vender.", status: "Qualified", priority: "High", score: 74, scoreCategory: "High", owner: "María Santos", source: "Facebook Ad", entryDate: new Date(now - 7 * day).toISOString(), nextFollowUp: new Date(now + 1 * day).toISOString(), tags: ["divorcio", "ambos_de_acuerdo"], activities: [{ id: "X11", type: "Call", description: "Ambas partes de acuerdo en vender.", date: new Date(now - 5 * day).toISOString(), author: "María Santos" }] },
  { id: "LD-2021", name: "Juan Carlos Méndez", phone: "(787) 555-7021", email: "jcmendez@email.com", preferredContact: "Llamada", propertyType: "Comercial", municipality: "Aguadilla", sector: "Ramey", region: "Oeste", situation: ["Vacía", "Vender rápido"], condition: "Regular", timeline: "Urgente", estimatedValue: "$100k - $150k", hasDebt: "No sé", isOccupied: "No", additionalMessage: "Local en zona turística, cerró con COVID.", status: "New", priority: "High", score: 69, scoreCategory: "High", owner: "Juan Delgado", source: "Website", entryDate: new Date(now - 1 * day).toISOString(), nextFollowUp: null, tags: ["comercial", "turístico", "vacía"], activities: [{ id: "X12", type: "System", description: "Lead capturado vía formulario web", date: new Date(now - 1 * day).toISOString(), author: "System" }] },
  { id: "LD-2022", name: "Teresa Pagán", phone: "(787) 555-7022", email: "tpagan@email.com", preferredContact: "Email", propertyType: "Casa", municipality: "Las Piedras", sector: "Centro", region: "Este", situation: ["Herencia", "CRIM"], condition: "Deteriorada", timeline: "Este mes", estimatedValue: "$50k - $100k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "4 hermanos, todos quieren vender.", status: "Evaluation Pending", priority: "High", score: 71, scoreCategory: "High", owner: "Ana Rodríguez", source: "Facebook Ad", entryDate: new Date(now - 11 * day).toISOString(), nextFollowUp: new Date(now + 2 * day).toISOString(), tags: ["herencia", "CRIM", "múltiples_dueños"], activities: [] },
  { id: "LD-2023", name: "Raúl Cintrón", phone: "(939) 555-7023", email: "rcintrón@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Vega Baja", sector: "Cerro Gordo", region: "Norte", situation: ["Mudanza"], condition: "Buena", timeline: "30-60 días", estimatedValue: "$100k - $150k", hasDebt: "No", isOccupied: "Sí", additionalMessage: "Me mudo a Orlando en mayo.", status: "Contacted", priority: "Normal", score: 52, scoreCategory: "Medium", owner: "Carlos Reyes", source: "Instagram Ad", entryDate: new Date(now - 17 * day).toISOString(), nextFollowUp: new Date(now + 5 * day).toISOString(), tags: ["mudanza", "florida"], activities: [] },
  { id: "LD-2024", name: "Norma Soto", phone: "(787) 555-7024", email: "nsoto@email.com", preferredContact: "Llamada", propertyType: "Multifamiliar", municipality: "San Juan", sector: "Santurce", region: "Metro", situation: ["No invertir más", "Deudas"], condition: "Necesita reparaciones", timeline: "Urgente", estimatedValue: "$200k+", hasDebt: "Sí", isOccupied: "Parcialmente", additionalMessage: "8 unidades, debe $25k CRIM. Solo 3 pagan renta.", status: "Qualified", priority: "Urgent", score: 90, scoreCategory: "Hot", owner: "María Santos", source: "Referral", entryDate: new Date(now - 4 * day).toISOString(), nextFollowUp: new Date(now + 6 * hour).toISOString(), tags: ["multifamiliar", "CRIM", "urgente", "alto_valor"], activities: [{ id: "X13", type: "Call", description: "Caso complejo. Deuda CRIM significativa.", date: new Date(now - 3 * day).toISOString(), author: "María Santos" }] },
  { id: "LD-2025", name: "David Rosado", phone: "(787) 555-7025", email: "drosado@email.com", preferredContact: "WhatsApp", propertyType: "Casa", municipality: "Hormigueros", sector: "Centro", region: "Oeste", situation: ["Explorando"], condition: "Excelente", timeline: "Solo evaluando", estimatedValue: "$100k - $150k", hasDebt: "No", isOccupied: "Sí", additionalMessage: "", status: "Not Qualified", priority: "Low", score: 12, scoreCategory: "Low", owner: "Juan Delgado", source: "Website", entryDate: new Date(now - 35 * day).toISOString(), nextFollowUp: null, tags: ["retail_price", "no_cash_fit"], activities: [] },
  { id: "LD-2026", name: "Gladys Fontánez", phone: "(939) 555-7026", email: "gfontanez@email.com", preferredContact: "Email", propertyType: "Casa", municipality: "Barceloneta", sector: "Costa de Oro", region: "Norte", situation: ["Herencia", "Vacía"], condition: "Regular", timeline: "Este mes", estimatedValue: "$50k - $100k", hasDebt: "No sé", isOccupied: "No", additionalMessage: "Casa de playa de mis padres.", status: "Contacted", priority: "Normal", score: 56, scoreCategory: "Medium", owner: "Ana Rodríguez", source: "Facebook Ad", entryDate: new Date(now - 6 * day).toISOString(), nextFollowUp: new Date(now + 3 * day).toISOString(), tags: ["playa", "herencia", "vacía"], activities: [] },
  { id: "LD-2027", name: "Axel Morales", phone: "(787) 555-7027", email: "amorales@email.com", preferredContact: "Llamada", propertyType: "Casa", municipality: "Juana Díaz", sector: "Centro", region: "Sur", situation: ["Vender rápido", "Deudas"], condition: "Necesita reparaciones", timeline: "7 días", estimatedValue: "$50k - $100k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Necesito dinero para cirugía.", status: "New", priority: "Urgent", score: 83, scoreCategory: "High", owner: "Carlos Reyes", source: "Facebook Ad", entryDate: new Date(now - 12 * hour).toISOString(), nextFollowUp: null, tags: ["urgente", "médico", "deuda"], activities: [{ id: "X14", type: "System", description: "Lead capturado vía formulario web", date: new Date(now - 12 * hour).toISOString(), author: "System" }] },
  { id: "LD-2028", name: "Iris Meléndez", phone: "(787) 555-7028", email: "imelendez@email.com", preferredContact: "WhatsApp", propertyType: "Apartamento", municipality: "Guaynabo", sector: "Downtown", region: "Metro", situation: ["Divorcio"], condition: "Excelente", timeline: "Este mes", estimatedValue: "$200k+", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Divorcio finalizado. Necesito liquidar.", status: "Won", priority: "High", score: 79, scoreCategory: "High", owner: "María Santos", source: "Referral", entryDate: new Date(now - 45 * day).toISOString(), nextFollowUp: null, tags: ["divorcio", "alto_valor", "cerrado"], activities: [{ id: "X15", type: "StatusChange", description: "Deal cerrado exitosamente", date: new Date(now - 10 * day).toISOString(), author: "María Santos" }] },
  { id: "LD-2029", name: "Luis Pacheco", phone: "(939) 555-7029", email: "lpacheco@email.com", preferredContact: "Llamada", propertyType: "Casa", municipality: "Naguabo", sector: "Playa Húcares", region: "Este", situation: ["Vacía", "Deteriorada"], condition: "Muy deteriorada", timeline: "Este mes", estimatedValue: "Menos de $50k", hasDebt: "Sí", isOccupied: "No", additionalMessage: "Se dañó con María. No la arreglé.", status: "Won", priority: "Normal", score: 65, scoreCategory: "High", owner: "Carlos Reyes", source: "Facebook Ad", entryDate: new Date(now - 60 * day).toISOString(), nextFollowUp: null, tags: ["huracán", "cerrado"], activities: [{ id: "X16", type: "StatusChange", description: "Deal cerrado", date: new Date(now - 20 * day).toISOString(), author: "Carlos Reyes" }] },
  { id: "LD-2030", name: "Elena Cordero", phone: "(787) 555-7030", email: "ecordero@email.com", preferredContact: "Email", propertyType: "Casa", municipality: "Lajas", sector: "Centro", region: "Oeste", situation: ["Herencia"], condition: "Regular", timeline: "30-60 días", estimatedValue: "$50k - $100k", hasDebt: "No", isOccupied: "No", additionalMessage: "Propiedad heredada, quiero vender.", status: "Lost", priority: "Normal", score: 45, scoreCategory: "Medium", owner: "Juan Delgado", source: "Referral", entryDate: new Date(now - 40 * day).toISOString(), nextFollowUp: null, tags: ["herencia", "perdido"], activities: [{ id: "X17", type: "StatusChange", description: "Vendió a otro comprador", date: new Date(now - 15 * day).toISOString(), author: "Juan Delgado" }] },
];

export let leadsStore: Lead[] = [...initialLeads, ...additionalLeads];

export function getLeads(): Lead[] {
  return [...leadsStore].sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
}

export function getLeadById(id: string): Lead | undefined {
  return leadsStore.find(l => l.id === id);
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  let updated: Lead | null = null;
  leadsStore = leadsStore.map(l => {
    if (l.id === id) {
      updated = { ...l, ...updates };
      return updated;
    }
    return l;
  });
  return updated;
}

export function addLead(lead: Lead): void {
  leadsStore = [lead, ...leadsStore];
}

export function addActivityToLead(leadId: string, activity: Activity): void {
  leadsStore = leadsStore.map(l => {
    if (l.id === leadId) {
      return { ...l, activities: [activity, ...l.activities] };
    }
    return l;
  });
}
