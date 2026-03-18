import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Target, Eye, Heart, Users } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const teamMembers = [
  {
    name: 'Carlos Rivera',
    title: 'Director General',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'María Santos',
    title: 'Directora de Ventas',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'José Fernández',
    title: 'Asesor de Inversiones',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Ana Rodríguez',
    title: 'Agente de Bienes Raíces',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Luis Méndez',
    title: 'Especialista Hipotecario',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Carmen Díaz',
    title: 'Coordinadora de Operaciones',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
  },
];

export default function About() {
  return (
    <PublicLayout>
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80"
            alt="Puerto Rico Real Estate"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Somos un equipo apasionado de profesionales inmobiliarios comprometidos con transformar la experiencia de compra y venta de propiedades en Puerto Rico.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  My House Realty nació con una visión clara: hacer que el proceso de compra y venta de propiedades en Puerto Rico sea transparente, justo y accesible para todos.
                </p>
                <p>
                  Desde nuestros inicios, hemos ayudado a más de 500 propietarios a resolver situaciones complejas — desde herencias y propiedades deterioradas hasta urgencias de mudanza y deudas con el CRIM.
                </p>
                <p>
                  Nuestro enfoque de compra directa con fondos propios elimina la incertidumbre del proceso tradicional, ofreciendo soluciones reales en plazos que se adaptan a las necesidades de cada cliente.
                </p>
              </div>
            </motion.div>
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80"
                alt="Nuestro equipo"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              {...fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Nuestra Misión</h3>
              <p className="text-slate-600 leading-relaxed">
                Facilitar la compra y venta de propiedades en Puerto Rico ofreciendo soluciones rápidas, justas y transparentes que generan confianza y tranquilidad a cada cliente.
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Nuestra Visión</h3>
              <p className="text-slate-600 leading-relaxed">
                Ser la empresa de bienes raíces más confiable y eficiente de Puerto Rico, reconocida por nuestro compromiso con la excelencia y la satisfacción del cliente.
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Nuestros Valores</h3>
              <p className="text-slate-600 leading-relaxed">
                Transparencia, integridad, eficiencia y empatía guían cada interacción con nuestros clientes. Creemos que cada propietario merece un trato digno y soluciones reales.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
              <Users className="h-7 w-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Profesionales dedicados con años de experiencia en el mercado inmobiliario de Puerto Rico.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{member.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
