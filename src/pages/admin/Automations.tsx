import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Select } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import {
  Zap, ArrowRight, Clock, CheckCircle2, Plus, Settings, Trash2, Eye,
  Play, Pause, Loader2, History, Mail, UserPlus, Bell, Tag, Timer,
  Target, TrendingUp, CalendarCheck, GitBranch, X, Edit3, ArrowDown,
  Filter, HelpCircle
} from "lucide-react";
import { automationsService } from "@/lib/services/automationsService";
import type { AutomationWorkflow, AutomationNode, AutomationTriggerType, AutomationActionType, AutomationConditionType } from "@/lib/operations-types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const TRIGGER_CONFIG: Record<AutomationTriggerType, { icon: any; label: string; color: string }> = {
  'lead-created': { icon: Target, label: 'Lead Created', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'lead-score-high': { icon: TrendingUp, label: 'Lead Score High', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'meeting-booked': { icon: CalendarCheck, label: 'Meeting Booked', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'stage-changed': { icon: GitBranch, label: 'Stage Changed', color: 'bg-teal-100 text-teal-700 border-teal-200' },
};

const ACTION_CONFIG: Record<AutomationActionType, { icon: any; label: string; color: string }> = {
  'send-email': { icon: Mail, label: 'Send Email', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'assign-agent': { icon: UserPlus, label: 'Assign Agent', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  'send-notification': { icon: Bell, label: 'Send Notification', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'add-tag': { icon: Tag, label: 'Add Tag', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  'wait-days': { icon: Timer, label: 'Wait X Days', color: 'bg-slate-200 text-slate-700 border-slate-300' },
};

const CONDITION_CONFIG: Record<AutomationConditionType, { icon: any; label: string; color: string }> = {
  'score-above': { icon: TrendingUp, label: 'Score Above', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'tag-equals': { icon: Tag, label: 'Tag Equals', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  'stage-is': { icon: GitBranch, label: 'Stage Is', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  'property-type': { icon: HelpCircle, label: 'Property Type', color: 'bg-lime-100 text-lime-700 border-lime-200' },
  'timeline-is': { icon: Clock, label: 'Timeline Is', color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

function InteractiveWorkflowCanvas({ workflow, onUpdate }: { workflow: AutomationWorkflow; onUpdate: (wf: AutomationWorkflow) => void }) {
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [nodeForm, setNodeForm] = useState<{ label: string; type: 'trigger' | 'action' | 'condition'; triggerType?: AutomationTriggerType; actionType?: AutomationActionType; conditionType?: AutomationConditionType }>({ label: "", type: "action" });

  const orderedNodes: AutomationNode[] = [];
  const triggerNodes = workflow.nodes.filter(n => n.type === 'trigger');
  const visited = new Set<string>();

  const traverse = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node) {
      orderedNodes.push(node);
      workflow.connections.filter(c => c.from === nodeId).forEach(c => traverse(c.to));
    }
  };
  triggerNodes.forEach(t => traverse(t.id));
  workflow.nodes.forEach(n => { if (!visited.has(n.id)) orderedNodes.push(n); });

  const openEditNode = (node: AutomationNode) => {
    setEditingNode(node.id);
    setNodeForm({
      label: node.label,
      type: node.type,
      triggerType: node.triggerType,
      actionType: node.actionType,
      conditionType: node.conditionType,
    });
  };

  const saveEditNode = () => {
    if (!editingNode) return;
    const updatedNodes = workflow.nodes.map(n => {
      if (n.id === editingNode) {
        return {
          ...n,
          type: nodeForm.type,
          label: nodeForm.label,
          ...(nodeForm.type === 'trigger' && nodeForm.triggerType ? { triggerType: nodeForm.triggerType } : {}),
          ...(nodeForm.type === 'action' && nodeForm.actionType ? { actionType: nodeForm.actionType } : {}),
          ...(nodeForm.type === 'condition' && nodeForm.conditionType ? { conditionType: nodeForm.conditionType } : {}),
        };
      }
      return n;
    });
    onUpdate({ ...workflow, nodes: updatedNodes });
    setEditingNode(null);
  };

  const [addNodeType, setAddNodeType] = useState<'action' | 'condition'>('action');

  const addNodeAfter = (afterNodeId: string, nodeType: 'action' | 'condition' = addNodeType) => {
    const newId = `n-${Date.now()}`;
    const newNode: AutomationNode = nodeType === 'condition' ? {
      id: newId,
      type: 'condition',
      conditionType: 'score-above',
      label: 'New Condition',
      config: {},
      x: 0,
      y: 0,
    } : {
      id: newId,
      type: 'action',
      actionType: 'send-notification',
      label: 'New Action',
      config: {},
      x: 0,
      y: 0,
    };
    const existingConnection = workflow.connections.find(c => c.from === afterNodeId);
    let newConnections = workflow.connections.filter(c => c.from !== afterNodeId);
    newConnections.push({ from: afterNodeId, to: newId });
    if (existingConnection) {
      newConnections.push({ from: newId, to: existingConnection.to });
    }
    onUpdate({
      ...workflow,
      nodes: [...workflow.nodes, newNode],
      connections: newConnections,
    });
  };

  const removeNode = (nodeId: string) => {
    if (workflow.nodes.length <= 1) return;
    const incomingConn = workflow.connections.find(c => c.to === nodeId);
    const outgoingConn = workflow.connections.find(c => c.from === nodeId);

    let newConnections = workflow.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
    if (incomingConn && outgoingConn) {
      newConnections.push({ from: incomingConn.from, to: outgoingConn.to });
    }
    onUpdate({
      ...workflow,
      nodes: workflow.nodes.filter(n => n.id !== nodeId),
      connections: newConnections,
    });
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 min-h-[250px]">
      <div className="flex flex-col items-center gap-2">
        {orderedNodes.map((node, idx) => {
          const isTrigger = node.type === 'trigger';
          const isCondition = node.type === 'condition';
          const cfg = isTrigger
            ? (node.triggerType ? TRIGGER_CONFIG[node.triggerType] : null)
            : isCondition
            ? (node.conditionType ? CONDITION_CONFIG[node.conditionType] : null)
            : (node.actionType ? ACTION_CONFIG[node.actionType] : null);
          const NodeIcon = cfg?.icon || (isCondition ? Filter : Zap);

          return (
            <div key={node.id} className="flex flex-col items-center">
              <div className="relative group">
                <div
                  className={cn(
                    "px-5 py-3 rounded-xl border-2 shadow-sm min-w-[200px] cursor-pointer transition-all hover:shadow-md",
                    cfg?.color || "bg-blue-100 text-blue-700 border-blue-200",
                    editingNode === node.id && "ring-2 ring-primary"
                  )}
                  onClick={() => openEditNode(node)}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{isTrigger ? "Trigger" : isCondition ? "Condition" : `Action ${idx}`}</div>
                  <div className="flex items-center gap-2">
                    <NodeIcon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold">{node.label}</span>
                  </div>
                </div>
                {workflow.nodes.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {idx < orderedNodes.length - 1 && (
                <div className="flex flex-col items-center my-1">
                  <ArrowDown className="h-4 w-4 text-slate-300" />
                  <div className="flex gap-1">
                    <button
                      onClick={() => addNodeAfter(node.id, 'condition')}
                      className="w-6 h-6 rounded-full border-2 border-dashed border-yellow-300 text-yellow-400 hover:border-yellow-500 hover:text-yellow-600 flex items-center justify-center transition-colors"
                      title="Add Condition"
                    >
                      <Filter className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => addNodeAfter(node.id, 'action')}
                      className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 text-slate-300 hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                      title="Add Action"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <ArrowDown className="h-4 w-4 text-slate-300" />
                </div>
              )}

              {idx === orderedNodes.length - 1 && (
                <div className="flex flex-col items-center mt-2">
                  <ArrowDown className="h-4 w-4 text-slate-300" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addNodeAfter(node.id, 'condition')}
                      className="px-3 py-1.5 rounded-lg border-2 border-dashed border-yellow-300 text-yellow-500 hover:border-yellow-500 hover:text-yellow-700 flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      <Filter className="h-3 w-3" /> Condición
                    </button>
                    <button
                      onClick={() => addNodeAfter(node.id, 'action')}
                      className="px-3 py-1.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      <Plus className="h-3 w-3" /> Acción
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingNode && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setEditingNode(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl border-slate-200" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-slate-900">Editar Nodo</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingNode(null)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
                  <Input value={nodeForm.label} onChange={e => setNodeForm(p => ({ ...p, label: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Nodo</label>
                  <Select value={nodeForm.type} onChange={e => {
                    const newType = e.target.value as 'trigger' | 'action' | 'condition';
                    setNodeForm(p => ({
                      ...p,
                      type: newType,
                      ...(newType === 'trigger' ? { actionType: undefined, conditionType: undefined, triggerType: p.triggerType || ('lead-created' as AutomationTriggerType) } : {}),
                      ...(newType === 'condition' ? { triggerType: undefined, actionType: undefined, conditionType: p.conditionType || ('score-above' as AutomationConditionType) } : {}),
                      ...(newType === 'action' ? { triggerType: undefined, conditionType: undefined, actionType: p.actionType || ('send-notification' as AutomationActionType) } : {}),
                    }));
                  }}>
                    <option value="trigger">Trigger</option>
                    <option value="condition">Condition</option>
                    <option value="action">Action</option>
                  </Select>
                </div>
                {nodeForm.type === 'trigger' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Trigger</label>
                    <Select value={nodeForm.triggerType || ''} onChange={e => setNodeForm(p => ({ ...p, triggerType: e.target.value as AutomationTriggerType }))}>
                      {(Object.keys(TRIGGER_CONFIG) as AutomationTriggerType[]).map(k => (
                        <option key={k} value={k}>{TRIGGER_CONFIG[k].label}</option>
                      ))}
                    </Select>
                  </div>
                )}
                {nodeForm.type === 'condition' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Condición</label>
                    <Select value={nodeForm.conditionType || ''} onChange={e => setNodeForm(p => ({ ...p, conditionType: e.target.value as AutomationConditionType }))}>
                      {(Object.keys(CONDITION_CONFIG) as AutomationConditionType[]).map(k => (
                        <option key={k} value={k}>{CONDITION_CONFIG[k].label}</option>
                      ))}
                    </Select>
                  </div>
                )}
                {nodeForm.type === 'action' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Acción</label>
                    <Select value={nodeForm.actionType || ''} onChange={e => setNodeForm(p => ({ ...p, actionType: e.target.value as AutomationActionType }))}>
                      {(Object.keys(ACTION_CONFIG) as AutomationActionType[]).map(k => (
                        <option key={k} value={k}>{ACTION_CONFIG[k].label}</option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingNode(null)}>Cancelar</Button>
                <Button onClick={saveEditNode}>Guardar</Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default function Automations() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWf, setSelectedWf] = useState<AutomationWorkflow | null>(null);
  const [showHistoryId, setShowHistoryId] = useState<string | null>(null);

  useEffect(() => {
    automationsService.getAll().then(wfs => { setWorkflows(wfs); setLoading(false); });
  }, []);

  const handleToggle = async (id: string) => {
    await automationsService.toggle(id);
    const updated = await automationsService.getAll();
    setWorkflows(updated);
    if (selectedWf?.id === id) {
      const s = updated.find(w => w.id === id);
      if (s) setSelectedWf(s);
    }
  };

  const handleDelete = async (id: string) => {
    await automationsService.delete(id);
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (selectedWf?.id === id) setSelectedWf(null);
  };

  const handleCreate = async () => {
    const triggerId = `n-${Date.now()}-trigger`;
    const actionId = `n-${Date.now()}-action`;
    const newWf = await automationsService.create({
      name: 'New Automation',
      description: 'Configure triggers and actions.',
      nodes: [
        { id: triggerId, type: 'trigger', triggerType: 'lead-created', label: 'Lead Created', config: {}, x: 100, y: 150 },
        { id: actionId, type: 'action', actionType: 'send-email', label: 'Send Email', config: {}, x: 350, y: 150 },
      ],
      connections: [{ from: triggerId, to: actionId }],
    });
    setWorkflows(prev => [...prev, newWf]);
    setSelectedWf(newWf);
  };

  const handleUpdateWorkflow = (updatedWf: AutomationWorkflow) => {
    setWorkflows(prev => prev.map(w => w.id === updatedWf.id ? updatedWf : w));
    setSelectedWf(updatedWf);
  };

  const enabledCount = workflows.filter(w => w.enabled).length;
  const totalRuns = workflows.reduce((s, w) => s + w.runCount, 0);

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Automations" }]}>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Automation Engine</h1>
            <p className="text-sm text-slate-500 mt-1">Crea workflows visuales con triggers y acciones automatizadas.</p>
          </div>
          <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" /> Nuevo Workflow</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-xs text-slate-500">Total Workflows</div><div className="text-2xl font-display font-bold text-slate-900">{workflows.length}</div></CardContent></Card>
          <Card className="shadow-sm border-emerald-200 bg-emerald-50/50"><CardContent className="p-4"><div className="text-xs text-emerald-600">Activos</div><div className="text-2xl font-display font-bold text-emerald-700">{enabledCount}</div></CardContent></Card>
          <Card className="shadow-sm border-blue-200 bg-blue-50/50"><CardContent className="p-4"><div className="text-xs text-blue-600">Total Ejecuciones</div><div className="text-2xl font-display font-bold text-blue-700">{totalRuns}</div></CardContent></Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-4">
            {workflows.map(wf => (
              <Card key={wf.id} className={cn("shadow-sm transition-all", wf.enabled ? "border-slate-200" : "border-slate-200 opacity-60", selectedWf?.id === wf.id && "ring-2 ring-primary")}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedWf(selectedWf?.id === wf.id ? null : wf)}>
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", wf.enabled ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400")}>
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{wf.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{wf.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={wf.enabled} onChange={() => handleToggle(wf.id)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
                      </label>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => handleDelete(wf.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  {selectedWf?.id === wf.id && (
                    <>
                      <InteractiveWorkflowCanvas workflow={wf} onUpdate={handleUpdateWorkflow} />

                      <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {wf.runCount} ejecuciones</span>
                          {wf.lastRun && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Última: {formatDistanceToNow(new Date(wf.lastRun), { addSuffix: true, locale: es })}</span>}
                          <span className="flex items-center gap-1">{wf.nodes.length} nodos · {wf.connections.length} conexiones</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowHistoryId(showHistoryId === wf.id ? null : wf.id)}>
                          <History className="h-3 w-3 mr-1" /> Historial
                        </Button>
                      </div>

                      {showHistoryId === wf.id && wf.runHistory.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Historial de Ejecución</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {wf.runHistory.map(run => (
                              <div key={run.id} className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg">
                                <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", run.status === 'success' ? 'bg-emerald-500' : run.status === 'failed' ? 'bg-red-500' : 'bg-amber-500')} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-slate-700">{run.trigger}</div>
                                  <div className="text-[11px] text-slate-400">{run.details}</div>
                                </div>
                                <div className="text-right shrink-0">
                                  <Badge variant={run.status === 'success' ? 'success' : run.status === 'failed' ? 'destructive' : 'secondary'} className="text-[9px]">{run.status}</Badge>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{run.duration}ms</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedWf?.id !== wf.id && (
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {wf.runCount} ejecuciones</span>
                        {wf.lastRun && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Última: {formatDistanceToNow(new Date(wf.lastRun), { addSuffix: true, locale: es })}</span>}
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedWf(wf)}><Eye className="h-3 w-3 mr-1" /> Ver</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
