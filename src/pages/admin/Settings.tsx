import { useState, useRef, useCallback, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Badge } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import {
  Building2, Users, Bell, Shield, Save, Check, Plus, Trash2, Palette, FileText,
  Settings2, Globe, Smartphone, Calendar, Video, DollarSign, FolderOpen, Plug,
  Upload, X, Image, Type, Eye, GripVertical, ChevronUp, ChevronDown
} from "lucide-react";
import { getBranding, updateBranding } from "@/store/branding-store";
import { getContactSettings, updateContactSettings } from "@/store/contact-store";
import { getRoles, addRole, updateRole, deleteRole, ALL_MODULES } from "@/store/roles-store";
import type { Role, RolePermission } from "@/store/roles-store";
import { teamMembers } from "@/store";

const TABS = [
  { key: "branding", label: "Branding", icon: Palette },
  { key: "contact", label: "Contacto", icon: Smartphone },
  { key: "team", label: "Equipo", icon: Users },
  { key: "roles", label: "Roles", icon: Shield },
  { key: "scoring", label: "Scoring", icon: Shield },
  { key: "pipeline", label: "Pipeline", icon: Settings2 },
  { key: "notifications", label: "Notificaciones", icon: Bell },
  { key: "form", label: "Formulario", icon: FileText },
  { key: "sources", label: "Fuentes", icon: Globe },
  { key: "calendar", label: "Calendario", icon: Calendar },
  { key: "meetings", label: "Reuniones", icon: Video },
  { key: "billing", label: "Facturación", icon: DollarSign },
  { key: "documents", label: "Documentos", icon: FolderOpen },
  { key: "integrations", label: "Integraciones", icon: Plug },
];

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter (Default)" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Nunito", label: "Nunito" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("branding");
  const [saved, setSaved] = useState(false);
  const [branding, setBranding] = useState(getBranding);
  const [contact, setContact] = useState(getContactSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(branding.logoUrl);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(branding.faviconUrl);
  const [logoDragActive, setLogoDragActive] = useState(false);
  const [faviconDragActive, setFaviconDragActive] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [pipelineStages, setPipelineStages] = useState([
    { key: "New", label: "Nuevo", color: "bg-blue-400" },
    { key: "Contacted", label: "Contactado", color: "bg-indigo-400" },
    { key: "Qualified", label: "Calificado", color: "bg-amber-400" },
    { key: "Evaluation Pending", label: "En Evaluación", color: "bg-orange-400" },
    { key: "Offer Review", label: "Oferta Enviada", color: "bg-purple-400" },
    { key: "Negotiation", label: "Negociación", color: "bg-pink-400" },
    { key: "Won", label: "Cerrado", color: "bg-emerald-500" },
    { key: "Lost", label: "Perdido", color: "bg-slate-400" },
  ]);

  const [scoringWeights, setScoringWeights] = useState([
    { factor: "Timeline = Urgente", weight: 30 },
    { factor: "Condición deteriorada", weight: 15 },
    { factor: "Situación: Herencia o Deudas", weight: 15 },
    { factor: "Tipo: Multifamiliar/Comercial", weight: 10 },
    { factor: "Región Metro", weight: 5 },
    { factor: "Timeline = Solo evaluando", weight: -30 },
  ]);

  const [notifPrefs, setNotifPrefs] = useState({
    newLead: true, hotLead: true, overdueFollowUp: true, evaluationDone: true,
    offerUpdated: true, campaignAlert: true, reassigned: true,
    emailDigest: true, pushNotifications: false, smsAlerts: false,
    digestFrequency: "daily",
  });

  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [showNewRole, setShowNewRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  useEffect(() => {
    const handleBranding = () => setBranding(getBranding());
    const handleContact = () => setContact(getContactSettings());
    window.addEventListener("branding-updated", handleBranding);
    window.addEventListener("contact-updated", handleContact);
    return () => {
      window.removeEventListener("branding-updated", handleBranding);
      window.removeEventListener("contact-updated", handleContact);
    };
  }, []);

  useEffect(() => {
    updateBranding({ ...branding, logoUrl: logoPreview || branding.logoUrl, faviconUrl: faviconPreview || branding.faviconUrl });
  }, [branding.primaryColor, branding.accentColor, branding.sidebarColor, branding.fontFamily, logoPreview, faviconPreview]);

  useEffect(() => {
    const hexToHslChannels = (hex: string): string | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return null;
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s: number;
      const l = (max + min) / 2;
      if (max === min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
      }
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    const root = document.documentElement;
    const primaryHsl = hexToHslChannels(branding.primaryColor);
    if (primaryHsl) root.style.setProperty('--primary', primaryHsl);
    const accentHsl = hexToHslChannels(branding.accentColor);
    if (accentHsl) root.style.setProperty('--accent', accentHsl);
    root.style.setProperty('--sidebar-bg', branding.sidebarColor);
    root.style.setProperty('--font-family', branding.fontFamily);
    document.body.style.fontFamily = branding.fontFamily;

    const existingFavicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    const favSrc = faviconPreview || branding.faviconUrl;
    if (favSrc) {
      if (existingFavicon) {
        existingFavicon.href = favSrc;
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = favSrc;
        document.head.appendChild(link);
      }
    }
  }, [branding.primaryColor, branding.accentColor, branding.sidebarColor, branding.fontFamily, faviconPreview, branding.faviconUrl]);

  const handleSave = () => {
    updateBranding({ ...branding, logoUrl: logoPreview, faviconUrl: faviconPreview });
    updateContactSettings(contact);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileUpload = useCallback((file: File, type: "logo" | "favicon") => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(file.type)) return;
    const maxSize = type === "logo" ? 5 * 1024 * 1024 : 1024 * 1024;
    if (file.size > maxSize) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      if (type === "logo") {
        setLogoPreview(url);
        setBranding(prev => ({ ...prev, logoUrl: url }));
      } else {
        setFaviconPreview(url);
        setBranding(prev => ({ ...prev, faviconUrl: url }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = (e: React.DragEvent, type: "logo" | "favicon", active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "logo") setLogoDragActive(active);
    else setFaviconDragActive(active);
  };

  const handleDrop = (e: React.DragEvent, type: "logo" | "favicon") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "logo") setLogoDragActive(false);
    else setFaviconDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0], type);
  };

  const moveStage = (index: number, dir: -1 | 1) => {
    const newStages = [...pipelineStages];
    const target = index + dir;
    if (target < 0 || target >= newStages.length) return;
    [newStages[index], newStages[target]] = [newStages[target], newStages[index]];
    setPipelineStages(newStages);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1100px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Configuración</h1>
            <p className="text-sm text-slate-500 mt-1">Administra la configuración del sistema y equipo.</p>
          </div>
          <Button onClick={handleSave} className={cn(saved && "bg-emerald-600 hover:bg-emerald-700")}>
            {saved ? <><Check className="h-4 w-4 mr-2" /> Guardado</> : <><Save className="h-4 w-4 mr-2" /> Guardar Cambios</>}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <nav className="lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                    activeTab === tab.key
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex-1 min-w-0">
            {activeTab === "branding" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle>Identidad de Marca</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del sistema</label>
                        <Input value={branding.systemName} onChange={e => setBranding(prev => ({ ...prev, systemName: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>
                        <Input value={branding.tagline} onChange={e => setBranding(prev => ({ ...prev, tagline: e.target.value }))} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo</label>
                      <input ref={logoInputRef} type="file" accept=".png,.jpg,.jpeg,.svg,.webp" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "logo")} />
                      {logoPreview ? (
                        <div className="border-2 border-slate-200 rounded-xl p-4 flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">Logo cargado</p>
                            <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, SVG, WebP</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                              <Upload className="h-3 w-3 mr-1" /> Reemplazar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => { setLogoPreview(null); setBranding(prev => ({ ...prev, logoUrl: null })); }}>
                              <X className="h-3 w-3 mr-1" /> Eliminar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                            logoDragActive ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                          )}
                          onClick={() => logoInputRef.current?.click()}
                          onDragEnter={e => handleDrag(e, "logo", true)}
                          onDragLeave={e => handleDrag(e, "logo", false)}
                          onDragOver={e => handleDrag(e, "logo", true)}
                          onDrop={e => handleDrop(e, "logo")}
                        >
                          <Upload className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                          <p className="text-sm text-slate-500 font-medium">Arrastra tu logo aquí o haz clic para subir</p>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG, WebP — Máximo 5MB</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Favicon</label>
                      <input ref={faviconInputRef} type="file" accept=".png,.jpg,.jpeg,.svg,.ico,.webp" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "favicon")} />
                      {faviconPreview ? (
                        <div className="border-2 border-slate-200 rounded-xl p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            <img src={faviconPreview} alt="Favicon preview" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">Favicon cargado</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => faviconInputRef.current?.click()}>Reemplazar</Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => { setFaviconPreview(null); setBranding(prev => ({ ...prev, faviconUrl: null })); }}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors flex items-center gap-3",
                            faviconDragActive ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                          )}
                          onClick={() => faviconInputRef.current?.click()}
                          onDragEnter={e => handleDrag(e, "favicon", true)}
                          onDragLeave={e => handleDrag(e, "favicon", false)}
                          onDragOver={e => handleDrag(e, "favicon", true)}
                          onDrop={e => handleDrop(e, "favicon")}
                        >
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">MH</div>
                          <span className="text-sm text-slate-500">Subir favicon — ICO, PNG, SVG — Máx 1MB</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Paleta de Colores</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Color primario</label>
                        <div className="flex items-center gap-3">
                          <input type="color" value={branding.primaryColor} onChange={e => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                          <Input value={branding.primaryColor} onChange={e => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))} className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Color acento</label>
                        <div className="flex items-center gap-3">
                          <input type="color" value={branding.accentColor} onChange={e => setBranding(prev => ({ ...prev, accentColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                          <Input value={branding.accentColor} onChange={e => setBranding(prev => ({ ...prev, accentColor: e.target.value }))} className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Sidebar</label>
                        <div className="flex items-center gap-3">
                          <input type="color" value={branding.sidebarColor} onChange={e => setBranding(prev => ({ ...prev, sidebarColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                          <Input value={branding.sidebarColor} onChange={e => setBranding(prev => ({ ...prev, sidebarColor: e.target.value }))} className="flex-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2"><Type className="h-5 w-5 text-primary" /> Tipografía</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Fuente principal</label>
                      <Select value={branding.fontFamily} onChange={e => setBranding(prev => ({ ...prev, fontFamily: e.target.value }))}>
                        {FONT_OPTIONS.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-400 mb-2">Vista previa</p>
                      <p className="text-lg font-bold text-slate-900" style={{ fontFamily: branding.fontFamily }}>Título de Ejemplo — {branding.systemName}</p>
                      <p className="text-sm text-slate-600 mt-1" style={{ fontFamily: branding.fontFamily }}>Este es un párrafo de muestra con la fuente seleccionada.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Vista Previa del Tema</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <div className="h-12 flex items-center px-4 gap-3" style={{ backgroundColor: branding.sidebarColor }}>
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="h-6 w-6 rounded object-contain" />
                        ) : (
                          <Building2 className="h-5 w-5" style={{ color: branding.primaryColor }} />
                        )}
                        <span className="text-white text-sm font-bold" style={{ fontFamily: branding.fontFamily }}>{branding.systemName}</span>
                      </div>
                      <div className="p-4 bg-white flex items-center gap-3">
                        <div className="w-20 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: branding.primaryColor }}>Primario</div>
                        <div className="w-20 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: branding.accentColor }}>Acento</div>
                        <div className="flex-1 h-8 rounded-lg bg-slate-100 flex items-center px-3 text-sm text-slate-600" style={{ fontFamily: branding.fontFamily }}>Texto de ejemplo</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "contact" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono Metro</label>
                      <Input value={contact.phoneMetro} onChange={e => setContact(prev => ({ ...prev, phoneMetro: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono Isla</label>
                      <Input value={contact.phoneIsla} onChange={e => setContact(prev => ({ ...prev, phoneIsla: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                      <Input value={contact.email} onChange={e => setContact(prev => ({ ...prev, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp</label>
                      <Input value={contact.whatsapp} onChange={e => setContact(prev => ({ ...prev, whatsapp: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección</label>
                    <Input value={contact.address} onChange={e => setContact(prev => ({ ...prev, address: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Horario de atención</label>
                      <Input value={contact.businessHours} onChange={e => setContact(prev => ({ ...prev, businessHours: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">CTA principal</label>
                      <Input value={contact.ctaLabel} onChange={e => setContact(prev => ({ ...prev, ctaLabel: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Zona horaria</label>
                      <Select value={contact.timezone} onChange={e => setContact(prev => ({ ...prev, timezone: e.target.value }))}>
                        <option value="America/Puerto_Rico">America/Puerto_Rico (AST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Idioma predeterminado</label>
                      <Select value={contact.language} onChange={e => setContact(prev => ({ ...prev, language: e.target.value }))}>
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </Select>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-5">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Redes Sociales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Facebook</label>
                        <Input value={contact.socialLinks.facebook} onChange={e => setContact(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, facebook: e.target.value } }))} placeholder="https://facebook.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Instagram</label>
                        <Input value={contact.socialLinks.instagram} onChange={e => setContact(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))} placeholder="https://instagram.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">LinkedIn</label>
                        <Input value={contact.socialLinks.linkedin} onChange={e => setContact(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))} placeholder="https://linkedin.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">YouTube</label>
                        <Input value={contact.socialLinks.youtube} onChange={e => setContact(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, youtube: e.target.value } }))} placeholder="https://youtube.com/..." />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "team" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                  <CardTitle>Equipo</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Invitar</Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="divide-y divide-slate-100">
                    {teamMembers.map(member => (
                      <div key={member.email} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center font-bold text-sm">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{member.name}</div>
                            <div className="text-sm text-slate-500">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={member.role === "Admin" ? "destructive" : member.role === "Agent" ? "high" : "secondary"} className="text-xs">{member.role}</Badge>
                          <span className="text-xs text-slate-400">{member.assignedLeads} leads</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "roles" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle>Roles y Permisos</CardTitle>
                    <Button size="sm" onClick={() => setShowNewRole(true)}><Plus className="h-4 w-4 mr-1" />Crear Rol</Button>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {showNewRole && (
                      <Card className="border-primary/30 bg-primary/5 p-4 space-y-3">
                        <Input placeholder="Nombre del rol" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
                        <Input placeholder="Descripción" value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => { setShowNewRole(false); setNewRoleName(""); setNewRoleDesc(""); }}>Cancelar</Button>
                          <Button size="sm" onClick={() => {
                            if (!newRoleName.trim()) return;
                            const created = addRole({ name: newRoleName, description: newRoleDesc, permissions: ALL_MODULES.map(m => ({ module: m, view: false, edit: false })), isSystem: false });
                            setRoles(getRoles());
                            setEditingRoleId(created.id);
                            setShowNewRole(false);
                            setNewRoleName("");
                            setNewRoleDesc("");
                          }}>Crear</Button>
                        </div>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roles.map(role => (
                        <Card key={role.id} className={cn("border cursor-pointer hover:shadow-md transition-shadow", editingRoleId === role.id && "ring-2 ring-primary")} onClick={() => setEditingRoleId(editingRoleId === role.id ? null : role.id)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm">{role.name}</h4>
                              <div className="flex items-center gap-1">
                                {role.isSystem && <Badge variant="secondary" className="text-[10px]">Sistema</Badge>}
                                {!role.isSystem && (
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={e => {
                                    e.stopPropagation();
                                    deleteRole(role.id);
                                    setRoles(getRoles());
                                    if (editingRoleId === role.id) setEditingRoleId(null);
                                  }}><Trash2 className="h-3 w-3" /></Button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">{role.description}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{role.permissions.filter(p => p.view).length} módulos visibles, {role.permissions.filter(p => p.edit).length} editables</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {editingRoleId && (() => {
                      const role = roles.find(r => r.id === editingRoleId);
                      if (!role) return null;
                      return (
                        <Card className="border-slate-200 mt-4">
                          <CardHeader className="border-b border-slate-100 py-3">
                            <CardTitle className="text-base">Permisos: {role.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left p-3 font-medium text-slate-600">Módulo</th>
                                    <th className="text-center p-3 font-medium text-slate-600 w-24">Ver</th>
                                    <th className="text-center p-3 font-medium text-slate-600 w-24">Editar</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {role.permissions.map((perm, pi) => (
                                    <tr key={perm.module} className={cn("border-b border-slate-100", pi % 2 === 1 && "bg-slate-50/50")}>
                                      <td className="p-3 text-slate-700">{perm.module}</td>
                                      <td className="text-center p-3">
                                        <input type="checkbox" checked={perm.view} onChange={e => {
                                          const newPerms = role.permissions.map((p, i) => i === pi ? { ...p, view: e.target.checked, edit: !e.target.checked ? false : p.edit } : p);
                                          updateRole(role.id, { permissions: newPerms });
                                          setRoles(getRoles());
                                        }} className="h-4 w-4 rounded border-slate-300 text-primary" />
                                      </td>
                                      <td className="text-center p-3">
                                        <input type="checkbox" checked={perm.edit} disabled={!perm.view} onChange={e => {
                                          const newPerms = role.permissions.map((p, i) => i === pi ? { ...p, edit: e.target.checked } : p);
                                          updateRole(role.id, { permissions: newPerms });
                                          setRoles(getRoles());
                                        }} className="h-4 w-4 rounded border-slate-300 text-primary disabled:opacity-30" />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "scoring" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle>Rangos de Scoring</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {[
                      { label: "Hot", range: "85 - 100", color: "bg-[hsl(350,89%,60%)]", desc: "Leads de máxima prioridad, acción inmediata requerida." },
                      { label: "High", range: "60 - 84", color: "bg-[hsl(35,92%,53%)]", desc: "Alta probabilidad, requiere seguimiento activo." },
                      { label: "Medium", range: "30 - 59", color: "bg-[hsl(48,96%,53%)]", desc: "Potencial moderado, evaluar antes de invertir tiempo." },
                      { label: "Low", range: "0 - 29", color: "bg-slate-300", desc: "Baja prioridad, posible nurturing a largo plazo." },
                    ].map(tier => (
                      <div key={tier.label} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className={cn("w-4 h-4 rounded-full shrink-0 mt-0.5", tier.color)} />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-slate-900">{tier.label}</span>
                            <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">{tier.range}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{tier.desc}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle>Pesos de Factores</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {scoringWeights.map((sw, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <span className="flex-1 text-sm text-slate-700">{sw.factor}</span>
                        <div className="flex items-center gap-2 w-40">
                          <input
                            type="range"
                            min={-50}
                            max={50}
                            value={sw.weight}
                            onChange={e => {
                              const updated = [...scoringWeights];
                              updated[i] = { ...updated[i], weight: parseInt(e.target.value) };
                              setScoringWeights(updated);
                            }}
                            className="flex-1 accent-primary"
                          />
                          <span className={cn("text-sm font-bold w-12 text-right", sw.weight >= 0 ? "text-emerald-600" : "text-red-500")}>
                            {sw.weight >= 0 ? "+" : ""}{sw.weight}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "pipeline" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                  <CardTitle>Etapas del Pipeline</CardTitle>
                  <Button size="sm" onClick={() => {
                    const newKey = `stage-${Date.now()}`;
                    setPipelineStages(prev => [...prev, { key: newKey, label: "Nueva Etapa", color: "bg-slate-400" }]);
                  }}><Plus className="h-3.5 w-3.5 mr-1" /> Agregar Etapa</Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <p className="text-sm text-slate-500 mb-4">Reordena, agrega o elimina las etapas del pipeline de ventas. Arrastra para reordenar.</p>
                  {pipelineStages.map((stage, i) => (
                    <div
                      key={stage.key}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group"
                      draggable
                      onDragStart={e => { e.dataTransfer.setData("text/plain", String(i)); e.dataTransfer.effectAllowed = "move"; }}
                      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                      onDrop={e => {
                        e.preventDefault();
                        const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
                        if (isNaN(fromIdx) || fromIdx === i) return;
                        const updated = [...pipelineStages];
                        const [moved] = updated.splice(fromIdx, 1);
                        updated.splice(i, 0, moved);
                        setPipelineStages(updated);
                      }}
                    >
                      <GripVertical className="h-4 w-4 text-slate-300 shrink-0 cursor-grab active:cursor-grabbing" />
                      <div className={cn("w-4 h-4 rounded-full shrink-0", stage.color)} />
                      <Input
                        value={stage.label}
                        onChange={e => {
                          const updated = [...pipelineStages];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setPipelineStages(updated);
                        }}
                        className="flex-1 h-9 bg-white"
                      />
                      <span className="text-xs text-slate-400 w-32 truncate">{stage.key}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" onClick={() => moveStage(i, -1)} disabled={i === 0}>
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" onClick={() => moveStage(i, 1)} disabled={i === pipelineStages.length - 1}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setPipelineStages(prev => prev.filter((_, idx) => idx !== i))}
                          disabled={pipelineStages.length <= 1}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle>Tipos de Notificación</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    {[
                      { key: "newLead" as const, label: "Nuevo lead capturado" },
                      { key: "hotLead" as const, label: "Lead Hot detectado" },
                      { key: "overdueFollowUp" as const, label: "Follow-up vencido" },
                      { key: "evaluationDone" as const, label: "Evaluación completada" },
                      { key: "offerUpdated" as const, label: "Actualización de oferta" },
                      { key: "campaignAlert" as const, label: "Alerta de campaña" },
                      { key: "reassigned" as const, label: "Lead reasignado" },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={notifPrefs[item.key]} onChange={e => setNotifPrefs(prev => ({ ...prev, [item.key]: e.target.checked }))} className="sr-only peer" />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle>Canales de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    {[
                      { key: "emailDigest" as const, label: "Email digest" },
                      { key: "pushNotifications" as const, label: "Push notifications" },
                      { key: "smsAlerts" as const, label: "SMS alerts" },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={notifPrefs[item.key]} onChange={e => setNotifPrefs(prev => ({ ...prev, [item.key]: e.target.checked }))} className="sr-only peer" />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                      </div>
                    ))}
                    <div className="pt-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Frecuencia del digest</label>
                      <Select value={notifPrefs.digestFrequency} onChange={e => setNotifPrefs(prev => ({ ...prev, digestFrequency: e.target.value }))}>
                        <option value="realtime">Tiempo real</option>
                        <option value="hourly">Cada hora</option>
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "form" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Configuración del Formulario</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Campos activos</h4>
                    <div className="space-y-3">
                      {[
                        { field: "Nombre completo", step: 1, required: true },
                        { field: "Teléfono", step: 1, required: true },
                        { field: "Email", step: 1, required: false },
                        { field: "Tipo de propiedad", step: 2, required: true },
                        { field: "Municipio", step: 3, required: true },
                        { field: "Sector / Barrio", step: 3, required: false },
                        { field: "Situación principal", step: 4, required: true },
                        { field: "Condición física", step: 5, required: true },
                        { field: "Urgencia / Timeline", step: 6, required: true },
                        { field: "Valor estimado", step: 7, required: false },
                        { field: "Deudas / Hipoteca", step: 7, required: false },
                        { field: "Mensaje adicional", step: 8, required: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">{item.step}</span>
                            <span className="text-sm text-slate-700">{item.field}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {item.required && <span className="text-[10px] text-red-500 font-semibold">Requerido</span>}
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-5">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Mensaje de éxito</h4>
                    <Input defaultValue="¡Información recibida con éxito! Te contactaremos dentro de las próximas 24 horas." />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "sources" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                  <CardTitle>Fuentes y Campañas</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Agregar Fuente</Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {[
                      { name: "Facebook Ad", type: "Meta Ads", active: true, leads: 45 },
                      { name: "Instagram Ad", type: "Meta Ads", active: true, leads: 30 },
                      { name: "Website (Orgánico)", type: "Orgánico", active: true, leads: 15 },
                      { name: "Referral", type: "Referido", active: true, leads: 10 },
                      { name: "Llamada Directa", type: "Llamada", active: false, leads: 5 },
                      { name: "Landing Page Externa", type: "Landing", active: false, leads: 0 },
                    ].map(source => (
                      <div key={source.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={source.active} className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                          </label>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{source.name}</div>
                            <div className="text-xs text-slate-500">{source.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-primary">{source.leads} leads</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "calendar" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Configuración de Calendario</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Vista predeterminada</label>
                      <Select defaultValue="week">
                        <option value="day">Día</option>
                        <option value="week">Semana</option>
                        <option value="month">Mes</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Primer día de la semana</label>
                      <Select defaultValue="monday">
                        <option value="monday">Lunes</option>
                        <option value="sunday">Domingo</option>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Horario laboral — Inicio</label>
                      <Input defaultValue="08:00" type="time" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Horario laboral — Fin</label>
                      <Input defaultValue="18:00" type="time" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Buffer entre citas (minutos)</label>
                    <Input defaultValue="15" type="number" />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "meetings" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Configuración de Reuniones</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Proveedor predeterminado</label>
                    <Select defaultValue="zoom">
                      <option value="zoom">Zoom</option>
                      <option value="google-meet">Google Meet</option>
                      <option value="teams">Microsoft Teams</option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Duración predeterminada</label>
                      <Select defaultValue="30">
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                        <option value="45">45 minutos</option>
                        <option value="60">60 minutos</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Recordatorio previo</label>
                      <Select defaultValue="15">
                        <option value="5">5 minutos</option>
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                        <option value="60">1 hora</option>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Configuración de Facturación</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Moneda</label>
                      <Select defaultValue="USD">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Términos de pago</label>
                      <Select defaultValue="30">
                        <option value="15">Net 15</option>
                        <option value="30">Net 30</option>
                        <option value="60">Net 60</option>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "documents" && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Configuración de Documentos</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tamaño máximo de archivo (MB)</label>
                    <Input defaultValue="25" type="number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipos de archivo permitidos</label>
                    <Input defaultValue=".pdf, .doc, .docx, .xls, .xlsx, .jpg, .png, .gif" />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle>Integraciones</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-slate-500 mb-6">Gestiona las conexiones con servicios externos. Configura API keys, webhooks y estados.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "CRM (HubSpot)", status: "Conectado", icon: "🔗", apiKey: "hbsp_****7f3a", webhookUrl: "https://hooks.myhouse.com/crm", active: true, description: "Sincroniza leads y contactos automáticamente." },
                        { name: "Email Marketing (Mailchimp)", status: "Conectado", icon: "📧", apiKey: "mc_****9d2e", webhookUrl: "https://hooks.myhouse.com/email", active: true, description: "Campañas automáticas y segmentación de leads." },
                        { name: "SMS / WhatsApp API", status: "Conectado", icon: "💬", apiKey: "twl_****4b1c", webhookUrl: "https://hooks.myhouse.com/sms", active: false, description: "Mensajes automatizados y notificaciones por SMS/WhatsApp." },
                        { name: "Google Sheets", status: "Próximo", icon: "📊", apiKey: "", webhookUrl: "", active: false, description: "Exporta datos de leads y reportes a Google Sheets." },
                        { name: "Meta Lead Ads", status: "Conectado", icon: "📣", apiKey: "meta_****8e5f", webhookUrl: "https://hooks.myhouse.com/meta", active: true, description: "Captura leads directamente desde Facebook e Instagram." },
                        { name: "Calendario (Google)", status: "Próximo", icon: "📅", apiKey: "", webhookUrl: "", active: false, description: "Sincroniza citas y reuniones con Google Calendar." },
                      ].map(integration => (
                        <Card key={integration.name} className={cn("shadow-sm transition-all", integration.active ? "border-emerald-200" : "border-slate-200")}>
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{integration.icon}</span>
                                <div>
                                  <h4 className="font-semibold text-sm text-slate-900">{integration.name}</h4>
                                  <p className="text-xs text-slate-500 mt-0.5">{integration.description}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <span className={cn(
                                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                                integration.status === "Conectado" ? "bg-emerald-100 text-emerald-700" :
                                integration.status === "Próximo" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                              )}>{integration.status}</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={integration.active} className="sr-only peer" disabled={integration.status !== "Conectado"} />
                                <div className={cn("w-9 h-5 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all",
                                  integration.status === "Conectado" ? "bg-slate-200 peer-checked:bg-emerald-500 peer-checked:after:translate-x-4" : "bg-slate-100 cursor-not-allowed"
                                )} />
                              </label>
                            </div>

                            {integration.status === "Conectado" && (
                              <div className="space-y-2 pt-3 border-t border-slate-100">
                                <div>
                                  <label className="block text-[10px] font-medium text-slate-500 mb-1">API Key</label>
                                  <Input defaultValue={integration.apiKey} className="h-8 text-xs font-mono bg-slate-50" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Webhook URL</label>
                                  <Input defaultValue={integration.webhookUrl} className="h-8 text-xs font-mono bg-slate-50" />
                                </div>
                              </div>
                            )}

                            {integration.status === "Próximo" && (
                              <div className="pt-3 border-t border-slate-100">
                                <p className="text-xs text-slate-400 text-center py-2">Disponible próximamente</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
