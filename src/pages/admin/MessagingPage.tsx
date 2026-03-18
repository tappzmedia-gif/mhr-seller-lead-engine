import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { cn } from "@/lib/utils";
import { Hash, AtSign, Send, Paperclip, Smile, MessageSquare, Plus, Search, ChevronDown, Reply, MoreHorizontal, Bell, Pin } from "lucide-react";
import { teamMembers } from "@/store";

interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  reactions: { emoji: string; count: number; reacted: boolean }[];
  thread?: Message[];
  isPinned?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: "channel" | "dm";
  unread: number;
  icon?: string;
  lastMessage?: string;
  members?: string[];
}

const CHANNELS: Channel[] = [
  { id: "ch-1", name: "marketing", type: "channel", unread: 3, lastMessage: "Nueva campaña de FB lista para revisión" },
  { id: "ch-2", name: "closers", type: "channel", unread: 1, lastMessage: "Pedro Morales aceptó contraoferta" },
  { id: "ch-3", name: "brokers", type: "channel", unread: 0, lastMessage: "Evaluación de Arecibo completada" },
  { id: "ch-4", name: "admin", type: "channel", unread: 5, lastMessage: "Reunión de equipo mañana a las 9am" },
  { id: "ch-5", name: "general", type: "channel", unread: 0, lastMessage: "Bienvenidos al nuevo sistema de mensajería" },
];

const DMS: Channel[] = [
  { id: "dm-1", name: "María Santos", type: "dm", unread: 2, icon: "MS", lastMessage: "¿Puedes revisar la oferta de Carolina?" },
  { id: "dm-2", name: "Carlos Reyes", type: "dm", unread: 0, icon: "CR", lastMessage: "Listo, ya subí las fotos" },
  { id: "dm-3", name: "Juan Delgado", type: "dm", unread: 1, icon: "JD", lastMessage: "Voy camino a la evaluación" },
  { id: "dm-4", name: "Ana Rodríguez", type: "dm", unread: 0, icon: "AR", lastMessage: "Gracias por la info" },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  "ch-1": [
    { id: "m1", author: "María Santos", avatar: "MS", text: "¡Equipo! La nueva campaña de Facebook está lista. Target: propietarios en el área metro con casas que necesitan reparaciones.", timestamp: "9:15 AM", reactions: [{ emoji: "👍", count: 3, reacted: false }, { emoji: "🔥", count: 2, reacted: true }] },
    { id: "m2", author: "Carlos Reyes", avatar: "CR", text: "El copy se ve genial. ¿Cuál es el presupuesto diario?", timestamp: "9:22 AM", reactions: [] },
    { id: "m3", author: "María Santos", avatar: "MS", text: "$50/día para empezar. Si los números son buenos, subimos a $100.", timestamp: "9:25 AM", reactions: [{ emoji: "✅", count: 1, reacted: false }] },
    { id: "m4", author: "Juan Delgado", avatar: "JD", text: "¿Incluimos el área de Caguas también? Hemos tenido buenos resultados ahí.", timestamp: "9:30 AM", reactions: [] },
    { id: "m5", author: "Ana Rodríguez", avatar: "AR", text: "Sugiero que incluyamos testimonios de sellers recientes. Eso mejoró el CTR en la última campaña un 40%.", timestamp: "9:35 AM", reactions: [{ emoji: "💡", count: 4, reacted: true }] },
    { id: "m6", author: "María Santos", avatar: "MS", text: "Excelente idea Ana. Carlos, ¿puedes coordinar con el equipo de diseño para los creatives?", timestamp: "9:40 AM", reactions: [] },
    { id: "m7", author: "Carlos Reyes", avatar: "CR", text: "Sí, lo coordino hoy. Nueva campaña de FB lista para revisión 🚀", timestamp: "10:05 AM", reactions: [{ emoji: "🎯", count: 2, reacted: false }], isPinned: true },
  ],
  "ch-2": [
    { id: "m8", author: "Juan Delgado", avatar: "JD", text: "Update: Pedro Morales respondió a la contraoferta. Acepta $255k.", timestamp: "8:45 AM", reactions: [{ emoji: "🎉", count: 3, reacted: true }] },
    { id: "m9", author: "María Santos", avatar: "MS", text: "¡Excelente! Eso está dentro del rango aprobado. Procede con el contrato.", timestamp: "8:50 AM", reactions: [] },
    { id: "m10", author: "Juan Delgado", avatar: "JD", text: "Perfecto. Voy a preparar los documentos de cierre. ¿Usamos el título del template estándar?", timestamp: "8:55 AM", reactions: [] },
    { id: "m11", author: "María Santos", avatar: "MS", text: "Sí, template estándar. Fecha de cierre tentativa: 2 semanas.", timestamp: "9:00 AM", reactions: [{ emoji: "👍", count: 1, reacted: false }] },
    { id: "m12", author: "Carlos Reyes", avatar: "CR", text: "Pedro Morales aceptó contraoferta 🏠💰", timestamp: "9:10 AM", reactions: [{ emoji: "🥳", count: 2, reacted: false }] },
  ],
  "ch-3": [
    { id: "m13", author: "Carlos Reyes", avatar: "CR", text: "Completé la evaluación de la propiedad en Arecibo (Luis García). Casa en muy mal estado.", timestamp: "2:30 PM", reactions: [] },
    { id: "m14", author: "Carlos Reyes", avatar: "CR", text: "Valor estimado: $65k-$75k. Necesita techo nuevo, plomería, eléctrica. Fotos subidas al sistema.", timestamp: "2:32 PM", reactions: [{ emoji: "📸", count: 1, reacted: false }] },
    { id: "m15", author: "María Santos", avatar: "MS", text: "Gracias Carlos. ¿El seller sigue motivado?", timestamp: "2:45 PM", reactions: [] },
    { id: "m16", author: "Carlos Reyes", avatar: "CR", text: "Muy motivado. Tiene $8k de deuda CRIM. Quiere salir de la propiedad ya. Evaluación de Arecibo completada.", timestamp: "2:50 PM", reactions: [{ emoji: "✅", count: 2, reacted: false }] },
  ],
  "ch-4": [
    { id: "m17", author: "María Santos", avatar: "MS", text: "📋 Recordatorio: Reunión de equipo mañana a las 9:00 AM\n\nAgenda:\n1. Review de pipeline\n2. Nuevos leads de la semana\n3. Status de ofertas pendientes\n4. Estrategia Q2", timestamp: "4:00 PM", reactions: [{ emoji: "👍", count: 4, reacted: true }], isPinned: true },
    { id: "m18", author: "Juan Delgado", avatar: "JD", text: "Confirmo asistencia. Preparo el reporte de ofertas.", timestamp: "4:15 PM", reactions: [] },
    { id: "m19", author: "Carlos Reyes", avatar: "CR", text: "También confirmo. Tengo updates de 3 evaluaciones.", timestamp: "4:20 PM", reactions: [] },
    { id: "m20", author: "Ana Rodríguez", avatar: "AR", text: "Confirmo. Tengo propuesta para optimizar el proceso de follow-up.", timestamp: "4:30 PM", reactions: [{ emoji: "💡", count: 1, reacted: false }] },
    { id: "m21", author: "María Santos", avatar: "MS", text: "Reunión de equipo mañana a las 9am. ¡No falten! 🗓️", timestamp: "4:35 PM", reactions: [] },
  ],
  "ch-5": [
    { id: "m22", author: "María Santos", avatar: "MS", text: "¡Bienvenidos al nuevo sistema de mensajería interna! 🎉 Aquí podremos coordinar mejor como equipo.", timestamp: "8:00 AM", reactions: [{ emoji: "🎉", count: 5, reacted: true }, { emoji: "❤️", count: 3, reacted: false }], isPinned: true },
  ],
  "dm-1": [
    { id: "dm-m1", author: "María Santos", avatar: "MS", text: "Hola, ¿puedes revisar la oferta de Carolina? Ana Martínez quiere respuesta hoy.", timestamp: "11:00 AM", reactions: [] },
    { id: "dm-m2", author: "Tú", avatar: "YO", text: "Sí, la estoy revisando ahora. ¿$185k es el tope?", timestamp: "11:05 AM", reactions: [] },
    { id: "dm-m3", author: "María Santos", avatar: "MS", text: "Podemos subir hasta $195k si es necesario. Pero prefiero cerrar en $185k.", timestamp: "11:08 AM", reactions: [{ emoji: "👍", count: 1, reacted: true }] },
  ],
  "dm-2": [
    { id: "dm-m4", author: "Carlos Reyes", avatar: "CR", text: "Ya subí las fotos de la evaluación de Arecibo al sistema.", timestamp: "3:00 PM", reactions: [] },
    { id: "dm-m5", author: "Tú", avatar: "YO", text: "Perfecto, las reviso. Listo, ya subí las fotos.", timestamp: "3:15 PM", reactions: [{ emoji: "✅", count: 1, reacted: false }] },
  ],
  "dm-3": [
    { id: "dm-m6", author: "Juan Delgado", avatar: "JD", text: "Voy camino a la evaluación de Isabel Torres en Mayagüez. Llego en 30 min.", timestamp: "1:30 PM", reactions: [] },
    { id: "dm-m7", author: "Tú", avatar: "YO", text: "OK, ten cuidado con el tema del foreclosure. Es caso sensible.", timestamp: "1:32 PM", reactions: [] },
    { id: "dm-m8", author: "Juan Delgado", avatar: "JD", text: "Entendido. Voy preparado. Te actualizo cuando termine.", timestamp: "1:35 PM", reactions: [{ emoji: "👍", count: 1, reacted: false }] },
  ],
  "dm-4": [
    { id: "dm-m9", author: "Ana Rodríguez", avatar: "AR", text: "Gracias por la info sobre el lead de Trujillo Alto. Ya lo marqué como not qualified.", timestamp: "10:00 AM", reactions: [] },
  ],
};

const EMOJIS = ["👍", "❤️", "🔥", "💡", "✅", "🎉", "😂", "🚀"];

export default function MessagingPage() {
  const [activeChannel, setActiveChannel] = useState<string>("ch-1");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [threadMessage, setThreadMessage] = useState<Message | null>(null);
  const [threadInput, setThreadInput] = useState("");

  const allChannels = [...CHANNELS, ...DMS];
  const currentChannel = allChannels.find(c => c.id === activeChannel);
  const currentMessages = messages[activeChannel] || [];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: "Tú",
      avatar: "MS",
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString("es-PR", { hour: "2-digit", minute: "2-digit" }),
      reactions: [],
    };
    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setMessageInput("");
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => {
      const channelMsgs = [...(prev[activeChannel] || [])];
      const msgIndex = channelMsgs.findIndex(m => m.id === messageId);
      if (msgIndex === -1) return prev;
      const msg = { ...channelMsgs[msgIndex] };
      const reactionIndex = msg.reactions.findIndex(r => r.emoji === emoji);
      if (reactionIndex >= 0) {
        const reaction = { ...msg.reactions[reactionIndex] };
        reaction.reacted = !reaction.reacted;
        reaction.count += reaction.reacted ? 1 : -1;
        msg.reactions = [...msg.reactions];
        msg.reactions[reactionIndex] = reaction;
      } else {
        msg.reactions = [...msg.reactions, { emoji, count: 1, reacted: true }];
      }
      channelMsgs[msgIndex] = msg;
      return { ...prev, [activeChannel]: channelMsgs };
    });
    setShowEmojiPicker(null);
  };

  const handleThreadReply = () => {
    if (!threadInput.trim() || !threadMessage) return;
    const reply: Message = {
      id: `thread-${Date.now()}`,
      author: "Tú",
      avatar: "MS",
      text: threadInput.trim(),
      timestamp: new Date().toLocaleTimeString("es-PR", { hour: "2-digit", minute: "2-digit" }),
      reactions: [],
    };
    setMessages(prev => {
      const channelMsgs = [...(prev[activeChannel] || [])];
      const msgIndex = channelMsgs.findIndex(m => m.id === threadMessage.id);
      if (msgIndex === -1) return prev;
      const msg = { ...channelMsgs[msgIndex] };
      msg.thread = [...(msg.thread || []), reply];
      channelMsgs[msgIndex] = msg;
      return { ...prev, [activeChannel]: channelMsgs };
    });
    setThreadInput("");
  };

  const totalUnread = [...CHANNELS, ...DMS].reduce((sum, c) => sum + c.unread, 0);

  return (
    <AdminLayout breadcrumbs={[{ label: "Messaging" }]}>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar conversaciones..."
                className="w-full bg-white/10 text-white text-xs px-8 py-2 rounded-md placeholder:text-slate-500 focus:outline-none focus:bg-white/15"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-3 pt-4 pb-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Canales</span>
                <button className="text-slate-500 hover:text-white"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              {CHANNELS.filter(c => !searchQuery || c.name.includes(searchQuery.toLowerCase())).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors", activeChannel === ch.id ? "bg-primary text-white" : "text-slate-300 hover:bg-white/10")}
                >
                  <Hash className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <span className="truncate">{ch.name}</span>
                  {ch.unread > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">{ch.unread}</span>}
                </button>
              ))}
            </div>

            <div className="px-3 pt-4 pb-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mensajes Directos</span>
                <button className="text-slate-500 hover:text-white"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              {DMS.filter(d => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(dm => (
                <button
                  key={dm.id}
                  onClick={() => setActiveChannel(dm.id)}
                  className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors", activeChannel === dm.id ? "bg-primary text-white" : "text-slate-300 hover:bg-white/10")}
                >
                  <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold shrink-0">{dm.icon}</div>
                  <span className="truncate">{dm.name}</span>
                  {dm.unread > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">{dm.unread}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              {currentChannel?.type === "channel" ? <Hash className="h-4 w-4 text-slate-400" /> : <AtSign className="h-4 w-4 text-slate-400" />}
              <span className="font-semibold text-slate-900 text-sm">{currentChannel?.name}</span>
              {currentChannel?.type === "channel" && <span className="text-xs text-slate-400">· {(currentMessages.length > 0 ? new Set(currentMessages.map(m => m.author)).size : 0)} miembros</span>}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded"><Pin className="h-4 w-4" /></button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded"><Bell className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                {currentMessages.map(msg => (
                  <div key={msg.id} className={cn("group flex items-start gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors", msg.isPinned && "bg-amber-50/50")}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", msg.author === "Tú" ? "bg-primary" : "bg-slate-600")}>
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{msg.author}</span>
                        <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                        {msg.isPinned && <Pin className="h-3 w-3 text-amber-500" />}
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-line mt-0.5">{msg.text}</p>
                      {msg.reactions.length > 0 && (
                        <div className="flex gap-1 mt-1.5">
                          {msg.reactions.map((r, i) => (
                            <button
                              key={i}
                              onClick={() => handleReaction(msg.id, r.emoji)}
                              className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors", r.reacted ? "border-primary/30 bg-primary/5 text-primary" : "border-slate-200 hover:border-slate-300 text-slate-500")}
                            >
                              {r.emoji} {r.count}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.thread && msg.thread.length > 0 && (
                        <button onClick={() => setThreadMessage(msg)} className="mt-1.5 text-xs text-primary font-medium hover:underline flex items-center gap-1">
                          <Reply className="h-3 w-3" /> {msg.thread.length} respuesta{msg.thread.length > 1 ? "s" : ""}
                        </button>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                      <button onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)} className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                        <Smile className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setThreadMessage(msg)} className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                        <Reply className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {showEmojiPicker === msg.id && (
                      <div className="absolute right-16 mt-8 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                        {EMOJIS.map(emoji => (
                          <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="w-8 h-8 hover:bg-slate-100 rounded flex items-center justify-center text-base">
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 p-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    placeholder={`Mensaje en #${currentChannel?.name || ""}...`}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button onClick={handleSendMessage} className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {threadMessage && (
              <div className="w-80 border-l border-slate-200 flex flex-col shrink-0">
                <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4">
                  <span className="text-sm font-semibold text-slate-900">Hilo</span>
                  <button onClick={() => setThreadMessage(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-md bg-slate-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{threadMessage.avatar}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900">{threadMessage.author}</span>
                        <span className="text-[10px] text-slate-400">{threadMessage.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5">{threadMessage.text}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Respuestas</span>
                  </div>
                  {(threadMessage.thread || []).map(reply => (
                    <div key={reply.id} className="flex items-start gap-2">
                      <div className={cn("w-7 h-7 rounded-md text-white text-[10px] font-bold flex items-center justify-center shrink-0", reply.author === "Tú" ? "bg-primary" : "bg-slate-600")}>{reply.avatar}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900">{reply.author}</span>
                          <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 p-2 flex gap-1.5 shrink-0">
                  <input
                    value={threadInput}
                    onChange={e => setThreadInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleThreadReply()}
                    placeholder="Responder..."
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button onClick={handleThreadReply} className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center">
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
