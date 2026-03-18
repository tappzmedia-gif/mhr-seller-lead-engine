import type { ClientRecord, ClientType } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockClients: ClientRecord[] = [
  { id: 'cl-1', name: 'Carlos Rivera', email: 'carlos.r@email.com', phone: '(787) 555-0123', type: 'lead', municipality: 'Bayamón', region: 'Metro', leadId: 'LD-1001', owner: 'María Santos', createdAt: d(-2), updatedAt: d(-1), totalProposals: 1, totalInvoices: 0, totalMeetings: 1, totalDocuments: 2, outstandingBalance: 0, totalRevenue: 1200, tags: ['urgente', 'deteriorada'], notes: 'Propiedad con filtraciones. Necesita oferta rápida.', timeline: [{ id: 'ct-1', type: 'note', title: 'Lead creado', description: 'Lead capturado via formulario', date: d(-2), author: 'System' }, { id: 'ct-2', type: 'meeting', title: 'Consulta inicial programada', description: 'Zoom call para evaluar situación', date: d(-1), author: 'María Santos', linkedId: 'mtg-1' }], lifecycleStage: 1 },
  { id: 'cl-2', name: 'María López', email: 'm.lopez88@email.com', phone: '(787) 555-0456', type: 'prospect', municipality: 'Ponce', region: 'Sur', leadId: 'LD-1002', owner: 'Juan Delgado', createdAt: d(-15), updatedAt: d(-1), totalProposals: 0, totalInvoices: 0, totalMeetings: 2, totalDocuments: 1, outstandingBalance: 0, totalRevenue: 0, tags: ['herencia', 'seguimiento'], notes: 'Esperando declaratoria de herederos.', timeline: [{ id: 'ct-3', type: 'call', title: 'Llamada inicial', description: 'Hablé con María sobre la herencia.', date: d(-10), author: 'Juan Delgado' }, { id: 'ct-4', type: 'document', title: 'Documento recibido', description: 'Declaratoria de herederos (pendiente)', date: d(-3), author: 'Juan Delgado', linkedId: 'doc-7' }], lifecycleStage: 2 },
  { id: 'cl-4', name: 'Ana Martínez', email: 'ana.mart@email.com', phone: '(787) 555-0321', type: 'client', municipality: 'Carolina', region: 'Metro', leadId: 'LD-1004', owner: 'María Santos', createdAt: d(-30), updatedAt: d(-2), totalProposals: 1, totalInvoices: 1, totalMeetings: 3, totalDocuments: 3, outstandingBalance: 0, totalRevenue: 5000, tags: ['multifamiliar', 'cash_fit', 'urgente'], notes: 'Cliente activa. Mudanza a Orlando pendiente.', timeline: [{ id: 'ct-5', type: 'proposal', title: 'Propuesta aceptada', description: 'Oferta de compra aceptada por $185,000', date: d(-7), author: 'María Santos', linkedId: 'prop-1' }, { id: 'ct-6', type: 'invoice', title: 'Factura pagada', description: 'Depósito de buena fe - $5,000', date: d(-2), author: 'System', linkedId: 'inv-1' }, { id: 'ct-7', type: 'payment', title: 'Pago recibido', description: '$5,000 via Stripe', date: d(-2), author: 'System' }], lifecycleStage: 3 },
  { id: 'cl-5', name: 'Luis García', email: 'lgarcia@email.com', phone: '(787) 555-0654', type: 'prospect', municipality: 'Arecibo', region: 'Norte', leadId: 'LD-1005', owner: 'Carlos Reyes', createdAt: d(-20), updatedAt: d(-5), totalProposals: 1, totalInvoices: 1, totalMeetings: 1, totalDocuments: 1, outstandingBalance: 4000, totalRevenue: 2000, tags: ['CRIM', 'vacía'], notes: 'Debe $8,000 de CRIM.', timeline: [{ id: 'ct-8', type: 'payment', title: 'Pago parcial', description: '$2,000 en efectivo', date: d(-5), author: 'Carlos Reyes' }], lifecycleStage: 2 },
  { id: 'cl-6', name: 'Carmen Díaz', email: 'carmen.fl@email.com', phone: '(407) 555-0987', type: 'prospect', municipality: 'Caguas', region: 'Centro', leadId: 'LD-1006', owner: 'Juan Delgado', createdAt: d(-25), updatedAt: d(-3), totalProposals: 0, totalInvoices: 1, totalMeetings: 1, totalDocuments: 1, outstandingBalance: 8000, totalRevenue: 0, tags: ['fuera_pr', 'inquilino'], notes: 'Vive en FL. Inquilino problemático.', timeline: [{ id: 'ct-9', type: 'invoice', title: 'Factura vencida', description: 'INV-2025-004 - $8,000 overdue', date: d(-5), author: 'System', linkedId: 'inv-4' }], lifecycleStage: 2 },
  { id: 'cl-8', name: 'Isabel Torres', email: 'isa.torres@email.com', phone: '(787) 555-2222', type: 'client', municipality: 'Mayagüez', region: 'Oeste', leadId: 'LD-1008', owner: 'María Santos', createdAt: d(-18), updatedAt: d(-1), totalProposals: 1, totalInvoices: 1, totalMeetings: 2, totalDocuments: 2, outstandingBalance: 0, totalRevenue: 2500, tags: ['deuda', 'urgente', 'foreclosure_risk'], notes: 'Riesgo de ejecución. Caso prioritario.', timeline: [{ id: 'ct-10', type: 'meeting', title: 'Evaluación virtual', description: 'Google Meet - resultado positivo', date: d(-2), author: 'María Santos', linkedId: 'mtg-4' }, { id: 'ct-11', type: 'proposal', title: 'Propuesta enviada', description: 'Oferta por $120,000 - en revisión', date: d(-1), author: 'María Santos', linkedId: 'prop-3' }], lifecycleStage: 3 },
  { id: 'cl-9', name: 'Pedro Morales', email: 'pmorales@email.com', phone: '(939) 555-3333', type: 'client', municipality: 'Guaynabo', region: 'Metro', leadId: 'LD-1009', owner: 'Juan Delgado', createdAt: d(-40), updatedAt: d(-1), totalProposals: 1, totalInvoices: 1, totalMeetings: 2, totalDocuments: 2, outstandingBalance: 15000, totalRevenue: 0, tags: ['alto_valor', 'lista_para_venta'], notes: 'Propiedad custom, negociación avanzada.', timeline: [{ id: 'ct-12', type: 'proposal', title: 'Propuesta enviada', description: 'Oferta por $275,000', date: d(-4), author: 'Juan Delgado', linkedId: 'prop-2' }, { id: 'ct-13', type: 'invoice', title: 'Factura enviada', description: 'INV-2025-002 - $15,000', date: d(-3), author: 'Juan Delgado', linkedId: 'inv-2' }], lifecycleStage: 3 },
  { id: 'cl-10', name: 'Diana Cruz', email: 'dianac@email.com', phone: '(787) 555-4444', type: 'lead', municipality: 'Bayamón', region: 'Metro', leadId: 'LD-1010', owner: 'María Santos', createdAt: d(-20), updatedAt: d(-2), totalProposals: 0, totalInvoices: 0, totalMeetings: 0, totalDocuments: 0, outstandingBalance: 0, totalRevenue: 0, tags: ['herencia', 'apartamento'], notes: '', timeline: [], lifecycleStage: 1 },
  { id: 'cl-11', name: 'Miguel Colón', email: 'mcolon.biz@email.com', phone: '(787) 555-5555', type: 'prospect', municipality: 'Ponce', region: 'Sur', leadId: 'LD-1011', owner: 'Carlos Reyes', createdAt: d(-15), updatedAt: d(-5), totalProposals: 1, totalInvoices: 1, totalMeetings: 0, totalDocuments: 0, outstandingBalance: 3500, totalRevenue: 0, tags: ['comercial', 'centro_pueblo'], notes: 'Local comercial antiguo.', timeline: [{ id: 'ct-14', type: 'proposal', title: 'Propuesta rechazada', description: 'Oferta por $210,000 - rechazada', date: d(-14), author: 'Carlos Reyes', linkedId: 'prop-5' }], lifecycleStage: 2 },
  { id: 'cl-12', name: 'Sofía Vega', email: 'svega@email.com', phone: '(939) 555-6666', type: 'past-client', municipality: 'Trujillo Alto', region: 'Metro', leadId: 'LD-1012', owner: 'Juan Delgado', createdAt: d(-60), updatedAt: d(-30), totalProposals: 0, totalInvoices: 0, totalMeetings: 1, totalDocuments: 0, outstandingBalance: 0, totalRevenue: 750, tags: ['retail_price', 'no_cash_fit'], notes: 'No calificada. Quería precio de mercado.', timeline: [{ id: 'ct-15', type: 'status-change', title: 'No Calificado', description: 'Movida a Not Qualified - no cash fit', date: d(-30), author: 'Juan Delgado' }], lifecycleStage: 4 },
];

export const clientsService = {
  async getAll(): Promise<ClientRecord[]> {
    await delay(300);
    return [...mockClients];
  },
  async getById(id: string): Promise<ClientRecord | undefined> {
    await delay(200);
    return mockClients.find(c => c.id === id);
  },
  async getByType(type: ClientType): Promise<ClientRecord[]> {
    await delay(250);
    return mockClients.filter(c => c.type === type);
  },
  async create(client: Partial<ClientRecord>): Promise<ClientRecord> {
    await delay(400);
    const newClient: ClientRecord = { id: `cl-${Date.now()}`, name: '', email: '', phone: '', type: 'lead', owner: 'María Santos', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), totalProposals: 0, totalInvoices: 0, totalMeetings: 0, totalDocuments: 0, outstandingBalance: 0, totalRevenue: 0, tags: [], notes: '', timeline: [], lifecycleStage: 1, ...client } as ClientRecord;
    mockClients.push(newClient);
    return newClient;
  },
  async update(id: string, data: Partial<ClientRecord>): Promise<ClientRecord | undefined> {
    await delay(300);
    const idx = mockClients.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockClients[idx] = { ...mockClients[idx], ...data };
    return mockClients[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockClients.findIndex(c => c.id === id);
    if (idx === -1) return false;
    mockClients[idx].type = 'past-client';
    return true;
  },
};
