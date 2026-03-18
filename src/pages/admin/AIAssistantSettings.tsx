import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Badge } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import {
  Bot, Save, Check, Plus, Trash2, MessageCircle, Sparkles, AlertTriangle, UserCheck, ArrowRight,
  Eye, Settings2, Zap, Send, Upload, FileText, File, X, BookOpen, ToggleLeft, ToggleRight, Edit3
} from "lucide-react";
import { BRAND } from "@/lib/mock-data";

const TONE_OPTIONS = [
  { value: "professional", label: "Profesional", description: "Formal y directo. Ideal para clientes serios." },
  { value: "friendly", label: "Amigable", description: "Cálido y cercano. Genera confianza rápido." },
  { value: "aggressive", label: "Agresivo", description: "Urgente y persuasivo. Para conversiones rápidas." },
  { value: "consultative", label: "Consultivo", description: "Hace preguntas para entender necesidades antes de ofrecer." },
  { value: "urgent", label: "Urgente", description: "Enfocado en crear sentido de urgencia y acción rápida." },
  { value: "educational", label: "Educativo", description: "Explica el proceso paso a paso, genera confianza a través de conocimiento." },
  { value: "empathetic", label: "Empático", description: "Se enfoca en la situación emocional del cliente." },
  { value: "direct", label: "Directo", description: "Va al grano con propuestas claras sin rodeos." },
];

const STYLE_OPTIONS = [
  { value: "consultative", label: "Consultivo", description: "Hace preguntas para entender necesidades." },
  { value: "direct", label: "Directo", description: "Va al grano con propuestas claras." },
  { value: "empathetic", label: "Empático", description: "Se enfoca en la situación del cliente." },
];

const DEFAULT_QUESTIONS = [
  { id: "q1", text: "¿Qué tipo de propiedad tienes?", required: true, order: 1 },
  { id: "q2", text: "¿En qué municipio se encuentra?", required: true, order: 2 },
  { id: "q3", text: "¿Cuál es tu timeline para vender?", required: true, order: 3 },
  { id: "q4", text: "¿En qué condición se encuentra la propiedad?", required: true, order: 4 },
  { id: "q5", text: "¿Cuál es tu principal motivación para vender?", required: true, order: 5 },
  { id: "q6", text: "¿Tienes deudas asociadas a la propiedad?", required: false, order: 6 },
];

const ESCALATION_RULES = [
  { id: "e1", condition: "Score > 80", action: "Transferir a agente inmediatamente", enabled: true },
  { id: "e2", condition: "Menciona 'foreclosure' o 'ejecución'", action: "Alerta urgente al equipo", enabled: true },
  { id: "e3", condition: "Timeline 'Urgente'", action: "Priorizar en cola de agentes", enabled: true },
  { id: "e4", condition: "3+ intentos sin respuesta", action: "Ofrecer llamada telefónica", enabled: false },
  { id: "e5", condition: "Pide hablar con humano", action: "Transferir inmediatamente", enabled: true },
];

interface TrainingDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: "processed" | "processing" | "error";
}

interface TriggerRule {
  id: string;
  name: string;
  event: string;
  condition: string;
  action: string;
  enabled: boolean;
}

const MOCK_TRAINING_DOCS: TrainingDoc[] = [
  { id: "td1", name: "Manual de Ventas Q1.pdf", type: "PDF", size: "2.4 MB", uploadedAt: "2025-01-15", status: "processed" },
  { id: "td2", name: "FAQ Propiedades.docx", type: "DOCX", size: "890 KB", uploadedAt: "2025-02-01", status: "processed" },
  { id: "td3", name: "Guía de Precios.txt", type: "TXT", size: "156 KB", uploadedAt: "2025-02-20", status: "processing" },
];

const MOCK_TRIGGERS: TriggerRule[] = [
  { id: "tr1", name: "Lead Caliente Auto-Assign", event: "lead_score_high", condition: "Score > 80", action: "Asignar a agente senior", enabled: true },
  { id: "tr2", name: "Follow-up Automático", event: "no_response_48h", condition: "Sin respuesta 48h", action: "Enviar email de seguimiento", enabled: true },
  { id: "tr3", name: "Alerta Foreclosure", event: "keyword_detected", condition: "Menciona foreclosure", action: "Notificar al equipo urgente", enabled: false },
];

const TABS = [
  { key: "tone", label: "Tono y Estilo", icon: Sparkles },
  { key: "training", label: "Training Center", icon: BookOpen },
  { key: "questions", label: "Preguntas", icon: MessageCircle },
  { key: "triggers", label: "Triggers", icon: Zap },
  { key: "escalation", label: "Escalación", icon: AlertTriangle },
  { key: "transfer", label: "Transferencia", icon: UserCheck },
  { key: "preview", label: "Vista Previa", icon: Eye },
];

export default function AIAssistantSettings() {
  const [activeTab, setActiveTab] = useState("tone");
  const [saved, setSaved] = useState(false);
  const [tone, setTone] = useState("friendly");
  const [style, setStyle] = useState("consultative");
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [escalationRules, setEscalationRules] = useState(ESCALATION_RULES);
  const [autoGreet, setAutoGreet] = useState(true);
  const [greetDelay, setGreetDelay] = useState("5");
  const [captureAfterQuestions, setCaptureAfterQuestions] = useState("3");
  const [transferAgent, setTransferAgent] = useState("maria-santos");

  const [previewMessages, setPreviewMessages] = useState<{ role: string; text: string }[]>([]);
  const [previewInput, setPreviewInput] = useState("");

  const [trainingDocs, setTrainingDocs] = useState<TrainingDoc[]>(MOCK_TRAINING_DOCS);
  const [dragActive, setDragActive] = useState(false);

  const [triggers, setTriggers] = useState<TriggerRule[]>(MOCK_TRIGGERS);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<TriggerRule | null>(null);
  const [triggerForm, setTriggerForm] = useState({ name: "", event: "lead_score_high", condition: "", action: "" });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: `q${Date.now()}`,
      text: "",
      required: false,
      order: questions.length + 1,
    }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const toggleEscalation = (id: string) => {
    setEscalationRules(escalationRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleTrainingUpload = () => {
    const newDoc: TrainingDoc = {
      id: `td-${Date.now()}`,
      name: `Documento_${Date.now().toString(36)}.pdf`,
      type: "PDF",
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "processing",
    };
    setTrainingDocs(prev => [...prev, newDoc]);
    setTimeout(() => {
      setTrainingDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: "processed" as const } : d));
    }, 3000);
  };

  const removeTrainingDoc = (id: string) => {
    setTrainingDocs(prev => prev.filter(d => d.id !== id));
  };

  const toggleTrigger = (id: string) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const handleSaveTrigger = () => {
    if (editingTrigger) {
      setTriggers(prev => prev.map(t => t.id === editingTrigger.id ? { ...editingTrigger, ...triggerForm } : t));
    } else {
      const newTrigger: TriggerRule = {
        id: `tr-${Date.now()}`,
        ...triggerForm,
        enabled: true,
      };
      setTriggers(prev => [...prev, newTrigger]);
    }
    setShowTriggerModal(false);
    setEditingTrigger(null);
    setTriggerForm({ name: "", event: "lead_score_high", condition: "", action: "" });
  };

  const openEditTrigger = (trigger: TriggerRule) => {
    setEditingTrigger(trigger);
    setTriggerForm({ name: trigger.name, event: trigger.event, condition: trigger.condition, action: trigger.action });
    setShowTriggerModal(true);
  };

  const deleteTrigger = (id: string) => {
    setTriggers(prev => prev.filter(t => t.id !== id));
  };

  const startPreview = () => {
    const greeting = tone === "professional"
      ? `Buenos días. Soy el asistente virtual de ${BRAND.name}. ¿En qué puedo asistirle con su propiedad?`
      : tone === "aggressive"
      ? `¡Hola! 🔥 ¿Sabías que podemos hacerte una oferta cash por tu propiedad en menos de 24 horas? ¡Cuéntame sobre tu propiedad!`
      : `¡Hola! 👋 Soy el asistente virtual de ${BRAND.name}. Estoy aquí para ayudarte con la venta de tu propiedad. ¿En qué te puedo ayudar?`;

    setPreviewMessages([{ role: "bot", text: greeting }]);
  };

  const handlePreviewSend = () => {
    if (!previewInput.trim()) return;
    const userMsg = previewInput.trim();
    setPreviewInput("");

    setPreviewMessages(prev => [...prev, { role: "user", text: userMsg }]);

    setTimeout(() => {
      const currentQ = questions[Math.min(previewMessages.filter(m => m.role === "bot").length, questions.length - 1)];
      const response = currentQ
        ? (tone === "professional" ? `Entendido. ${currentQ.text}` : tone === "aggressive" ? `¡Perfecto! ${currentQ.text} 🏠` : `¡Genial! ${currentQ.text}`)
        : "¡Gracias por toda la información! Un agente se comunicará contigo pronto.";
      setPreviewMessages(prev => [...prev, { role: "bot", text: response }]);
    }, 800);
  };

  return (
    <AdminLayout breadcrumbs={[{ label: "AI Assistant Settings" }]}>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Bot className="h-7 w-7 text-primary" />
              AI Assistant Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">Configura el comportamiento del chatbot de ventas.</p>
          </div>
          <Button onClick={handleSave} className={cn(saved && "bg-emerald-600 hover:bg-emerald-700")}>
            {saved ? <><Check className="h-4 w-4 mr-2" /> Guardado</> : <><Save className="h-4 w-4 mr-2" /> Guardar</>}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <nav className="lg:w-52 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); if (tab.key === "preview") startPreview(); }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === tab.key ? "bg-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex-1 min-w-0">
            {activeTab === "tone" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3"><CardTitle className="text-base">Tono de Conversación</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {TONE_OPTIONS.map(opt => (
                        <label key={opt.value} className={cn("flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all", tone === opt.value ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300")}>
                          <input type="radio" name="tone" value={opt.value} checked={tone === opt.value} onChange={() => setTone(opt.value)} className="mt-1 accent-primary" />
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{opt.label}</div>
                            <div className="text-xs text-slate-500">{opt.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3"><CardTitle className="text-base">Estilo de Ventas</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {STYLE_OPTIONS.map(opt => (
                      <label key={opt.value} className={cn("flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all", style === opt.value ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300")}>
                        <input type="radio" name="style" value={opt.value} checked={style === opt.value} onChange={() => setStyle(opt.value)} className="mt-1 accent-primary" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{opt.label}</div>
                          <div className="text-xs text-slate-500">{opt.description}</div>
                        </div>
                      </label>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3"><CardTitle className="text-base">Auto-Saludo</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={autoGreet} onChange={e => setAutoGreet(e.target.checked)} className="accent-primary w-4 h-4" />
                      <span className="text-sm text-slate-700">Mostrar saludo automáticamente al visitante</span>
                    </label>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Retraso (segundos)</label>
                      <Input value={greetDelay} onChange={e => setGreetDelay(e.target.value)} className="w-32" type="number" min="0" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "training" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" /> Training Center</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-500">Sube documentos para entrenar al asistente AI con conocimiento específico de tu negocio.</p>

                    <div
                      className={cn(
                        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                        dragActive ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                      )}
                      onClick={handleTrainingUpload}
                      onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                      onDrop={e => { e.preventDefault(); setDragActive(false); handleTrainingUpload(); }}
                    >
                      <Upload className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 font-medium">Arrastra archivos aquí o haz clic para subir</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, TXT, DOCX — Máximo 10MB por archivo</p>
                    </div>

                    <div className="space-y-2">
                      {trainingDocs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center",
                              doc.type === "PDF" ? "bg-red-100 text-red-600" :
                              doc.type === "DOCX" ? "bg-blue-100 text-blue-600" :
                              "bg-slate-100 text-slate-600"
                            )}>
                              {doc.type === "PDF" ? <FileText className="h-5 w-5" /> : <File className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                              <div className="text-xs text-slate-400">{doc.size} · {doc.uploadedAt}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={doc.status === "processed" ? "success" : doc.status === "processing" ? "medium" : "destructive"}
                              className="text-[10px]"
                            >
                              {doc.status === "processed" ? "Procesado" : doc.status === "processing" ? "Procesando..." : "Error"}
                            </Badge>
                            <button onClick={() => removeTrainingDoc(doc.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "questions" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Secuencia de Calificación</CardTitle>
                  <Button size="sm" onClick={addQuestion}><Plus className="h-3.5 w-3.5 mr-1" /> Agregar</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex items-center gap-3 group">
                      <span className="text-xs font-bold text-slate-400 w-6 shrink-0">{i + 1}.</span>
                      <Input
                        value={q.text}
                        onChange={e => updateQuestion(q.id, e.target.value)}
                        className="flex-1 text-sm"
                        placeholder="Escribe la pregunta..."
                      />
                      <label className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                        <input type="checkbox" checked={q.required} onChange={() => setQuestions(questions.map(x => x.id === q.id ? { ...x, required: !x.required } : x))} className="accent-primary" />
                        Requerida
                      </label>
                      <button onClick={() => removeQuestion(q.id)} className="p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "triggers" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Automation Triggers</CardTitle>
                    <Button size="sm" onClick={() => { setEditingTrigger(null); setTriggerForm({ name: "", event: "lead_score_high", condition: "", action: "" }); setShowTriggerModal(true); }}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Crear Trigger
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {triggers.map(trigger => (
                      <div key={trigger.id} className={cn("flex items-center justify-between p-4 rounded-xl border-2 transition-all", trigger.enabled ? "border-primary/20 bg-primary/5" : "border-slate-200 bg-slate-50")}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button onClick={() => toggleTrigger(trigger.id)} className="shrink-0">
                            {trigger.enabled ? <ToggleRight className="h-6 w-6 text-primary" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
                          </button>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900">{trigger.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              <span className="font-medium">Si:</span> {trigger.condition} <ArrowRight className="inline h-3 w-3 mx-1" /> {trigger.action}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Badge variant={trigger.enabled ? "success" : "secondary"} className="text-[10px]">
                            {trigger.enabled ? "Activo" : "Inactivo"}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary" onClick={() => openEditTrigger(trigger)}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500" onClick={() => deleteTrigger(trigger.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {triggers.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm">No hay triggers configurados.</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3"><CardTitle className="text-base">Lead Capture Settings</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1.5 block">Capturar lead después de N preguntas respondidas</label>
                      <Input value={captureAfterQuestions} onChange={e => setCaptureAfterQuestions(e.target.value)} className="w-32" type="number" min="1" max="10" />
                    </div>
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-semibold text-slate-700">Condiciones de Captura Automática</h4>
                      {[
                        "Visitante comparte nombre y teléfono",
                        "Visitante selecciona timeline 'Urgente'",
                        "Visitante menciona deudas o foreclosure",
                        "Visitante completa 5+ preguntas",
                        "Visitante pide hablar con agente",
                      ].map((condition, i) => (
                        <label key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                          <input type="checkbox" defaultChecked={i < 3} className="accent-primary w-4 h-4" />
                          <span className="text-sm text-slate-700">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "escalation" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3"><CardTitle className="text-base">Reglas de Escalación</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {escalationRules.map(rule => (
                    <div key={rule.id} className={cn("flex items-center justify-between p-3 rounded-xl border-2 transition-all", rule.enabled ? "border-primary/20 bg-primary/5" : "border-slate-200 bg-slate-50")}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={rule.enabled} onChange={() => toggleEscalation(rule.id)} className="accent-primary w-4 h-4" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{rule.condition}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> {rule.action}</div>
                        </div>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", rule.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
                        {rule.enabled ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "transfer" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3"><CardTitle className="text-base">Transferencia a Agente</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Agente predeterminado</label>
                    <select value={transferAgent} onChange={e => setTransferAgent(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary focus:outline-none">
                      <option value="maria-santos">María Santos (Admin)</option>
                      <option value="carlos-reyes">Carlos Reyes (Agent)</option>
                      <option value="juan-delgado">Juan Delgado (Agent)</option>
                      <option value="round-robin">Round Robin (Automático)</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Lógica de Asignación</h4>
                    <div className="space-y-2">
                      {[
                        { label: "Round robin entre agentes disponibles", checked: true },
                        { label: "Asignar según municipio del lead", checked: false },
                        { label: "Asignar según carga de trabajo", checked: true },
                        { label: "Priorizar agente con mejor tasa de cierre", checked: false },
                      ].map((item, i) => (
                        <label key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                          <input type="checkbox" defaultChecked={item.checked} className="accent-primary w-4 h-4" />
                          <span className="text-sm text-slate-700">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Mensaje de Transferencia</h4>
                    <textarea
                      defaultValue="Un momento, te voy a transferir con uno de nuestros agentes especializados que te puede ayudar mejor con tu caso. ¡Ya te atienden!"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm min-h-[80px] focus:border-primary focus:outline-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "preview" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Vista Previa del Chat</CardTitle>
                    <Button size="sm" variant="outline" onClick={startPreview}><Eye className="h-3.5 w-3.5 mr-1" /> Reiniciar</Button>
                  </div>
                  <p className="text-xs text-slate-500">Tono: {TONE_OPTIONS.find(t => t.value === tone)?.label} · Estilo: {STYLE_OPTIONS.find(s => s.value === style)?.label}</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 h-[400px] flex flex-col">
                    <div className="bg-primary text-white px-4 py-2.5 rounded-t-xl flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span className="text-sm font-semibold">Preview — {BRAND.name}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {previewMessages.map((msg, i) => (
                        <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                          <div className={cn("max-w-[80%] px-3 py-2 rounded-xl text-sm", msg.role === "user" ? "bg-primary text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm")}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-200 p-2 flex gap-2">
                      <input
                        value={previewInput}
                        onChange={e => setPreviewInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handlePreviewSend()}
                        placeholder="Escribe para probar..."
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <button onClick={handlePreviewSend} className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showTriggerModal && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowTriggerModal(false)} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md shadow-2xl border-slate-200">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-slate-900">{editingTrigger ? "Editar Trigger" : "Crear Trigger"}</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowTriggerModal(false)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                    <Input value={triggerForm.name} onChange={e => setTriggerForm(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del trigger" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Evento</label>
                    <Select value={triggerForm.event} onChange={e => setTriggerForm(p => ({ ...p, event: e.target.value }))}>
                      <option value="lead_score_high">Lead Score Alto</option>
                      <option value="no_response_48h">Sin Respuesta 48h</option>
                      <option value="keyword_detected">Keyword Detectado</option>
                      <option value="form_submitted">Formulario Enviado</option>
                      <option value="meeting_booked">Reunión Agendada</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Condición</label>
                    <Input value={triggerForm.condition} onChange={e => setTriggerForm(p => ({ ...p, condition: e.target.value }))} placeholder="Ej: Score > 80" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Acción</label>
                    <Input value={triggerForm.action} onChange={e => setTriggerForm(p => ({ ...p, action: e.target.value }))} placeholder="Ej: Notificar al equipo" />
                  </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowTriggerModal(false)}>Cancelar</Button>
                  <Button onClick={handleSaveTrigger} disabled={!triggerForm.name.trim()}>
                    {editingTrigger ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
