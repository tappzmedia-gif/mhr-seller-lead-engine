import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { Button, Input, Select, Textarea, Card } from "@/components/ui-components";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useCreateLead } from "@/hooks/use-leads";
import { cn } from "@/lib/utils";

const STEPS = 9; // Step 10 is success page redirection

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const createLead = useCreateLead();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredContact: "Llamada",
    propertyType: "Casa",
    municipality: "",
    sector: "",
    region: "Metro",
    situation: [] as string[],
    condition: "Buena",
    timeline: "30-60 días",
    estimatedValue: "$100k - $150k",
    hasDebt: "No sé",
    isOccupied: "No",
    additionalMessage: "",
    source: "Website",
    nextFollowUp: null as string | null,
    tags: [] as string[],
  });

  const nextStep = () => setStep(s => Math.min(STEPS, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const toggleSituation = (s: string) => {
    setFormData(prev => ({
      ...prev,
      situation: prev.situation.includes(s) 
        ? prev.situation.filter(x => x !== s)
        : [...prev.situation, s]
    }));
  };

  const handleSubmit = () => {
    createLead.mutate(formData, {
      onSuccess: () => {
        setLocation("/gracias");
      }
    });
  };

  const isStepValid = () => {
    if (step === 1) return formData.name.trim() !== "" && formData.phone.trim() !== "";
    if (step === 3) return formData.municipality.trim() !== "";
    if (step === 4) return formData.situation.length > 0;
    return true;
  };

  return (
    <PublicLayout>
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-2">
              <span>Paso {step} de {STEPS}</span>
              <span>{Math.round((step / STEPS) * 100)}% Completado</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(step / STEPS) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="p-6 md:p-10 shadow-xl shadow-slate-200/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">Empecemos con lo básico</h2>
                      <p className="text-slate-500 mt-1">Tu información es confidencial.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                        <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Juan Pérez" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Teléfono *</label>
                        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(787) 555-0000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email (Opcional)</label>
                        <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="juan@email.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Método preferido de contacto</label>
                        <div className="flex gap-3">
                          {["Llamada", "WhatsApp", "Email"].map(method => (
                            <button
                              key={method}
                              onClick={() => setFormData({...formData, preferredContact: method})}
                              className={cn(
                                "flex-1 py-3 border-2 rounded-xl text-sm font-medium transition-all",
                                formData.preferredContact === method ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-slate-300"
                              )}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">¿Qué tipo de propiedad es?</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["Casa", "Apartamento", "Multifamiliar", "Terreno", "Comercial", "Otra"].map(type => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, propertyType: type})}
                          className={cn(
                            "p-4 border-2 rounded-xl text-left transition-all",
                            formData.propertyType === type ? "border-primary bg-primary/5 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          <div className={cn("font-medium", formData.propertyType === type ? "text-primary" : "text-slate-700")}>{type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">¿Dónde está ubicada?</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Municipio *</label>
                        <Input value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} placeholder="Ej. Bayamón, San Juan..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Sector / Urbanización / Barrio</label>
                        <Input value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} placeholder="Ej. Urb. Santa Rosa" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Región general</label>
                        <Select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                          <option>Metro</option>
                          <option>Norte</option>
                          <option>Sur</option>
                          <option>Este</option>
                          <option>Oeste</option>
                          <option>Centro</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">¿Cuál es la situación principal?</h2>
                      <p className="text-slate-500 mt-1">Selecciona todas las que apliquen (mínimo 1)</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {["Quiero vender rápido", "Propiedad heredada", "Tiene deudas / Atrasos", "Problemas de CRIM", "Está deteriorada", "Está vacía / Abandonada", "Me mudo de Puerto Rico", "No quiero invertir más dinero", "Solo estoy explorando opciones"].map(sit => (
                        <button
                          key={sit}
                          onClick={() => toggleSituation(sit)}
                          className={cn(
                            "flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all",
                            formData.situation.includes(sit) ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <div className={cn("w-5 h-5 rounded-md border flex items-center justify-center shrink-0", formData.situation.includes(sit) ? "bg-primary border-primary" : "border-slate-300")}>
                            {formData.situation.includes(sit) && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={formData.situation.includes(sit) ? "text-primary font-medium" : "text-slate-700"}>{sit}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">Condición física de la propiedad</h2>
                    </div>
                    <div className="space-y-3">
                      {["Excelente", "Buena", "Regular", "Necesita reparaciones", "Muy deteriorada", "No estoy seguro"].map(cond => (
                        <button
                          key={cond}
                          onClick={() => setFormData({...formData, condition: cond})}
                          className={cn(
                            "w-full p-4 border-2 rounded-xl text-left transition-all",
                            formData.condition === cond ? "border-primary bg-primary/5 font-medium text-primary shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">¿Qué tan pronto te gustaría vender?</h2>
                    </div>
                    <div className="space-y-3">
                      {["Urgente (lo antes posible)", "En los próximos 7 días", "Este mes", "30-60 días", "Solo evaluando por ahora"].map(t => (
                        <button
                          key={t}
                          onClick={() => setFormData({...formData, timeline: t.replace(" (lo antes posible)", "")})}
                          className={cn(
                            "w-full p-4 border-2 rounded-xl text-left transition-all",
                            formData.timeline === t.replace(" (lo antes posible)", "") ? "border-primary bg-primary/5 font-medium text-primary shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">Información Adicional</h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Valor estimado o expectativa</label>
                        <Select value={formData.estimatedValue} onChange={e => setFormData({...formData, estimatedValue: e.target.value})}>
                          <option>Menos de $50k</option>
                          <option>$50k - $100k</option>
                          <option>$100k - $150k</option>
                          <option>$150k - $200k</option>
                          <option>$200k - $300k</option>
                          <option>$300k+</option>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">¿La propiedad tiene hipoteca o deudas?</label>
                        <div className="flex gap-3">
                          {["Sí", "No", "No sé"].map(opt => (
                            <button
                              key={opt}
                              onClick={() => setFormData({...formData, hasDebt: opt})}
                              className={cn(
                                "flex-1 py-3 border-2 rounded-xl text-sm font-medium transition-all",
                                formData.hasDebt === opt ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-slate-300"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">¿Está ocupada actualmente?</label>
                        <div className="flex gap-3">
                          {["Sí", "No", "Parcialmente"].map(opt => (
                            <button
                              key={opt}
                              onClick={() => setFormData({...formData, isOccupied: opt})}
                              className={cn(
                                "flex-1 py-3 border-2 rounded-xl text-sm font-medium transition-all",
                                formData.isOccupied === opt ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-slate-300"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">¿Algo más que debamos saber?</h2>
                      <p className="text-slate-500 mt-1">Cualquier detalle ayuda a hacerte una mejor oferta.</p>
                    </div>
                    <Textarea 
                      value={formData.additionalMessage} 
                      onChange={e => setFormData({...formData, additionalMessage: e.target.value})}
                      placeholder="Ej. La casa tiene filtraciones en el techo, los herederos están de acuerdo en vender, etc."
                      className="min-h-[150px]"
                    />
                  </div>
                )}

                {step === 9 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">Revisa tu información</h2>
                      <p className="text-slate-500 mt-1">Todo luce bien. Confirma para enviar tu solicitud.</p>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500">Nombre:</span>
                        <span className="col-span-2 font-medium">{formData.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500">Teléfono:</span>
                        <span className="col-span-2 font-medium">{formData.phone}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500">Propiedad:</span>
                        <span className="col-span-2 font-medium">{formData.propertyType} en {formData.municipality}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500">Urgencia:</span>
                        <span className="col-span-2 font-medium">{formData.timeline}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500">Situación:</span>
                        <span className="col-span-2 font-medium">{formData.situation.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={step === 1 || createLead.isPending}
                className={step === 1 ? "invisible" : ""}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>

              {step < STEPS ? (
                <Button onClick={nextStep} disabled={!isStepValid()}>
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={createLead.isPending} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20">
                  {createLead.isPending ? "Enviando..." : "Enviar Solicitud"}
                  {!createLead.isPending && <Check className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
