import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn, formatCurrency } from "@/lib/utils";
import { Receipt, Plus, Search, Eye, Send, DollarSign, Clock, CheckCircle, AlertTriangle, FileText, Loader2, Printer, X, Trash2, Save, CreditCard, Lock } from "lucide-react";
import { invoicesService } from "@/lib/services/invoicesService";
import type { Invoice, Receipt as ReceiptType, InvoiceStatus, InvoiceLineItem } from "@/lib/operations-types";
import { BRAND } from "@/lib/mock-data";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const STATUS_BADGES: Record<InvoiceStatus, { variant: any; label: string }> = {
  draft: { variant: 'secondary', label: 'Borrador' },
  sent: { variant: 'default', label: 'Enviada' },
  viewed: { variant: 'high', label: 'Vista' },
  paid: { variant: 'success', label: 'Pagada' },
  'partially-paid': { variant: 'medium', label: 'Pago Parcial' },
  overdue: { variant: 'destructive', label: 'Vencida' },
  canceled: { variant: 'low', label: 'Cancelada' },
  void: { variant: 'low', label: 'Anulada' },
};

const METHOD_LABELS: Record<string, string> = {
  stripe: 'Stripe', square: 'Square', paypal: 'PayPal', ach: 'ACH', cash: 'Efectivo', check: 'Cheque', quickbooks: 'QuickBooks',
};

function InvoiceCheckoutModal({ invoice, onClose, onPaid }: { invoice: Invoice; onClose: () => void; onPaid: (inv: Invoice) => void }) {
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const amountDue = invoice.balanceDue > 0 ? invoice.balanceDue : invoice.total;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    setSuccess(true);

    const updated = await invoicesService.update(invoice.id, {
      status: 'paid',
      amountPaid: invoice.total,
      balanceDue: 0,
      paidDate: new Date().toISOString(),
    });
    if (updated) {
      setTimeout(() => {
        onPaid(updated);
        toast({ title: "Pago exitoso", description: `Factura ${invoice.number} pagada: ${formatCurrency(amountDue)}` });
      }, 1500);
    }
  };

  const isValid = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvc.length >= 3;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pago Exitoso</h3>
            <p className="text-slate-500 text-sm">Factura {invoice.number} pagada: {formatCurrency(amountDue)}</p>
            <Badge variant="success" className="mt-3 text-sm px-4 py-1">Pagado</Badge>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm font-medium">Pagar Factura</span>
                </div>
                <button onClick={onClose} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(amountDue)}</div>
              <div className="text-white/60 text-sm mt-1">Factura {invoice.number}</div>
              <div className="text-white/40 text-xs mt-0.5">{invoice.clientName}</div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">Número de Tarjeta</label>
                <div className="relative">
                  <Input
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    className="h-11 text-sm pl-10"
                    maxLength={19}
                  />
                  <CreditCard className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Vencimiento</label>
                  <Input
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="h-11 text-sm"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">CVC</label>
                  <div className="relative">
                    <Input
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="h-11 text-sm pl-10"
                      maxLength={4}
                    />
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={handlePay}
                disabled={!isValid || processing}
              >
                {processing ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Procesando...</>
                ) : (
                  <>Pagar {formatCurrency(amountDue)}</>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Lock className="h-3 w-3" />
                <span>Pago simulado · No se realizará ningún cargo real</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InvoicePublicView({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto print:relative">
      <div className="max-w-3xl mx-auto p-8 print:p-4">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h2 className="text-lg font-semibold">Vista de Factura</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="h-3.5 w-3.5 mr-1" /> Exportar PDF</Button>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-8 print:border-none print:p-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt={BRAND.name} className="h-12 w-auto object-contain mb-2" />
              <h1 className="text-2xl font-display font-bold text-slate-900">{BRAND.name}</h1>
              <p className="text-sm text-slate-500">{BRAND.tagline}</p>
              <p className="text-xs text-slate-400 mt-1">{BRAND.email}</p>
              <p className="text-xs text-slate-400">{BRAND.phones.metro}</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-display font-bold text-primary">FACTURA</h2>
              <p className="text-lg font-semibold text-slate-700 mt-1">{invoice.number}</p>
              <Badge variant={STATUS_BADGES[invoice.status].variant} className="mt-2">{STATUS_BADGES[invoice.status].label}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Facturar a:</h4>
              <p className="text-sm font-semibold text-slate-900">{invoice.clientName}</p>
              <p className="text-sm text-slate-500">{invoice.clientEmail}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Fecha: <span className="font-medium text-slate-700">{format(new Date(invoice.issueDate), "d MMM yyyy", { locale: es })}</span></div>
              <div className="text-sm text-slate-500">Vence: <span className="font-medium text-slate-700">{format(new Date(invoice.dueDate), "d MMM yyyy", { locale: es })}</span></div>
              {invoice.terms && <div className="text-xs text-slate-400 mt-1">{invoice.terms}</div>}
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 text-slate-500 font-semibold">Descripción</th>
                <th className="text-right py-3 text-slate-500 font-semibold">Cant.</th>
                <th className="text-right py-3 text-slate-500 font-semibold">Precio</th>
                <th className="text-right py-3 text-slate-500 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map(li => (
                <tr key={li.id} className="border-b border-slate-100">
                  <td className="py-3 text-slate-700">{li.description}</td>
                  <td className="py-3 text-right text-slate-600">{li.quantity}</td>
                  <td className="py-3 text-right text-slate-600">{formatCurrency(li.unitPrice)}</td>
                  <td className="py-3 text-right font-medium text-slate-900">{formatCurrency(li.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-slate-500">Tax ({invoice.taxRate}%)</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-lg border-t-2 border-slate-300">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">{formatCurrency(invoice.total)}</span>
              </div>
              {invoice.amountPaid > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-emerald-600 font-medium">Pagado</span>
                  <span className="text-emerald-600 font-medium">-{formatCurrency(invoice.amountPaid)}</span>
                </div>
              )}
              {invoice.balanceDue > 0 && (
                <div className="flex justify-between py-2 text-sm font-bold">
                  <span className="text-red-600">Balance Pendiente</span>
                  <span className="text-red-600">{formatCurrency(invoice.balanceDue)}</span>
                </div>
              )}
            </div>
          </div>

          {invoice.memo && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Notas</h4>
              <p className="text-sm text-slate-600">{invoice.memo}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            <p>{BRAND.name} · {BRAND.email} · {BRAND.phones.metro}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateInvoiceForm({ onSave, onCancel }: { onSave: (inv: Invoice) => void; onCancel: () => void }) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [memo, setMemo] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: `li-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const addLineItem = () => {
    setLineItems(prev => [...prev, { id: `li-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const updateLineItem = (id: string, field: string, value: string | number) => {
    setLineItems(prev => prev.map(li => {
      if (li.id !== id) return li;
      const updated = { ...li, [field]: value };
      updated.total = updated.quantity * updated.unitPrice;
      return updated;
    }));
  };

  const removeLineItem = (id: string) => {
    setLineItems(prev => prev.filter(li => li.id !== id));
  };

  const subtotal = lineItems.reduce((s, li) => s + li.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSave = async () => {
    const inv = await invoicesService.create({
      clientName, clientEmail, lineItems, subtotal, taxRate, taxAmount, total, amountPaid: 0, balanceDue: total, memo,
    });
    onSave(inv);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Nueva Factura</CardTitle>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Nombre del Cliente</label>
            <Input value={clientName} onChange={e => setClientName(e.target.value)} className="h-9 text-sm" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Email</label>
            <Input value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="h-9 text-sm" placeholder="email@ejemplo.com" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase">Líneas</h4>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addLineItem}><Plus className="h-3 w-3 mr-1" /> Agregar</Button>
          </div>
          <div className="space-y-2">
            {lineItems.map(li => (
              <div key={li.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input value={li.description} onChange={e => updateLineItem(li.id, 'description', e.target.value)} placeholder="Descripción" className="h-8 text-xs" />
                </div>
                <div className="w-16">
                  <Input type="number" value={li.quantity} onChange={e => updateLineItem(li.id, 'quantity', parseInt(e.target.value) || 0)} className="h-8 text-xs" />
                </div>
                <div className="w-24">
                  <Input type="number" value={li.unitPrice} onChange={e => updateLineItem(li.id, 'unitPrice', parseFloat(e.target.value) || 0)} placeholder="Precio" className="h-8 text-xs" />
                </div>
                <div className="w-24 text-right text-sm font-medium text-slate-700 py-1">{formatCurrency(li.total)}</div>
                <button onClick={() => removeLineItem(li.id)} className="text-red-400 hover:text-red-600 pb-1"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Tax Rate (%)</label>
            <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="h-9 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Notas/Memo</label>
            <Input value={memo} onChange={e => setMemo(e.target.value)} className="h-9 text-sm" placeholder="Notas opcionales..." />
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 text-right space-y-1">
          <div className="text-sm text-slate-500">Subtotal: <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span></div>
          {taxAmount > 0 && <div className="text-sm text-slate-500">Tax: <span className="font-medium">{formatCurrency(taxAmount)}</span></div>}
          <div className="text-lg font-bold text-slate-900">Total: {formatCurrency(total)}</div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancelar</Button>
          <Button className="flex-1" onClick={handleSave} disabled={!clientName}><Save className="h-4 w-4 mr-2" /> Guardar como Borrador</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<InvoiceStatus | 'all' | 'receipts'>('all');
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showPublicView, setShowPublicView] = useState(false);
  const [checkoutInv, setCheckoutInv] = useState<Invoice | null>(null);

  useEffect(() => {
    Promise.all([invoicesService.getAll(), invoicesService.getReceipts()]).then(([invs, recs]) => {
      setInvoices(invs);
      setReceipts(recs);
      setLoading(false);
    });
  }, []);

  const handleSendInvoice = async (inv: Invoice) => {
    const updated = await invoicesService.update(inv.id, { status: 'sent' });
    if (updated) {
      setInvoices(prev => prev.map(i => i.id === inv.id ? updated : i));
      setSelectedInv(updated);
    }
  };

  const handleCheckoutPaid = (updatedInv: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === updatedInv.id ? updatedInv : i));
    setCheckoutInv(null);
    setSelectedInv(updatedInv);
  };

  const handleCreateSave = (inv: Invoice) => {
    setInvoices(prev => [...prev, inv]);
    setShowCreate(false);
    setSelectedInv(inv);
  };

  const filtered = activeTab === 'receipts' ? [] : invoices
    .filter(i => activeTab === 'all' || i.status === activeTab)
    .filter(i => !search || i.clientName.toLowerCase().includes(search.toLowerCase()) || i.number.toLowerCase().includes(search.toLowerCase()));

  if (showPublicView && selectedInv) {
    return <InvoicePublicView invoice={selectedInv} onClose={() => setShowPublicView(false)} />;
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Facturas y Recibos</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona facturas, pagos y recibos.</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-2" /> Nueva Factura</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{invoices.length}</div><div className="text-xs text-slate-500">Total Facturas</div></CardContent></Card>
          <Card className="shadow-sm border-emerald-200 bg-emerald-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-700">{formatCurrency(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0))}</div><div className="text-xs text-emerald-600">Pagadas</div></CardContent></Card>
          <Card className="shadow-sm border-amber-200 bg-amber-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-amber-700">{formatCurrency(invoices.filter(i => ['sent', 'viewed', 'partially-paid'].includes(i.status)).reduce((s, i) => s + i.balanceDue, 0))}</div><div className="text-xs text-amber-600">Pendiente</div></CardContent></Card>
          <Card className="shadow-sm border-red-200 bg-red-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-red-700">{formatCurrency(invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.balanceDue, 0))}</div><div className="text-xs text-red-600">Vencido</div></CardContent></Card>
        </div>

        {showCreate && (
          <CreateInvoiceForm onSave={handleCreateSave} onCancel={() => setShowCreate(false)} />
        )}

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex gap-1 overflow-x-auto">
                {(['all', 'draft', 'sent', 'paid', 'partially-paid', 'overdue', 'receipts'] as const).map(s => (
                  <button key={s} onClick={() => setActiveTab(s)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", activeTab === s ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>
                    {s === 'all' ? 'Todas' : s === 'receipts' ? `Recibos (${receipts.length})` : STATUS_BADGES[s].label}
                  </button>
                ))}
              </div>
              <div className="relative w-48 hidden sm:block">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-9 text-xs" />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : activeTab === 'receipts' ? (
              receipts.length === 0 ? (
                <div className="text-center py-16 text-slate-400">No hay recibos.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {receipts.map(rec => (
                    <div key={rec.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle className="h-4 w-4" /></div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Recibo #{rec.id}</div>
                          <div className="text-xs text-slate-500">{rec.clientName} · {rec.invoiceNumber}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{format(new Date(rec.date), "d MMM yyyy", { locale: es })} · {METHOD_LABELS[rec.method]}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-600">{formatCurrency(rec.amount)}</div>
                        <Button size="sm" variant="ghost" className="mt-1 h-7 text-xs"><Printer className="h-3 w-3 mr-1" /> Imprimir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">No hay facturas.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map(inv => (
                  <div key={inv.id} className={cn("flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer", selectedInv?.id === inv.id && "bg-primary/5")} onClick={() => setSelectedInv(inv)}>
                    <div className="flex items-start gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", inv.status === 'paid' ? 'bg-emerald-500' : inv.status === 'overdue' ? 'bg-red-500' : inv.status === 'partially-paid' ? 'bg-amber-500' : 'bg-slate-400')}>
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{inv.number}</div>
                        <div className="text-xs text-slate-500">{inv.clientName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{inv.lineItems.length} líneas · Vence {format(new Date(inv.dueDate), "d MMM", { locale: es })}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {(inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'overdue' || inv.status === 'partially-paid') && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={e => { e.stopPropagation(); setCheckoutInv(inv); }}>
                          <CreditCard className="h-3 w-3 mr-1" /> Pagar
                        </Button>
                      )}
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">{formatCurrency(inv.total)}</div>
                        {inv.balanceDue > 0 && inv.balanceDue !== inv.total && <div className="text-[11px] text-amber-600">Balance: {formatCurrency(inv.balanceDue)}</div>}
                        <Badge variant={STATUS_BADGES[inv.status].variant} className="text-[10px] mt-0.5">{STATUS_BADGES[inv.status].label}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedInv && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{selectedInv.number} — {selectedInv.clientName}</CardTitle>
                <Badge variant={STATUS_BADGES[selectedInv.status].variant}>{STATUS_BADGES[selectedInv.status].label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-200"><th className="text-left py-2 text-slate-500 font-medium">Descripción</th><th className="text-right py-2 text-slate-500 font-medium">Cant.</th><th className="text-right py-2 text-slate-500 font-medium">Precio</th><th className="text-right py-2 text-slate-500 font-medium">Total</th></tr></thead>
                  <tbody>
                    {selectedInv.lineItems.map(li => (
                      <tr key={li.id} className="border-b border-slate-50"><td className="py-2 text-slate-700">{li.description}</td><td className="py-2 text-right text-slate-600">{li.quantity}</td><td className="py-2 text-right text-slate-600">{formatCurrency(li.unitPrice)}</td><td className="py-2 text-right font-medium text-slate-900">{formatCurrency(li.total)}</td></tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-200"><td colSpan={3} className="py-2 text-right font-medium text-slate-500">Subtotal</td><td className="py-2 text-right font-medium">{formatCurrency(selectedInv.subtotal)}</td></tr>
                    {selectedInv.taxAmount > 0 && <tr><td colSpan={3} className="py-1 text-right text-slate-500">Tax ({selectedInv.taxRate}%)</td><td className="py-1 text-right">{formatCurrency(selectedInv.taxAmount)}</td></tr>}
                    <tr className="border-t border-slate-300"><td colSpan={3} className="py-2 text-right font-bold text-slate-900">Total</td><td className="py-2 text-right font-bold text-lg">{formatCurrency(selectedInv.total)}</td></tr>
                    {selectedInv.amountPaid > 0 && <tr><td colSpan={3} className="py-1 text-right text-emerald-600 font-medium">Pagado</td><td className="py-1 text-right text-emerald-600 font-medium">-{formatCurrency(selectedInv.amountPaid)}</td></tr>}
                    {selectedInv.balanceDue > 0 && <tr><td colSpan={3} className="py-1 text-right text-red-600 font-bold">Balance</td><td className="py-1 text-right text-red-600 font-bold">{formatCurrency(selectedInv.balanceDue)}</td></tr>}
                  </tfoot>
                </table>
              </div>
              {selectedInv.payments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Pagos Aplicados</h4>
                  {selectedInv.payments.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm py-1.5">
                      <span className="text-slate-600">{format(new Date(p.date), "d MMM yyyy", { locale: es })} · {METHOD_LABELS[p.method]}</span>
                      <span className="font-medium text-emerald-600">{formatCurrency(p.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowPublicView(true)}><Eye className="h-3.5 w-3.5 mr-1" /> Ver Factura</Button>
                {selectedInv.status === 'draft' && <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSendInvoice(selectedInv)}><Send className="h-3.5 w-3.5 mr-1" /> Enviar</Button>}
                {selectedInv.status !== 'paid' && selectedInv.status !== 'void' && (
                  <Button size="sm" className="flex-1" onClick={() => setCheckoutInv(selectedInv)}>
                    <CreditCard className="h-3.5 w-3.5 mr-1" /> Pagar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {checkoutInv && <InvoiceCheckoutModal invoice={checkoutInv} onClose={() => setCheckoutInv(null)} onPaid={handleCheckoutPaid} />}
    </AdminLayout>
  );
}
