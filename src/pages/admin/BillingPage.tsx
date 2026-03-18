import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn, formatCurrency } from "@/lib/utils";
import { DollarSign, Plus, Search, TrendingUp, Clock, AlertTriangle, CheckCircle, CreditCard, ArrowUpRight, ArrowDownRight, Filter, Loader2, Eye, X, Lock, Sparkles } from "lucide-react";
import { billingService } from "@/lib/services/billingService";
import type { Transaction, BillingMetrics, PaymentProvider, TransactionStatus } from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const STATUS_BADGES: Record<TransactionStatus, { variant: any; label: string }> = {
  completed: { variant: 'success', label: 'Completado' },
  pending: { variant: 'medium', label: 'Pendiente' },
  failed: { variant: 'destructive', label: 'Fallido' },
  refunded: { variant: 'low', label: 'Reembolsado' },
  overdue: { variant: 'hot', label: 'Vencido' },
};

const METHOD_LABELS: Record<string, string> = {
  stripe: 'Stripe', square: 'Square', paypal: 'PayPal', ach: 'ACH', cash: 'Efectivo', check: 'Cheque', quickbooks: 'QuickBooks',
};

function CheckoutModal({ transaction, onClose, onPaid }: { transaction: Transaction; onClose: () => void; onPaid: (tx: Transaction) => void }) {
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

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    setSuccess(true);

    const updated = await billingService.update(transaction.id, { status: 'completed' });
    if (updated) {
      setTimeout(() => {
        onPaid(updated);
        toast({ title: "Pago exitoso", description: `${formatCurrency(transaction.amount)} pagado correctamente.` });
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
            <p className="text-slate-500 text-sm">Se ha procesado el pago de {formatCurrency(transaction.amount)}</p>
            <Badge variant="success" className="mt-3 text-sm px-4 py-1">Pagado</Badge>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm font-medium">Checkout</span>
                </div>
                <button onClick={onClose} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(transaction.amount)}</div>
              <div className="text-white/60 text-sm mt-1">{transaction.description}</div>
              <div className="text-white/40 text-xs mt-0.5">{transaction.clientName}</div>
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
                  <>Pagar {formatCurrency(transaction.amount)}</>
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

export default function BillingPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<BillingMetrics | null>(null);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [checkoutTx, setCheckoutTx] = useState<Transaction | null>(null);

  useEffect(() => {
    Promise.all([billingService.getAll(), billingService.getMetrics(), billingService.getProviders()]).then(([txs, met, provs]) => {
      setTransactions(txs);
      setMetrics(met);
      setProviders(provs);
      setLoading(false);
    });
  }, []);

  const filtered = transactions
    .filter(t => statusFilter === 'all' || t.status === statusFilter)
    .filter(t => !search || t.clientName.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));

  const handleCheckoutPaid = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    setCheckoutTx(null);
    if (selectedTx?.id === updatedTx.id) setSelectedTx(updatedTx);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Facturación y Pagos</h1>
            <p className="text-sm text-slate-500 mt-1">Vista general de transacciones y cobros.</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Solicitar Pago</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2"><DollarSign className="h-5 w-5 text-slate-400" /><ArrowUpRight className="h-4 w-4 text-emerald-500" /></div>
              <div className="text-2xl font-bold text-slate-900">{metrics ? formatCurrency(metrics.totalBilled) : '...'}</div>
              <div className="text-xs text-slate-500">Total Facturado</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
              <div className="text-2xl font-bold text-emerald-700">{metrics ? formatCurrency(metrics.collected) : '...'}</div>
              <div className="text-xs text-emerald-600">Cobrado</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-amber-200 bg-amber-50/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2"><Clock className="h-5 w-5 text-amber-500" /></div>
              <div className="text-2xl font-bold text-amber-700">{metrics ? formatCurrency(metrics.pending) : '...'}</div>
              <div className="text-xs text-amber-600">Pendiente</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-red-200 bg-red-50/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
              <div className="text-2xl font-bold text-red-700">{metrics ? formatCurrency(metrics.overdue) : '...'}</div>
              <div className="text-xs text-red-600">Vencido</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex gap-1 overflow-x-auto">
                    {(['all', 'completed', 'pending', 'overdue', 'failed', 'refunded'] as const).map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all", statusFilter === s ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>
                        {s === 'all' ? 'Todos' : STATUS_BADGES[s].label}
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
                ) : filtered.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">No hay transacciones.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filtered.map(tx => (
                      <div key={tx.id} className={cn("flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer", selectedTx?.id === tx.id && "bg-primary/5")} onClick={() => setSelectedTx(tx)}>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", tx.status === 'completed' ? 'bg-emerald-500' : tx.status === 'overdue' ? 'bg-red-500' : tx.status === 'failed' ? 'bg-red-400' : 'bg-amber-500')}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{tx.description}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{tx.clientName} · {METHOD_LABELS[tx.method]}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {(tx.status === 'pending' || tx.status === 'overdue') && (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={e => { e.stopPropagation(); setCheckoutTx(tx); }}>
                              <CreditCard className="h-3 w-3 mr-1" /> Cobrar
                            </Button>
                          )}
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">{formatCurrency(tx.amount)}</div>
                            <Badge variant={STATUS_BADGES[tx.status].variant} className="text-[10px] mt-0.5">{STATUS_BADGES[tx.status].label}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedTx ? (
              <Card className="shadow-sm border-slate-200 sticky top-20">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base">Detalle de Transacción</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="text-center py-2">
                    <div className="text-3xl font-bold text-slate-900">{formatCurrency(selectedTx.amount)}</div>
                    <Badge variant={STATUS_BADGES[selectedTx.status].variant} className="mt-2">{STATUS_BADGES[selectedTx.status].label}</Badge>
                  </div>
                  <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                    <div className="flex justify-between"><span className="text-slate-500">Cliente</span><span className="font-medium">{selectedTx.clientName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Método</span><span className="font-medium">{METHOD_LABELS[selectedTx.method]}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Fecha</span><span className="font-medium">{format(new Date(selectedTx.date), "d MMM yyyy", { locale: es })}</span></div>
                    {selectedTx.dueDate && <div className="flex justify-between"><span className="text-slate-500">Vence</span><span className="font-medium">{format(new Date(selectedTx.dueDate), "d MMM yyyy", { locale: es })}</span></div>}
                    {selectedTx.memo && <div className="pt-2"><span className="text-xs text-slate-500">Memo:</span><p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded">{selectedTx.memo}</p></div>}
                  </div>
                  {selectedTx.timeline.length > 0 && (
                    <div className="border-t border-slate-100 pt-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Timeline</h4>
                      {selectedTx.timeline.map(t => (
                        <div key={t.id} className="text-[11px] text-slate-500 mb-1.5">
                          <span className="font-medium text-slate-700">{t.action}</span>
                          <div className="text-slate-400">{t.author} · {formatDistanceToNow(new Date(t.date), { addSuffix: true, locale: es })}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {(selectedTx.status === 'pending' || selectedTx.status === 'overdue') && (
                    <div className="border-t border-slate-100 pt-3">
                      <Button className="w-full" onClick={() => setCheckoutTx(selectedTx)}>
                        <CreditCard className="h-4 w-4 mr-2" /> Procesar Pago
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base">Proveedores de Pago</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="space-y-3">
                    {providers.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.description}</div>
                        </div>
                        <Badge variant={p.status === 'connected' ? 'success' : p.status === 'coming-soon' ? 'secondary' : 'low'} className="text-[10px]">
                          {p.status === 'connected' ? 'Conectado' : p.status === 'coming-soon' ? 'Próximo' : 'Desconectado'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {checkoutTx && <CheckoutModal transaction={checkoutTx} onClose={() => setCheckoutTx(null)} onPaid={handleCheckoutPaid} />}
    </AdminLayout>
  );
}
