import type { IntegrationConnection, IntegrationCategory } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockIntegrations: IntegrationConnection[] = [
  { id: 'int-1', name: 'Google Calendar', category: 'calendar', status: 'connected', description: 'Sync appointments and availability with Google Calendar.', benefits: ['Two-way sync', 'Auto-block slots', 'Meeting reminders'], requiredPermissions: ['Calendar read/write', 'Event management'], icon: 'google-calendar', lastSync: d(0), connectedAt: d(-30), logs: [{ id: 'il-1', action: 'Sync completed', status: 'success', date: d(0), details: '12 events synced' }] },
  { id: 'int-2', name: 'Outlook Calendar', category: 'calendar', status: 'disconnected', description: 'Sync with Microsoft Outlook calendar.', benefits: ['Two-way sync', 'Teams integration'], requiredPermissions: ['Calendar access', 'Mail read'], icon: 'outlook', logs: [] },
  { id: 'int-3', name: 'Apple Calendar', category: 'calendar', status: 'coming-soon', description: 'Sync with Apple iCal.', benefits: ['iPhone/Mac sync'], requiredPermissions: ['CalDAV access'], icon: 'apple', logs: [] },
  { id: 'int-4', name: 'Zoom', category: 'meetings', status: 'connected', description: 'Create and manage Zoom meetings automatically.', benefits: ['Auto-generate links', 'Recording sync', 'Calendar integration'], requiredPermissions: ['Meeting create/manage', 'Recording access'], icon: 'zoom', lastSync: d(0), connectedAt: d(-25), logs: [{ id: 'il-2', action: 'Meeting created', status: 'success', date: d(-1), details: 'Meeting mtg-1 created' }] },
  { id: 'int-5', name: 'Google Meet', category: 'meetings', status: 'connected', description: 'Create Google Meet links for virtual meetings.', benefits: ['Instant link generation', 'Calendar sync'], requiredPermissions: ['Meet create'], icon: 'google-meet', lastSync: d(-1), connectedAt: d(-20), logs: [{ id: 'il-3', action: 'Link generated', status: 'success', date: d(-2), details: 'Meeting link created for mtg-4' }] },
  { id: 'int-6', name: 'Microsoft Teams', category: 'meetings', status: 'disconnected', description: 'Create and manage Teams meetings.', benefits: ['Enterprise meeting management', 'Recording'], requiredPermissions: ['Teams meeting create'], icon: 'teams', logs: [] },
  { id: 'int-7', name: 'Stripe', category: 'payments', status: 'connected', description: 'Accept credit card and ACH payments online.', benefits: ['Card processing', 'ACH transfers', 'Invoice payments', 'Recurring billing'], requiredPermissions: ['Charges create', 'Customer manage', 'Invoice manage'], icon: 'stripe', lastSync: d(0), connectedAt: d(-60), logs: [{ id: 'il-4', action: 'Payment processed', status: 'success', date: d(-2), details: '$5,000 charge for inv-1' }, { id: 'il-5', action: 'Payment failed', status: 'error', date: d(-3), details: 'Card declined for inv-5' }] },
  { id: 'int-8', name: 'Square', category: 'payments', status: 'connected', description: 'Process in-person and online payments.', benefits: ['POS integration', 'Online payments', 'Invoicing'], requiredPermissions: ['Payments process', 'Transactions read'], icon: 'square', lastSync: d(-1), connectedAt: d(-45), logs: [] },
  { id: 'int-9', name: 'PayPal', category: 'payments', status: 'disconnected', description: 'Accept PayPal payments and invoicing.', benefits: ['Global payments', 'Buyer protection', 'Invoicing'], requiredPermissions: ['Payments access', 'Invoice create'], icon: 'paypal', logs: [] },
  { id: 'int-10', name: 'QuickBooks', category: 'payments', status: 'coming-soon', description: 'Sync invoices and payments with QuickBooks.', benefits: ['Accounting sync', 'Tax reports', 'Financial reports'], requiredPermissions: ['Company read/write', 'Invoice manage'], icon: 'quickbooks', logs: [] },
  { id: 'int-11', name: 'Google Drive', category: 'storage', status: 'connected', description: 'Store and sync documents with Google Drive.', benefits: ['Cloud storage', 'Document collaboration', 'Version history'], requiredPermissions: ['Drive read/write', 'File management'], icon: 'google-drive', lastSync: d(0), connectedAt: d(-40), logs: [{ id: 'il-6', action: 'File synced', status: 'success', date: d(0), details: '3 documents synced' }] },
  { id: 'int-12', name: 'OneDrive', category: 'storage', status: 'disconnected', description: 'Microsoft OneDrive cloud storage.', benefits: ['Office integration', 'SharePoint sync'], requiredPermissions: ['Files read/write'], icon: 'onedrive', logs: [] },
  { id: 'int-13', name: 'Dropbox', category: 'storage', status: 'coming-soon', description: 'Dropbox cloud storage integration.', benefits: ['Smart sync', 'Team folders'], requiredPermissions: ['Files read/write'], icon: 'dropbox', logs: [] },
  { id: 'int-14', name: 'Amazon S3', category: 'storage', status: 'coming-soon', description: 'Enterprise-grade object storage.', benefits: ['Unlimited storage', 'High availability'], requiredPermissions: ['S3 bucket access'], icon: 's3', logs: [] },
  { id: 'int-15', name: 'Zapier', category: 'automation', status: 'connected', description: 'Connect 5000+ apps with automated workflows.', benefits: ['Custom automations', 'Multi-step workflows', 'Triggers and actions'], requiredPermissions: ['Webhook access', 'API access'], icon: 'zapier', lastSync: d(0), connectedAt: d(-15), logs: [{ id: 'il-7', action: 'Zap triggered', status: 'success', date: d(-1), details: 'New lead notification sent' }] },
  { id: 'int-16', name: 'Make (Integromat)', category: 'automation', status: 'disconnected', description: 'Visual automation platform.', benefits: ['Visual workflows', 'Data transformation', 'Scheduling'], requiredPermissions: ['API access'], icon: 'make', logs: [] },
  { id: 'int-17', name: 'n8n', category: 'automation', status: 'coming-soon', description: 'Self-hosted workflow automation.', benefits: ['Self-hosted', 'Custom nodes', 'Free tier'], requiredPermissions: ['Webhook access'], icon: 'n8n', logs: [] },
  { id: 'int-18', name: 'WhatsApp Business', category: 'communications', status: 'connected', description: 'Send and receive WhatsApp messages.', benefits: ['Template messages', 'Media sharing', 'Quick replies'], requiredPermissions: ['Message send/receive', 'Template manage'], icon: 'whatsapp', lastSync: d(0), connectedAt: d(-50), logs: [{ id: 'il-8', action: 'Message sent', status: 'success', date: d(-1), details: 'Follow-up sent to Carlos Rivera' }] },
  { id: 'int-19', name: 'Twilio SMS', category: 'communications', status: 'disconnected', description: 'Send SMS notifications and reminders.', benefits: ['SMS alerts', 'Two-way messaging', 'Scheduling'], requiredPermissions: ['SMS send', 'Number manage'], icon: 'twilio', logs: [] },
  { id: 'int-20', name: 'Mailgun', category: 'communications', status: 'coming-soon', description: 'Transactional email service.', benefits: ['Email delivery', 'Templates', 'Analytics'], requiredPermissions: ['Email send', 'Domain verify'], icon: 'mailgun', logs: [] },
  { id: 'int-21', name: 'HubSpot', category: 'crm', status: 'disconnected', description: 'Sync contacts and deals with HubSpot CRM.', benefits: ['Contact sync', 'Deal pipeline', 'Email tracking'], requiredPermissions: ['Contacts read/write', 'Deals manage'], icon: 'hubspot', logs: [] },
  { id: 'int-22', name: 'Salesforce', category: 'crm', status: 'coming-soon', description: 'Enterprise CRM integration.', benefits: ['Lead management', 'Opportunity tracking', 'Reports'], requiredPermissions: ['API access', 'Object CRUD'], icon: 'salesforce', logs: [] },
  { id: 'int-23', name: 'Meta Lead Ads', category: 'marketing', status: 'connected', description: 'Import leads from Facebook and Instagram ads.', benefits: ['Auto-import leads', 'Campaign tracking', 'Form mapping'], requiredPermissions: ['Lead access', 'Page admin'], icon: 'meta', lastSync: d(0), connectedAt: d(-55), logs: [{ id: 'il-9', action: 'Leads imported', status: 'success', date: d(0), details: '3 new leads imported from FB' }] },
  { id: 'int-24', name: 'Google Ads', category: 'marketing', status: 'disconnected', description: 'Track Google Ads conversions.', benefits: ['Conversion tracking', 'Lead quality scoring', 'ROI tracking'], requiredPermissions: ['Ads read', 'Conversion tracking'], icon: 'google-ads', logs: [] },
];

export const integrationsService = {
  async getAll(): Promise<IntegrationConnection[]> {
    await delay(300);
    return [...mockIntegrations];
  },
  async getById(id: string): Promise<IntegrationConnection | undefined> {
    await delay(200);
    return mockIntegrations.find(i => i.id === id);
  },
  async getByCategory(category: IntegrationCategory): Promise<IntegrationConnection[]> {
    await delay(250);
    return mockIntegrations.filter(i => i.category === category);
  },
  async create(integration: Partial<IntegrationConnection>): Promise<IntegrationConnection> {
    await delay(400);
    const newInt: IntegrationConnection = { id: `int-${Date.now()}`, name: '', category: 'automation', status: 'disconnected', description: '', benefits: [], requiredPermissions: [], icon: '', logs: [], ...integration } as IntegrationConnection;
    mockIntegrations.push(newInt);
    return newInt;
  },
  async update(id: string, data: Partial<IntegrationConnection>): Promise<IntegrationConnection | undefined> {
    await delay(300);
    const idx = mockIntegrations.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    mockIntegrations[idx] = { ...mockIntegrations[idx], ...data };
    return mockIntegrations[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockIntegrations.findIndex(i => i.id === id);
    if (idx === -1) return false;
    mockIntegrations[idx].status = 'disconnected';
    return true;
  },
};
