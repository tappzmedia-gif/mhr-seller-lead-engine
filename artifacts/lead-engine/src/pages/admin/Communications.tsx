import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui-components";
import { communications, type Communication } from "@/store";
import { cn } from "@/lib/utils";
import { Phone, Mail, MessageCircle, MessageSquare, Search, Send, X, StickyNote, Clock, User, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const TYPE_ICONS: Record<Communication["type"], typeof Phone> = {
  Call: Phone,
  Email: Mail,
  WhatsApp: MessageCircle,
  SMS: MessageSquare,
};

const TYPE_COLORS: Record<Communication["type"], { bg: string; text: string; bubble: string; border: string }> = {
  Call: { bg: "bg-blue-50", text: "text-blue-600", bubble: "bg-blue-500", border: "border-blue-200" },
  Email: { bg: "bg-purple-50", text: "text-purple-600", bubble: "bg-purple-500", border: "border-purple-200" },
  WhatsApp: { bg: "bg-green-50", text: "text-green-600", bubble: "bg-green-500", border: "border-green-200" },
  SMS: { bg: "bg-amber-50", text: "text-amber-600", bubble: "bg-amber-500", border: "border-amber-200" },
};

interface ConversationThread {
  leadId: string;
  leadName: string;
  lastMessage: string;
  lastDate: string;
  channel: Communication["type"];
  unread: number;
  messages: Communication[];
}

interface ChatMessage {
  id: string;
  text: string;
  author: string;
  date: string;
  direction: "Inbound" | "Outbound";
  type: Communication["type"];
  status: string;
}

const CLIENT_PROFILES: Record<string, { phone: string; email: string; address: string; notes: string[]; interactions: number; lastContact: string; tags: string[] }> = {
  "LD-1001": { phone: "(787) 555-0123", email: "carlos.r@email.com", address: "Santa Rosa, Bayamón", notes: ["Interesado en vender rápido", "Propiedad con problemas de techo"], interactions: 12, lastContact: "Hoy", tags: ["Motivado", "Urgente"] },
  "LD-1002": { phone: "(787) 555-0456", email: "m.lopez88@email.com", address: "Ponce Centro", notes: ["Caso de herencia", "Esperando documentos legales"], interactions: 8, lastContact: "Ayer", tags: ["Herencia", "Pendiente docs"] },
  "LD-1004": { phone: "(787) 555-0321", email: "ana.mart@email.com", address: "Valle Arriba, Carolina", notes: ["Multipropiedades", "Quiere vender 3 unidades"], interactions: 15, lastContact: "Hace 2 días", tags: ["Multi-propiedad", "Alto valor"] },
  "LD-1007": { phone: "(787) 555-1111", email: "roberto.h@email.com", address: "Caguas Centro", notes: ["Primera consulta pendiente"], interactions: 3, lastContact: "Hace 3 días", tags: ["Nuevo"] },
  "LD-1008": { phone: "(787) 555-2222", email: "isa.torres@email.com", address: "Guanajibo, Mayagüez", notes: ["Riesgo de ejecución", "Muy motivada a vender"], interactions: 6, lastContact: "Hace 1 día", tags: ["Foreclosure", "Urgente"] },
};

function buildConversations(): ConversationThread[] {
  const grouped: Record<string, Communication[]> = {};
  communications.forEach(c => {
    if (!grouped[c.leadId]) grouped[c.leadId] = [];
    grouped[c.leadId].push(c);
  });

  return Object.entries(grouped).map(([leadId, msgs]) => {
    const sorted = [...msgs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      leadId,
      leadName: sorted[0].leadName,
      lastMessage: sorted[0].body.substring(0, 60) + (sorted[0].body.length > 60 ? "..." : ""),
      lastDate: sorted[0].date,
      channel: sorted[0].type,
      unread: Math.floor(Math.random() * 3),
      messages: sorted.reverse(),
    };
  }).sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());
}

export default function Communications() {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;

  const [conversations] = useState<ConversationThread[]>(buildConversations);
  const [activeConversation, setActiveConversation] = useState<string>(conversations[0]?.leadId || "");
  const [channelFilter, setChannelFilter] = useState<Communication["type"] | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, ChatMessage[]>>({});
  const [showProfile, setShowProfile] = useState(true);
  const [noteInput, setNoteInput] = useState("");
  const [clientNotes, setClientNotes] = useState<Record<string, string[]>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations
    .filter(c => channelFilter === "All" || c.channel === channelFilter)
    .filter(c => !searchTerm || c.leadName.toLowerCase().includes(searchTerm.toLowerCase()));

  const current = conversations.find(c => c.leadId === activeConversation);
  const currentChannel = current?.channel || "WhatsApp";
  const colors = TYPE_COLORS[currentChannel];

  const allMessages: ChatMessage[] = [
    ...(current?.messages.map(m => ({
      id: m.id,
      text: m.body,
      author: m.author,
      date: m.date,
      direction: m.direction,
      type: m.type,
      status: m.status,
    })) || []),
    ...(localMessages[activeConversation] || []),
  ];

  const profile = current ? CLIENT_PROFILES[current.leadId] || {
    phone: "(787) 555-0000",
    email: "contacto@email.com",
    address: "Puerto Rico",
    notes: [],
    interactions: 1,
    lastContact: "Reciente",
    tags: [],
  } : null;

  const allNotes = [
    ...(profile?.notes || []),
    ...(clientNotes[activeConversation] || []),
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const handleSend = () => {
    if (!messageInput.trim() || !current) return;
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      text: messageInput.trim(),
      author: "Tú",
      date: new Date().toISOString(),
      direction: "Outbound",
      type: currentChannel,
      status: "Sent",
    };
    setLocalMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMsg],
    }));
    setMessageInput("");
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setClientNotes(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), noteInput.trim()],
    }));
    setNoteInput("");
  };

  const channelTypes: (Communication["type"] | "All")[] = ["All", "WhatsApp", "Call", "Email", "SMS"];

  return (
    <AdminLayout breadcrumbs={[{ label: t("titleDashboard"), href: "/admin/dashboard" }, { label: t("titleCommunications") }]}>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className="w-80 border-r border-slate-200 flex flex-col bg-white shrink-0">
          <div className="p-3 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder={t("comms.searchConvPlaceholder")} className="pl-9 h-9 bg-slate-50 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {channelTypes.map(ch => {
                const Icon = ch === "All" ? MessageSquare : TYPE_ICONS[ch];
                return (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(ch)}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg whitespace-nowrap transition-all",
                      channelFilter === ch ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {ch === "All" ? t("common.all") : ch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conv => {
              const Icon = TYPE_ICONS[conv.channel];
              const isActive = conv.leadId === activeConversation;
              return (
                <button
                  key={conv.leadId}
                  onClick={() => setActiveConversation(conv.leadId)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 text-left transition-colors border-b border-slate-50",
                    isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", TYPE_COLORS[conv.channel].bg)}>
                    <Icon className={cn("h-4 w-4", TYPE_COLORS[conv.channel].text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-sm font-semibold truncate", isActive ? "text-primary" : "text-slate-900")}>{conv.leadName}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{format(new Date(conv.lastDate), "d MMM", { locale: dateLocale })}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">{conv.channel}</Badge>
                      {conv.unread > 0 && <span className="bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{conv.unread}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          {current ? (
            <>
              <div className={cn("h-14 border-b flex items-center justify-between px-4 shrink-0 bg-white", colors.border, "border-b-2")}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", colors.bg)}>
                    {(() => { const Icon = TYPE_ICONS[currentChannel]; return <Icon className={cn("h-4 w-4", colors.text)} />; })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/leads/${current.leadId}`} className="text-sm font-semibold text-slate-900 hover:text-primary">{current.leadName}</Link>
                      <Badge className={cn("text-[10px]", colors.bg, colors.text)}>{currentChannel}</Badge>
                    </div>
                    <div className="text-[11px] text-slate-400">{current.leadId} · {allMessages.length} mensajes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className={cn("p-2 rounded-lg transition-colors", showProfile ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100")}
                  >
                    <User className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {allMessages.map(msg => {
                      const isOutbound = msg.direction === "Outbound";
                      return (
                        <div key={msg.id} className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
                          <div className={cn("max-w-[70%] space-y-1")}>
                            <div className={cn(
                              "px-4 py-2.5 rounded-2xl text-sm",
                              isOutbound
                                ? cn(colors.bubble, "text-white rounded-br-md")
                                : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                            )}>
                              {msg.text}
                            </div>
                            <div className={cn("flex items-center gap-2 text-[10px] text-slate-400 px-1", isOutbound ? "justify-end" : "justify-start")}>
                              {isOutbound ? (
                                <>
                                  <span>{msg.status}</span>
                                  <span>·</span>
                                  <span>{msg.author}</span>
                                </>
                              ) : (
                                <>
                                  <span>{msg.author}</span>
                                </>
                              )}
                              <span>·</span>
                              <span>{format(new Date(msg.date), "d MMM, h:mm a", { locale: dateLocale })}</span>
                              {isOutbound ? <ArrowUpRight className="h-2.5 w-2.5 text-blue-400" /> : <ArrowDownLeft className="h-2.5 w-2.5 text-green-400" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  <div className={cn("border-t p-3 shrink-0 bg-white", colors.border, "border-t-2")}>
                    <div className="flex items-center gap-2">
                      <div className={cn("px-2 py-1 rounded text-[10px] font-semibold", colors.bg, colors.text)}>
                        {currentChannel}
                      </div>
                      <input
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                        placeholder={`Mensaje vía ${currentChannel}...`}
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                      <button onClick={handleSend} className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors shrink-0", colors.bubble, "hover:opacity-90")}>
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {showProfile && profile && (
                <>
                  <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowProfile(false)} />
                  <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 max-w-[95vw] max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-y-auto">
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-900">{t("comms.clientInfo")}</h3>
                        <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                        {current.leadName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-slate-900">{current.leadName}</div>
                        <div className="text-xs text-slate-500">{current.leadId}</div>
                      </div>
                    </div>

                    <div className="p-4 border-b border-slate-100 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">{profile.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">{t("comms.lastContact")}: {profile.lastContact}</span>
                      </div>
                    </div>

                    <div className="p-4 border-b border-slate-100">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-slate-900">{profile.interactions}</div>
                          <div className="text-[10px] text-slate-500">{t("comms.interactions")}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-slate-900">{allMessages.length}</div>
                          <div className="text-[10px] text-slate-500">{t("comms.messages")}</div>
                        </div>
                      </div>
                    </div>

                    {profile.tags.length > 0 && (
                      <div className="p-4 border-b border-slate-100">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-2">{t("comms.tags")}</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 flex-1">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <StickyNote className="h-3 w-3" /> Notas ({allNotes.length})
                      </h4>
                      <div className="space-y-2 mb-3">
                        {allNotes.map((note, i) => (
                          <div key={i} className="text-xs text-slate-600 bg-amber-50 border border-amber-100 p-2 rounded-lg">
                            {note}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          value={noteInput}
                          onChange={e => setNoteInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleAddNote()}
                          placeholder={t("comms.addNotePlaceholder")}
                          className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button onClick={handleAddNote} className="px-2 py-1.5 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("comms.selectConversation")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
