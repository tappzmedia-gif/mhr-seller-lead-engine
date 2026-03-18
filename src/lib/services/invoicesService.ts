import type { Invoice, Receipt, InvoiceStatus } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockInvoices: Invoice[] = [
  { id: 'inv-1', number: 'INV-2025-001', status: 'paid', clientName: 'Ana Martínez', clientEmail: 'ana.mart@email.com', clientId: 'cl-4', proposalId: 'prop-1', lineItems: [{ id: 'li-1', description: 'Depósito de buena fe', quantity: 1, unitPrice: 5000, total: 5000 }], subtotal: 5000, taxRate: 0, taxAmount: 0, total: 5000, amountPaid: 5000, balanceDue: 0, issueDate: d(-12), dueDate: d(-5), paidDate: d(-2), memo: 'Depósito inicial para reservar propiedad multifamiliar.', terms: 'Pago al recibir. No reembolsable después de 48 horas.', paymentMethods: ['stripe', 'ach'], owner: 'María Santos', createdAt: d(-12), payments: [{ id: 'ip-1', amount: 5000, method: 'stripe', date: d(-2), reference: 'ch_1abc123' }] },
  { id: 'inv-2', number: 'INV-2025-002', status: 'sent', clientName: 'Pedro Morales', clientEmail: 'pmorales@email.com', clientId: 'cl-9', proposalId: 'prop-2', lineItems: [{ id: 'li-2', description: 'Honorarios de gestión inmobiliaria', quantity: 1, unitPrice: 12000, total: 12000 }, { id: 'li-3', description: 'Tasación profesional', quantity: 1, unitPrice: 3000, total: 3000 }], subtotal: 15000, taxRate: 0, taxAmount: 0, total: 15000, amountPaid: 0, balanceDue: 15000, issueDate: d(-3), dueDate: d(12), terms: 'Net 15. Pago mediante transferencia ACH o tarjeta.', paymentMethods: ['ach', 'stripe'], owner: 'Juan Delgado', createdAt: d(-3), payments: [] },
  { id: 'inv-3', number: 'INV-2025-003', status: 'paid', clientName: 'Isabel Torres', clientEmail: 'isa.torres@email.com', clientId: 'cl-8', lineItems: [{ id: 'li-4', description: 'Evaluación profesional de propiedad', quantity: 1, unitPrice: 2500, total: 2500 }], subtotal: 2500, taxRate: 0, taxAmount: 0, total: 2500, amountPaid: 2500, balanceDue: 0, issueDate: d(-14), dueDate: d(-10), paidDate: d(-7), paymentMethods: ['paypal', 'stripe'], owner: 'María Santos', createdAt: d(-14), payments: [{ id: 'ip-2', amount: 2500, method: 'paypal', date: d(-7), reference: 'PAY-xyz789' }] },
  { id: 'inv-4', number: 'INV-2025-004', status: 'overdue', clientName: 'Carmen Díaz', clientEmail: 'carmen.fl@email.com', clientId: 'cl-6', lineItems: [{ id: 'li-5', description: 'Comisión de gestión de venta', quantity: 1, unitPrice: 8000, total: 8000 }], subtotal: 8000, taxRate: 0, taxAmount: 0, total: 8000, amountPaid: 0, balanceDue: 8000, issueDate: d(-20), dueDate: d(-5), terms: 'Net 15. Cargo por mora después de 5 días.', paymentMethods: ['check', 'ach'], owner: 'Juan Delgado', createdAt: d(-20), payments: [] },
  { id: 'inv-5', number: 'INV-2025-005', status: 'draft', clientName: 'Miguel Colón', clientEmail: 'mcolon.biz@email.com', clientId: 'cl-11', lineItems: [{ id: 'li-6', description: 'Evaluación propiedad comercial', quantity: 1, unitPrice: 3500, total: 3500 }], subtotal: 3500, taxRate: 0, taxAmount: 0, total: 3500, amountPaid: 0, balanceDue: 3500, issueDate: d(-5), dueDate: d(10), paymentMethods: ['stripe'], owner: 'Carlos Reyes', createdAt: d(-5), payments: [] },
  { id: 'inv-6', number: 'INV-2025-006', status: 'partially-paid', clientName: 'Luis García', clientEmail: 'lgarcia@email.com', clientId: 'cl-5', lineItems: [{ id: 'li-7', description: 'Gestión y resolución de deuda CRIM', quantity: 1, unitPrice: 4000, total: 4000 }, { id: 'li-8', description: 'Evaluación de propiedad', quantity: 1, unitPrice: 2000, total: 2000 }], subtotal: 6000, taxRate: 0, taxAmount: 0, total: 6000, amountPaid: 2000, balanceDue: 4000, issueDate: d(-10), dueDate: d(5), paymentMethods: ['cash', 'ach'], owner: 'Carlos Reyes', createdAt: d(-10), payments: [{ id: 'ip-3', amount: 2000, method: 'cash', date: d(-5), reference: 'CASH-001' }] },
];

const mockReceipts: Receipt[] = [
  { id: 'rec-1', invoiceId: 'inv-1', invoiceNumber: 'INV-2025-001', clientName: 'Ana Martínez', amount: 5000, date: d(-2), method: 'stripe', reference: 'ch_1abc123' },
  { id: 'rec-2', invoiceId: 'inv-3', invoiceNumber: 'INV-2025-003', clientName: 'Isabel Torres', amount: 2500, date: d(-7), method: 'paypal', reference: 'PAY-xyz789' },
  { id: 'rec-3', invoiceId: 'inv-6', invoiceNumber: 'INV-2025-006', clientName: 'Luis García', amount: 2000, date: d(-5), method: 'cash', reference: 'CASH-001' },
];

export const invoicesService = {
  async getAll(): Promise<Invoice[]> {
    await delay(300);
    return [...mockInvoices];
  },
  async getById(id: string): Promise<Invoice | undefined> {
    await delay(200);
    return mockInvoices.find(i => i.id === id);
  },
  async getByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    await delay(250);
    return mockInvoices.filter(i => i.status === status);
  },
  async create(invoice: Partial<Invoice>): Promise<Invoice> {
    await delay(400);
    const newInv: Invoice = { id: `inv-${Date.now()}`, number: `INV-2025-${String(mockInvoices.length + 1).padStart(3, '0')}`, status: 'draft', clientName: '', clientEmail: '', lineItems: [], subtotal: 0, taxRate: 0, taxAmount: 0, total: 0, amountPaid: 0, balanceDue: 0, issueDate: new Date().toISOString(), dueDate: d(15), paymentMethods: ['stripe'], owner: 'María Santos', createdAt: new Date().toISOString(), payments: [], ...invoice } as Invoice;
    mockInvoices.push(newInv);
    return newInv;
  },
  async update(id: string, data: Partial<Invoice>): Promise<Invoice | undefined> {
    await delay(300);
    const idx = mockInvoices.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    mockInvoices[idx] = { ...mockInvoices[idx], ...data };
    return mockInvoices[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockInvoices.findIndex(i => i.id === id);
    if (idx === -1) return false;
    mockInvoices[idx].status = 'void';
    return true;
  },
  async getReceipts(): Promise<Receipt[]> {
    await delay(200);
    return [...mockReceipts];
  },
};
