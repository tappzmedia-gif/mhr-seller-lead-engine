import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { FolderOpen, Plus, Search, Upload, File, Image, FileText, Tag, MoreVertical, Grid, List, Download, Share2, Trash2, Edit3, Loader2, FolderClosed, HardDrive, Lock, Unlock, X, History, Shield, Clock, Eye, CheckCircle } from "lucide-react";
import { documentsService } from "@/lib/services/documentsService";
import type { DocumentFile, DocumentFolder, StorageProvider, DocumentCategory } from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_KEYS: Record<DocumentCategory, string> = {
  contracts: 'documents.category.contracts',
  proposals: 'documents.category.proposals',
  invoices: 'documents.category.invoices',
  photos: 'documents.category.photos',
  inspections: 'documents.category.inspections',
  legal: 'documents.category.legal',
  sops: 'documents.category.sops',
  templates: 'documents.category.templates',
  scripts: 'documents.category.scripts',
  marketing: 'documents.category.marketing',
  other: 'documents.category.other',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image;
  return FileText;
}

const mockVersionHistory = [
  { version: 3, date: new Date(Date.now() - 86400000).toISOString(), author: 'María Santos', changes: 'Actualizado con nueva información' },
  { version: 2, date: new Date(Date.now() - 3 * 86400000).toISOString(), author: 'Carlos Reyes', changes: 'Correcciones menores' },
  { version: 1, date: new Date(Date.now() - 7 * 86400000).toISOString(), author: 'María Santos', changes: 'Versión inicial' },
];

function PDFPreviewModal({ doc, onClose }: { doc: DocumentFile; onClose: () => void }) {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;
  const { toast } = useToast();

  const handleDownload = () => {
    const blob = new Blob([`${doc.name}\n\n${doc.type}\n${formatFileSize(doc.size)}\nv${doc.version}\n${doc.uploadedBy}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: t("documents.downloadStarted"), description: `${doc.name} ${t("documents.downloadingDesc")}` });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/docs/${doc.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({ title: t("documents.linkCopied"), description: t("documents.linkCopiedDesc") });
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{doc.name}</h3>
              <p className="text-xs text-slate-400">{formatFileSize(doc.size)} · v{doc.version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5 mr-1" /> {t("documents.download")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-3.5 w-3.5 mr-1" /> {t("documents.share")}
            </Button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-10 min-h-[500px]">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <FileText className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">{doc.name}</h2>
                <p className="text-xs text-slate-400">{t("documents.preview")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-slate-500 text-xs block mb-1">{t("documents.fileType")}</span>
                  <span className="font-medium text-slate-700">{doc.type}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-slate-500 text-xs block mb-1">{t("documents.size")}</span>
                  <span className="font-medium text-slate-700">{formatFileSize(doc.size)}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-slate-500 text-xs block mb-1">{t("documents.category")}</span>
                  <span className="font-medium text-slate-700">{t(CATEGORY_KEYS[doc.category])}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-slate-500 text-xs block mb-1">{t("documents.version")}</span>
                  <span className="font-medium text-slate-700">v{doc.version}</span>
                </div>
              </div>

              <div className="mt-6 p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 text-center">
                <FileText className="h-16 w-16 mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 font-medium">{t("documents.docContent")}</p>
                <p className="text-xs text-slate-400 mt-1">{t("documents.previewUnavailable")}</p>
                <p className="text-xs text-slate-400">{t("documents.downloadToView")}</p>
              </div>

              <div className="mt-4 text-xs text-slate-400 space-y-1">
                <p>{t("documents.uploadedBy")}: <span className="text-slate-600">{doc.uploadedBy}</span></p>
                <p>{t("documents.date")}: <span className="text-slate-600">{format(new Date(doc.uploadedAt), "d MMMM yyyy, HH:mm", { locale: dateLocale })}</span></p>
                <p>{t("documents.folder")}: <span className="text-slate-600">{doc.folder}</span></p>
                {doc.clientName && <p>{t("documents.client")}: <span className="text-primary font-medium">{doc.clientName}</span></p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentDetailPanel({ doc, onClose, onPreview }: { doc: DocumentFile; onClose: () => void; onPreview: () => void }) {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;
  const { toast } = useToast();
  const [showVersions, setShowVersions] = useState(false);
  const [permissions, setPermissions] = useState({ admin: true, agent: doc.permissions.includes('agent'), viewer: doc.permissions.includes('viewer') });
  const [visibility, setVisibility] = useState<'internal' | 'client'>(doc.isInternal ? 'internal' : 'client');
  const Icon = getFileIcon(doc.type);

  const handleDownload = () => {
    const blob = new Blob([`${doc.name}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: t("documents.downloadStarted"), description: `${doc.name} ${t("documents.downloadingDesc")}` });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/docs/${doc.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({ title: t("documents.linkCopied"), description: t("documents.linkCopiedDesc") });
    });
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm truncate">{doc.name}</CardTitle>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors" onClick={onPreview}>
          <div className="text-center">
            <Icon className="h-16 w-16 text-slate-300 mx-auto" />
            <span className="text-xs text-primary font-medium mt-2 block">{t("documents.clickToPreview")}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs"><span className="text-slate-500">{t("documents.fileType")}</span><span className="text-slate-700 font-medium">{doc.type}</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-500">{t("documents.size")}</span><span className="text-slate-700 font-medium">{formatFileSize(doc.size)}</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-500">{t("documents.version")}</span><span className="text-slate-700 font-medium">v{doc.version}</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-500">{t("documents.folder")}</span><span className="text-slate-700 font-medium">{doc.folder}</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-500">{t("documents.uploadedBy")}</span><span className="text-slate-700 font-medium">{doc.uploadedBy}</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-500">{t("documents.date")}</span><span className="text-slate-700 font-medium">{format(new Date(doc.uploadedAt), "d MMM yyyy", { locale: dateLocale })}</span></div>
          {doc.clientName && <div className="flex justify-between text-xs"><span className="text-slate-500">{t("documents.client")}</span><span className="text-primary font-medium">{doc.clientName}</span></div>}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
            {visibility === 'internal' ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            {t("documents.visibility")}
          </h4>
          <div className="flex gap-2">
            <button onClick={() => setVisibility('internal')} className={cn("flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all", visibility === 'internal' ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-50 text-slate-500 border border-slate-100")}>
              <Lock className="h-3 w-3 mx-auto mb-1" /> {t("documents.internal")}
            </button>
            <button onClick={() => setVisibility('client')} className={cn("flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all", visibility === 'client' ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-slate-50 text-slate-500 border border-slate-100")}>
              <Unlock className="h-3 w-3 mx-auto mb-1" /> {t("documents.client")}
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><Shield className="h-3 w-3" /> {t("documents.permissionsByRole")}</h4>
          <div className="space-y-2">
            {(['admin', 'agent', 'viewer'] as const).map(role => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-xs text-slate-600 capitalize">{role}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={permissions[role]} onChange={() => setPermissions(prev => ({ ...prev, [role]: !prev[role] }))} className="sr-only peer" disabled={role === 'admin'} />
                  <div className={cn("w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5", role === 'admin' && "opacity-60")} />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button onClick={() => setShowVersions(!showVersions)} className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase mb-2 w-full hover:text-primary">
            <History className="h-3 w-3" /> {t("documents.versionHistory")}
          </button>
          {showVersions && (
            <div className="space-y-2">
              {mockVersionHistory.map(v => (
                <div key={v.version} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">v{v.version}</div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-700">{v.changes}</div>
                    <div className="text-[10px] text-slate-400">{v.author} · {formatDistanceToNow(new Date(v.date), { addSuffix: true, locale: dateLocale })}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={onPreview}><Eye className="h-3.5 w-3.5 mr-1" /> {t("documents.preview")}</Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={handleDownload}><Download className="h-3.5 w-3.5 mr-1" /> {t("documents.download")}</Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={handleShare}><Share2 className="h-3.5 w-3.5 mr-1" /> {t("documents.share")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DocumentsPage() {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;

  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [providers, setProviders] = useState<StorageProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [showInternal, setShowInternal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('application/pdf');

  useEffect(() => {
    Promise.all([documentsService.getAll(), documentsService.getFolders(), documentsService.getStorageProviders()]).then(([docs, flds, provs]) => {
      setDocuments(docs);
      setFolders(flds);
      setProviders(provs);
      setLoading(false);
    });
  }, []);

  const allTags = [...new Set(documents.flatMap(d => d.tags))];

  const filtered = documents
    .filter(d => showInternal ? d.isInternal : !d.isInternal)
    .filter(d => !activeFolder || d.folder === activeFolder)
    .filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))
    .filter(d => !tagFilter || d.tags.includes(tagFilter));

  const displayFolders = folders.filter(f => showInternal ? f.isInternal : !f.isInternal);

  const handleSimulateUpload = () => {
    if (!uploadName) return;
    const newDoc: DocumentFile = {
      id: `doc-${Date.now()}`, name: uploadName, type: uploadType, size: Math.floor(Math.random() * 5000000) + 100000,
      category: 'other', folder: activeFolder || 'General', tags: [], uploadedBy: 'María Santos',
      uploadedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1,
      isInternal: showInternal, permissions: ['admin', 'agent'],
    };
    setDocuments(prev => [...prev, newDoc]);
    setShowUpload(false);
    setUploadName('');
  };

  const handleRowDownload = (e: React.MouseEvent, doc: DocumentFile) => {
    e.stopPropagation();
    const blob = new Blob([`${doc.name}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: t("documents.downloadStarted"), description: `${doc.name} ${t("documents.downloadingDesc")}` });
  };

  const handleRowShare = (e: React.MouseEvent, doc: DocumentFile) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/docs/${doc.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({ title: t("documents.linkCopied"), description: t("documents.linkCopiedDesc") });
    });
  };

  const handleRowPreview = (e: React.MouseEvent, doc: DocumentFile) => {
    e.stopPropagation();
    setPreviewDoc(doc);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">{t("titleDocuments")}</h1>
            <p className="text-sm text-slate-500 mt-1">{t("documents.subtitle")}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowUpload(!showUpload)}><Upload className="h-4 w-4 mr-2" /> {t("documents.uploadFile")}</Button>
            <Button><Plus className="h-4 w-4 mr-2" /> {t("documents.newFolder")}</Button>
          </div>
        </div>

        {showUpload && (
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-900">{t("documents.uploadFileSimulated")}</h4>
                <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>
              <div className="flex gap-3">
                <Input value={uploadName} onChange={e => setUploadName(e.target.value)} placeholder={t("documents.filenamePlaceholder")} className="h-9 text-sm flex-1" />
                <select value={uploadType} onChange={e => setUploadType(e.target.value)} className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white">
                  <option value="application/pdf">PDF</option>
                  <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">DOCX</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="application/zip">ZIP</option>
                </select>
                <Button size="sm" onClick={handleSimulateUpload} disabled={!uploadName}><Upload className="h-3.5 w-3.5 mr-1" /> {t("documents.upload")}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <button onClick={() => { setShowInternal(false); setActiveFolder(null); }} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all", !showInternal ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>{t("documents.clientDocuments")}</button>
          <button onClick={() => { setShowInternal(true); setActiveFolder(null); }} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all", showInternal ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>{t("documents.internalDocuments")}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
          <div className="space-y-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t("documents.folders")}</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <button onClick={() => setActiveFolder(null)} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all", !activeFolder ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100")}>
                    <FolderOpen className="h-4 w-4" /> {t("documents.all")} ({documents.filter(d => showInternal ? d.isInternal : !d.isInternal).length})
                  </button>
                  {displayFolders.map(f => (
                    <button key={f.id} onClick={() => setActiveFolder(f.name)} className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all", activeFolder === f.name ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100")}>
                      <span className="flex items-center gap-2"><FolderClosed className="h-4 w-4" /> {f.name}</span>
                      <span className="text-[10px]">{f.documentCount}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t("documents.tags")}</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {tagFilter && <button onClick={() => setTagFilter('')} className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded-full font-medium">{t("documents.clearFilter")}</button>}
                  {allTags.map(tag => (
                    <button key={tag} onClick={() => setTagFilter(tag === tagFilter ? '' : tag)} className={cn("text-[10px] px-2 py-1 rounded-full font-medium transition-all", tag === tagFilter ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>#{tag}</button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><HardDrive className="h-4 w-4" /> {t("documents.storage")}</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {providers.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                      <div>
                        <div className="font-medium text-slate-900">{p.name}</div>
                        {p.spaceUsed && <div className="text-slate-400">{p.spaceUsed} / {p.spaceTotal}</div>}
                      </div>
                      <Badge variant={p.status === 'connected' ? 'success' : p.status === 'coming-soon' ? 'secondary' : 'low'} className="text-[9px]">
                        {p.status === 'connected' ? t("documents.statusOk") : p.status === 'coming-soon' ? t("documents.statusSoon") : t("documents.statusOff")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={cn("md:col-span-3", selectedDoc && "md:col-span-2")}>
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="relative w-64">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input placeholder={t("documents.searchFiles")} value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-9 text-xs" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded", viewMode === 'list' ? "bg-slate-200" : "hover:bg-slate-100")}><List className="h-4 w-4 text-slate-500" /></button>
                    <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded", viewMode === 'grid' ? "bg-slate-200" : "hover:bg-slate-100")}><Grid className="h-4 w-4 text-slate-500" /></button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t("documents.noFiles")}</p>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="divide-y divide-slate-100">
                    {filtered.map(doc => {
                      const Icon = getFileIcon(doc.type);
                      return (
                        <div key={doc.id} className={cn("flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer", selectedDoc?.id === doc.id && "bg-primary/5")} onClick={() => setSelectedDoc(doc)}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Icon className="h-4 w-4" /></div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                <span>{formatFileSize(doc.size)}</span>
                                <span>·</span>
                                <span>v{doc.version}</span>
                                <span>·</span>
                                <span>{doc.uploadedBy}</span>
                                <span>·</span>
                                <span>{formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true, locale: dateLocale })}</span>
                                {doc.clientName && <><span>·</span><span className="text-primary">{doc.clientName}</span></>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {doc.isInternal && <Lock className="h-3 w-3 text-amber-400" />}
                            {doc.tags.slice(0, 2).map(tg => <span key={tg} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">#{tg}</span>)}
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => handleRowPreview(e, doc)} title={t("documents.preview")}><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => handleRowDownload(e, doc)} title={t("documents.download")}><Download className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => handleRowShare(e, doc)} title={t("documents.share")}><Share2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {filtered.map(doc => {
                      const Icon = getFileIcon(doc.type);
                      return (
                        <div key={doc.id} className={cn("border border-slate-200 rounded-xl p-3 hover:border-primary/30 transition-colors cursor-pointer", selectedDoc?.id === doc.id && "border-primary ring-1 ring-primary/20")} onClick={() => setSelectedDoc(doc)}>
                          <div className="w-full h-20 bg-slate-100 rounded-lg flex items-center justify-center mb-2"><Icon className="h-8 w-8 text-slate-300" /></div>
                          <div className="text-xs font-medium text-slate-900 truncate">{doc.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{formatFileSize(doc.size)} · v{doc.version}</div>
                          <div className="flex gap-1 mt-2">
                            <button className="text-[10px] text-primary hover:underline" onClick={e => handleRowPreview(e, doc)}>{t("documents.preview")}</button>
                            <span className="text-slate-300">·</span>
                            <button className="text-[10px] text-primary hover:underline" onClick={e => handleRowDownload(e, doc)}>{t("documents.download")}</button>
                            <span className="text-slate-300">·</span>
                            <button className="text-[10px] text-primary hover:underline" onClick={e => handleRowShare(e, doc)}>{t("documents.share")}</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedDoc && (
            <div className="md:col-span-1">
              <DocumentDetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} onPreview={() => setPreviewDoc(selectedDoc)} />
            </div>
          )}
        </div>
      </div>

      {previewDoc && <PDFPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </AdminLayout>
  );
}
