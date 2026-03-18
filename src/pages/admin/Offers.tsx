import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button, Select } from "@/components/ui-components";
import { offers, type Offer } from "@/store";
import { cn } from "@/lib/utils";
import { DollarSign, Clock, CheckCircle2, X, AlertTriangle, ArrowUpDown, Plus, FileText, Send } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const STATUS_CONFIG: Record<Offer["status"], { color: string; label: string }> = {
  Draft: { color: "bg-slate-100 text-slate-700", label: "Borrador" },
  Sent: { color: "bg-blue-100 text-blue-700", label: "Enviada" },
  "Under Review": { color: "bg-amber-100 text-amber-700", label: "En Revisión" },
  Countered: { color: "bg-purple-100 text-purple-700", label: "Contraoferta" },
  Accepted: { color: "bg-emerald-100 text-emerald-700", label: "Aceptada" },
  Rejected: { color: "bg-red-100 text-red-700", label: "Rechazada" },
  Expired: { color: "bg-slate-200 text-slate-600", label: "Expirada" },
};

export default function Offers() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const filtered = offers.filter(o => statusFilter === "All" || o.status === statusFilter);
  const totalValue = offers.reduce((sum, o) => sum + o.amount, 0);
  const activeOffers = offers.filter(o => ["Sent", "Under Review", "Countered"].includes(o.status));
  const acceptedOffers = offers.filter(o => o.status === "Accepted");

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Offers" }]}>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Offers</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona ofertas enviadas y negociaciones.</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Nueva Oferta</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Total Ofertas</div>
              <div className="text-2xl font-display font-bold text-slate-900">{offers.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Valor Pipeline</div>
              <div className="text-2xl font-display font-bold text-primary">${(totalValue / 1000).toFixed(0)}k</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Activas</div>
              <div className="text-2xl font-display font-bold text-amber-600">{activeOffers.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">Aceptadas</div>
              <div className="text-2xl font-display font-bold text-emerald-600">{acceptedOffers.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-3">
          <Select className="h-9 w-48 bg-white text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">Todos los estados</option>
            <option value="Draft">Borrador</option>
            <option value="Sent">Enviada</option>
            <option value="Under Review">En Revisión</option>
            <option value="Countered">Contraoferta</option>
            <option value="Accepted">Aceptada</option>
            <option value="Rejected">Rechazada</option>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.map(offer => {
            const cfg = STATUS_CONFIG[offer.status];
            return (
              <Card key={offer.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{offer.leadName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{offer.propertyType} · {offer.municipality}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:shrink-0 flex-wrap">
                    <div className="text-right">
                      <div className="text-lg font-display font-bold text-slate-900">${offer.amount.toLocaleString()}</div>
                      {offer.counterAmount && (
                        <div className="flex items-center gap-1 text-xs text-purple-600"><ArrowUpDown className="h-3 w-3" /> ${offer.counterAmount.toLocaleString()}</div>
                      )}
                    </div>
                    <Badge className={cn("border-0", cfg.color)}>{cfg.label}</Badge>
                    <div className="text-xs text-slate-400">
                      {format(new Date(offer.createdDate), "dd MMM", { locale: es })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedOffer && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedOffer(null)} />
            <div className="fixed right-0 top-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-display font-bold text-lg text-slate-900">Oferta {selectedOffer.id}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOffer(null)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="p-5 space-y-5">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500 mb-1">Monto de Oferta</div>
                  <div className="text-3xl font-display font-bold text-slate-900">${selectedOffer.amount.toLocaleString()}</div>
                  {selectedOffer.counterAmount && (
                    <div className="mt-2 text-sm text-purple-600 font-medium">Contraoferta: ${selectedOffer.counterAmount.toLocaleString()}</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={cn("border-0", STATUS_CONFIG[selectedOffer.status].color)}>{STATUS_CONFIG[selectedOffer.status].label}</Badge>
                  <Link href={`/admin/leads/${selectedOffer.leadId}`} className="text-sm text-primary hover:underline font-medium">Ver Lead →</Link>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Lead", value: selectedOffer.leadName },
                    { label: "Propiedad", value: `${selectedOffer.propertyType} en ${selectedOffer.municipality}` },
                    { label: "Creada", value: format(new Date(selectedOffer.createdDate), "dd MMM yyyy", { locale: es }) },
                    { label: "Expira", value: format(new Date(selectedOffer.expiryDate), "dd MMM yyyy", { locale: es }) },
                    { label: "Owner", value: selectedOffer.owner },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
                {selectedOffer.notes && (
                  <div className="border-t border-slate-100 pt-4">
                    <div className="text-sm font-medium text-slate-500 mb-2">Notas</div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedOffer.notes}</p>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  {selectedOffer.status === "Draft" && <Button className="w-full"><Send className="h-4 w-4 mr-2" /> Enviar Oferta</Button>}
                  {selectedOffer.status === "Countered" && (
                    <>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="h-4 w-4 mr-2" /> Aceptar Contraoferta</Button>
                      <Button variant="outline" className="w-full">Contra-proponer</Button>
                    </>
                  )}
                  {["Sent", "Under Review"].includes(selectedOffer.status) && (
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">Retirar Oferta</Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
