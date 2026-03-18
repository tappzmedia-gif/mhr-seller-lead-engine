import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui-components";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "[data-tour='sidebar']",
    title: "Navegación Principal",
    content: "Accede a todos los módulos del CRM desde la barra lateral. Los badges muestran conteos de items pendientes.",
    position: "right",
  },
  {
    target: "[data-tour='role-switcher']",
    title: "Demo Role Switcher",
    content: "Cambia de rol para ver cómo diferentes usuarios ven la plataforma. Cada rol tiene permisos específicos por módulo.",
    position: "bottom",
  },
  {
    target: "[data-tour='search']",
    title: "Búsqueda Global",
    content: "Busca leads, propiedades, evaluaciones y más desde cualquier pantalla con Cmd+K.",
    position: "bottom",
  },
  {
    target: "[data-tour='notifications']",
    title: "Notificaciones",
    content: "Recibe alertas sobre leads nuevos, follow-ups vencidos, ofertas actualizadas y más.",
    position: "bottom",
  },
];

export function DemoMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    try { return localStorage.getItem("demo-tour-seen") === "true"; } catch { return false; }
  });

  useEffect(() => {
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [hasSeenTour]);

  const handleClose = () => {
    setIsOpen(false);
    setHasSeenTour(true);
    try { localStorage.setItem("demo-tour-seen", "true"); } catch {}
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) {
    if (hasSeenTour) return null;
    return (
      <button
        onClick={() => { setIsOpen(true); setCurrentStep(0); }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white text-sm font-semibold rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
      >
        <Sparkles className="h-4 w-4" />
        Demo Tour
      </button>
    );
  }

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[1px]" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-700 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Paso {currentStep + 1} de {TOUR_STEPS.length}
              </div>
              <button onClick={handleClose} className="text-white/60 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-600 leading-relaxed">{step.content}</p>
          </div>
          <div className="px-5 pb-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentStep ? "bg-primary" : i < currentStep ? "bg-primary/30" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={handlePrev}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {currentStep === TOUR_STEPS.length - 1 ? "Finalizar" : <>Siguiente <ChevronRight className="h-4 w-4 ml-1" /></>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
