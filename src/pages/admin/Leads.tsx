import { useState } from "react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button, Card, Badge, Input, Select } from "@/components/ui-components";
import { useLeads } from "@/hooks/use-leads";
import { scoreCategoryToBadgeVariant } from "@/lib/mock-data";
import { Search, Filter, Download, MoreHorizontal, ChevronDown, ChevronUp, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatus, Priority, ScoreCategory } from "@/lib/mock-data";

type SortKey = "name" | "municipality" | "score" | "entryDate" | "status";
type SortDir = "asc" | "desc";

const STATUS_COLORS: Record<string, string> = {
  "New":                "bg-blue-400 text-white",
  "Attempted Contact":  "bg-blue-300 text-blue-950",
  "Contacted":          "bg-indigo-400 text-white",
  "Waiting on Seller":  "bg-indigo-300 text-indigo-950",
  "Qualified":          "bg-amber-400 text-amber-950",
  "Evaluation Pending": "bg-orange-400 text-white",
  "Offer Review":       "bg-purple-400 text-white",
  "Negotiation":        "bg-pink-400 text-white",
  "Won":                "bg-emerald-500 text-white",
  "Lost":               "bg-slate-500 text-white",
  "Not Qualified":      "bg-slate-400 text-white",
};

export default function Leads() {
  const { data: leads, isLoading } = useLeads();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [municipalityFilter, setMunicipalityFilter] = useState("All");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("entryDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [, navigate] = useLocation();

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />;
  };

  const filteredLeads = (leads || []).filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesRegion = regionFilter === "All" || lead.region === regionFilter;
    const matchesMunicipality = municipalityFilter === "All" || lead.municipality === municipalityFilter;
    const matchesPropertyType = propertyTypeFilter === "All" || lead.propertyType === propertyTypeFilter;
    const matchesUrgency = urgencyFilter === "All" || lead.timeline === urgencyFilter;
    const matchesScore = scoreFilter === "All" || lead.scoreCategory === scoreFilter;
    const matchesOwner = ownerFilter === "All" || lead.owner === ownerFilter;
    const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;
    const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;
    const entryTime = new Date(lead.entryDate).getTime();
    const matchesDateFrom = !dateFrom || entryTime >= new Date(dateFrom).getTime();
    const matchesDateTo = !dateTo || entryTime <= new Date(dateTo + "T23:59:59").getTime();
    return matchesSearch && matchesStatus && matchesRegion && matchesMunicipality && matchesPropertyType && matchesUrgency && matchesScore && matchesOwner && matchesSource && matchesPriority && matchesDateFrom && matchesDateTo;
  }).sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "municipality") cmp = a.municipality.localeCompare(b.municipality);
    else if (sortKey === "score") cmp = a.score - b.score;
    else if (sortKey === "entryDate") cmp = new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime();
    else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const activeFilterCount = [statusFilter, regionFilter, municipalityFilter, propertyTypeFilter, urgencyFilter, scoreFilter, ownerFilter, sourceFilter, priorityFilter].filter(f => f !== "All").length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const clearFilters = () => {
    setStatusFilter("All"); setRegionFilter("All"); setMunicipalityFilter("All");
    setPropertyTypeFilter("All"); setUrgencyFilter("All"); setScoreFilter("All");
    setOwnerFilter("All"); setSourceFilter("All"); setPriorityFilter("All");
    setDateFrom(""); setDateTo(""); setPage(1);
  };

  return (
    <AdminLayout>
      <motion.div
        className="p-6 lg:p-8 space-y-6 h-[calc(100vh-64px)] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Lead Center</h1>
            <p className="text-sm text-slate-500">Gestiona y filtra todas las oportunidades de venta.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white"><Download className="mr-2 h-4 w-4"/> Exportar CSV</Button>
            <Button>Crear Lead</Button>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <Card className="p-3 flex items-center gap-4 shrink-0 shadow-sm border-primary/30 bg-primary/5">
            <span className="text-sm font-semibold text-primary">{selectedIds.size} seleccionado(s)</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-white text-xs">Asignar Owner</Button>
              <Button size="sm" variant="outline" className="bg-white text-xs">Cambiar Estado</Button>
              <Button size="sm" variant="outline" className="bg-white text-xs text-red-600 border-red-200 hover:bg-red-50">Archivar</Button>
            </div>
            <Button size="sm" variant="ghost" className="ml-auto text-slate-400" onClick={() => setSelectedIds(new Set())}>
              <X className="h-4 w-4" />
            </Button>
          </Card>
        )}

        <Card className="p-4 space-y-4 shrink-0 shadow-sm border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar por nombre, municipio o teléfono..." 
                className="pl-9 h-10 bg-slate-50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Select className="h-10 w-40 bg-slate-50" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">Todos los estados</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Evaluation Pending">Evaluation Pending</option>
                <option value="Offer Review">Offer Review</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </Select>
              <Button variant="outline" className={cn("h-10 bg-slate-50 border-slate-200", showAdvanced && "border-primary bg-primary/5")} onClick={() => setShowAdvanced(!showAdvanced)}>
                <Filter className="mr-2 h-4 w-4" /> Filtros {activeFilterCount > 0 && <span className="ml-1 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
              </Button>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" className="text-slate-400 text-xs" onClick={clearFilters}>Limpiar</Button>
              )}
            </div>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Región</label>
                <Select className="h-9 bg-slate-50 text-sm" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                  <option value="All">Todas</option>
                  <option>Metro</option><option>Norte</option><option>Sur</option><option>Este</option><option>Oeste</option><option>Centro</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Municipio</label>
                <Select className="h-9 bg-slate-50 text-sm" value={municipalityFilter} onChange={e => setMunicipalityFilter(e.target.value)}>
                  <option value="All">Todos</option>
                  {Array.from(new Set((leads || []).map(l => l.municipality))).sort().map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Tipo Propiedad</label>
                <Select className="h-9 bg-slate-50 text-sm" value={propertyTypeFilter} onChange={e => setPropertyTypeFilter(e.target.value)}>
                  <option value="All">Todos</option>
                  <option>Casa</option><option>Apartamento</option><option>Multifamiliar</option><option>Terreno</option><option>Comercial</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Urgencia</label>
                <Select className="h-9 bg-slate-50 text-sm" value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
                  <option value="All">Todas</option>
                  <option>Urgente</option><option>7 días</option><option>Este mes</option><option>30-60 días</option><option>Solo evaluando</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Score</label>
                <Select className="h-9 bg-slate-50 text-sm" value={scoreFilter} onChange={e => setScoreFilter(e.target.value)}>
                  <option value="All">Todos</option>
                  <option value="Hot">Hot (85+)</option>
                  <option value="High">High (60-84)</option>
                  <option value="Medium">Medium (30-59)</option>
                  <option value="Low">Low (&lt;30)</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Owner</label>
                <Select className="h-9 bg-slate-50 text-sm" value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}>
                  <option value="All">Todos</option>
                  <option>Carlos Reyes</option><option>María Santos</option><option>Juan Delgado</option><option>Unassigned</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Fuente</label>
                <Select className="h-9 bg-slate-50 text-sm" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                  <option value="All">Todas</option>
                  <option>Facebook Ad</option><option>Instagram Ad</option><option>Website</option><option>Referral</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Prioridad</label>
                <Select className="h-9 bg-slate-50 text-sm" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                  <option value="All">Todas</option>
                  <option>Urgent</option><option>High</option><option>Normal</option><option>Low</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Fecha Desde</label>
                <Input type="date" className="h-9 bg-slate-50 text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Fecha Hasta</label>
                <Input type="date" className="h-9 bg-slate-50 text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
            </div>
          )}
        </Card>

        <Card className="flex-1 overflow-hidden flex flex-col shadow-sm border-slate-200">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input type="checkbox" className="rounded border-slate-300" checked={filteredLeads.length > 0 && selectedIds.size === filteredLeads.length} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-4 py-4 font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort("name")}>
                    <span className="flex items-center gap-1">Lead <SortIcon col="name" /></span>
                  </th>
                  <th className="px-4 py-4 font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort("municipality")}>
                    <span className="flex items-center gap-1">Propiedad / Ubicación <SortIcon col="municipality" /></span>
                  </th>
                  <th className="px-4 py-4 font-semibold">Situación</th>
                  <th className="px-4 py-4 font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort("score")}>
                    <span className="flex items-center gap-1">Score <SortIcon col="score" /></span>
                  </th>
                  <th className="px-4 py-4 font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort("status")}>
                    <span className="flex items-center gap-1">Estado <SortIcon col="status" /></span>
                  </th>
                  <th className="px-4 py-4 font-semibold">Owner</th>
                  <th className="px-4 py-4 font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort("entryDate")}>
                    <span className="flex items-center gap-1">Fecha <SortIcon col="entryDate" /></span>
                  </th>
                  <th className="px-4 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={9} className="text-center py-10 text-slate-500">Cargando leads...</td></tr>
                ) : filteredLeads.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-10 text-slate-500">No se encontraron resultados.</td></tr>
                ) : (
                  filteredLeads.slice((page - 1) * pageSize, page * pageSize).map(lead => {
                    const handleRowClick = (e: React.MouseEvent) => {
                      const target = e.target as HTMLElement;
                      if (target.closest('input[type="checkbox"]') || target.closest('button')) return;
                      navigate(`/admin/leads/${lead.id}`);
                    };
                    return (
                      <tr key={lead.id} className={cn("bg-white hover:bg-slate-50/80 transition-colors group cursor-pointer", selectedIds.has(lead.id) && "bg-primary/5")} onClick={handleRowClick}>
                        <td className="px-4 py-4">
                          <input type="checkbox" className="rounded border-slate-300" checked={selectedIds.has(lead.id)} onChange={() => toggleSelect(lead.id)} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{lead.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-700">{lead.municipality}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{lead.propertyType}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-slate-700">{lead.situation[0] || 'N/A'}</div>
                          <div className={cn("text-xs mt-0.5 font-medium", lead.timeline === 'Urgente' ? "text-red-500" : "text-slate-500")}>
                            {lead.timeline}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)} className="mb-1">{lead.scoreCategory} {lead.score}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="default" className={cn("border-0", STATUS_COLORS[lead.status])}>{lead.status}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold text-slate-600">
                              {lead.owner.substring(0,2).toUpperCase()}
                            </div>
                            <span className="text-slate-600">{lead.owner.split(' ')[0]}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          {format(new Date(lead.entryDate), "dd MMM, yyyy", { locale: es })}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-sm text-slate-500 shrink-0">
            <div>Mostrando {Math.min((page - 1) * pageSize + 1, filteredLeads.length)}–{Math.min(page * pageSize, filteredLeads.length)} de {filteredLeads.length} leads</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
              <Button variant="outline" size="sm" disabled={page * pageSize >= filteredLeads.length} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}
