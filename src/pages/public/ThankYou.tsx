import { Link } from "wouter";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { Button, Card } from "@/components/ui-components";
import { CheckCircle2, MessageCircle, Phone, ArrowLeft } from "lucide-react";
import { BRAND } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function ThankYou() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-xl w-full"
        >
          <Card className="p-8 md:p-12 text-center shadow-2xl shadow-slate-200/50">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">¡Información recibida con éxito!</h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Un miembro de nuestro equipo está revisando tu caso. Te contactaremos dentro de las próximas 24 horas para discutir las opciones.
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4">¿Quieres hablar con alguien ahora mismo?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="flex-1">
                  <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20 h-12">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Escribir por WhatsApp
                  </Button>
                </a>
                <a href={`tel:${BRAND.phones.metro.replace(/[^0-9]/g, '')}`} className="flex-1">
                  <Button variant="outline" className="w-full h-12 bg-white">
                    <Phone className="mr-2 h-5 w-5" />
                    Llamar al {BRAND.phones.metro}
                  </Button>
                </a>
              </div>
            </div>

            <Link href="/">
              <Button variant="ghost" className="text-slate-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
