import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui-components";
import { Clock, ShieldCheck, Home, AlertTriangle, ArrowRight, Star, ChevronDown, DollarSign, Handshake, Lock, Zap } from "lucide-react";
import { BRAND } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { HomeCatalogSection } from "@/components/catalog/HomeCatalogSection";

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-28 lg:pt-32 lg:pb-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Luxury Puerto Rico Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Compramos propiedades en todo Puerto Rico
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-[1.1] mb-5 shadow-sm">
                ¿Necesitas Vender Tu Propiedad Rápido y Sin Estrés?
              </h1>
              <p className="text-base sm:text-lg text-slate-200 mb-8 max-w-xl mx-auto leading-relaxed">
                Evaluamos tu caso, hacemos una oferta justa y compramos cash. Sin necesidad de reparar, sin intermediarios, sin complicaciones.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/formulario">
                  <Button size="lg" className="w-full sm:w-auto text-base h-13 px-8 shadow-xl shadow-primary/30 hover:scale-105 transition-transform group">
                    Evaluar mi propiedad
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="flex items-center gap-3 text-white text-sm">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-900 bg-slate-300 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Avatar" />
                      </div>
                    ))}
                  </div>
                  <span>+500<br/><span className="opacity-70">Propietarios ayudados</span></span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border">
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">Cash</div>
              <div className="text-sm font-medium text-slate-500">Compra directa</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">24h</div>
              <div className="text-sm font-medium text-slate-500">Respuesta inicial</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">Cero</div>
              <div className="text-sm font-medium text-slate-500">Comisiones o reparaciones</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">100%</div>
              <div className="text-sm font-medium text-slate-500">Confidencialidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <HomeCatalogSection />

      {/* Pain Cases Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">¿En qué casos podemos ayudarte?</h2>
            <p className="text-slate-600 text-lg">Entendemos que cada situación es única. Hemos ayudado a propietarios en múltiples escenarios complicados en Puerto Rico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Propiedad Deteriorada", desc: "No inviertas en reparaciones. Compramos en las condiciones que esté.", icon: Home },
              { title: "Herencia Compleja", desc: "Te orientamos en el proceso de declaratoria y compramos la participación.", icon: ShieldCheck },
              { title: "Deuda y CRIM", desc: "Atrasos, riesgo de ejecución o deudas con el gobierno.", icon: AlertTriangle },
              { title: "Urgencia de Mudanza", desc: "Si te vas de la isla, te facilitamos la venta rápida para que viajes tranquilo.", icon: Clock },
            ].map((case_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                  <case_.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{case_.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{case_.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Un proceso diseñado para tu tranquilidad</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10"></div>
            {[
              { step: "1", title: "Cuéntanos de la propiedad", desc: "Llena un breve formulario con los detalles básicos de la situación." },
              { step: "2", title: "Evaluamos tu caso", desc: "Nuestro equipo analiza el mercado y la condición reportada rápidamente." },
              { step: "3", title: "Te contactamos", desc: "Te llamamos para entender mejor tus necesidades y discutir opciones." },
              { step: "4", title: "Oferta y Cierre", desc: "Si hace sentido para ambas partes, formalizamos la compra en la fecha que elijas." },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-primary text-primary rounded-full flex items-center justify-center font-display font-bold text-3xl mb-6 shadow-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <Link href="/formulario">
                <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20">Comenzar el Paso 1 ahora</Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Lo que dicen en Puerto Rico</h2>
            <div className="flex justify-center gap-1 text-yellow-400 mb-2">
              <Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "La casa llevaba vacía años y se estaba deteriorando. En menos de 3 semanas ya habíamos cerrado y tenía mi cheque.", author: "Miguel R.", loc: "Bayamón" },
              { quote: "Me mudaba para Florida y necesitaba vender urgente. Fue el único equipo que me dio una solución real y sin dar vueltas.", author: "Sonia C.", loc: "Carolina" },
              { quote: "Excelente trato. Tenía un problema de herencia con mis hermanos y nos orientaron paso a paso hasta que pudimos vender.", author: "Héctor T.", loc: "Ponce" },
            ].map((test, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <p className="text-slate-300 mb-6 italic">"{test.quote}"</p>
                <div className="font-semibold">{test.author}</div>
                <div className="text-sm text-slate-500">{test.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">¿Por qué vendernos a nosotros?</h2>
            <p className="text-slate-600 text-lg">Ventajas claras frente al mercado tradicional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: DollarSign, title: "Pago en Cash", desc: "Sin depender de bancos, aprobaciones ni financiamiento. Cerramos con fondos propios." },
              { icon: Zap, title: "Rapidez Garantizada", desc: "Desde la evaluación hasta el cierre en tan poco como 14 días si todo está en orden." },
              { icon: Handshake, title: "Sin Intermediarios", desc: "Tratamos directamente contigo. Cero comisiones a agentes o brokers." },
              { icon: Lock, title: "100% Confidencial", desc: "Tu información y situación se manejan con total discreción y respeto." },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-slate-600 text-lg">Respuestas a las dudas más comunes.</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">¿Listo para recibir una oferta por tu propiedad?</h2>
            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
              Sin compromiso, sin presión. Cuéntanos tu situación y te damos una evaluación honesta en 24 horas.
            </p>
            <Link href="/formulario">
              <Button size="lg" className="text-lg h-14 px-10 shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                Evaluar mi propiedad ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-blue-300 mt-6">Más de 500 propietarios han confiado en nosotros.</p>
          </motion.div>
        </div>
      </section>

    </PublicLayout>
  );
}

const FAQ_ITEMS = [
  { q: "¿Realmente compran en cualquier condición?", a: "Sí. Compramos propiedades en cualquier estado — deterioradas, con problemas legales, herencias, deudas de CRIM, ocupadas, vacías. No necesitas invertir en reparaciones ni arreglos." },
  { q: "¿Cuánto tiempo toma el proceso?", a: "Desde que recibimos tu información, generalmente hacemos una evaluación inicial en 24 horas. Si procede, podemos cerrar la compra en tan poco como 14 días, dependiendo de la documentación disponible." },
  { q: "¿Tengo que pagar comisión o algún costo?", a: "No. No cobramos comisiones, ni honorarios, ni gastos de cierre. Nuestro equipo absorbe los costos del proceso." },
  { q: "¿Qué pasa si la propiedad tiene deuda o hipoteca?", a: "Evaluamos la situación y, si es viable, nos encargamos de resolver las deudas pendientes como parte del proceso de compra. Incluyendo deudas de CRIM, hipotecas y otros gravámenes." },
  { q: "¿Qué documentos necesito tener?", a: "Idealmente: escritura de la propiedad, evidencia de contribuciones (CRIM), y documentos de identidad. Si es herencia, la declaratoria de herederos. Nuestro equipo te orienta paso a paso." },
  { q: "¿Cómo determinan el precio de oferta?", a: "Analizamos el valor de mercado, condición física, ubicación, situación legal y urgencia. Te damos una oferta justa basada en datos reales del mercado de Puerto Rico." },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
            <ChevronDown className={cn(
              "h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200",
              openIndex === i && "rotate-180 text-primary"
            )} />
          </button>
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            openIndex === i ? "max-h-48 pb-5" : "max-h-0"
          )}>
            <p className="px-6 text-slate-600 text-sm leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
