import type { Transaction, BillingMetrics, PaymentProvider, TransactionStatus } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockTransactions: Transaction[] = [
  { id: 'tx-1', amount: 5000, status: 'completed', method: 'stripe', description: 'Depósito de buena fe - Ana Martínez', clientName: 'Ana Martínez', clientId: 'cl-4', invoiceId: 'inv-1', date: d(-2), dueDate: d(-5), memo: 'Depósito inicial para reservar propiedad', paymentTerms: 'Net 0', reminderSent: false, createdAt: d(-5), timeline: [{ id: 'tt-1', action: 'Payment received via Stripe', date: d(-2), author: 'System' }, { id: 'tt-2', action: 'Invoice marked as paid', date: d(-2), author: 'System' }] },
  { id: 'tx-2', amount: 15000, status: 'pending', method: 'ach', description: 'Honorarios de gestión - Pedro Morales', clientName: 'Pedro Morales', clientId: 'cl-9', invoiceId: 'inv-2', date: d(-1), dueDate: d(5), memo: 'Pago parcial por servicios de gestión', paymentTerms: 'Net 15', reminderSent: false, createdAt: d(-1), timeline: [{ id: 'tt-3', action: 'Payment request created', date: d(-1), author: 'María Santos' }] },
  { id: 'tx-3', amount: 2500, status: 'completed', method: 'paypal', description: 'Evaluación profesional - Isabel Torres', clientName: 'Isabel Torres', clientId: 'cl-8', invoiceId: 'inv-3', date: d(-7), dueDate: d(-10), reminderSent: false, createdAt: d(-10), timeline: [{ id: 'tt-4', action: 'Payment received via PayPal', date: d(-7), author: 'System' }] },
  { id: 'tx-4', amount: 8000, status: 'overdue', method: 'check', description: 'Comisión de venta - Carmen Díaz', clientName: 'Carmen Díaz', clientId: 'cl-6', invoiceId: 'inv-4', date: d(-15), dueDate: d(-5), memo: 'Overdue - enviar recordatorio', paymentTerms: 'Net 10', reminderSent: true, createdAt: d(-15), timeline: [{ id: 'tt-5', action: 'Reminder sent', date: d(-3), author: 'System' }, { id: 'tt-6', action: 'Invoice created', date: d(-15), author: 'Juan Delgado' }] },
  { id: 'tx-5', amount: 1200, status: 'completed', method: 'cash', description: 'Gastos de notaría - Carlos Rivera', clientName: 'Carlos Rivera', clientId: 'cl-1', date: d(-10), reminderSent: false, createdAt: d(-10), timeline: [{ id: 'tt-7', action: 'Cash payment recorded', date: d(-10), author: 'María Santos' }] },
  { id: 'tx-6', amount: 3500, status: 'failed', method: 'stripe', description: 'Intento de pago fallido - Miguel Colón', clientName: 'Miguel Colón', clientId: 'cl-11', invoiceId: 'inv-5', date: d(-3), dueDate: d(-1), reminderSent: true, createdAt: d(-5), timeline: [{ id: 'tt-8', action: 'Payment failed - card declined', date: d(-3), author: 'System' }, { id: 'tt-9', action: 'Retry notification sent', date: d(-2), author: 'System' }] },
  { id: 'tx-7', amount: 750, status: 'refunded', method: 'square', description: 'Reembolso - Sofía Vega', clientName: 'Sofía Vega', clientId: 'cl-12', date: d(-8), reminderSent: false, createdAt: d(-12), timeline: [{ id: 'tt-10', action: 'Refund processed', date: d(-8), author: 'María Santos' }] },
  { id: 'tx-8', amount: 25000, status: 'pending', method: 'ach', description: 'Pago de cierre - Pedro Morales', clientName: 'Pedro Morales', clientId: 'cl-9', proposalId: 'prop-2', date: d(0), dueDate: d(10), paymentTerms: 'Net 10', reminderSent: false, createdAt: d(0), timeline: [{ id: 'tt-11', action: 'Payment request created', date: d(0), author: 'Juan Delgado' }] },
];

const mockProviders: PaymentProvider[] = [
  { id: 'pp-1', name: 'Stripe', icon: 'stripe', status: 'connected', description: 'Process credit card and ACH payments online.' },
  { id: 'pp-2', name: 'Square', icon: 'square', status: 'connected', description: 'In-person and online payment processing.' },
  { id: 'pp-3', name: 'PayPal', icon: 'paypal', status: 'disconnected', description: 'Online payments and invoicing.' },
  { id: 'pp-4', name: 'QuickBooks', icon: 'quickbooks', status: 'coming-soon', description: 'Accounting and invoicing integration.' },
  { id: 'pp-5', name: 'ACH Direct', icon: 'ach', status: 'connected', description: 'Direct bank transfers.' },
  { id: 'pp-6', name: 'Cash', icon: 'cash', status: 'connected', description: 'Record cash payments manually.' },
  { id: 'pp-7', name: 'Check', icon: 'check', status: 'connected', description: 'Record check payments manually.' },
];

export const billingService = {
  async getAll(): Promise<Transaction[]> {
    await delay(300);
    return [...mockTransactions];
  },
  async getById(id: string): Promise<Transaction | undefined> {
    await delay(200);
    return mockTransactions.find(t => t.id === id);
  },
  async getByStatus(status: TransactionStatus): Promise<Transaction[]> {
    await delay(250);
    return mockTransactions.filter(t => t.status === status);
  },
  async create(tx: Partial<Transaction>): Promise<Transaction> {
    await delay(400);
    const newTx: Transaction = { id: `tx-${Date.now()}`, amount: 0, status: 'pending', method: 'stripe', description: '', clientName: '', date: new Date().toISOString(), reminderSent: false, createdAt: new Date().toISOString(), timeline: [], ...tx } as Transaction;
    mockTransactions.push(newTx);
    return newTx;
  },
  async update(id: string, data: Partial<Transaction>): Promise<Transaction | undefined> {
    await delay(300);
    const idx = mockTransactions.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    mockTransactions[idx] = { ...mockTransactions[idx], ...data };
    return mockTransactions[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockTransactions.findIndex(t => t.id === id);
    if (idx === -1) return false;
    mockTransactions.splice(idx, 1);
    return true;
  },
  async getMetrics(): Promise<BillingMetrics> {
    await delay(200);
    const all = mockTransactions;
    return {
      totalBilled: all.reduce((s, t) => s + t.amount, 0),
      collected: all.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0),
      pending: all.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0),
      overdue: all.filter(t => t.status === 'overdue').reduce((s, t) => s + t.amount, 0),
    };
  },
  async getProviders(): Promise<PaymentProvider[]> {
    await delay(200);
    return [...mockProviders];
  },
};
