import type { DocumentFile, DocumentFolder, StorageProvider, DocumentCategory } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockFolders: DocumentFolder[] = [
  { id: 'fld-1', name: 'Contratos', documentCount: 5, isInternal: false },
  { id: 'fld-2', name: 'Propuestas', documentCount: 6, isInternal: false },
  { id: 'fld-3', name: 'Facturas', documentCount: 4, isInternal: false },
  { id: 'fld-4', name: 'Fotos de Propiedades', documentCount: 12, isInternal: false },
  { id: 'fld-5', name: 'Inspecciones', documentCount: 3, isInternal: false },
  { id: 'fld-6', name: 'Documentos Legales', documentCount: 8, isInternal: false },
  { id: 'fld-7', name: 'SOPs Internos', documentCount: 5, isInternal: true },
  { id: 'fld-8', name: 'Templates', documentCount: 10, isInternal: true },
  { id: 'fld-9', name: 'Scripts de Ventas', documentCount: 4, isInternal: true },
  { id: 'fld-10', name: 'Marketing', documentCount: 6, isInternal: true },
];

const mockDocuments: DocumentFile[] = [
  { id: 'doc-1', name: 'Contrato de compraventa - Ana Martínez.pdf', type: 'application/pdf', size: 245000, category: 'contracts', folder: 'Contratos', tags: ['contrato', 'firmado'], uploadedBy: 'María Santos', uploadedAt: d(-10), updatedAt: d(-10), leadId: 'LD-1004', leadName: 'Ana Martínez', clientId: 'cl-4', clientName: 'Ana Martínez', version: 2, isInternal: false, permissions: ['view', 'download'] },
  { id: 'doc-2', name: 'Propuesta - Pedro Morales.pdf', type: 'application/pdf', size: 180000, category: 'proposals', folder: 'Propuestas', tags: ['propuesta', 'enviada'], uploadedBy: 'Juan Delgado', uploadedAt: d(-5), updatedAt: d(-4), leadId: 'LD-1009', leadName: 'Pedro Morales', clientId: 'cl-9', clientName: 'Pedro Morales', version: 1, isInternal: false, permissions: ['view', 'download', 'share'] },
  { id: 'doc-3', name: 'Factura INV-2025-004.pdf', type: 'application/pdf', size: 95000, category: 'invoices', folder: 'Facturas', tags: ['factura', 'overdue'], uploadedBy: 'System', uploadedAt: d(-20), updatedAt: d(-20), clientId: 'cl-6', clientName: 'Carmen Díaz', version: 1, isInternal: false, permissions: ['view', 'download'] },
  { id: 'doc-4', name: 'Fotos propiedad - Carlos Rivera_001.jpg', type: 'image/jpeg', size: 3200000, category: 'photos', folder: 'Fotos de Propiedades', tags: ['fotos', 'evaluación'], uploadedBy: 'María Santos', uploadedAt: d(-8), updatedAt: d(-8), leadId: 'LD-1001', leadName: 'Carlos Rivera', version: 1, isInternal: false, permissions: ['view', 'download'] },
  { id: 'doc-5', name: 'Fotos propiedad - Carlos Rivera_002.jpg', type: 'image/jpeg', size: 2800000, category: 'photos', folder: 'Fotos de Propiedades', tags: ['fotos', 'evaluación'], uploadedBy: 'María Santos', uploadedAt: d(-8), updatedAt: d(-8), leadId: 'LD-1001', leadName: 'Carlos Rivera', version: 1, isInternal: false, permissions: ['view', 'download'] },
  { id: 'doc-6', name: 'Inspección estructural - Isabel Torres.pdf', type: 'application/pdf', size: 520000, category: 'inspections', folder: 'Inspecciones', tags: ['inspección', 'urgente'], uploadedBy: 'Carlos Reyes', uploadedAt: d(-4), updatedAt: d(-4), leadId: 'LD-1008', leadName: 'Isabel Torres', version: 1, isInternal: false, permissions: ['view', 'download'] },
  { id: 'doc-7', name: 'Declaratoria de herederos - María López.pdf', type: 'application/pdf', size: 310000, category: 'legal', folder: 'Documentos Legales', tags: ['legal', 'herencia'], uploadedBy: 'Juan Delgado', uploadedAt: d(-3), updatedAt: d(-3), leadId: 'LD-1002', leadName: 'María López', version: 1, isInternal: false, permissions: ['view'] },
  { id: 'doc-8', name: 'Certificación CRIM - Luis García.pdf', type: 'application/pdf', size: 120000, category: 'legal', folder: 'Documentos Legales', tags: ['CRIM', 'deuda'], uploadedBy: 'Carlos Reyes', uploadedAt: d(-6), updatedAt: d(-6), leadId: 'LD-1005', leadName: 'Luis García', version: 1, isInternal: false, permissions: ['view', 'download'] },
  { id: 'doc-9', name: 'SOP - Proceso de evaluación.docx', type: 'application/docx', size: 85000, category: 'sops', folder: 'SOPs Internos', tags: ['SOP', 'evaluación'], uploadedBy: 'María Santos', uploadedAt: d(-30), updatedAt: d(-5), version: 3, isInternal: true, permissions: ['view', 'edit'] },
  { id: 'doc-10', name: 'SOP - Proceso de cierre.docx', type: 'application/docx', size: 92000, category: 'sops', folder: 'SOPs Internos', tags: ['SOP', 'cierre'], uploadedBy: 'María Santos', uploadedAt: d(-25), updatedAt: d(-10), version: 2, isInternal: true, permissions: ['view', 'edit'] },
  { id: 'doc-11', name: 'Template - Email follow-up.html', type: 'text/html', size: 15000, category: 'templates', folder: 'Templates', tags: ['template', 'email'], uploadedBy: 'María Santos', uploadedAt: d(-20), updatedAt: d(-15), version: 4, isInternal: true, permissions: ['view', 'edit'] },
  { id: 'doc-12', name: 'Script - Llamada inicial vendedor.docx', type: 'application/docx', size: 28000, category: 'scripts', folder: 'Scripts de Ventas', tags: ['script', 'vendedor'], uploadedBy: 'Juan Delgado', uploadedAt: d(-15), updatedAt: d(-8), version: 2, isInternal: true, permissions: ['view', 'edit'] },
  { id: 'doc-13', name: 'Brochure - My House Realty.pdf', type: 'application/pdf', size: 4500000, category: 'marketing', folder: 'Marketing', tags: ['marketing', 'brochure'], uploadedBy: 'María Santos', uploadedAt: d(-40), updatedAt: d(-20), version: 3, isInternal: true, permissions: ['view', 'download', 'share'] },
  { id: 'doc-14', name: 'Fotos propiedad - Ana Martínez_001.jpg', type: 'image/jpeg', size: 2900000, category: 'photos', folder: 'Fotos de Propiedades', tags: ['fotos', 'multifamiliar'], uploadedBy: 'María Santos', uploadedAt: d(-12), updatedAt: d(-12), leadId: 'LD-1004', leadName: 'Ana Martínez', version: 1, isInternal: false, permissions: ['view', 'download'] },
];

const mockProviders: StorageProvider[] = [
  { id: 'sp-1', name: 'Google Drive', status: 'connected', description: 'Store and sync documents with Google Drive.', spaceUsed: '2.3 GB', spaceTotal: '15 GB' },
  { id: 'sp-2', name: 'OneDrive', status: 'disconnected', description: 'Microsoft OneDrive cloud storage.' },
  { id: 'sp-3', name: 'Dropbox', status: 'coming-soon', description: 'Dropbox cloud storage integration.' },
  { id: 'sp-4', name: 'Amazon S3', status: 'coming-soon', description: 'Enterprise-grade object storage.' },
];

export const documentsService = {
  async getAll(): Promise<DocumentFile[]> {
    await delay(300);
    return [...mockDocuments];
  },
  async getById(id: string): Promise<DocumentFile | undefined> {
    await delay(200);
    return mockDocuments.find(d => d.id === id);
  },
  async getByCategory(category: DocumentCategory): Promise<DocumentFile[]> {
    await delay(250);
    return mockDocuments.filter(d => d.category === category);
  },
  async getByClient(clientId: string): Promise<DocumentFile[]> {
    await delay(250);
    return mockDocuments.filter(d => d.clientId === clientId);
  },
  async create(doc: Partial<DocumentFile>): Promise<DocumentFile> {
    await delay(400);
    const newDoc: DocumentFile = { id: `doc-${Date.now()}`, name: '', type: '', size: 0, category: 'other', folder: '', tags: [], uploadedBy: 'María Santos', uploadedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, isInternal: false, permissions: ['view', 'download'], ...doc } as DocumentFile;
    mockDocuments.push(newDoc);
    return newDoc;
  },
  async update(id: string, data: Partial<DocumentFile>): Promise<DocumentFile | undefined> {
    await delay(300);
    const idx = mockDocuments.findIndex(d => d.id === id);
    if (idx === -1) return undefined;
    mockDocuments[idx] = { ...mockDocuments[idx], ...data };
    return mockDocuments[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockDocuments.findIndex(d => d.id === id);
    if (idx === -1) return false;
    mockDocuments.splice(idx, 1);
    return true;
  },
  async getFolders(): Promise<DocumentFolder[]> {
    await delay(200);
    return [...mockFolders];
  },
  async getStorageProviders(): Promise<StorageProvider[]> {
    await delay(200);
    return [...mockProviders];
  },
};
