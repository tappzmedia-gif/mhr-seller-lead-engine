import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MessageCircle, Users, Maximize, Send, X, Hand, Settings } from "lucide-react";
import { meetingsService } from "@/lib/services/meetingsService";
import type { Meeting } from "@/lib/operations-types";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: "p1", name: "María Santos", avatar: "MS", isMuted: false, isVideoOn: true, isSpeaking: true, isScreenSharing: false },
  { id: "p2", name: "Carlos Rivera", avatar: "CR", isMuted: true, isVideoOn: true, isSpeaking: false, isScreenSharing: false },
  { id: "p3", name: "Juan Delgado", avatar: "JD", isMuted: false, isVideoOn: false, isSpeaking: false, isScreenSharing: false },
  { id: "p4", name: "Ana Rodríguez", avatar: "AR", isMuted: true, isVideoOn: true, isSpeaking: false, isScreenSharing: false },
];

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
}

const MOCK_CHAT: ChatMessage[] = [
  { id: "c1", author: "María Santos", text: "Bienvenidos a la reunión. Vamos a revisar la propiedad de Carlos.", time: "10:00" },
  { id: "c2", author: "Carlos Rivera", text: "Gracias. Tengo algunas preguntas sobre la oferta.", time: "10:01" },
  { id: "c3", author: "Juan Delgado", text: "Perfecto, estamos listos para discutir.", time: "10:02" },
];

export default function InMeetingPage() {
  const [, params] = useRoute("/admin/meeting/:id");
  const meetingId = params?.id || "MTG-001";

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [participants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("00:12:34");

  useEffect(() => {
    meetingsService.getById(meetingId).then(m => {
      if (m) setMeeting(m);
    });
  }, [meetingId]);

  const meetingLink = meeting?.meetingLink || '';
  const meetingTitle = meeting?.title || `Reunión ${meetingId}`;
  const meetingProvider = meeting?.provider || 'zoom';
  const meetingLocation = meeting?.location || '';

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: `c-${Date.now()}`,
      author: "Tú",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString("es-PR", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setChatInput("");
  };

  if (meetingEnded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <PhoneOff className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Reunión Finalizada</h1>
          <p className="text-slate-400 mb-1">Duración: {elapsedTime}</p>
          <p className="text-slate-400 mb-6">{participants.length} participantes</p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/meetings">
              <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Volver a Reuniones
              </button>
            </Link>
            <Link href="/admin/calendar">
              <button className="px-6 py-2.5 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors">
                Ver Calendario
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-sm font-semibold truncate max-w-[300px]">{meetingTitle}</span>
          {meetingProvider && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">
              {meetingProvider === 'in-person' ? 'Presencial' : meetingProvider === 'google-meet' ? 'Google Meet' : meetingProvider}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {meetingLink && (
            <span className="text-xs text-primary truncate max-w-[150px] hidden sm:block" title={meetingLink}>
              {meetingLink}
            </span>
          )}
          {meetingLocation && !meetingLink && (
            <span className="text-xs text-slate-400 truncate max-w-[150px] hidden sm:block">
              {meetingLocation}
            </span>
          )}
          <span className="text-slate-400 text-sm font-mono">{elapsedTime}</span>
          <span className="text-slate-400 text-sm flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {participants.length}
          </span>
          <button className="p-1.5 text-slate-400 hover:text-white rounded"><Settings className="h-4 w-4" /></button>
          <button className="p-1.5 text-slate-400 hover:text-white rounded"><Maximize className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 flex flex-col min-w-0">
          <div className={cn("flex-1 grid gap-3", participants.length <= 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2")}>
            {participants.map(p => (
              <div key={p.id} className={cn("relative rounded-xl overflow-hidden bg-slate-800 border-2 transition-all", p.isSpeaking ? "border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-slate-700")}>
                {p.isVideoOn ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                      {p.avatar}
                    </div>
                    <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.3),transparent)] animate-spin" style={{ animationDuration: "8s" }} />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-white text-2xl font-bold">
                      {p.avatar}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-white text-sm font-medium">{p.name}</span>
                    {p.isMuted && <MicOff className="h-3.5 w-3.5 text-red-400" />}
                  </div>
                  {p.isSpeaking && (
                    <div className="flex items-center gap-0.5 bg-emerald-500/20 px-2 py-1 rounded-full">
                      <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                      <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
                      <div className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                    </div>
                  )}
                </div>

                {!p.isVideoOn && (
                  <div className="absolute top-3 right-3">
                    <VideoOff className="h-4 w-4 text-slate-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {(showChat || showParticipants) && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col shrink-0">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => { setShowChat(true); setShowParticipants(false); }}
                className={cn("flex-1 py-2.5 text-xs font-semibold transition-colors", showChat && !showParticipants ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-white")}
              >
                Chat
              </button>
              <button
                onClick={() => { setShowParticipants(true); setShowChat(false); }}
                className={cn("flex-1 py-2.5 text-xs font-semibold transition-colors", showParticipants ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-white")}
              >
                Participantes ({participants.length})
              </button>
              <button
                onClick={() => { setShowChat(false); setShowParticipants(false); }}
                className="px-3 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {showChat && !showParticipants && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-slate-300">{msg.author}</span>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-400">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-700 p-2 flex gap-1.5 shrink-0">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendChat()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-slate-700 text-white text-sm px-3 py-1.5 rounded-lg placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button onClick={handleSendChat} className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}

            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {participants.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xs font-bold">{p.avatar}</div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.isSpeaking ? "Hablando..." : p.isMuted ? "Silenciado" : "Conectado"}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {p.isMuted ? <MicOff className="h-3.5 w-3.5 text-red-400" /> : <Mic className="h-3.5 w-3.5 text-emerald-400" />}
                      {p.isVideoOn ? <Video className="h-3.5 w-3.5 text-emerald-400" /> : <VideoOff className="h-3.5 w-3.5 text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-16 bg-slate-800 border-t border-slate-700 flex items-center justify-center gap-3 shrink-0">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", isMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-slate-700 hover:bg-slate-600 text-white")}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", !isVideoOn ? "bg-red-500 hover:bg-red-600 text-white" : "bg-slate-700 hover:bg-slate-600 text-white")}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", isScreenSharing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-slate-700 hover:bg-slate-600 text-white")}
        >
          <Monitor className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIsHandRaised(!isHandRaised)}
          className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", isHandRaised ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-slate-700 hover:bg-slate-600 text-white")}
        >
          <Hand className="h-5 w-5" />
        </button>
        <button
          onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
          className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", showChat ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-700 hover:bg-slate-600 text-white")}
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
          className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", showParticipants ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-700 hover:bg-slate-600 text-white")}
        >
          <Users className="h-5 w-5" />
        </button>

        <div className="w-px h-8 bg-slate-600 mx-2" />

        <button
          onClick={() => setMeetingEnded(true)}
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
