import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button, Input, Card } from "@/components/ui-components";
import { BRAND } from "@/lib/mock-data";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleDemoAccess = () => {
    setLoading(true);
    setTimeout(() => setLocation("/admin/dashboard"), 800);
  };

  return (
    <div className="min-h-screen bg-[#0a1128] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt={BRAND.name}
            className="h-32 w-auto object-contain brightness-0 invert drop-shadow-2xl"
          />
        </div>
        <h2 className="text-center text-3xl font-display font-bold text-white tracking-tight">
          {BRAND.name}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Seller Lead Engine™
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl py-8 px-4 sm:px-10 rounded-3xl">
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleDemoAccess(); }}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <Input 
                  type="email" 
                  defaultValue="agente@myhouserealty.com" 
                  className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Contraseña
              </label>
              <div className="mt-1">
                <Input 
                  type="password" 
                  defaultValue="••••••••" 
                  className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/50" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Recordarme
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full h-12 text-base shadow-primary/30" disabled={loading}>
                {loading ? "Entrando..." : "Iniciar Sesión"}
              </Button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[#0a1128] px-2 text-slate-400 rounded-md">O para evaluación</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 border-white/20 hover:bg-white/10 hover:text-white text-[#000000]"
                  onClick={handleDemoAccess}
                >
                  Acceso Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
