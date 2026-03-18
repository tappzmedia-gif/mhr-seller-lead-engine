import type { Proposal, ProposalTemplate, ProposalStatus } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockProposals: Proposal[] = [
  { id: 'prop-1', title: 'Oferta de compra - Ana Martínez (Multifamiliar)', status: 'accepted', clientName: 'Ana Martínez', clientId: 'cl-4', leadId: 'LD-1004', totalValue: 185000, createdAt: d(-10), sentAt: d(-9), viewedAt: d(-8), respondedAt: d(-7), expiresAt: d(20), blocks: [{ id: 'b1', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'b2', type: 'intro', title: 'Introducción', content: {}, order: 1 }, { id: 'b3', type: 'pricing', title: 'Oferta', content: {}, order: 2 }, { id: 'b4', type: 'terms', title: 'Términos', content: {}, order: 3 }, { id: 'b5', type: 'signature', title: 'Firma', content: {}, order: 4 }], version: 2, owner: 'María Santos', linkedInvoiceId: 'inv-1', viewCount: 5, lastViewedAt: d(-3) },
  { id: 'prop-2', title: 'Propuesta de compra - Pedro Morales (Casa)', status: 'sent', clientName: 'Pedro Morales', clientId: 'cl-9', leadId: 'LD-1009', totalValue: 275000, createdAt: d(-5), sentAt: d(-4), expiresAt: d(10), blocks: [{ id: 'b6', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'b7', type: 'problem', title: 'Oportunidad', content: {}, order: 1 }, { id: 'b8', type: 'solution', title: 'Nuestra Propuesta', content: {}, order: 2 }, { id: 'b9', type: 'pricing', title: 'Oferta', content: {}, order: 3 }, { id: 'b10', type: 'timeline', title: 'Timeline', content: {}, order: 4 }, { id: 'b11', type: 'terms', title: 'Términos', content: {}, order: 5 }, { id: 'b12', type: 'signature', title: 'Firma', content: {}, order: 6 }], version: 1, owner: 'Juan Delgado', viewCount: 2, lastViewedAt: d(-2) },
  { id: 'prop-3', title: 'Evaluación y oferta - Isabel Torres', status: 'viewed', clientName: 'Isabel Torres', clientId: 'cl-8', leadId: 'LD-1008', totalValue: 120000, createdAt: d(-4), sentAt: d(-3), viewedAt: d(-1), expiresAt: d(11), blocks: [{ id: 'b13', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'b14', type: 'intro', title: 'Introducción', content: {}, order: 1 }, { id: 'b15', type: 'chart', title: 'Análisis de Mercado', content: {}, order: 2 }, { id: 'b16', type: 'pricing', title: 'Oferta', content: {}, order: 3 }, { id: 'b17', type: 'terms', title: 'Términos', content: {}, order: 4 }], version: 1, owner: 'María Santos', viewCount: 3, lastViewedAt: d(-1) },
  { id: 'prop-4', title: 'Oferta cash - Carlos Rivera', status: 'draft', clientName: 'Carlos Rivera', clientId: 'cl-1', leadId: 'LD-1001', totalValue: 95000, createdAt: d(-1), expiresAt: d(14), blocks: [{ id: 'b18', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'b19', type: 'pricing', title: 'Oferta', content: {}, order: 1 }], version: 1, owner: 'María Santos', viewCount: 0 },
  { id: 'prop-5', title: 'Propuesta comercial - Miguel Colón', status: 'rejected', clientName: 'Miguel Colón', clientId: 'cl-11', leadId: 'LD-1011', totalValue: 210000, createdAt: d(-20), sentAt: d(-19), viewedAt: d(-17), respondedAt: d(-14), expiresAt: d(-5), blocks: [{ id: 'b20', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'b21', type: 'pricing', title: 'Oferta', content: {}, order: 1 }, { id: 'b22', type: 'terms', title: 'Términos', content: {}, order: 2 }], version: 1, owner: 'Carlos Reyes', viewCount: 4, lastViewedAt: d(-14) },
  { id: 'prop-6', title: 'Oferta revisada - Luis García', status: 'expired', clientName: 'Luis García', clientId: 'cl-5', leadId: 'LD-1005', totalValue: 65000, createdAt: d(-30), sentAt: d(-29), expiresAt: d(-15), blocks: [{ id: 'b23', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'b24', type: 'pricing', title: 'Oferta', content: {}, order: 1 }], version: 1, owner: 'Carlos Reyes', viewCount: 1, lastViewedAt: d(-25) },
];

const mockTemplates: ProposalTemplate[] = [
  { id: 'pt-1', name: 'Oferta Cash Rápida', description: 'Propuesta simplificada para ofertas cash con cierre rápido.', category: 'Cash Offer', blocks: [{ id: 'tb1', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'tb2', type: 'intro', title: 'Introducción', content: {}, order: 1 }, { id: 'tb3', type: 'pricing', title: 'Oferta', content: {}, order: 2 }, { id: 'tb4', type: 'terms', title: 'Términos', content: {}, order: 3 }, { id: 'tb5', type: 'signature', title: 'Firma', content: {}, order: 4 }], createdAt: d(-60), usageCount: 12 },
  { id: 'pt-2', name: 'Propuesta Premium Completa', description: 'Propuesta detallada con análisis de mercado, comparativos y ROI.', category: 'Full Proposal', blocks: [{ id: 'tb6', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'tb7', type: 'intro', title: 'Introducción', content: {}, order: 1 }, { id: 'tb8', type: 'problem', title: 'Oportunidad', content: {}, order: 2 }, { id: 'tb9', type: 'solution', title: 'Nuestra Propuesta', content: {}, order: 3 }, { id: 'tb10', type: 'chart', title: 'Análisis de Mercado', content: {}, order: 4 }, { id: 'tb11', type: 'pricing', title: 'Oferta (3 opciones)', content: {}, order: 5 }, { id: 'tb12', type: 'timeline', title: 'Timeline', content: {}, order: 6 }, { id: 'tb13', type: 'testimonials', title: 'Testimonios', content: {}, order: 7 }, { id: 'tb14', type: 'terms', title: 'Términos', content: {}, order: 8 }, { id: 'tb15', type: 'signature', title: 'Firma', content: {}, order: 9 }], createdAt: d(-45), usageCount: 8 },
  { id: 'pt-3', name: 'Evaluación de Propiedad', description: 'Reporte de evaluación con comparativos de mercado.', category: 'Evaluation', blocks: [{ id: 'tb16', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'tb17', type: 'scope', title: 'Alcance', content: {}, order: 1 }, { id: 'tb18', type: 'chart', title: 'Comparativos', content: {}, order: 2 }, { id: 'tb19', type: 'gallery', title: 'Fotos', content: {}, order: 3 }, { id: 'tb20', type: 'deliverables', title: 'Entregables', content: {}, order: 4 }], createdAt: d(-30), usageCount: 15 },
  { id: 'pt-4', name: 'Propuesta de Inversión', description: 'Para inversionistas interesados en múltiples propiedades.', category: 'Investment', blocks: [{ id: 'tb21', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'tb22', type: 'problem', title: 'Oportunidad de Mercado', content: {}, order: 1 }, { id: 'tb23', type: 'chart', title: 'ROI Proyectado', content: {}, order: 2 }, { id: 'tb24', type: 'pricing', title: 'Opciones de Inversión', content: {}, order: 3 }, { id: 'tb25', type: 'terms', title: 'Términos', content: {}, order: 4 }], createdAt: d(-20), usageCount: 5 },
  { id: 'pt-5', name: 'Oferta de Herencia', description: 'Propuesta sensible para casos de herencia con múltiples herederos.', category: 'Estate', blocks: [{ id: 'tb26', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'tb27', type: 'intro', title: 'Entendemos su situación', content: {}, order: 1 }, { id: 'tb28', type: 'solution', title: 'Cómo podemos ayudar', content: {}, order: 2 }, { id: 'tb29', type: 'timeline', title: 'Proceso simplificado', content: {}, order: 3 }, { id: 'tb30', type: 'pricing', title: 'Oferta', content: {}, order: 4 }, { id: 'tb31', type: 'terms', title: 'Términos', content: {}, order: 5 }], createdAt: d(-15), usageCount: 7 },
  { id: 'pt-6', name: 'Propuesta de Renovación', description: 'Para propiedades que necesitan reparaciones con desglose de costos.', category: 'Renovation', blocks: [{ id: 'tb32', type: 'cover', title: 'Portada', content: {}, order: 0 }, { id: 'tb33', type: 'scope', title: 'Estado Actual', content: {}, order: 1 }, { id: 'tb34', type: 'deliverables', title: 'Trabajo Requerido', content: {}, order: 2 }, { id: 'tb35', type: 'pricing', title: 'Oferta con Descuento', content: {}, order: 3 }, { id: 'tb36', type: 'chart', title: 'Valor Post-Renovación', content: {}, order: 4 }, { id: 'tb37', type: 'terms', title: 'Términos', content: {}, order: 5 }], createdAt: d(-10), usageCount: 3 },
];

export const proposalsService = {
  async getAll(): Promise<Proposal[]> {
    await delay(300);
    return [...mockProposals];
  },
  async getById(id: string): Promise<Proposal | undefined> {
    await delay(200);
    return mockProposals.find(p => p.id === id);
  },
  async getByStatus(status: ProposalStatus): Promise<Proposal[]> {
    await delay(250);
    return mockProposals.filter(p => p.status === status);
  },
  async create(proposal: Partial<Proposal>): Promise<Proposal> {
    await delay(400);
    const newProposal: Proposal = { id: `prop-${Date.now()}`, title: '', status: 'draft', clientName: '', totalValue: 0, createdAt: new Date().toISOString(), expiresAt: d(14), blocks: [], version: 1, owner: 'María Santos', viewCount: 0, ...proposal } as Proposal;
    mockProposals.push(newProposal);
    return newProposal;
  },
  async update(id: string, data: Partial<Proposal>): Promise<Proposal | undefined> {
    await delay(300);
    const idx = mockProposals.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    mockProposals[idx] = { ...mockProposals[idx], ...data };
    return mockProposals[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockProposals.findIndex(p => p.id === id);
    if (idx === -1) return false;
    mockProposals.splice(idx, 1);
    return true;
  },
  async getTemplates(): Promise<ProposalTemplate[]> {
    await delay(200);
    return [...mockTemplates];
  },
};
