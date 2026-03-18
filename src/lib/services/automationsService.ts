import type { AutomationWorkflow } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockWorkflows: AutomationWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Welcome New Lead',
    description: 'Envía email de bienvenida y asigna agente cuando se crea un lead.',
    enabled: true,
    nodes: [
      { id: 'n1', type: 'trigger', triggerType: 'lead-created', label: 'Lead Created', config: {}, x: 100, y: 150 },
      { id: 'n2', type: 'action', actionType: 'send-email', label: 'Send Welcome Email', config: { template: 'welcome' }, x: 350, y: 100 },
      { id: 'n3', type: 'action', actionType: 'assign-agent', label: 'Assign to Available Agent', config: { method: 'round-robin' }, x: 350, y: 220 },
      { id: 'n4', type: 'action', actionType: 'send-notification', label: 'Notify Team', config: { channel: 'slack' }, x: 600, y: 150 },
    ],
    connections: [{ from: 'n1', to: 'n2' }, { from: 'n1', to: 'n3' }, { from: 'n2', to: 'n4' }],
    createdAt: d(-30),
    updatedAt: d(-2),
    runCount: 87,
    lastRun: d(-1),
    runHistory: [
      { id: 'rh-1', date: d(-1), trigger: 'Lead LD-1001 created', status: 'success', details: 'Email sent, agent assigned', duration: 1200 },
      { id: 'rh-2', date: d(-2), trigger: 'Lead LD-1008 created', status: 'success', details: 'Email sent, agent assigned', duration: 980 },
      { id: 'rh-3', date: d(-3), trigger: 'Lead LD-1007 created', status: 'failed', details: 'Email delivery failed — invalid address', duration: 3400 },
    ],
  },
  {
    id: 'wf-2',
    name: 'Hot Lead Alert',
    description: 'Notifica al equipo senior cuando un lead tiene score alto.',
    enabled: true,
    nodes: [
      { id: 'n5', type: 'trigger', triggerType: 'lead-score-high', label: 'Lead Score > 80', config: { threshold: '80' }, x: 100, y: 150 },
      { id: 'n6', type: 'action', actionType: 'send-notification', label: 'Alert Senior Team', config: { urgency: 'high' }, x: 350, y: 100 },
      { id: 'n7', type: 'action', actionType: 'add-tag', label: 'Add "Hot Lead" Tag', config: { tag: 'hot_lead' }, x: 350, y: 220 },
      { id: 'n8', type: 'action', actionType: 'assign-agent', label: 'Assign Senior Agent', config: { agent: 'María Santos' }, x: 600, y: 150 },
    ],
    connections: [{ from: 'n5', to: 'n6' }, { from: 'n5', to: 'n7' }, { from: 'n6', to: 'n8' }],
    createdAt: d(-25),
    updatedAt: d(-1),
    runCount: 34,
    lastRun: d(0),
    runHistory: [
      { id: 'rh-4', date: d(0), trigger: 'Lead LD-1004 score: 91', status: 'success', details: 'Notification sent, tag added, assigned to María', duration: 850 },
      { id: 'rh-5', date: d(-1), trigger: 'Lead LD-1001 score: 87', status: 'success', details: 'Notification sent, tag added', duration: 720 },
    ],
  },
  {
    id: 'wf-3',
    name: 'Meeting Follow-up',
    description: 'Envía email de seguimiento después de una reunión agendada.',
    enabled: true,
    nodes: [
      { id: 'n9', type: 'trigger', triggerType: 'meeting-booked', label: 'Meeting Booked', config: {}, x: 100, y: 150 },
      { id: 'n10', type: 'action', actionType: 'wait-days', label: 'Wait 1 Day', config: { days: '1' }, x: 350, y: 150 },
      { id: 'n11', type: 'action', actionType: 'send-email', label: 'Send Follow-up Email', config: { template: 'meeting-followup' }, x: 600, y: 150 },
    ],
    connections: [{ from: 'n9', to: 'n10' }, { from: 'n10', to: 'n11' }],
    createdAt: d(-20),
    updatedAt: d(-5),
    runCount: 23,
    lastRun: d(-2),
    runHistory: [
      { id: 'rh-6', date: d(-2), trigger: 'Meeting MTG-003 booked', status: 'success', details: 'Follow-up email queued', duration: 450 },
    ],
  },
  {
    id: 'wf-4',
    name: 'Stage Change Notification',
    description: 'Notifica cuando un lead cambia de etapa en el pipeline.',
    enabled: false,
    nodes: [
      { id: 'n12', type: 'trigger', triggerType: 'stage-changed', label: 'Stage Changed', config: {}, x: 100, y: 150 },
      { id: 'n13', type: 'action', actionType: 'send-notification', label: 'Notify Owner', config: {}, x: 350, y: 150 },
    ],
    connections: [{ from: 'n12', to: 'n13' }],
    createdAt: d(-15),
    updatedAt: d(-10),
    runCount: 0,
    runHistory: [],
  },
];

export const automationsService = {
  async getAll(): Promise<AutomationWorkflow[]> {
    await delay(300);
    return [...mockWorkflows];
  },
  async getById(id: string): Promise<AutomationWorkflow | undefined> {
    await delay(200);
    return mockWorkflows.find(w => w.id === id);
  },
  async create(workflow: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> {
    await delay(400);
    const newWf: AutomationWorkflow = {
      id: `wf-${Date.now()}`, name: '', description: '', enabled: false, nodes: [], connections: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), runCount: 0, runHistory: [],
      ...workflow,
    } as AutomationWorkflow;
    mockWorkflows.push(newWf);
    return newWf;
  },
  async toggle(id: string): Promise<boolean> {
    await delay(200);
    const wf = mockWorkflows.find(w => w.id === id);
    if (!wf) return false;
    wf.enabled = !wf.enabled;
    return true;
  },
  async delete(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockWorkflows.findIndex(w => w.id === id);
    if (idx === -1) return false;
    mockWorkflows.splice(idx, 1);
    return true;
  },
};
