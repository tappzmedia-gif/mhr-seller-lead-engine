import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/mock-data";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  options?: string[];
  timestamp: Date;
}

const QUALIFICATION_FLOW: { key: string; question: string; options?: string[] }[] = [
  { key: "greeting", question: `¡Hola! 👋 Soy el asistente virtual de ${BRAND.name}. Estoy aquí para ayudarte con la venta de tu propiedad en Puerto Rico. ¿En qué te puedo ayudar?`, options: ["Quiero vender mi propiedad", "Ver propiedades disponibles", "Agendar una cita", "Hablar con un agente"] },
  { key: "property_type", question: "¡Excelente! Me encantaría ayudarte. ¿Qué tipo de propiedad tienes?", options: ["Casa", "Apartamento", "Terreno", "Comercial", "Multifamiliar"] },
  { key: "municipality", question: "¿En qué municipio se encuentra la propiedad?" },
  { key: "timeline", question: "¿Cuál es tu timeline para vender?", options: ["Urgente (menos de 7 días)", "Este mes", "30-60 días", "Solo estoy evaluando"] },
  { key: "condition", question: "¿En qué condición se encuentra la propiedad?", options: ["Excelente", "Buena", "Regular", "Necesita reparaciones", "Muy deteriorada"] },
  { key: "motivation", question: "¿Cuál es tu principal motivación para vender?", options: ["Deudas / Foreclosure", "Herencia", "Mudanza", "No quiero invertir más", "Otra razón"] },
  { key: "contact_name", question: "¡Perfecto! Basado en lo que me cuentas, definitivamente podemos ayudarte. Para preparar una evaluación personalizada, ¿me puedes dar tu nombre completo?" },
  { key: "contact_phone", question: "¿Y tu número de teléfono para contactarte?" },
  { key: "contact_email", question: "¿Tu correo electrónico?" },
  { key: "complete", question: "¡Gracias! 🎉 He creado tu perfil en nuestro sistema. Un agente especializado te contactará en las próximas 24 horas para discutir tu caso.\n\n📋 Resumen:\n• Tipo: {property_type}\n• Municipio: {municipality}\n• Timeline: {timeline}\n• Condición: {condition}\n\n¿Hay algo más en que te pueda ayudar?", options: ["Agendar una cita ahora", "Ver propiedades disponibles", "No, gracias"] },
];

const PROPERTY_RECOMMENDATIONS = [
  { name: "Casa en Bayamón", price: "$95,000", beds: 3, baths: 2 },
  { name: "Apartamento en San Juan", price: "$120,000", beds: 2, baths: 1 },
  { name: "Casa en Carolina", price: "$185,000", beds: 4, baths: 3 },
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [leadData, setLeadData] = useState<Record<string, string>>({});
  const [leadCreated, setLeadCreated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(QUALIFICATION_FLOW[0].question, QUALIFICATION_FLOW[0].options);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        role: "bot",
        text,
        options,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleUserResponse = (text: string) => {
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date(),
    }]);

    const step = QUALIFICATION_FLOW[currentStep];

    if (text === "Agendar una cita ahora" || text === "Ir a agendar cita" || text === "Agendar una cita") {
      addBotMessage("¡Te redirijo al sistema de reservaciones! 📅");
      setTimeout(() => {
        window.location.href = `${import.meta.env.BASE_URL}book`;
      }, 1200);
      return;
    }
    if (text === "Ver propiedades disponibles") {
      addBotMessage(
        "Aquí tienes algunas propiedades destacadas:\n\n" +
        PROPERTY_RECOMMENDATIONS.map(p => `🏠 ${p.name} — ${p.price} (${p.beds}H/${p.baths}B)`).join("\n") +
        "\n\n¿Te interesa alguna o prefieres contarme sobre tu propiedad?",
        ["Quiero vender mi propiedad", "Agendar una cita"]
      );
      return;
    }
    if (text === "Hablar con un agente") {
      addBotMessage(`Puedes comunicarte directamente con nuestro equipo:\n\n📞 Metro: ${BRAND.phones.metro}\n📞 Isla: ${BRAND.phones.isla}\n📧 ${BRAND.email}\n\n¿O prefieres que un agente te contacte?`, ["Sí, que me contacten", "Prefiero llamar yo"]);
      return;
    }
    if (text === "Prefiero llamar yo" || text === "No, gracias") {
      addBotMessage("¡Perfecto! Estamos aquí cuando nos necesites. ¡Que tengas un excelente día! 😊");
      return;
    }
    if (text === "Sí, que me contacten" || text === "Quiero vender mi propiedad" || text === "Mejor cuéntame más") {
      if (currentStep < 1) {
        setCurrentStep(1);
        const next = QUALIFICATION_FLOW[1];
        addBotMessage(next.question, next.options);
        return;
      }
    }

    if (currentStep === 0) {
      setCurrentStep(1);
      const next = QUALIFICATION_FLOW[1];
      addBotMessage(next.question, next.options);
      return;
    }

    if (step) {
      const newData = { ...leadData, [step.key]: text };
      setLeadData(newData);
    }

    const nextStep = currentStep + 1;
    if (nextStep < QUALIFICATION_FLOW.length) {
      setCurrentStep(nextStep);
      const next = QUALIFICATION_FLOW[nextStep];
      let questionText = next.question;

      if (next.key === "complete") {
        const data = { ...leadData, [step.key]: text };
        questionText = questionText
          .replace("{property_type}", data.property_type || "N/A")
          .replace("{municipality}", data.municipality || "N/A")
          .replace("{timeline}", data.timeline || "N/A")
          .replace("{condition}", data.condition || "N/A");

        if (!leadCreated) {
          setLeadCreated(true);
          window.dispatchEvent(new CustomEvent("chatbot-lead-created", { detail: data }));
        }
      }

      addBotMessage(questionText, next.options);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleUserResponse(inputValue.trim());
    setInputValue("");
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center group"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{BRAND.name}</div>
                <div className="text-[11px] text-white/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Asistente Virtual
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%]", msg.role === "user" ? "order-1" : "order-1")}>
                  <div className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line",
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-slate-100 text-slate-800 rounded-bl-md"
                  )}>
                    {msg.text}
                  </div>
                  {msg.options && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleUserResponse(opt)}
                          className="px-3 py-1.5 bg-white border border-primary/30 text-primary text-xs font-medium rounded-full hover:bg-primary hover:text-white transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className={cn("text-[10px] text-slate-400 mt-1", msg.role === "user" ? "text-right" : "text-left")}>
                    {msg.timestamp.toLocaleTimeString("es-PR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex gap-1 bg-slate-100 px-3 py-2 rounded-2xl rounded-bl-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 p-3 flex gap-2 shrink-0">
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
