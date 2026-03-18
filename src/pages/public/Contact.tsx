import { useState } from 'react';
import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { BRAND } from '@/lib/mock-data';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newErrors: Record<string, string> = {};

    if (!data.get('name')) newErrors.name = 'Nombre es requerido';
    if (!data.get('email')) newErrors.email = 'Email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get('email') as string)) {
      newErrors.email = 'Email no válido';
    }
    if (!data.get('message')) newErrors.message = 'Mensaje es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80"
            alt="Contact Us"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Contáctenos
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Estamos aquí para ayudarle. Comuníquese con nosotros y le responderemos en menos de 24 horas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div {...fadeInUp} className="lg:col-span-2">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Envíenos un mensaje</h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-slate-600">Nos pondremos en contacto con usted pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nombre completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="juan@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Teléfono
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="(787) 555-0000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="¿En qué podemos ayudarle?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                  >
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Información de contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Dirección</p>
                      <p className="text-sm text-slate-600">Ave. Ponce de León 1225, Suite 300<br />San Juan, PR 00907</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Teléfono</p>
                      <p className="text-sm text-slate-600">Metro: {BRAND.phones.metro}</p>
                      <p className="text-sm text-slate-600">Isla: {BRAND.phones.isla}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Email</p>
                      <p className="text-sm text-slate-600">{BRAND.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Horario de oficina</p>
                      <p className="text-sm text-slate-600">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                      <p className="text-sm text-slate-600">Sábados: 9:00 AM - 2:00 PM</p>
                      <p className="text-sm text-slate-600">Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 text-center">Nuestra ubicación</h2>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60796.44742893655!2d-66.1115!3d18.4655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c036856269fd1b1%3A0x2adf775e5cc2f3aa!2sSan%20Juan%2C%20Puerto%20Rico!5e0!3m2!1sen!2sus!4v1699900000000!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de My House Realty"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
