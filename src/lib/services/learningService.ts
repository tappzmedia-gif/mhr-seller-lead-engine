import type { LearningSection, Lesson } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const mockSections: LearningSection[] = [
  { id: 'sec-1', title: 'Primeros Pasos', description: 'Introducción al sistema, navegación, dashboard y configuración inicial.', icon: 'layout', lessonCount: 4, completedCount: 0 },
  { id: 'sec-2', title: 'Gestión de Leads', description: 'Lead Center, captura, scoring, calificación y seguimiento de leads.', icon: 'target', lessonCount: 5, completedCount: 0 },
  { id: 'sec-3', title: 'Pipeline de Ventas', description: 'Gestión del pipeline, etapas, movimiento de leads y negociación.', icon: 'kanban', lessonCount: 3, completedCount: 0 },
  { id: 'sec-4', title: 'Propiedades', description: 'Listings, evaluaciones de propiedades y gestión de ofertas.', icon: 'home', lessonCount: 4, completedCount: 0 },
  { id: 'sec-5', title: 'Comunicaciones', description: 'Comunicaciones, mensajería y campañas de marketing.', icon: 'message', lessonCount: 4, completedCount: 0 },
  { id: 'sec-6', title: 'Operaciones', description: 'Calendario, reservas, agendamiento y reuniones de equipo.', icon: 'calendar', lessonCount: 5, completedCount: 0 },
  { id: 'sec-7', title: 'Gestión de Clientes', description: 'Clientes, documentos y formularios personalizados.', icon: 'users', lessonCount: 4, completedCount: 0 },
  { id: 'sec-8', title: 'Finanzas', description: 'Facturación, propuestas comerciales e invoices.', icon: 'dollar', lessonCount: 4, completedCount: 0 },
  { id: 'sec-9', title: 'Automatización e IA', description: 'Automatizaciones, asistente IA y plantillas del sistema.', icon: 'zap', lessonCount: 4, completedCount: 0 },
  { id: 'sec-10', title: 'Equipo y Administración', description: 'Team management, roles, activity log y notificaciones.', icon: 'shield', lessonCount: 5, completedCount: 0 },
  { id: 'sec-11', title: 'Configuración del Sistema', description: 'Settings, integraciones y personalización de la plataforma.', icon: 'settings', lessonCount: 3, completedCount: 0 },
  { id: 'sec-12', title: 'Analytics y Reportes', description: 'Dashboard de analytics, métricas avanzadas y exportación de datos.', icon: 'chart', lessonCount: 3, completedCount: 0 },
  { id: 'sec-13', title: 'Recursos Humanos', description: 'HR, beneficios, nómina, evaluaciones de desempeño y políticas.', icon: 'briefcase', lessonCount: 4, completedCount: 0 },
];

const mockLessons: Lesson[] = [
  // ─── SECTION 1: Primeros Pasos ─────────────────────────
  {
    id: 'les-1', sectionId: 'sec-1', title: 'Navegación del Sistema', description: 'Conoce el dashboard, menú lateral, búsqueda rápida y estructura general del sistema.', estimatedMinutes: 15, completed: false, order: 1,
    content: `## Navegación del Sistema Seller Lead Engine™

Bienvenido al sistema Seller Lead Engine™ de My House Realty. Esta guía te enseñará cómo moverte eficientemente por la plataforma.

### Estructura del Menú Lateral

El menú lateral izquierdo es tu centro de navegación. Está organizado en las siguientes secciones:

1. **Principal**: Dashboard, Lead Center, Pipeline, Analytics, Follow-ups
2. **Gestión**: Listings, Evaluations, Offers, Communications, Messaging, Campaigns
3. **Operations**: Calendar, Bookings, Scheduling, Meetings, Clients, Documents, Forms
4. **Finance**: Billing, Proposals, Invoices
5. **Sistema**: Team, User Roles, AI Assistant, Automations, Activity Log, Notifications, Integrations, Templates, Learning, HR, Settings

### Cómo Navegar

- **Click directo**: Haz click en cualquier opción del menú para ir a esa sección
- **Collapse/Expand**: Usa el botón "Collapse" en la parte inferior para contraer el menú y ganar espacio
- **Breadcrumbs**: En la parte superior verás la ruta de navegación (ej: Dashboard / Lead Center / Carlos Rivera)

### Búsqueda Rápida (Cmd+K)

La búsqueda rápida es una de las herramientas más poderosas del sistema:

1. Presiona **Cmd+K** (Mac) o **Ctrl+K** (Windows) en cualquier momento
2. Escribe el nombre de un lead, sección o acción
3. Los resultados aparecen instantáneamente
4. Presiona **Enter** para ir al resultado seleccionado

### Ejemplo Práctico
- Necesitas encontrar al lead "Carlos Rivera" rápidamente
- Presiona Cmd+K → escribe "Carlos" → selecciona el resultado → llegas a su perfil

### Perfil de Usuario

En la esquina superior derecha encontrarás:
- **Nombre y Rol**: Tu nombre y rol actual
- **Campana de Notificaciones**: Alertas del sistema
- **Selector de Rol**: Si tienes acceso a múltiples roles, puedes cambiar aquí

### Tips de Navegación
- Usa las flechas del teclado para navegar menús desplegables
- Los badges rojos en el menú indican items pendientes de atención
- El botón "Exit" te lleva de vuelta al login`,
  },
  {
    id: 'les-2', sectionId: 'sec-1', title: 'Dashboard Operativo', description: 'Entiende cada componente del dashboard: KPIs, alertas, leads recientes y métricas.', estimatedMinutes: 20, completed: false, order: 2,
    content: `## Dashboard Operativo

El Dashboard es tu centro de comando. Aquí ves el estado general de tus operaciones en tiempo real.

### KPIs Principales (Fila Superior)

La primera fila muestra 4 métricas clave:

1. **Total Leads**: Cantidad total de leads en el sistema
2. **Nuevos (Sin tocar)**: Leads que nadie ha contactado aún — ¡requieren atención inmediata!
3. **Urgentes**: Leads marcados como prioridad alta que necesitan follow-up
4. **Calificados Activos**: Leads que ya pasaron el proceso de calificación y están activos en el pipeline

### KPIs Secundarios (Segunda Fila)

1. **Contactados**: Total de leads que ya fueron contactados al menos una vez
2. **Conversiones**: Leads que avanzaron a la etapa de cierre
3. **Oportunidades**: Leads con alta probabilidad de conversión
4. **Tasa de Conversión**: Porcentaje de leads que se convirtieron en deals cerrados

### Leads Recientes

Esta sección muestra los últimos leads ingresados al sistema:
- **Nombre y avatar**: Identificación del lead
- **Ubicación**: Municipio de la propiedad
- **Tipo de propiedad**: Casa, Apartamento, Terreno, etc.
- **Temperatura**: Hot (rojo), High (verde), Medium (amarillo), Low (azul)
- **Status**: New, Contacted, Qualified, etc.
- **Tiempo**: Hace cuánto ingresó el lead

### Ejemplo: Interpretar el Dashboard
- Ves "9 Nuevos" con badge verde "+3 hoy" → 3 leads nuevos entraron hoy, 9 en total sin contactar
- Un lead con tag "Hot" y status "New" → Debe contactarse INMEDIATAMENTE
- Tasa de conversión "4.8%" → De cada 100 leads, 4.8 se cierran

### Sección de Atención Inmediata

El panel derecho "Atención Inmediata" muestra leads que necesitan acción urgente:
- **Deteriorada**: La propiedad tiene condiciones que requieren atención rápida
- **CRIM**: Hay deudas de CRIM pendientes
- **Vender rápido**: El seller tiene urgencia de vender

### Acciones Rápidas
- **Ver Todos**: Te lleva al Lead Center con todos los leads
- **Crear Lead Manual**: Para agregar un lead directamente al sistema
- **Demo Tour**: Recorrido interactivo por las funciones principales`,
  },
  {
    id: 'les-3', sectionId: 'sec-1', title: 'Follow-ups y Seguimientos', description: 'Cómo gestionar seguimientos pendientes, vencidos y programados.', estimatedMinutes: 20, completed: false, order: 3,
    content: `## Follow-ups y Seguimientos

Los follow-ups son la clave de la conversión. Un lead sin seguimiento oportuno se pierde.

### Panel de Follow-ups

Al acceder a Follow-ups verás:
- **Total pendientes**: Follow-ups que necesitan completarse
- **Vencidos**: Follow-ups cuya fecha ya pasó — ¡prioridad máxima!
- **Para hoy**: Los que debes completar hoy
- **Próximos**: Programados para los próximos días

### Crear un Follow-up

1. Abre el perfil de un lead
2. Click en "Nuevo Follow-up" o "Agendar Seguimiento"
3. Selecciona el tipo: Llamada, WhatsApp, Email, Visita
4. Establece fecha y hora
5. Agrega notas sobre qué comunicar
6. Guarda el follow-up

### Tipos de Follow-up y Cuándo Usarlos

- **Llamada telefónica**: Para leads Hot y High — contacto directo y personal
- **WhatsApp**: Para comunicación rápida, confirmaciones y envío de fotos/documentos
- **Email**: Para información detallada, propuestas formales y documentación
- **Visita presencial**: Para evaluaciones de propiedad y cierres

### Frecuencia Recomendada por Temperatura

| Temperatura | Frecuencia | Tipo Recomendado |
|-------------|------------|-----------------|
| Hot (80-100) | Cada 24 horas | Llamada + WhatsApp |
| High (60-79) | Cada 48 horas | Llamada |
| Medium (40-59) | Cada semana | Email + WhatsApp |
| Low (0-39) | Cada 2 semanas | Email nurturing |

### Marcar Follow-up como Completado

1. Click en el follow-up
2. Registra el resultado: ¿Contestó? ¿Qué se habló?
3. Marca como completado
4. El sistema te sugiere el próximo follow-up automáticamente

### Ejemplo Práctico
- Es lunes 9 AM y ves 3 follow-ups vencidos del viernes
- Prioriza por temperatura: Hot primero, luego High
- Llama a cada uno, documenta el resultado
- Agenda el próximo follow-up basado en la respuesta`,
  },
  {
    id: 'les-4', sectionId: 'sec-1', title: 'Notificaciones y Alertas', description: 'Configura y gestiona notificaciones para no perder ningún evento importante.', estimatedMinutes: 10, completed: false, order: 4,
    content: `## Notificaciones y Alertas

Las notificaciones te mantienen informado de todo lo que pasa en el sistema sin necesidad de revisar cada sección.

### Tipos de Notificaciones

1. **Nuevos Leads**: Cuando llega un lead nuevo al sistema
2. **Follow-ups Vencidos**: Cuando un seguimiento pasa su fecha programada
3. **Cambios de Etapa**: Cuando un lead cambia de etapa en el pipeline
4. **Reuniones Próximas**: Recordatorios de reuniones agendadas
5. **Tareas Asignadas**: Cuando se te asigna una nueva tarea
6. **Actualizaciones del Sistema**: Cambios o mejoras en la plataforma

### Acceder a Notificaciones

- Click en el ícono de campana (🔔) en la esquina superior derecha
- El badge rojo indica la cantidad de notificaciones no leídas
- El panel se abre mostrando las más recientes primero

### Gestionar Notificaciones

En la sección Notifications del menú:
- **Marcar como leída**: Click en la notificación
- **Marcar todas como leídas**: Botón en la parte superior
- **Filtrar por tipo**: Usa los filtros para ver solo un tipo
- **Ir al item**: Click en la notificación te lleva directamente al lead/evento

### Configurar Preferencias

En Settings > Notifications puedes configurar:
- Qué tipos de notificaciones quieres recibir
- Frecuencia de resúmenes por email
- Sonidos de alerta activos o silenciados

### Ejemplo Práctico
- Llegas en la mañana y ves el badge "5" en la campana
- Abres notificaciones: 2 leads nuevos, 1 follow-up vencido, 2 reuniones hoy
- Priorizas: Follow-up vencido primero, luego leads nuevos, luego preparas reuniones`,
  },

  // ─── SECTION 2: Gestión de Leads ─────────────────────────
  {
    id: 'les-5', sectionId: 'sec-2', title: 'Lead Center - Centro de Leads', description: 'Guía completa del centro de leads: vista, filtros, búsqueda y acciones.', estimatedMinutes: 25, completed: false, order: 1,
    content: `## Lead Center - Centro de Leads

El Lead Center es el corazón del sistema. Aquí gestionas todos tus leads de venta de propiedades.

### Vista General

Al entrar al Lead Center verás:
- **Barra de filtros** en la parte superior
- **Lista de leads** con información clave
- **Panel de detalle** al hacer click en un lead

### Información de Cada Lead

Cada tarjeta de lead muestra:
- **Nombre completo** del seller
- **Municipio**: Ubicación de la propiedad
- **Tipo**: Casa, Apartamento, Terreno, Comercial
- **Temperatura**: Hot 🔥, High 🟢, Medium 🟡, Low 🔵
- **Status**: New, Contacted, Qualified, Evaluation, Negotiation, Won, Lost
- **Agente asignado**: Quién está gestionando este lead
- **Última actividad**: Cuándo fue el último contacto

### Filtros Disponibles

1. **Por Status**: Filtra leads en una etapa específica
2. **Por Temperatura**: Solo Hot, solo Medium, etc.
3. **Por Agente**: Ver leads de un agente específico
4. **Por Municipio**: Filtrar por ubicación geográfica
5. **Por Fuente**: Facebook, Instagram, Referido, Manual
6. **Por Fecha**: Rango de fechas de creación

### Cómo Buscar un Lead

1. Usa la barra de búsqueda en la parte superior
2. Busca por nombre, teléfono, email o municipio
3. Los resultados se filtran en tiempo real

### Acciones Rápidas en un Lead

- **Llamar**: Ícono de teléfono para iniciar llamada
- **WhatsApp**: Ícono de mensaje para abrir chat
- **Email**: Ícono de correo para enviar email
- **Editar**: Modificar información del lead
- **Cambiar Status**: Mover a otra etapa del pipeline

### Crear un Lead Manual

1. Click en "+ Crear Lead Manual" en la esquina superior derecha
2. Completa los campos: Nombre, Teléfono, Email
3. Selecciona Tipo de Propiedad y Municipio
4. Agrega notas relevantes
5. El sistema asigna el score automáticamente

### Ejemplo Paso a Paso: Gestionar un Lead Nuevo
1. Entras al Lead Center y ves el badge "10" (10 leads nuevos)
2. Filtras por status "New" → aparecen todos los leads sin contactar
3. Ordenar por fecha (más recientes primero)
4. Click en el primer lead → ves sus datos completos
5. Click en "Llamar" → registras el resultado de la llamada
6. Cambias su status a "Contacted"
7. Agendas un follow-up para mañana`,
  },
  {
    id: 'les-6', sectionId: 'sec-2', title: 'Captura y Fuentes de Leads', description: 'Configura formularios web, integra Facebook/Instagram Ads y captura referidos.', estimatedMinutes: 20, completed: false, order: 2,
    content: `## Captura y Fuentes de Leads

Entender de dónde vienen tus leads y cómo se capturan es fundamental para optimizar tu marketing.

### Fuentes de Leads

1. **Formulario Web (Landing Page)**
   - El formulario multi-step en tu página pública
   - Los visitantes completan: nombre, teléfono, tipo de propiedad, municipio, motivación
   - El lead se crea automáticamente en el sistema con todos los datos
   - Se asigna un score inicial basado en las respuestas

2. **Facebook Ads (Meta Lead Ads)**
   - Configura la integración en Settings > Integrations
   - Los leads de tus campañas de Facebook se importan automáticamente
   - Incluye los campos configurados en el formulario del ad
   - Se etiquetan con la fuente "Facebook" y el nombre de la campaña

3. **Instagram Ads**
   - Funciona igual que Facebook a través de Meta Business
   - Los leads se identifican con fuente "Instagram"

4. **Referidos**
   - Cuando un cliente existente refiere a alguien
   - Se registra el referidor para tracking de comisiones
   - Fuente: "Referral" con nota del contacto que refirió

5. **Entrada Manual**
   - Para leads que llegan por teléfono, walk-in o networking
   - Usa el botón "Crear Lead Manual" en el Lead Center

### Auto-asignación de Leads

El sistema puede asignar leads automáticamente basado en reglas:
- **Por Región**: Leads de Bayamón van a Carlos, de San Juan van a Juan
- **Por Tipo**: Propiedades comerciales van al especialista
- **Round Robin**: Se distribuyen equitativamente entre agentes disponibles
- **Por Disponibilidad**: Solo asigna a agentes no saturados

Configura estas reglas en Automations > Assignment Rules.

### Ejemplo: Flujo Completo de Captura
1. Un seller ve tu ad en Facebook → click → llena el formulario
2. El lead llega al sistema con fuente "Facebook - Campaña Q1"
3. El sistema calcula el score: Timeline urgente (30pts) + Motivación alta (25pts) = 85 pts → Hot 🔥
4. Se asigna automáticamente a Carlos (zona Bayamón)
5. Carlos recibe notificación: "Nuevo lead Hot: María López, Bayamón"
6. Carlos llama dentro de los primeros 5 minutos`,
  },
  {
    id: 'les-7', sectionId: 'sec-2', title: 'Lead Scoring y Priorización', description: 'Cómo funciona el sistema de puntuación, categorías y acciones por score.', estimatedMinutes: 20, completed: false, order: 3,
    content: `## Lead Scoring y Priorización

El Lead Scoring es un sistema automático que asigna una puntuación de 0-100 a cada lead para determinar su prioridad.

### Cómo se Calcula el Score

Cada lead recibe puntos basado en 5 factores:

1. **Urgencia del Timeline** (máx. 30 puntos)
   - Quiere vender en < 30 días: 30 pts
   - 1-3 meses: 20 pts
   - 3-6 meses: 10 pts
   - > 6 meses o "explorando": 5 pts

2. **Motivación del Seller** (máx. 25 puntos)
   - Deudas/Foreclosure: 25 pts
   - Divorcio/Herencia: 20 pts
   - Relocación: 15 pts
   - Upgrade/Downsize: 10 pts
   - Solo curiosidad: 5 pts

3. **Valor de la Propiedad** (máx. 20 puntos)
   - > $500K: 20 pts
   - $200K-$500K: 15 pts
   - $100K-$200K: 10 pts
   - < $100K: 5 pts

4. **Engagement** (máx. 15 puntos)
   - Responde llamadas: +5 pts
   - Envía documentos solicitados: +5 pts
   - Agenda reunión: +5 pts

5. **Fuente del Lead** (máx. 10 puntos)
   - Referido: 10 pts
   - Orgánico (búsqueda): 8 pts
   - Facebook/Instagram: 6 pts
   - Otro: 4 pts

### Categorías de Temperatura

| Score | Categoría | Color | Acción |
|-------|-----------|-------|--------|
| 80-100 | Hot 🔥 | Rojo | Contacto inmediato (< 5 min) |
| 60-79 | High | Verde | Contacto dentro de 1 hora |
| 40-59 | Medium | Amarillo | Contacto dentro de 24 horas |
| 0-39 | Low | Azul | Email nurturing semanal |

### Ejemplo: Cómo Interpretar un Score

Lead: Roberto Hernández, Humacao, Terreno
- Timeline: Vender en 2 meses → 20 pts
- Motivación: Herencia compartida → 20 pts
- Valor: $150,000 → 10 pts
- Engagement: No ha respondido aún → 0 pts
- Fuente: Facebook Ad → 6 pts
- **Total: 56 pts → Medium**

Después de la primera llamada donde confirma urgencia y envía documentos:
- Engagement actualizado: +10 pts
- **Nuevo score: 66 pts → High** → Se sube de prioridad automáticamente`,
  },
  {
    id: 'les-8', sectionId: 'sec-2', title: 'Calificación y Descalificación', description: 'Criterios para calificar leads: qué buscar, señales positivas y negativas.', estimatedMinutes: 15, completed: false, order: 4,
    content: `## Calificación y Descalificación de Leads

No todos los leads se convierten en deals. La calificación efectiva te ahorra tiempo y recursos.

### Criterios de Calificación (Qualified ✅)

Un lead se califica positivamente cuando cumple:
- ✅ Tiene motivación clara y real para vender
- ✅ Tiene un timeline definido (idealmente < 6 meses)
- ✅ La propiedad está libre de problemas legales severos irresolubles
- ✅ Las expectativas de precio son realistas o negociables
- ✅ El seller es el propietario legal o tiene autoridad para vender
- ✅ Responde a las comunicaciones de manera consistente

### Criterios de Descalificación (Not Qualified ❌)

Un lead se descalifica cuando:
- ❌ Quiere precio retail y no está dispuesto a negociar
- ❌ No tiene motivación real (solo "tantea" el mercado)
- ❌ Problemas legales complejos que no se pueden resolver
- ❌ No responde después de 5+ intentos de contacto
- ❌ No es el propietario y no tiene poder legal
- ❌ La propiedad tiene deudas insalvables o embargos activos

### Proceso de Calificación Paso a Paso

1. **Primer Contacto**: Llama al lead y preséntate
2. **Discovery**: Haz preguntas clave sobre motivación y timeline
3. **Verificación**: Confirma propiedad en CRIM y Registro de la Propiedad
4. **Evaluación**: ¿El precio esperado es viable?
5. **Decisión**: Qualified o Not Qualified
6. **Documentar**: Registra toda la información en el sistema

### Preguntas Clave para la Calificación

1. "¿Cuál es la razón principal por la que desea vender?"
2. "¿En qué plazo le gustaría completar la venta?"
3. "¿Tiene un precio en mente para la propiedad?"
4. "¿La propiedad tiene algún gravamen o deuda de CRIM?"
5. "¿Está usted como único propietario o hay copropietarios?"

### Ejemplo: Calificación en Acción
- Lead: Carmen López, Casa en Caguas, Score 72 (High)
- Primer contacto: Motivada por divorcio, quiere vender en 60 días
- Verificación: Propiedad a nombre de ambos cónyuges, CRIM al día
- Precio: Espera $180K, el comp analysis sugiere $165K
- Decisión: **Qualified** — motivación real, timeline claro, precio negociable
- Acción: Mover a etapa "Evaluation" y agendar visita a la propiedad`,
  },
  {
    id: 'les-9', sectionId: 'sec-2', title: 'Follow-ups Efectivos', description: 'Estrategias, scripts y técnicas para seguimientos que convierten.', estimatedMinutes: 25, completed: false, order: 5,
    content: `## Follow-ups Efectivos

El follow-up es donde se ganan o pierden los deals. Un lead sin seguimiento oportuno tiene 50% menos probabilidad de conversión.

### La Regla de Oro: Velocidad

- Lead Hot: Contacto en los primeros **5 minutos**
- Lead High: Contacto en la primera **hora**
- Lead Medium: Contacto en las primeras **24 horas**
- Lead Low: Contacto en las primeras **48 horas**

### Secuencia de Follow-up Recomendada

**Día 1:**
1. Llamada telefónica (intento 1)
2. Si no contesta → WhatsApp inmediato con presentación

**Día 2:**
3. Llamada telefónica (intento 2)
4. Email con información de valor

**Día 3-4:**
5. WhatsApp de seguimiento
6. Si contesta → Agendar reunión/evaluación

**Día 7:**
7. Llamada final o email de re-engagement

**Día 14+:**
8. Email nurturing automático (se configura en Automations)

### Scripts de Follow-up

**Primera llamada:**
"Buenos días [Nombre], le habla [Tu nombre] de My House Realty. Vi que está interesado/a en vender su propiedad en [Municipio]. ¿Tiene unos minutos para hablar sobre cómo podemos ayudarle?"

**WhatsApp después de no contestar:**
"Hola [Nombre], soy [Tu nombre] de My House Realty. Le llamé hace un momento sobre la venta de su propiedad. Cuando tenga un momento, me encantaría hablar con usted. ¿Cuál es un buen horario para llamarle?"

**Email de valor:**
"Asunto: Valor estimado de su propiedad en [Municipio]
Hola [Nombre], gracias por su interés. Adjunto un análisis preliminar del mercado en su área..."

### Registrar un Follow-up en el Sistema

1. Abre el perfil del lead
2. En la sección de actividades, click "Registrar Actividad"
3. Selecciona tipo: Llamada, WhatsApp, Email, Nota
4. Registra el resultado: ¿Contestó? ¿Qué se habló? ¿Próximos pasos?
5. Programa el siguiente follow-up con fecha y hora
6. El sistema te recordará cuando llegue la fecha`,
  },

  // ─── SECTION 3: Pipeline de Ventas ─────────────────────────
  {
    id: 'les-10', sectionId: 'sec-3', title: 'Pipeline - Vista Kanban', description: 'Cómo usar la vista Kanban del pipeline: arrastrar, mover y gestionar etapas.', estimatedMinutes: 20, completed: false, order: 1,
    content: `## Pipeline de Ventas - Vista Kanban

El Pipeline te permite ver el estado de todos tus deals en formato visual Kanban.

### Etapas del Pipeline

El pipeline está organizado en las siguientes columnas:

1. **New** — Lead recién capturado, sin contactar
2. **Contacted** — Primer contacto realizado con el seller
3. **Qualified** — Lead verificado y calificado positivamente
4. **Evaluation** — Propiedad en proceso de evaluación/inspección
5. **Negotiation** — En negociación de precio y términos
6. **Listing Agreement** — Contrato de listado firmado
7. **Under Contract** — Oferta aceptada, en proceso de cierre
8. **Won** — Deal cerrado exitosamente ✅
9. **Lost** — Deal perdido o descalificado ❌

### Cómo Mover un Lead

**Método 1: Arrastrar y soltar (Drag & Drop)**
1. Haz click y mantén presionado sobre la tarjeta del lead
2. Arrastra a la columna de destino
3. Suelta — el lead cambia de etapa automáticamente

**Método 2: Desde el detalle del lead**
1. Abre el perfil del lead
2. Cambia el campo "Status" al nuevo valor
3. El lead se mueve en el pipeline

### Información en las Tarjetas

Cada tarjeta en el pipeline muestra:
- Nombre del seller y avatar
- Municipio y tipo de propiedad
- Temperatura (color del badge)
- Tiempo en la etapa actual
- Agente asignado

### Filtros del Pipeline

Puedes filtrar el pipeline por:
- **Agente**: Ver solo tus deals o los de otro agente
- **Temperatura**: Solo Hot, solo High, etc.
- **Municipio**: Filtrar por zona geográfica
- **Valor**: Rango de valor de propiedad

### Ejemplo: Workflow del Pipeline
1. Lead "José Santos" llega como **New** (Score 75, High)
2. Lo llamas y confirmas interés → mueves a **Contacted**
3. Verificas propiedad y motivación → mueves a **Qualified**
4. Agendan visita para evaluar la propiedad → mueves a **Evaluation**
5. Evalúas la propiedad, acuerdan precio preliminar → **Negotiation**
6. Firman contrato de listado → **Listing Agreement**
7. Encuentras comprador, se acepta oferta → **Under Contract**
8. Cierre exitoso → **Won** 🎉`,
  },
  {
    id: 'les-11', sectionId: 'sec-3', title: 'Métricas del Pipeline', description: 'Entiende los KPIs del pipeline: valor, velocidad, tasas de conversión por etapa.', estimatedMinutes: 15, completed: false, order: 2,
    content: `## Métricas del Pipeline

Entender las métricas de tu pipeline te ayuda a predecir ingresos y optimizar tu proceso de ventas.

### Métricas Principales

1. **Valor Total del Pipeline**
   - Suma del valor estimado de todos los deals activos
   - Ejemplo: 15 deals activos × $180K promedio = $2.7M en pipeline

2. **Velocidad del Pipeline**
   - Tiempo promedio que un lead tarda en pasar de New a Won
   - Meta: < 60 días para seller leads
   - Si es > 90 días, hay un cuello de botella que investigar

3. **Tasa de Conversión por Etapa**
   - New → Contacted: Debería ser > 90% (casi todos se contactan)
   - Contacted → Qualified: ~50-60% (no todos califican)
   - Qualified → Evaluation: ~70-80%
   - Evaluation → Negotiation: ~60-70%
   - Negotiation → Won: ~40-50%

4. **Win Rate General**
   - % de leads que terminan en Won vs Total
   - Meta: > 15% para seller leads
   - Si es < 10%, revisar proceso de calificación

### Cómo Interpretar las Métricas

**Ejemplo de análisis:**
- Tienes 100 leads en el último trimestre
- 88 contactados (88% contact rate ✅)
- 44 calificados (50% qualification rate ✅)
- 30 evaluados (68% eval rate ✅)
- 18 en negociación (60% negotiation rate ✅)
- 8 ganados (44% close rate ✅)
- **Win Rate: 8%** ← Debajo de meta, hay que mejorar calificación

### Acciones Correctivas

| Problema | Indicador | Acción |
|----------|-----------|--------|
| Pocos contactos | Contact rate < 80% | Mejorar velocidad de respuesta |
| Mala calificación | Qual rate < 40% | Refinar criterios de scoring |
| Evaluaciones lentas | Eval time > 14 días | Asignar más recursos |
| Bajo cierre | Close rate < 30% | Training en negociación |`,
  },
  {
    id: 'les-12', sectionId: 'sec-3', title: 'Negociación y Cierre', description: 'Técnicas de negociación, preparación de ofertas y proceso de cierre de deals.', estimatedMinutes: 25, completed: false, order: 3,
    content: `## Negociación y Cierre

La negociación es donde se convierte un lead calificado en un deal cerrado. Este módulo cubre las mejores prácticas.

### Preparación para la Negociación

Antes de negociar, asegúrate de tener:
1. **Comp Analysis**: Ventas comparables en la zona (últimos 6 meses)
2. **Evaluación de la Propiedad**: Condición física, reparaciones necesarias
3. **Situación del Seller**: Motivación, timeline, deudas
4. **CRIM**: Estado de contribuciones al día
5. **Registro**: Verificación de propiedad en el Registro

### Estrategias de Negociación

1. **Ancla con datos**: Usa el comp analysis para justificar tu oferta
2. **Entiende la motivación**: Un seller urgente puede aceptar menos
3. **Ofrece flexibilidad**: Si no bajan precio, negocia términos (cierre rápido, asumir reparaciones)
4. **Win-Win**: El seller debe sentir que el acuerdo es justo
5. **Urgencia legítima**: "Tenemos un comprador listo si cerramos esta semana"

### Proceso de Cierre en el Sistema

1. **Crear Oferta**: Ve a Offers > Nueva Oferta
2. **Adjuntar documentos**: Comp analysis, fotos, evaluación
3. **Enviar al seller**: Por email o WhatsApp
4. **Registrar respuesta**: Aceptada, Contrapropuesta, Rechazada
5. **Si aceptada**: Mover lead a "Under Contract"
6. **Coordinar cierre**: Abogado, tasador, banco (si aplica)
7. **Cierre completado**: Mover a "Won" y registrar valor final

### Ejemplo: Negociación Real
- Propiedad: Casa 3/2 en Caguas, valor estimado $175K
- Seller espera: $190K
- Tu oferta: $160K (basada en comps y condición)
- Contrapropuesta: $180K
- Tu respuesta: $170K con cierre en 30 días
- Acuerdo final: **$172K** con cierre en 45 días
- Resultado: Deal cerrado, todos satisfechos`,
  },

  // ─── SECTION 4: Propiedades ─────────────────────────
  {
    id: 'les-13', sectionId: 'sec-4', title: 'Listings - Gestión de Propiedades', description: 'Crear, editar y publicar listings de propiedades en el catálogo público.', estimatedMinutes: 20, completed: false, order: 1,
    content: `## Listings - Gestión de Propiedades

La sección de Listings te permite gestionar el catálogo de propiedades que se muestran en la página pública.

### Ver Listings Existentes

Al abrir Listings verás:
- **Grid de propiedades**: Fotos, dirección, precio, status
- **Filtros**: Por tipo, precio, municipio, status
- **Contadores**: Total de listings activos, vendidos, pendientes

### Crear un Nuevo Listing

1. Click en "Nuevo Listing" o "+"
2. Completa los campos obligatorios:
   - **Título**: Nombre descriptivo (ej: "Casa Colonial en Viejo San Juan")
   - **Dirección**: Ubicación completa
   - **Municipio**: Selecciona de la lista
   - **Tipo**: Casa, Apartamento, Terreno, Comercial, Multi-familiar
   - **Precio**: Precio de venta o renta
   - **Área**: Pies cuadrados de la propiedad
3. Agrega especificaciones:
   - Habitaciones, baños, estacionamientos
   - Año de construcción
   - Amenidades (piscina, terraza, seguridad, etc.)
4. Sube fotos de la propiedad (mínimo 3, máximo 20)
5. Escribe una descripción atractiva
6. Publica el listing

### Editar un Listing

1. Click en el listing en la lista
2. Modifica los campos necesarios
3. Agrega o remueve fotos
4. Guarda los cambios
5. Si es listing público, los cambios se reflejan inmediatamente en el catálogo

### Estados de un Listing

- **Active**: Visible en el catálogo público
- **Pending**: En proceso de verificación
- **Under Contract**: Tiene oferta aceptada
- **Sold**: Vendida (se mantiene como referencia)
- **Draft**: Borrador, no visible públicamente

### Catálogo Público

Los listings activos se muestran en la sección "Propiedades" del sitio público:
- Los visitantes pueden navegar las propiedades
- Ver galería de fotos con zoom
- Ver especificaciones completas
- Usar los botones "Agendar Visita" o "Contactar Agente"`,
  },
  {
    id: 'les-14', sectionId: 'sec-4', title: 'Evaluaciones de Propiedades', description: 'Proceso completo de evaluación: inspección, documentación y reporte.', estimatedMinutes: 25, completed: false, order: 2,
    content: `## Evaluaciones de Propiedades

La evaluación es el proceso de inspeccionar y valorar una propiedad antes de hacer una oferta o listarla.

### Acceder a Evaluaciones

En el menú lateral > Evaluations verás:
- **Lista de evaluaciones**: Pendientes, en progreso y completadas
- **Badges**: Número de evaluaciones pendientes de revisión
- **Filtros**: Por status, municipio, agente, fecha

### Crear una Nueva Evaluación

1. Click en "Nueva Evaluación"
2. Vincula con un lead existente o crea nuevo
3. Establece fecha y hora de visita
4. Asigna el agente que realizará la evaluación

### Proceso de Evaluación en Campo

Durante la visita a la propiedad, documenta:

1. **Exterior**
   - Condición del techo
   - Fachada y pintura
   - Terreno y jardín
   - Estacionamiento
   - Condición de la estructura

2. **Interior**
   - Condición de paredes y pisos
   - Cocina y baños
   - Sistema eléctrico
   - Plomería
   - Ventanas y puertas

3. **Documentación**
   - Toma fotos de todas las áreas
   - Nota reparaciones necesarias con costo estimado
   - Verifica dimensiones reales

### Completar el Reporte

1. Registra la condición general: Excelente, Buena, Regular, Necesita Reparaciones
2. Estima el valor de mercado basado en comps
3. Lista las reparaciones necesarias con costos
4. Calcula el ARV (After Repair Value)
5. Agrega fotos y notas

### Ejemplo: Evaluación Completa
- Propiedad: Casa 3/2, Bayamón, 1,500 sq ft
- Condición: Regular — techo necesita reparación ($15K), baños desactualizados ($8K)
- Valor de mercado actual: $145K
- ARV (después de reparaciones): $185K
- Costo total de reparaciones: $23K
- Oferta recomendada: $120K-$130K`,
  },
  {
    id: 'les-15', sectionId: 'sec-4', title: 'Gestión de Ofertas', description: 'Crear, enviar y dar seguimiento a ofertas de compra.', estimatedMinutes: 20, completed: false, order: 3,
    content: `## Gestión de Ofertas

La sección de Offers te permite crear, enviar y gestionar ofertas formales para propiedades.

### Panel de Ofertas

Al entrar a Offers verás:
- **Resumen**: Total de ofertas, aceptadas, pendientes, rechazadas
- **Lista de ofertas**: Con status, monto y fecha
- **Filtros**: Por status, agente, rango de fechas

### Crear una Oferta

1. Click en "Nueva Oferta"
2. Selecciona el lead asociado
3. Completa los detalles:
   - **Monto de oferta**: Basado en evaluación y comps
   - **Tipo**: Cash, Financiamiento, Seller Financing
   - **Contingencias**: Inspección, financiamiento, tasación
   - **Plazo de cierre**: Fecha estimada de cierre
   - **Depósito de arras**: Cantidad de earnest money
4. Adjunta documentos de soporte (comp analysis, evaluación)
5. Revisa y envía al seller

### Estados de una Oferta

- **Draft**: En preparación, no enviada
- **Sent**: Enviada al seller, esperando respuesta
- **Under Review**: El seller está evaluando
- **Countered**: El seller hizo una contrapropuesta
- **Accepted**: Oferta aceptada ✅
- **Rejected**: Oferta rechazada ❌
- **Expired**: La oferta venció sin respuesta

### Dar Seguimiento

1. Monitorea el status de cada oferta
2. Si "Under Review" por más de 48 horas → follow-up
3. Si "Countered" → evalúa la contrapropuesta y responde
4. Si "Accepted" → mover lead a "Under Contract" en el pipeline

### Ejemplo: Ciclo de Oferta
1. Evaluación completada: Casa en Juncos, $145K valor, $120K oferta recomendada
2. Creas oferta por $118K, cash, cierre en 30 días
3. Envías al seller → Status: "Sent"
4. Seller responde con contrapropuesta: $135K
5. Negociación: ofreces $125K con cierre en 21 días
6. Seller acepta → Status: "Accepted" → Lead a "Under Contract"`,
  },
  {
    id: 'les-16', sectionId: 'sec-4', title: 'Análisis de Mercado (Comps)', description: 'Cómo realizar análisis comparativo de mercado para determinar el valor de propiedades.', estimatedMinutes: 20, completed: false, order: 4,
    content: `## Análisis de Mercado (Comps)

El análisis comparativo de mercado (CMA o Comps) es fundamental para determinar el valor real de una propiedad.

### ¿Qué son los Comps?

Los comps son ventas recientes de propiedades similares en la misma área. Se usan para estimar el valor de mercado de una propiedad.

### Criterios para Seleccionar Comps

1. **Ubicación**: Mismo barrio o municipio (máximo 1 milla de distancia)
2. **Tiempo**: Ventas de los últimos 6 meses (máximo 12 meses)
3. **Tipo**: Mismo tipo de propiedad (casa con casa, apto con apto)
4. **Tamaño**: Similar en sq ft (±20%)
5. **Habitaciones**: Misma configuración (±1 habitación)
6. **Condición**: Condición similar de la propiedad
7. **Cantidad**: Mínimo 3 comps, idealmente 5-6

### Proceso de Análisis

1. **Identificar la propiedad objetivo** con sus características
2. **Buscar comps** en bases de datos de ventas recientes (CRIM, MLS, registros)
3. **Ajustar diferencias**: Si el comp tiene piscina y el tuyo no, resta $15K
4. **Calcular precio por sq ft**: Divide precio de venta entre sq ft de cada comp
5. **Promediar**: El promedio te da el valor estimado por sq ft
6. **Multiplicar**: Precio/sqft × sqft de tu propiedad = Valor estimado

### Ejemplo de CMA
Propiedad: Casa 3/2, 1,400 sqft, Caguas

| Comp | Dirección | Precio | Sqft | $/sqft | Ajuste |
|------|-----------|--------|------|--------|--------|
| 1 | Calle A, Caguas | $175K | 1,500 | $117 | -$5K (más grande) |
| 2 | Calle B, Caguas | $162K | 1,350 | $120 | +$3K (más pequeña) |
| 3 | Calle C, Caguas | $180K | 1,450 | $124 | -$8K (tiene piscina) |

Promedio ajustado: ($170K + $165K + $172K) / 3 = **$169K valor estimado**`,
  },

  // ─── SECTION 5: Comunicaciones ─────────────────────────
  {
    id: 'les-17', sectionId: 'sec-5', title: 'Communications Hub', description: 'Centro de comunicaciones: llamadas, emails, WhatsApp y registro de actividades.', estimatedMinutes: 20, completed: false, order: 1,
    content: `## Communications Hub

El módulo de Communications centraliza todas las interacciones con leads y clientes.

### Vista General

Al abrir Communications verás:
- **Timeline de actividades**: Todas las comunicaciones recientes
- **Filtros**: Por tipo (llamada, email, WhatsApp), por agente, por fecha
- **Contadores**: Total de comunicaciones hoy, esta semana, este mes

### Tipos de Comunicación

1. **Llamadas Telefónicas**
   - Registra llamadas entrantes y salientes
   - Documenta duración y resultado
   - Notas sobre lo discutido

2. **WhatsApp**
   - Mensajes enviados y recibidos
   - Compartir documentos y fotos
   - Confirmaciones rápidas

3. **Emails**
   - Emails profesionales con plantillas
   - Seguimiento de apertura y respuesta
   - Adjuntos (evaluaciones, propuestas)

4. **SMS**
   - Para recordatorios rápidos
   - Confirmación de citas

### Registrar una Comunicación

1. Abre el perfil del lead
2. Click en "Nueva Actividad" o el ícono del tipo de comunicación
3. Selecciona tipo: Llamada, WhatsApp, Email, Nota
4. Registra los detalles:
   - ¿Se conectó con el contacto? (Sí/No)
   - Resultado: Interesado, No disponible, No interesado, Voicemail
   - Notas: Resumen de la conversación
5. Programa próximo follow-up si es necesario
6. Guarda la actividad

### Historial de Comunicaciones

Cada lead tiene un timeline completo de todas las interacciones:
- Fecha y hora de cada comunicación
- Tipo y dirección (entrante/saliente)
- Agente que realizó la comunicación
- Notas y resultado
- Esto es fundamental para cuando otro agente necesita tomar el caso`,
  },
  {
    id: 'les-18', sectionId: 'sec-5', title: 'Messaging - Mensajería', description: 'Sistema de mensajería interna del equipo y chat con leads.', estimatedMinutes: 15, completed: false, order: 2,
    content: `## Messaging - Mensajería Interna

El módulo de Messaging permite la comunicación interna entre miembros del equipo.

### Funcionalidades

1. **Chat Interno del Equipo**
   - Mensajes directos entre agentes
   - Canales por departamento o proyecto
   - Compartir información de leads de forma segura

2. **Notificaciones de Chat**
   - Badge rojo en el menú cuando hay mensajes nuevos
   - Notificación push (si está configurado)
   - Sonido de alerta configurable

### Cuándo Usar Messaging vs Email

| Situación | Usar Messaging | Usar Email |
|-----------|---------------|-----------|
| Pregunta rápida sobre un lead | ✅ | ❌ |
| Compartir documento formal | ❌ | ✅ |
| Coordinar visita de hoy | ✅ | ❌ |
| Reporte semanal | ❌ | ✅ |
| Pedir opinión del equipo | ✅ | ❌ |

### Buenas Prácticas

1. Mantén los mensajes cortos y al grano
2. Usa @mentions para notificar a personas específicas
3. No compartas información confidencial de clientes fuera del sistema
4. Responde a mensajes dentro de las horas laborales
5. Usa emojis para confirmar lectura (👍) cuando no necesitas responder largo`,
  },
  {
    id: 'les-19', sectionId: 'sec-5', title: 'Campaigns - Campañas de Marketing', description: 'Crear y gestionar campañas de marketing: ads, email marketing y tracking de ROI.', estimatedMinutes: 25, completed: false, order: 3,
    content: `## Campaigns - Campañas de Marketing

El módulo de Campaigns te permite crear, monitorear y optimizar tus campañas de generación de leads.

### Panel de Campañas

Al abrir Campaigns verás:
- **Dashboard de métricas**: CPL, conversiones, gasto total, ROI
- **Lista de campañas**: Activas, pausadas, completadas
- **Gráficos**: Rendimiento por período

### Tipos de Campaña

1. **Facebook/Instagram Ads**
   - Campañas de generación de leads en Meta
   - Formularios integrados que envían leads al CRM
   - Tracking automático de CPL y conversiones

2. **Google Ads**
   - Búsqueda pagada para keywords de sellers
   - Landing pages dedicadas
   - Tracking de conversiones

3. **Email Marketing**
   - Secuencias de nurturing para leads fríos
   - Newsletters mensuales
   - Campañas de re-engagement

4. **Orgánico**
   - SEO y contenido del blog
   - Social media orgánico
   - Referral programs

### Crear una Campaña

1. Click en "Nueva Campaña"
2. Selecciona tipo: Ads, Email, Orgánico
3. Define nombre y objetivo
4. Establece presupuesto (para ads)
5. Configura audiencia target
6. Crea o selecciona creativos
7. Establece fechas de inicio y fin
8. Activa la campaña

### Métricas Clave

- **CPL (Costo por Lead)**: ¿Cuánto cuesta adquirir cada lead?
  - Meta: < $25 para Facebook, < $40 para Google
- **Conversion Rate**: % de clicks que se convierten en leads
  - Meta: > 5% para landing pages
- **ROAS (Return on Ad Spend)**: Retorno por cada dólar invertido
  - Meta: > 5x para campañas maduras
- **Quality Score**: Calidad de los leads generados
  - % de leads que se califican positivamente

### Ejemplo: Análisis de Campaña
- Campaña: "Sellers Bayamón Q1 2026" (Facebook)
- Gasto: $2,500
- Leads generados: 85
- CPL: $29.41
- Leads calificados: 34 (40%)
- Deals cerrados: 4
- Revenue: $28,000 en comisiones
- ROAS: 11.2x ✅ — Excelente rendimiento`,
  },
  {
    id: 'les-20', sectionId: 'sec-5', title: 'Templates - Plantillas de Comunicación', description: 'Crear y usar plantillas para emails, WhatsApp, propuestas y documentos.', estimatedMinutes: 15, completed: false, order: 4,
    content: `## Templates - Plantillas de Comunicación

Las plantillas te ahorran tiempo y aseguran consistencia en tus comunicaciones.

### Acceder a Templates

Menú lateral > Templates verás:
- **Categorías**: Emails, WhatsApp, Proposals, Invoices, Meetings
- **Lista de plantillas**: Con nombre, categoría y frecuencia de uso
- **Plantillas predeterminadas**: Las que vienen con el sistema

### Tipos de Plantillas

1. **Email Templates**
   - Welcome email para nuevos leads
   - Follow-up después de llamada
   - Envío de evaluación/propuesta
   - Confirmación de reunión

2. **WhatsApp Templates**
   - Presentación inicial
   - Confirmación de cita
   - Envío de documentos
   - Recordatorio de follow-up

3. **Proposal Templates**
   - Propuesta de servicios de venta
   - Propuesta de listing agreement
   - Comparativo de mercado

4. **Invoice Templates**
   - Factura de comisión
   - Factura de servicios adicionales

### Variables Dinámicas

Las plantillas usan variables que se reemplazan automáticamente:
- **{nombre}** → Nombre del lead/cliente
- **{municipio}** → Municipio de la propiedad
- **{agente}** → Nombre del agente asignado
- **{precio}** → Precio de la propiedad
- **{fecha}** → Fecha actual o de evento
- **{empresa}** → "My House Realty"

### Crear una Plantilla

1. Click en "Nueva Plantilla"
2. Selecciona categoría
3. Escribe el nombre descriptivo
4. Redacta el contenido usando variables dinámicas
5. Guarda la plantilla

### Ejemplo de Plantilla de Email

**Nombre**: "Follow-up Post Llamada"
**Contenido**:
"Hola {nombre}, fue un placer hablar contigo hoy sobre tu propiedad en {municipio}. Como acordamos, te envío el análisis de mercado preliminar para que lo revises. Si tienes alguna pregunta, no dudes en contactarme. Saludos, {agente} - My House Realty"`,
  },

  // ─── SECTION 6: Operaciones ─────────────────────────
  {
    id: 'les-21', sectionId: 'sec-6', title: 'Calendar - Calendario', description: 'Gestión del calendario: vistas, crear eventos, sincronización y recordatorios.', estimatedMinutes: 20, completed: false, order: 1,
    content: `## Calendar - Calendario

El Calendario centraliza todas tus citas, reuniones, evaluaciones y eventos del equipo.

### Vistas del Calendario

1. **Vista Mes**: Visión general de todo el mes
2. **Vista Semana**: Detalle hora por hora de la semana
3. **Vista Día**: Detalle completo del día actual
4. **Vista Agenda**: Lista cronológica de todos los eventos próximos

### Tipos de Eventos

Cada tipo tiene un color identificativo:
- 🏠 **Property Viewing** (Azul): Visita a propiedad
- 🤝 **Seller Meeting** (Verde): Reunión con seller
- 📞 **Follow-up** (Naranja): Seguimiento programado
- 📋 **Evaluation** (Púrpura): Evaluación de propiedad
- ✅ **Closing** (Rojo): Cierre de deal
- 👥 **Team Meeting** (Gris): Reunión de equipo

### Crear un Evento

1. Click en el día/hora deseada en el calendario (o botón "+")
2. Selecciona el tipo de evento
3. Completa:
   - **Título**: Descripción del evento
   - **Fecha y hora**: Inicio y fin
   - **Ubicación**: Dirección o "Virtual"
   - **Asistentes**: Agentes y/o leads involucrados
   - **Recordatorio**: 15 min, 30 min, 1 hora, 1 día antes
   - **Notas**: Información adicional
4. Si está vinculado a un lead, selecciónalo
5. Guarda el evento

### Sincronización

En Integrations puedes conectar:
- **Google Calendar**: Sincronización bidireccional
- **Outlook Calendar**: Para usuarios de Microsoft
- **Apple Calendar**: Para usuarios de macOS/iOS

### Ejemplo: Planificar tu Semana
- Lunes: 9AM Team Meeting, 11AM Evaluación en Caguas, 3PM Follow-up calls
- Martes: 10AM Seller Meeting (Juan Santos), 2PM Property Viewing
- Miércoles: 9AM-12PM Follow-up block, 2PM Closing (Casa Bayamón)
- Jueves: 10AM Evaluation nueva propiedad, 3PM Team training
- Viernes: Morning follow-ups, PM admin tasks`,
  },
  {
    id: 'les-22', sectionId: 'sec-6', title: 'Bookings - Reservas', description: 'Sistema de reservas: tipos de cita, disponibilidad y link de agendamiento.', estimatedMinutes: 20, completed: false, order: 2,
    content: `## Bookings - Sistema de Reservas

El módulo de Bookings permite que leads y clientes agenden citas directamente en tu calendario.

### Vista de Bookings

Al abrir Bookings verás:
- **Próximas reservas**: Lista de citas confirmadas
- **Tipos de evento**: Categorías de citas disponibles
- **Métricas**: Reservas esta semana, tasa de no-show

### Tipos de Cita (Event Types)

Configura diferentes tipos de cita:

1. **Consulta Inicial** (30 min)
   - Para primera conversación con un nuevo lead
   - Virtual o presencial

2. **Evaluación de Propiedad** (60 min)
   - Visita para evaluar la propiedad
   - Siempre presencial

3. **Presentación de Oferta** (45 min)
   - Para presentar y discutir una oferta
   - Virtual o presencial

4. **Seguimiento** (15 min)
   - Check-in rápido con leads activos
   - Generalmente virtual

### Configurar Disponibilidad

1. Ve a Bookings > "Disponibilidad"
2. Configura tus horarios por día:
   - Lunes-Viernes: 9:00 AM - 5:00 PM (ejemplo)
   - Buffer entre citas: 15 minutos
   - Máximo de citas por día: 6
3. Bloquea fechas específicas (vacaciones, días personales)
4. Los leads solo verán horarios disponibles

### Compartir tu Link de Agendamiento

Cada tipo de cita tiene un link único:
- Compártelo por email, WhatsApp o en tu firma
- El lead selecciona fecha y hora disponible
- La cita se confirma automáticamente
- Ambos reciben confirmación por email

### Gestionar Reservas

- **Confirmar**: La cita se confirma al crearla
- **Reagendar**: Si el lead necesita cambiar fecha
- **Cancelar**: Registra razón de cancelación
- **No-show**: Marca si el lead no se presentó`,
  },
  {
    id: 'les-23', sectionId: 'sec-6', title: 'Scheduling - Agendamiento', description: 'Herramienta de agendamiento avanzado: reglas, slots y coordinación de equipo.', estimatedMinutes: 15, completed: false, order: 3,
    content: `## Scheduling - Agendamiento Avanzado

Scheduling complementa al calendario y bookings con herramientas de agendamiento más avanzadas para el equipo.

### Diferencia entre Calendar, Bookings y Scheduling

- **Calendar**: Tu calendario personal con todos los eventos
- **Bookings**: Sistema público para que leads agenden citas contigo
- **Scheduling**: Herramienta interna para coordinar y optimizar agendas del equipo

### Funcionalidades

1. **Vista de Equipo**
   - Ve la disponibilidad de todo el equipo en un solo lugar
   - Identifica slots disponibles para cualquier agente
   - Útil para asignar evaluaciones o reuniones

2. **Reglas de Agendamiento**
   - Máximo de citas por día por agente
   - Buffer mínimo entre citas
   - Tiempo de traslado entre ubicaciones
   - Horarios preferidos por tipo de actividad

3. **Auto-scheduling**
   - El sistema sugiere el mejor horario basado en:
     - Disponibilidad del agente
     - Ubicación de la propiedad (minimiza traslado)
     - Prioridad del lead
     - Preferencia del lead (si la indicó)

### Ejemplo: Coordinar Evaluaciones
1. Tienes 3 evaluaciones que programar esta semana
2. Abres Scheduling > Vista de Equipo
3. Ves que Carlos está libre martes AM y jueves PM
4. Juan está libre miércoles todo el día
5. Asignas las evaluaciones agrupando por zona geográfica
6. Carlos: 2 en Bayamón (martes), Juan: 1 en Caguas (miércoles)
7. Minimizas tiempo de traslado y maximizas productividad`,
  },
  {
    id: 'les-24', sectionId: 'sec-6', title: 'Meetings - Reuniones', description: 'Gestión de reuniones: crear, documentar agendas, registrar notas y resultados.', estimatedMinutes: 20, completed: false, order: 4,
    content: `## Meetings - Gestión de Reuniones

El módulo de Meetings te permite gestionar reuniones formales con tracking completo.

### Panel de Reuniones

Al abrir Meetings verás:
- **Próximas reuniones**: Con fecha, hora y participantes
- **Reuniones recientes**: Historial con resultados
- **Métricas**: Total de reuniones, tasa de resultados positivos

### Tipos de Reunión

1. **Virtual**
   - Zoom, Google Meet, Microsoft Teams
   - Link de reunión generado automáticamente
   - Ideal para consultas iniciales y follow-ups

2. **Presencial**
   - En oficina o en la propiedad
   - Dirección y instrucciones de llegada
   - Para evaluaciones y cierres

3. **WhatsApp Video**
   - Para video llamadas rápidas
   - Útil para mostrar propiedades virtualmente

4. **Telefónica**
   - Para check-ins rápidos
   - Cuando no se necesita video

### Crear una Reunión

1. Click en "Nueva Reunión"
2. Selecciona tipo (virtual/presencial)
3. Establece fecha, hora y duración
4. Agrega participantes (agentes, leads, clientes)
5. Escribe la agenda:
   - Punto 1: Revisión de evaluación
   - Punto 2: Discusión de precio
   - Punto 3: Próximos pasos
6. Configura recordatorios
7. Guarda y envía invitaciones

### Durante la Reunión

- Toma notas en tiempo real en el módulo
- Registra acuerdos y compromisos
- Marca items de la agenda como completados

### Después de la Reunión

1. Registra el **resultado**: Positivo, Neutral, Negativo, Necesita Follow-up
2. Documenta las **notas finales**: Qué se acordó, próximos pasos
3. Asigna **tareas** derivadas de la reunión
4. Programa el **siguiente contacto** si es necesario

### Ejemplo: Reunión de Presentación de Oferta
1. Tipo: Presencial en oficina
2. Participantes: Carlos (agente), José Santos (seller)
3. Agenda: 1) Revisar comps, 2) Presentar oferta, 3) Discutir términos
4. Resultado: Positivo - Seller interesado, pidió 48 horas para considerar
5. Follow-up: Llamada en 48 horas para obtener respuesta`,
  },
  {
    id: 'les-25', sectionId: 'sec-6', title: 'Activity Log', description: 'Registro de actividades: auditoría, timeline y tracking de cambios en el sistema.', estimatedMinutes: 10, completed: false, order: 5,
    content: `## Activity Log - Registro de Actividades

El Activity Log registra automáticamente todas las acciones realizadas en el sistema.

### ¿Qué se Registra?

Todo cambio significativo queda documentado:
- Creación de leads, clientes, propiedades
- Cambios de status en el pipeline
- Comunicaciones registradas
- Reuniones creadas y completadas
- Cambios de asignación de agentes
- Modificaciones de datos
- Login y logout de usuarios

### Acceder al Activity Log

Menú lateral > Activity Log muestra:
- **Timeline cronológico**: Actividades más recientes primero
- **Filtros**: Por usuario, por tipo, por fecha
- **Búsqueda**: Buscar por lead o acción específica

### Para Qué Sirve

1. **Auditoría**: Verificar quién hizo qué y cuándo
2. **Accountability**: Cada agente tiene su actividad documentada
3. **Resolución de problemas**: Si algo sale mal, puedes rastrear qué pasó
4. **Performance**: Medir la actividad de cada miembro del equipo

### Ejemplo de Uso
- Un lead se queja de que nadie lo contactó
- Vas al Activity Log y buscas su nombre
- Ves el historial: Lead creado hace 3 días, no hay registro de contacto
- Acción: Contactar inmediatamente y revisar el proceso de asignación`,
  },

  // ─── SECTION 7: Gestión de Clientes ─────────────────────────
  {
    id: 'les-26', sectionId: 'sec-7', title: 'Clients - Gestión de Clientes', description: 'Perfil completo de clientes: CRM, historial, documentos y lifecycle.', estimatedMinutes: 25, completed: false, order: 1,
    content: `## Clients - Gestión de Clientes

El módulo de Clients es tu CRM completo para gestionar relaciones con clientes desde el primer contacto hasta post-venta.

### Diferencia entre Lead y Client

- **Lead**: Persona interesada en vender que aún no ha cerrado un deal
- **Client**: Persona con quien tienes o tuviste una relación comercial activa

### Tipos de Cliente

1. **Lead**: En proceso de calificación (viene del Lead Center)
2. **Prospect**: Lead calificado, en negociación activa
3. **Client**: Con deal activo o cerrado
4. **Past Client**: Relación completada, potencial para referidos

### Perfil del Cliente

Cada cliente tiene un perfil completo:
- **Información personal**: Nombre, email, teléfono, dirección
- **Empresa**: Si aplica (compradores corporativos)
- **Tags**: Etiquetas para categorización
- **Lifecycle Stage**: Visual de en qué etapa está la relación

### Pestañas del Perfil

1. **Timeline**: Historial completo de todas las interacciones
2. **Proposals**: Propuestas enviadas a este cliente
3. **Invoices**: Facturas asociadas
4. **Documents**: Documentos compartidos
5. **Meetings**: Reuniones programadas y completadas
6. **Notes**: Notas privadas del agente

### Métricas por Cliente

- **Total Revenue**: Ingresos generados por este cliente
- **Outstanding Balance**: Saldo pendiente de cobro
- **Total Proposals**: Propuestas enviadas
- **Total Meetings**: Reuniones realizadas
- **Documents**: Archivos compartidos

### Ejemplo: Lifecycle de un Cliente
1. **Lead**: José Santos llena formulario web
2. **Prospect**: Se califica positivamente, en negociación
3. **Client**: Se firma contrato de listado, deal en progreso
4. **Client (activo)**: La propiedad se vende exitosamente
5. **Past Client**: Deal cerrado, enviar encuesta de satisfacción
6. **Referido**: José refiere a su vecino → nuevo lead`,
  },
  {
    id: 'les-27', sectionId: 'sec-7', title: 'Documents - Gestión Documental', description: 'Organizar, subir y compartir documentos: contratos, evaluaciones, fotos.', estimatedMinutes: 20, completed: false, order: 2,
    content: `## Documents - Gestión Documental

El módulo de Documents centraliza todos los archivos del negocio: contratos, evaluaciones, fotos, SOPs y más.

### Estructura de Carpetas

Los documentos se organizan en carpetas por categoría:
- 📁 **Contracts**: Contratos de listado, compraventa
- 📁 **Proposals**: Propuestas comerciales
- 📁 **Invoices**: Facturas y recibos
- 📁 **Photos**: Fotos de propiedades
- 📁 **Inspections**: Reportes de inspección
- 📁 **Legal**: Documentos legales, poderes
- 📁 **SOPs**: Procedimientos operativos estándar
- 📁 **Templates**: Plantillas de documentos
- 📁 **Scripts**: Scripts de llamadas y presentaciones
- 📁 **Marketing**: Material de marketing

### Subir un Documento

1. Navega a la carpeta correspondiente
2. Click en "Subir" o arrastra el archivo
3. El sistema detecta el tipo de archivo automáticamente
4. Agrega tags para facilitar la búsqueda
5. Vincula al lead/cliente si es relevante
6. Configura permisos: ¿Quién puede ver este documento?

### Buscar Documentos

- Usa la barra de búsqueda por nombre de archivo
- Filtra por categoría, tags, fecha o propietario
- Filtra por lead/cliente vinculado

### Permisos y Seguridad

- **Interno**: Solo visible para el equipo
- **Compartido**: Visible para el cliente también
- **Versiones**: El sistema guarda versiones anteriores
- **Audit trail**: Quién subió, quién descargó, cuándo

### Documentos Esenciales por Deal

Para cada deal, asegúrate de tener:
1. ☐ Contrato de listado firmado
2. ☐ Divulgación de condición de propiedad
3. ☐ Reporte de evaluación con fotos
4. ☐ Análisis comparativo de mercado (CMA)
5. ☐ Certificación CRIM
6. ☐ Título de propiedad
7. ☐ Oferta de compra firmada
8. ☐ Documentos de cierre`,
  },
  {
    id: 'les-28', sectionId: 'sec-7', title: 'Forms - Formularios Personalizados', description: 'Crear formularios para captura de datos: leads, encuestas, evaluaciones.', estimatedMinutes: 15, completed: false, order: 3,
    content: `## Forms - Formularios Personalizados

El módulo de Forms te permite crear formularios personalizados para captura de datos.

### Formularios Disponibles

Al abrir Forms verás los formularios existentes:
- **Formulario de Captura Web**: El formulario principal del landing page
- **Formulario de Evaluación**: Para documentar evaluaciones en campo
- **Encuesta de Satisfacción**: Para post-cierre
- **Formularios personalizados**: Los que crees tú

### Crear un Formulario

1. Click en "Nuevo Formulario"
2. Nombre y descripción del formulario
3. Agrega campos arrastrándolos:

**Tipos de Campo Disponibles:**
- **Text**: Texto corto (nombre, dirección)
- **Long Text**: Texto largo (notas, comentarios)
- **Number**: Números (precio, área)
- **Phone**: Teléfono con formato
- **Email**: Email con validación
- **Dropdown**: Lista desplegable de opciones
- **Multi-select**: Selección múltiple
- **Radio**: Opción única
- **Checkbox**: Sí/No
- **Date**: Selector de fecha
- **File Upload**: Subir archivos

4. Configura cada campo:
   - ¿Es obligatorio?
   - Placeholder text
   - Validación especial
5. Ordena los campos arrastrándolos
6. Guarda y activa el formulario

### Embed Code

Cada formulario genera un código de embed que puedes:
- Insertar en tu página web
- Compartir como link directo
- Enviar por email a leads

### Ver Submissions

1. Click en el formulario
2. Ve a "Submissions" o "Respuestas"
3. Cada respuesta muestra fecha, datos y status
4. Exporta a CSV para análisis externo`,
  },
  {
    id: 'les-29', sectionId: 'sec-7', title: 'Clients - Búsqueda y Segmentación', description: 'Cómo buscar, filtrar y segmentar tu base de clientes para acciones masivas.', estimatedMinutes: 15, completed: false, order: 4,
    content: `## Búsqueda y Segmentación de Clientes

Segmentar tu base de clientes te permite hacer acciones más efectivas y personalizadas.

### Filtros de Búsqueda

Filtra clientes por:
- **Tipo**: Lead, Prospect, Client, Past Client
- **Tags**: Categorías que les hayas asignado
- **Municipio**: Zona geográfica
- **Agente**: Quién los gestiona
- **Revenue**: Rango de ingresos generados
- **Balance**: Clientes con saldo pendiente
- **Actividad**: Última interacción (activos vs inactivos)

### Crear Segmentos

Un segmento es un filtro guardado que puedes reusar:

1. Aplica los filtros deseados
2. Click en "Guardar Segmento"
3. Dale un nombre descriptivo
4. Usa el segmento para campañas de email, reportes, etc.

### Segmentos Útiles

- **"Clientes VIP"**: Revenue > $10K, Type = Client
- **"Leads Dormidos"**: Type = Lead, última actividad > 30 días
- **"Zona Bayamón"**: Municipality = Bayamón, Type = any
- **"Con Balance"**: Outstanding Balance > $0
- **"Referidores"**: Tag = "Referidor activo"

### Acciones Masivas

Con un segmento seleccionado puedes:
- Enviar email masivo a todo el segmento
- Asignar/reasignar agente en bloque
- Exportar datos del segmento
- Cambiar tags en bloque`,
  },

  // ─── SECTION 8: Finanzas ─────────────────────────
  {
    id: 'les-30', sectionId: 'sec-8', title: 'Billing - Facturación', description: 'Centro de facturación: transacciones, pagos, proveedores y métricas financieras.', estimatedMinutes: 25, completed: false, order: 1,
    content: `## Billing - Centro de Facturación

El módulo de Billing centraliza toda la gestión financiera: transacciones, pagos y métricas.

### Dashboard Financiero

Al abrir Billing verás 4 métricas principales:
1. **Total Facturado**: Suma de todas las facturas emitidas
2. **Cobrado**: Monto ya recibido
3. **Pendiente**: Facturas pendientes de cobro
4. **Vencido**: Facturas que pasaron su fecha de pago

### Transacciones

Lista de todas las transacciones:
- **Monto**: Cantidad de la transacción
- **Status**: Completed, Pending, Failed, Refunded, Overdue
- **Método**: Stripe, PayPal, ACH, Cash, Check, QuickBooks
- **Cliente**: A quién pertenece
- **Fecha**: Cuándo se realizó

### Registrar una Transacción

1. Click en "Nueva Transacción"
2. Selecciona el cliente
3. Ingresa el monto y descripción
4. Selecciona método de pago
5. Establece fecha de vencimiento (si es a crédito)
6. Agrega memo o términos especiales
7. Guarda la transacción

### Proveedores de Pago

En la sección de proveedores puedes conectar:
- **Stripe**: Pagos con tarjeta
- **Square**: Terminal de punto de venta
- **PayPal**: Pagos en línea
- **ACH**: Transferencias bancarias directas
- **QuickBooks**: Sincronización contable

### Alertas de Cobro

- **Facturas vencidas**: El sistema marca automáticamente
- **Recordatorios**: Envío automático de recordatorios de pago
- **Escalación**: Si una factura tiene 30+ días vencida, se escala

### Ejemplo: Flujo de Cobro
1. Se cierra un deal → comisión de $7,000
2. Creas factura en Invoices → Status: "Sent"
3. El cliente paga con Stripe → Status: "Paid"
4. La transacción aparece en Billing → "Completed"
5. Si no paga en 30 días → "Overdue" → recordatorio automático`,
  },
  {
    id: 'les-31', sectionId: 'sec-8', title: 'Proposals - Propuestas Comerciales', description: 'Crear propuestas profesionales con bloques: cover, pricing, términos y firma.', estimatedMinutes: 25, completed: false, order: 2,
    content: `## Proposals - Propuestas Comerciales

El módulo de Proposals te permite crear propuestas profesionales y atractivas para tus clientes.

### Panel de Propuestas

Verás las propuestas organizadas por status:
- **Draft**: En borrador, aún no enviada
- **Sent**: Enviada al cliente
- **Viewed**: El cliente la abrió (tracking de apertura)
- **Accepted**: Cliente aceptó ✅
- **Rejected**: Cliente rechazó ❌
- **Expired**: Venció sin respuesta

### Crear una Propuesta

1. Click en "Nueva Propuesta" (o usar una plantilla)
2. Selecciona el cliente asociado
3. La propuesta se construye con **bloques**:

**Bloques Disponibles:**
- 📄 **Cover**: Portada con logo y datos del cliente
- 📝 **Intro**: Introducción y contexto
- ❓ **Problem**: El reto que enfrenta el cliente
- 💡 **Solution**: Tu solución propuesta
- 📋 **Scope**: Alcance del trabajo
- ✅ **Deliverables**: Lo que entregas
- 📅 **Timeline**: Calendario de ejecución
- 💰 **Pricing**: Tabla de precios y opciones
- 📊 **Chart**: Gráficos de datos/comparativos
- 🖼️ **Gallery**: Fotos del proyecto/propiedad
- ⭐ **Testimonials**: Testimonios de clientes
- 📜 **Terms**: Términos y condiciones
- ✍️ **Signature**: Firma electrónica

4. Personaliza cada bloque con la información del deal
5. Revisa el preview
6. Envía al cliente

### Tracking

Una vez enviada:
- Recibes notificación cuando el cliente la abre
- Ves cuántas veces la ha visto
- El tiempo que pasó en cada sección
- Esto te ayuda a hacer follow-up en el momento correcto

### Vincular a Invoice

Cuando una propuesta es aceptada:
1. Click en "Crear Factura" desde la propuesta
2. Los datos se pre-llenan desde la propuesta
3. Genera la factura automáticamente`,
  },
  {
    id: 'les-32', sectionId: 'sec-8', title: 'Invoices - Facturas', description: 'Crear, enviar y dar seguimiento a facturas: line items, impuestos y pagos.', estimatedMinutes: 20, completed: false, order: 3,
    content: `## Invoices - Gestión de Facturas

Las facturas formalizan los cobros a clientes y sirven como registro contable.

### Panel de Facturas

Verás métricas y lista de facturas:
- **Total facturado este mes/año**
- **Pendientes de cobro**
- **Cobrado este mes**
- **Facturas vencidas**

### Crear una Factura

1. Click en "Nueva Factura"
2. Selecciona el cliente
3. La factura incluye:
   - **Número**: Auto-generado (INV-001, INV-002...)
   - **Fecha de emisión**: Hoy por defecto
   - **Fecha de vencimiento**: Configurable (30 días por defecto)
   - **Line Items**: Detalle de servicios/productos

4. Agrega line items:
   - Descripción del servicio
   - Cantidad
   - Precio unitario
   - Total (calculado automáticamente)

5. Configura impuestos:
   - Tasa de IVU: 11.5% (PR)
   - Exenciones si aplican

6. Agrega términos de pago y memo
7. Selecciona métodos de pago aceptados
8. Revisa el total: Subtotal + Tax = Total
9. Envía al cliente

### Estados de una Factura

- **Draft**: En preparación
- **Sent**: Enviada al cliente
- **Viewed**: Cliente la abrió
- **Paid**: Pagada completamente ✅
- **Partially Paid**: Pago parcial recibido
- **Overdue**: Fecha de pago vencida ⚠️
- **Void**: Anulada

### Registrar Pagos

1. Abre la factura
2. Click en "Registrar Pago"
3. Ingresa monto, método y referencia
4. Si es pago parcial, el balance se actualiza automáticamente
5. Si es pago total, la factura cambia a "Paid"

### Recibos

Cuando se registra un pago, el sistema genera un recibo automáticamente que puedes enviar al cliente como comprobante.`,
  },
  {
    id: 'les-33', sectionId: 'sec-8', title: 'Reportes Financieros', description: 'Generar reportes de ingresos, gastos, comisiones y proyecciones.', estimatedMinutes: 15, completed: false, order: 4,
    content: `## Reportes Financieros

Los reportes financieros te dan visibilidad sobre la salud económica del negocio.

### Reportes Disponibles

1. **Resumen de Ingresos**
   - Total cobrado por período (mes, trimestre, año)
   - Desglose por fuente de ingreso
   - Comparación con período anterior

2. **Cuentas por Cobrar**
   - Facturas pendientes de pago
   - Antigüedad de saldo (30, 60, 90+ días)
   - Clientes con mayor balance

3. **Comisiones por Agente**
   - Ingresos generados por cada agente
   - Porcentaje de comisión
   - Ranking de rendimiento

4. **Pipeline Financiero**
   - Valor estimado de deals en cada etapa
   - Probabilidad de cierre por etapa
   - Revenue proyectado

### Cómo Generar un Reporte

1. Ve a Billing o Analytics
2. Selecciona el tipo de reporte
3. Configura el período de fechas
4. Aplica filtros adicionales (agente, cliente, etc.)
5. Visualiza en pantalla o exporta

### Exportar Datos

Todos los reportes se pueden exportar en:
- **CSV**: Para Excel o Google Sheets
- **PDF**: Para presentaciones y archivo
- **QuickBooks**: Sincronización directa con contabilidad

### Ejemplo: Reporte Mensual
- Mes: Marzo 2026
- Facturado: $35,000
- Cobrado: $28,500
- Pendiente: $6,500
- Deals cerrados: 4
- Comisión promedio: $7,000
- Agente top: Carlos Reyes ($14,000)`,
  },

  // ─── SECTION 9: Automatización e IA ─────────────────────────
  {
    id: 'les-34', sectionId: 'sec-9', title: 'Automations - Automatizaciones', description: 'Crear reglas y workflows automáticos: triggers, condiciones y acciones.', estimatedMinutes: 25, completed: false, order: 1,
    content: `## Automations - Automatizaciones

Las automatizaciones ejecutan acciones repetitivas sin intervención manual, ahorrando tiempo y eliminando errores.

### Conceptos Clave

Cada automatización tiene 3 partes:
1. **Trigger** (Disparador): El evento que inicia la automatización
2. **Condition** (Condición): Filtro opcional que decide si la acción se ejecuta
3. **Action** (Acción): Lo que se hace automáticamente

### Triggers Disponibles

- **Lead Created**: Cuando se crea un nuevo lead
- **Lead Score Changed**: Cuando el score de un lead cambia
- **Stage Changed**: Cuando un lead cambia de etapa en el pipeline
- **Meeting Booked**: Cuando se agenda una reunión
- **Form Submitted**: Cuando se envía un formulario
- **Invoice Overdue**: Cuando una factura se vence

### Acciones Disponibles

- **Send Email**: Enviar un email usando una plantilla
- **Send Notification**: Enviar notificación al equipo
- **Assign Agent**: Asignar un agente al lead
- **Add Tag**: Agregar una etiqueta al lead
- **Wait X Days**: Esperar un período antes de la siguiente acción
- **Update Status**: Cambiar status automáticamente
- **Create Task**: Crear una tarea para un agente

### Crear una Automatización

1. Ve a Automations
2. Click en "Nueva Automatización"
3. Dale nombre y descripción
4. Selecciona el trigger
5. Agrega condiciones (opcional):
   - Score > 80 (solo para leads Hot)
   - Source = "Facebook" (solo para leads de FB)
   - Municipality = "Bayamón" (solo para esa zona)
6. Agrega la acción (o múltiples acciones en secuencia)
7. Activa la automatización

### Automatizaciones Recomendadas

1. **Welcome Flow**: Lead Created → Send Welcome Email → Wait 1 Day → Send WhatsApp
2. **Hot Lead Alert**: Score > 80 → Send Notification (immediate) → Assign to Senior Agent
3. **Stale Lead Warning**: No activity in 7 days → Send Alert to Agent
4. **Meeting Reminder**: Meeting in 24h → Send Reminder Email/SMS
5. **Invoice Follow-up**: Invoice Overdue → Send Reminder → Wait 7 days → Escalate

### Monitorear Automatizaciones

- **Run History**: Ve cada ejecución con fecha, trigger y resultado
- **Success/Fail**: Cuántas se ejecutaron bien vs errores
- **Disable/Enable**: Activa o desactiva sin borrar`,
  },
  {
    id: 'les-35', sectionId: 'sec-9', title: 'AI Assistant - Asistente de IA', description: 'Usa el asistente de IA para análisis, sugerencias y productividad.', estimatedMinutes: 15, completed: false, order: 2,
    content: `## AI Assistant - Asistente de Inteligencia Artificial

El AI Assistant es tu copiloto inteligente que te ayuda a trabajar más eficientemente.

### Funcionalidades del AI Assistant

1. **Análisis de Leads**
   - El asistente analiza el perfil de un lead y sugiere la mejor estrategia
   - Ejemplo: "Este lead tiene alta motivación pero score bajo porque no ha respondido. Sugiero intentar WhatsApp en lugar de llamada."

2. **Redacción de Emails**
   - Genera borradores de emails basados en el contexto
   - Personaliza el tono: formal, casual, urgente
   - Sugiere subject lines optimizados

3. **Resúmenes**
   - Resume el historial de un lead largo en puntos clave
   - Resume reuniones y genera action items
   - Resume métricas semanales

4. **Sugerencias de Follow-up**
   - Analiza el historial de interacciones
   - Sugiere el mejor momento y método de contacto
   - Prioriza leads basado en probabilidad de conversión

5. **Análisis de Pipeline**
   - Identifica cuellos de botella
   - Predice deals que podrían perderse
   - Sugiere acciones correctivas

### Cómo Usar el AI Assistant

1. Ve a AI Assistant en el menú lateral
2. Escribe tu pregunta o solicitud en lenguaje natural
3. El asistente responde con análisis y sugerencias
4. Implementa las sugerencias directamente desde la interfaz

### Ejemplos de Prompts Útiles

- "¿Cuáles son mis leads con mayor probabilidad de cierre esta semana?"
- "Redacta un email de follow-up para María López que no contestó mi llamada"
- "Analiza mi pipeline y dime dónde estoy perdiendo leads"
- "Sugiere el mejor horario para llamar a leads en la zona metro"`,
  },
  {
    id: 'les-36', sectionId: 'sec-9', title: 'Templates Avanzadas', description: 'Crear workflows complejos con plantillas multi-step y variables condicionales.', estimatedMinutes: 20, completed: false, order: 3,
    content: `## Templates Avanzadas

Las plantillas avanzadas van más allá de simples textos — permiten workflows complejos y personalización condicional.

### Plantillas Multi-Step

Crea secuencias de comunicación que se ejecutan automáticamente:

**Ejemplo: Secuencia de Nurturing (Lead Medium)**

**Paso 1** (Día 0): Email de bienvenida
"Hola {nombre}, gracias por tu interés en vender tu propiedad en {municipio}..."

**Paso 2** (Día 3): Email de valor
"Hola {nombre}, adjunto un análisis del mercado inmobiliario en {municipio}..."

**Paso 3** (Día 7): WhatsApp
"Hola {nombre}, ¿has tenido oportunidad de revisar el análisis que te envié?"

**Paso 4** (Día 14): Email de caso de éxito
"Hola {nombre}, quería compartirte el caso de un cliente que vendió su propiedad en {municipio} en solo 45 días..."

**Paso 5** (Día 21): Llamada programada
Follow-up telefónico para verificar interés

### Variables Condicionales

Personaliza el contenido basado en datos del lead:

- **Si** Score > 80: "Tenemos compradores activos en tu zona..."
- **Si** Tipo = Terreno: "Los terrenos en {municipio} han subido 15% este año..."
- **Si** Motivación = Deudas: "Entendemos que esta es una situación urgente..."

### Crear una Plantilla Avanzada

1. Ve a Templates > "Nueva Plantilla Avanzada"
2. Selecciona el tipo de secuencia
3. Define los pasos con timing
4. Agrega variables condicionales
5. Configura el trigger que la inicia
6. Activa la plantilla

### Mejores Prácticas

- No envíes más de 1 email por semana a un lead frío
- Varía el canal (email → WhatsApp → llamada)
- Incluye call-to-action claro en cada paso
- Mide apertura y respuesta para optimizar`,
  },
  {
    id: 'les-37', sectionId: 'sec-9', title: 'Workflows Multi-Step', description: 'Combina triggers, condiciones y acciones en workflows complejos con branches.', estimatedMinutes: 20, completed: false, order: 4,
    content: `## Workflows Multi-Step

Los workflows avanzados combinan múltiples pasos, condiciones y branches para automatizar procesos complejos.

### Anatomía de un Workflow Complejo

Un workflow puede tener:
- Múltiples triggers que lo inician
- Condiciones que bifurcan el camino (branches)
- Acciones en secuencia con esperas
- Loops que repiten acciones

### Ejemplo: Workflow de Lead Nuevo Completo

**Trigger**: Lead Created

**Branch 1**: Score > 80 (Hot)
→ Asignar a Senior Agent
→ Enviar notificación URGENTE al equipo
→ Enviar WhatsApp de bienvenida personalizado
→ Esperar 1 hora
→ Si no contactado → Enviar alerta al Manager

**Branch 2**: Score 40-79 (Medium/High)
→ Asignar por Round Robin
→ Enviar email de bienvenida
→ Esperar 24 horas
→ Si no contactado → Reasignar a backup agent

**Branch 3**: Score < 40 (Low)
→ Enviar a secuencia de nurturing automático
→ Esperar 7 días
→ Evaluar engagement
→ Si engagement > 3 interacciones → Escalar a agente

### Crear un Workflow Visual

1. Ve a Automations > "Nuevo Workflow"
2. Arrastra el trigger al canvas
3. Agrega nodos de condición (diamond shape)
4. Conecta acciones a cada branch
5. Agrega nodos de espera entre acciones
6. Conecta los caminos hasta el final
7. Testea el workflow con un lead de prueba
8. Activa el workflow

### Monitorear Workflows

- **Dashboard de Workflows**: Ve todos los workflows activos
- **Run History**: Cada ejecución con su camino específico
- **Errores**: Si algún paso falla, recibes alerta
- **Métricas**: Cuántos leads pasaron por cada branch

### Tips
- Empieza simple y agrega complejidad gradualmente
- Siempre testea con datos de prueba antes de activar
- Revisa los workflows mensualmente y optimiza basado en métricas`,
  },

  // ─── SECTION 10: Equipo y Administración ─────────────────────────
  {
    id: 'les-38', sectionId: 'sec-10', title: 'Team - Gestión de Equipo', description: 'Administrar miembros del equipo: roles, permisos, actividad y rendimiento.', estimatedMinutes: 20, completed: false, order: 1,
    content: `## Team - Gestión de Equipo

El módulo de Team te permite administrar los miembros de tu equipo y sus permisos.

### Panel de Equipo

Al abrir Team verás:
- **Lista de miembros**: Con foto, nombre, rol y status
- **Métricas por miembro**: Leads asignados, conversiones, actividad
- **Invitaciones pendientes**: Miembros aún no activados

### Agregar un Miembro

1. Click en "Invitar Miembro"
2. Ingresa email del nuevo miembro
3. Selecciona rol: Admin, Manager, Agent, Closer, Marketing, Support, Finance, HR
4. El sistema envía invitación por email
5. El nuevo miembro crea su cuenta y accede al sistema

### Información de Cada Miembro

- **Datos personales**: Nombre, email, teléfono, foto
- **Rol y permisos**: Qué puede ver y hacer en el sistema
- **Leads asignados**: Cantidad y detalle de leads
- **Métricas**: Tasa de conversión, actividad, resultados
- **Actividad reciente**: Últimas acciones en el sistema

### Métricas de Rendimiento

Para cada agente puedes ver:
- **Leads asignados**: Total y por etapa
- **Tasa de contacto**: % de leads contactados en 24h
- **Tasa de calificación**: % de contactados que califican
- **Tasa de cierre**: % de leads que cierran
- **Revenue generado**: Comisiones totales
- **Actividad**: Llamadas, emails, reuniones

### Ejemplo: Revisión de Rendimiento
- Carlos Reyes: 45 leads, 90% contactados, 55% calificados, 18% cierre, $14K revenue → ⭐ Excelente
- Juan Delgado: 38 leads, 75% contactados, 40% calificados, 12% cierre, $8K revenue → Necesita mejorar contacto inicial`,
  },
  {
    id: 'les-39', sectionId: 'sec-10', title: 'User Roles - Roles y Permisos', description: 'Configurar roles del sistema: qué ve y puede hacer cada rol.', estimatedMinutes: 15, completed: false, order: 2,
    content: `## User Roles - Roles y Permisos

El sistema de roles controla qué puede ver y hacer cada miembro del equipo.

### Roles Predeterminados

1. **Admin**: Acceso total a todas las funciones
2. **Manager**: Gestión de equipo y operaciones, limitado en settings
3. **Agent**: Gestión de leads, pipeline, follow-ups — no ve finanzas ni settings
4. **Closer**: Enfocado en negociación y cierre — ve pipeline y ofertas
5. **Marketing**: Campañas, analytics y templates — no ve datos financieros
6. **Support**: Comunicaciones y follow-ups — acceso limitado
7. **Finance**: Billing, propuestas, facturas — no ve pipeline detallado
8. **HR**: Team, actividad y recursos humanos

### Cómo Funcionan los Permisos

Cada módulo tiene dos niveles de permiso:
- **View** (Ver): Puede ver la información pero no modificar
- **Edit** (Editar): Puede ver Y modificar la información

### Personalizar Roles

1. Ve a User Roles en el menú
2. Selecciona un rol existente o crea uno nuevo
3. Para cada módulo, configura permisos de View y Edit
4. Guarda los cambios
5. Todos los usuarios con ese rol ven los cambios inmediatamente

### Cambiar tu Rol Activo

Si tienes acceso a múltiples roles:
1. Click en el selector de rol (esquina superior derecha)
2. Selecciona el rol deseado
3. El menú lateral se actualiza mostrando solo los módulos permitidos
4. Útil para ver cómo se ve el sistema para diferentes roles

### Ejemplo: Rol Personalizado "Team Lead"
- Base: Copia del rol "Agent"
- Adicional: View de Analytics, View de Team, View de Activity Log
- Propósito: Un agente senior que puede ver métricas del equipo pero no cambiar configuraciones`,
  },
  {
    id: 'les-40', sectionId: 'sec-10', title: 'Integrations - Integraciones', description: 'Conectar servicios externos: calendarios, pagos, almacenamiento y comunicación.', estimatedMinutes: 20, completed: false, order: 3,
    content: `## Integrations - Integraciones

Las integraciones conectan el sistema con servicios externos para ampliar su funcionalidad.

### Categorías de Integraciones

1. **Calendar** 📅
   - Google Calendar: Sincronización bidireccional
   - Outlook Calendar: Para Microsoft
   - Apple Calendar: Para dispositivos Apple

2. **Meetings** 🎥
   - Zoom: Video conferencias
   - Google Meet: Alternativa gratuita
   - Microsoft Teams: Para corporativos

3. **Payments** 💳
   - Stripe: Pagos con tarjeta
   - Square: Terminal de punto de venta
   - PayPal: Pagos en línea
   - QuickBooks: Contabilidad

4. **Storage** 📁
   - Google Drive: Almacenamiento en la nube
   - Dropbox: Alternativa de storage
   - OneDrive: Para Microsoft

5. **Communications** 💬
   - WhatsApp Business API: Mensajería
   - Twilio: SMS y llamadas
   - SendGrid: Email masivo

6. **Marketing** 📊
   - Meta Business (Facebook/Instagram): Ads y leads
   - Google Ads: Publicidad de búsqueda
   - Mailchimp: Email marketing

### Conectar una Integración

1. Ve a Integrations
2. Busca el servicio deseado
3. Click en "Conectar"
4. Sigue el proceso de autenticación (OAuth)
5. Configura las opciones de sincronización
6. Verifica que la conexión esté activa

### Monitorear Integraciones

- **Status**: Connected (verde), Disconnected (rojo), Error (amarillo)
- **Last Sync**: Fecha de la última sincronización
- **Logs**: Historial de acciones y errores
- **Reconnect**: Si una integración se desconecta, reconecta fácilmente`,
  },
  {
    id: 'les-41', sectionId: 'sec-10', title: 'Notifications - Centro de Notificaciones', description: 'Gestión avanzada de notificaciones: configuración, filtros y preferencias.', estimatedMinutes: 10, completed: false, order: 4,
    content: `## Notifications - Centro de Notificaciones

La sección dedicada de Notifications te da control completo sobre tus alertas.

### Centro de Notificaciones

Al abrir Notifications verás:
- **Lista completa**: Todas las notificaciones, más recientes primero
- **Filtros**: Por tipo, leído/no leído, fecha
- **Acciones masivas**: Marcar todas como leídas, borrar antiguas

### Categorías de Notificación

1. **Leads** 🎯: Nuevos leads, cambios de score, asignaciones
2. **Follow-ups** ⏰: Recordatorios de seguimiento, vencidos
3. **Meetings** 📅: Reuniones próximas, confirmaciones, cancelaciones
4. **Pipeline** 📊: Cambios de etapa, deals cerrados
5. **Finance** 💰: Pagos recibidos, facturas vencidas
6. **System** ⚙️: Actualizaciones, mantenimiento, nuevas funciones
7. **Team** 👥: Mensajes del equipo, tareas asignadas

### Configurar Preferencias

En Settings > Notifications:
- **Por categoría**: Activa/desactiva cada tipo
- **Canales**: In-app, email, push (cuando disponible)
- **Frecuencia**: Inmediata, resumen diario, resumen semanal
- **Horario**: No molestar fuera de horario laboral

### Tips para Gestionar Notificaciones
- Revisa notificaciones al inicio y final del día
- Usa filtros para enfocarte en lo urgente (Follow-ups y Leads)
- Configura "Do Not Disturb" durante bloques de trabajo concentrado
- No ignores notificaciones de facturas vencidas`,
  },
  {
    id: 'les-42', sectionId: 'sec-10', title: 'Settings - Configuración General', description: 'Configuración del sistema: empresa, branding, preferencias y datos.', estimatedMinutes: 15, completed: false, order: 5,
    content: `## Settings - Configuración General

La sección de Settings te permite personalizar el sistema según las necesidades de tu empresa.

### Secciones de Configuración

1. **Company Profile**
   - Nombre de la empresa
   - Logo y branding
   - Dirección y teléfono
   - Redes sociales
   - Horario de operación

2. **Lead Settings**
   - Reglas de scoring (pesos de cada factor)
   - Auto-asignación: Round Robin, por zona, manual
   - Tiempo máximo sin contactar (alerta)
   - Fuentes de leads activas

3. **Communication Settings**
   - Firma de email predeterminada
   - Templates por defecto
   - Horarios de envío automático
   - Canales activos (email, WhatsApp, SMS)

4. **Financial Settings**
   - Moneda predeterminada (USD)
   - Tasa de impuesto (IVU 11.5%)
   - Términos de pago predeterminados
   - Proveedores de pago conectados

5. **Pipeline Settings**
   - Nombres de etapas personalizables
   - Colores de cada etapa
   - Campos requeridos por etapa
   - Automatizaciones por cambio de etapa

6. **Notification Settings**
   - Preferencias por tipo
   - Canales de notificación
   - Horario de "Do Not Disturb"

7. **Security**
   - Política de contraseñas
   - Autenticación 2FA
   - Sesiones activas
   - Registro de accesos

### Solo para Admins

Algunas configuraciones solo están disponibles para el rol Admin:
- Gestión de roles y permisos
- Integraciones
- Datos de la empresa
- Eliminación de datos`,
  },

  // ─── SECTION 11: Configuración del Sistema ─────────────────────────
  {
    id: 'les-43', sectionId: 'sec-11', title: 'Configuración Inicial', description: 'Setup completo del sistema: primeros pasos después de crear tu cuenta.', estimatedMinutes: 20, completed: false, order: 1,
    content: `## Configuración Inicial del Sistema

Esta guía te lleva paso a paso por la configuración inicial de tu cuenta de Seller Lead Engine™.

### Paso 1: Perfil de la Empresa

1. Ve a Settings > Company Profile
2. Sube tu logo (formato PNG, mínimo 200x200px)
3. Completa información de la empresa:
   - Nombre legal y nombre comercial
   - Dirección de oficina
   - Teléfono principal y de emergencia
   - Email de contacto
   - Número de licencia de corredor
4. Configura tus redes sociales

### Paso 2: Invitar al Equipo

1. Ve a Team > "Invitar Miembro"
2. Para cada miembro:
   - Email
   - Rol (Agent, Manager, etc.)
   - Departamento
3. Los miembros recibirán invitación por email
4. Verifica que todos activen sus cuentas

### Paso 3: Conectar Integraciones

1. Ve a Integrations
2. Conecta los servicios que uses:
   - Calendario (Google/Outlook)
   - Pagos (Stripe/PayPal)
   - Email (SendGrid)
   - Ads (Meta Business)
3. Verifica que cada integración muestre "Connected"

### Paso 4: Configurar Pipeline

1. Ve a Settings > Pipeline
2. Revisa las etapas predeterminadas
3. Personaliza nombres si es necesario
4. Configura campos requeridos por etapa
5. Activa automatizaciones básicas

### Paso 5: Crear Templates Básicos

1. Ve a Templates
2. Crea al menos estas plantillas:
   - Email de bienvenida para leads
   - WhatsApp de presentación
   - Propuesta de servicios
   - Factura estándar

### Paso 6: Configurar Automatizaciones

1. Ve a Automations
2. Activa las automatizaciones recomendadas:
   - Welcome flow para leads nuevos
   - Hot lead alert
   - Invoice reminder
3. Personaliza según tu proceso

### Paso 7: Tu Primera Campaña

1. Ve a Campaigns
2. Conecta tu cuenta de Meta
3. Crea tu primera campaña de Facebook Ads
4. Configura el formulario de captura
5. Lanza y monitorea resultados`,
  },
  {
    id: 'les-44', sectionId: 'sec-11', title: 'Personalización y Branding', description: 'Personalizar la apariencia: logo, colores, landing page y comunicaciones.', estimatedMinutes: 15, completed: false, order: 2,
    content: `## Personalización y Branding

Tu marca es tu identidad. El sistema te permite personalizar la apariencia para reflejar tu brand.

### Logo y Marca

1. **Logo principal**: Se usa en el menú lateral, emails y documentos
   - Formato: PNG con fondo transparente
   - Tamaño recomendado: 400x100px (horizontal)
   - Se muestra en login, sidebar y documentos

2. **Favicon**: El ícono pequeño en la pestaña del navegador
   - Formato: ICO o PNG
   - Tamaño: 32x32px

3. **Logo para fondo oscuro**: Versión blanca/clara del logo
   - Se usa en el sidebar (fondo oscuro)
   - Se usa en el footer de la página pública

### Colores de Marca

Los colores principales del sistema se configuran en Settings:
- **Primary**: Color principal (botones, links, acentos)
- **Accent**: Color secundario para highlights
- **Background**: Colores de fondo

### Página Pública

La landing page pública se personaliza desde Settings:
- **Hero section**: Título, subtítulo y imagen de fondo
- **Testimonios**: Agrega testimonios de clientes
- **Formulario**: Personaliza campos y colores
- **Footer**: Información de contacto y redes sociales

### Comunicaciones con Marca

Todos los emails y documentos incluyen automáticamente:
- Tu logo en el header
- Colores de marca
- Información de contacto en el footer
- Firma personalizada del agente

### Landing Page Pública
La página pública del sistema incluye:
- **Inicio**: Hero con formulario de captura
- **Propiedades**: Catálogo de listings activos
- **Sobre Nosotros**: Historia y equipo de la empresa
- **Contacto**: Formulario y datos de la oficina`,
  },
  {
    id: 'les-45', sectionId: 'sec-11', title: 'Seguridad y Accesos', description: 'Buenas prácticas de seguridad: contraseñas, 2FA, sesiones y respaldos.', estimatedMinutes: 15, completed: false, order: 3,
    content: `## Seguridad y Accesos

La seguridad de los datos de tus clientes y tu empresa es prioridad. Sigue estas prácticas.

### Política de Contraseñas

El sistema requiere:
- Mínimo 12 caracteres
- Al menos una mayúscula y una minúscula
- Al menos un número
- Al menos un carácter especial (!@#$%^&*)
- Cambio cada 90 días
- No reutilizar las últimas 5 contraseñas

### Autenticación de Dos Factores (2FA)

1. Ve a Settings > Security > 2FA
2. Activa la autenticación de dos factores
3. Escanea el código QR con tu app de autenticación (Google Authenticator, Authy)
4. Cada login requerirá el código de 6 dígitos
5. Guarda los códigos de respaldo en un lugar seguro

### Gestión de Sesiones

- Las sesiones expiran después de 8 horas de inactividad
- Puedes ver sesiones activas en Settings > Security
- Cierra sesiones sospechosas remotamente
- El sistema registra IP, dispositivo y ubicación de cada login

### Respaldos

- Los datos se respaldan automáticamente cada 24 horas
- Los respaldos se mantienen por 90 días
- Puedes solicitar un respaldo manual en Settings > Data > Backup
- Los datos se pueden exportar en CSV en cualquier momento

### Manejo de Datos Sensibles

- No guardar SSN o datos bancarios de clientes en notas
- Los datos de pago se procesan a través de Stripe (PCI compliant)
- Usar los campos designados del sistema para información sensible
- Reportar cualquier brecha de seguridad inmediatamente al Admin

### Checklist de Seguridad
- ☐ Contraseña fuerte y única
- ☐ 2FA activado
- ☐ No compartir credenciales
- ☐ Cerrar sesión al terminar
- ☐ No acceder desde redes públicas sin VPN
- ☐ Reportar emails de phishing`,
  },

  // ─── SECTION 12: Analytics y Reportes ─────────────────────────
  {
    id: 'les-46', sectionId: 'sec-12', title: 'Analytics Dashboard', description: 'Panel de analytics: métricas de rendimiento, gráficos y KPIs del negocio.', estimatedMinutes: 25, completed: false, order: 1,
    content: `## Analytics Dashboard

El Dashboard de Analytics te da una vista 360° del rendimiento de tu negocio.

### Métricas Principales

1. **Lead Metrics**
   - Total de leads por período
   - Leads por fuente (Facebook, Orgánico, Referidos)
   - Leads por temperatura
   - Distribución geográfica

2. **Conversion Metrics**
   - Tasa de conversión general
   - Conversión por etapa del pipeline
   - Conversión por agente
   - Conversión por fuente de lead

3. **Revenue Metrics**
   - Revenue total por período
   - Revenue por agente
   - Ticket promedio
   - Revenue proyectado

4. **Activity Metrics**
   - Llamadas realizadas
   - Emails enviados
   - Reuniones completadas
   - Follow-ups a tiempo vs vencidos

### Tipos de Gráficos

- **Line Chart**: Tendencias en el tiempo (leads por mes)
- **Bar Chart**: Comparaciones (revenue por agente)
- **Pie Chart**: Distribución (leads por fuente)
- **Funnel**: Conversión por etapa
- **Heat Map**: Actividad por hora/día

### Filtros del Dashboard

Personaliza tu vista con filtros:
- **Período**: Esta semana, este mes, este trimestre, personalizado
- **Agente**: Todos o uno específico
- **Fuente**: Todas o una específica
- **Municipio**: Todos o uno específico

### Reportes Predefinidos

1. **Reporte Semanal**: Resumen de actividad de la semana
2. **Reporte de Pipeline**: Estado actual del pipeline con proyección
3. **Reporte de Agentes**: Ranking de rendimiento por agente
4. **Reporte de Campañas**: ROI y métricas de marketing
5. **Reporte Financiero**: Ingresos, gastos y proyecciones

### Ejemplo: Lectura del Dashboard
- Leads este mes: 85 (↑ 12% vs mes anterior) → El marketing está funcionando
- Tasa de conversión: 4.8% (↓ 0.5% vs mes anterior) → Revisar calificación
- Revenue: $28K (↑ 20% vs mes anterior) → Buenos cierres
- Agente top: Carlos con 40% del revenue → Dependencia en un agente`,
  },
  {
    id: 'les-47', sectionId: 'sec-12', title: 'Métricas por Agente', description: 'Análisis de rendimiento individual: productividad, conversión y benchmarks.', estimatedMinutes: 15, completed: false, order: 2,
    content: `## Métricas por Agente

Analizar el rendimiento individual te ayuda a identificar fortalezas, debilidades y oportunidades de mejora.

### Dashboard del Agente

Cada agente tiene un dashboard personal con:

1. **Leads**
   - Total asignados
   - Por etapa del pipeline
   - Por temperatura
   - Sin contactar (action needed!)

2. **Actividad**
   - Llamadas realizadas (hoy, semana, mes)
   - Emails enviados
   - Reuniones completadas
   - Follow-ups a tiempo

3. **Conversión**
   - Contact rate: % contactados en 24h
   - Qualification rate: % que califican
   - Win rate: % que cierran
   - Average deal value

4. **Revenue**
   - Total generado
   - Comisiones ganadas
   - Comparación con meta

### Benchmarks y Metas

| Métrica | Meta Mínima | Meta Óptima |
|---------|-------------|-------------|
| Contact Rate | 80% | 95% |
| Qualification Rate | 40% | 60% |
| Win Rate | 12% | 20% |
| Calls/día | 15 | 25 |
| Response Time | < 1 hora | < 15 min |

### Identificar Oportunidades

- **Alta actividad + bajo cierre** → Training en técnicas de cierre
- **Baja actividad + alto cierre** → Asignar más leads, es eficiente
- **Alto contact rate + baja calificación** → Mejorar criterios de scoring
- **Bajo contact rate** → Problemas de gestión de tiempo, coaching necesario`,
  },
  {
    id: 'les-48', sectionId: 'sec-12', title: 'Exportación y Reportes Custom', description: 'Exportar datos, crear reportes personalizados y programar envíos automáticos.', estimatedMinutes: 15, completed: false, order: 3,
    content: `## Exportación y Reportes Personalizados

Lleva tus datos fuera del sistema para análisis avanzado o compartir con stakeholders.

### Exportar Datos

Casi cualquier vista del sistema se puede exportar:

1. **CSV**: Para Excel, Google Sheets o análisis en otras herramientas
2. **PDF**: Para presentaciones y archivo formal

### Datos Exportables

- **Leads**: Lista completa con todos los campos
- **Pipeline**: Estado actual con valores
- **Contacts**: Base de datos de clientes
- **Transactions**: Historial de pagos y facturas
- **Activity**: Log de actividades por período
- **Campaign Data**: Métricas de campañas

### Crear un Reporte Custom

1. Ve a Analytics > "Nuevo Reporte"
2. Selecciona las métricas a incluir
3. Configura filtros y período
4. Elige el formato de visualización (tabla, gráfico, mixto)
5. Nombra y guarda el reporte
6. Accede a él cuando quieras desde "Mis Reportes"

### Programar Reportes Automáticos

1. Abre un reporte guardado
2. Click en "Programar Envío"
3. Configura:
   - Frecuencia: Diario, semanal, mensual
   - Destinatarios: Emails de quienes lo recibirán
   - Formato: PDF adjunto o link
   - Hora de envío

### Ejemplo: Reporte Semanal al Director
- **Contenido**: KPIs principales, leads nuevos, deals cerrados, revenue
- **Frecuencia**: Todos los lunes a las 8 AM
- **Destinatarios**: director@myhouserealty.com
- **Formato**: PDF con gráficos`,
  },

  // ─── SECTION 13: Recursos Humanos ─────────────────────────
  {
    id: 'les-49', sectionId: 'sec-13', title: 'HR - Gestión de Empleados', description: 'Módulo HR completo: directorio, perfiles, beneficios y nómina.', estimatedMinutes: 25, completed: false, order: 1,
    content: `## HR - Gestión de Recursos Humanos

El módulo de HR te permite gestionar todo lo relacionado con el personal de la empresa.

### Panel Principal

Al abrir HR verás:
- **Métricas**: Total empleados, activos, candidatos, nómina anual
- **Pestañas**: Empleados, Pipeline de Contratación, Nómina, Beneficios, Tiempo Libre, Rendimiento, Políticas, Organigrama

### Directorio de Empleados

La pestaña Empleados muestra:
- Lista de todos los empleados con foto, nombre, departamento, status
- Filtros por departamento, status, búsqueda
- Click en un empleado para ver perfil completo

### Perfil del Empleado

Cada perfil incluye:
- **Información Personal**: Nombre, email, teléfono, dirección, fecha de nacimiento
- **Información Laboral**: Departamento, cargo, fecha de inicio, manager
- **Salario**: Salario anual y historial de cambios
- **Beneficios**: Planes en los que está inscrito
- **PTO**: Balance de vacaciones, enfermedad y personal
- **Evaluaciones**: Historial de performance reviews
- **Nómina**: Historial de pagos

### Agregar un Empleado

1. Click en "Nuevo Empleado"
2. Completa información personal
3. Asigna departamento y cargo
4. Establece salario
5. Selecciona beneficios
6. El sistema calcula automáticamente la nómina mensual

### Departamentos

- **Sales**: Agentes de ventas y closers
- **Operations**: Administración y coordinación
- **Marketing**: Marketing digital y campañas
- **Finance**: Contabilidad y facturación
- **HR**: Recursos humanos
- **Technology**: IT y sistemas`,
  },
  {
    id: 'les-50', sectionId: 'sec-13', title: 'HR - Beneficios y Nómina', description: 'Gestión de planes de beneficios, inscripción y procesamiento de nómina.', estimatedMinutes: 25, completed: false, order: 2,
    content: `## HR - Beneficios y Nómina

### Planes de Beneficios

La pestaña Beneficios muestra todos los planes disponibles:

1. **Salud (Health)**
   - PPO Premium: Red amplia, mayor costo
   - HMO Standard: Red selecta, menor costo
   - Proveedor: Triple-S Salud

2. **Dental**
   - Delta Dental Premier: Cobertura completa incluyendo ortodoncia
   - Delta Dental Basic: Cobertura preventiva y restaurativa

3. **Visión**
   - VSP Vision Choice: Exámenes, lentes y monturas

4. **Seguro de Vida**
   - Term Life (MetLife): 2x salario anual

5. **Retiro**
   - 401(k) con Fidelity: Match del empleador hasta 4%

6. **Incapacidad**
   - Short-Term Disability (Unum): 60% del salario

### Inscripción en Beneficios

- Los nuevos empleados se inscriben durante sus primeros 30 días
- Open Enrollment anual en noviembre
- Cambios de vida (matrimonio, bebé) permiten inscripción especial

### Nómina

La pestaña Nómina muestra:
- **Tabla de empleados**: Con salario anual, mensual bruto, deducciones y neto
- **Totales**: Nómina total anual y mensual
- **Status**: Pagado, pendiente, procesando

### Procesamiento de Nómina

1. El sistema calcula automáticamente:
   - Salario bruto mensual (salario anual / 12)
   - Deducciones (~25%): Seguro social, Medicare, impuestos PR
   - Contribuciones a beneficios
   - Salario neto

2. Cada período de pago genera un registro
3. El Admin aprueba y procesa los pagos
4. Se genera comprobante de pago para cada empleado`,
  },
  {
    id: 'les-51', sectionId: 'sec-13', title: 'HR - Evaluaciones de Rendimiento', description: 'Crear, gestionar y dar seguimiento a evaluaciones de performance.', estimatedMinutes: 20, completed: false, order: 3,
    content: `## HR - Evaluaciones de Rendimiento

Las evaluaciones de rendimiento son fundamentales para el desarrollo profesional del equipo.

### Tipos de Evaluación

1. **Annual**: Evaluación completa de fin de año
2. **Semi-annual**: Evaluación cada 6 meses
3. **Quarterly**: Evaluación trimestral (para roles en desarrollo)
4. **Probation**: Evaluación de período probatorio (90 días)

### Crear una Evaluación

1. Ve a HR > Pestaña "Rendimiento"
2. Click en "Nueva Evaluación"
3. Selecciona el empleado
4. Selecciona el tipo de evaluación
5. El sistema pre-llena las categorías de evaluación

### Categorías de Evaluación

Cada evaluación califica estas áreas (escala 1-5):

1. **Productividad** (peso: 25%): Cumplimiento de metas y objetivos
2. **Calidad de Trabajo** (peso: 25%): Precisión, atención al detalle
3. **Trabajo en Equipo** (peso: 20%): Colaboración y comunicación con el equipo
4. **Comunicación** (peso: 15%): Claridad, profesionalismo
5. **Iniciativa/Aprendizaje** (peso: 15%): Proactividad y desarrollo

### Completar la Evaluación

1. Califica cada categoría de 1 a 5
2. Agrega comentarios específicos por categoría
3. Lista fortalezas del empleado (mínimo 2)
4. Lista áreas de mejora (mínimo 1)
5. Define metas para el próximo período
6. Agrega comentarios generales
7. El rating general se calcula automáticamente (promedio ponderado)

### Metas (Goals)

Cada evaluación incluye metas medibles:
- **Título**: Qué lograr (ej: "Cerrar 24 deals en 2026")
- **Descripción**: Detalle y contexto
- **Fecha objetivo**: Cuándo debe completarse
- **Progreso**: % de avance (se actualiza durante el período)
- **Status**: Not Started, In Progress, Completed, Overdue

### Rating Scale
| Rating | Significado | Acción |
|--------|-------------|--------|
| 5.0 | Excepcional | Candidato a promoción |
| 4.0-4.9 | Excelente | Reconocimiento y bonos |
| 3.0-3.9 | Competente | Desarrollo continuo |
| 2.0-2.9 | Necesita Mejora | Plan de mejora formal |
| 1.0-1.9 | Insatisfactorio | Acción disciplinaria |`,
  },
  {
    id: 'les-52', sectionId: 'sec-13', title: 'HR - Tiempo Libre y Políticas', description: 'Solicitudes de PTO, asistencia, políticas de empresa y organigrama.', estimatedMinutes: 20, completed: false, order: 4,
    content: `## HR - Tiempo Libre, Asistencia y Políticas

### Solicitudes de Tiempo Libre (PTO)

La pestaña "Tiempo Libre" muestra:
- **Solicitudes pendientes**: Esperando aprobación del manager
- **Calendario**: Vista de ausencias aprobadas
- **Balances**: PTO disponible por empleado

### Crear una Solicitud

1. Click en "Nueva Solicitud"
2. Selecciona tipo: Vacaciones, Enfermedad, Personal, Maternidad/Paternidad, Duelo
3. Selecciona fechas (inicio y fin)
4. Escribe la razón
5. Envía la solicitud
6. El manager recibe notificación para aprobar/denegar

### Aprobar/Denegar (Managers)

1. Ve las solicitudes pendientes
2. Verifica el balance del empleado
3. Verifica que no hay conflictos de agenda
4. Aprueba o deniega con comentario
5. El empleado recibe notificación del resultado

### Balances de PTO

Cada empleado tiene:
- **Vacaciones**: 15 días/año (acumulación mensual)
- **Enfermedad**: 10 días/año
- **Personal**: 3 días/año

### Asistencia

La pestaña muestra el registro de asistencia diario:
- Hora de entrada y salida
- Horas trabajadas
- Status: Presente, Tarde, Ausente, Medio día, Remoto

### Políticas de Empresa

La pestaña "Políticas" contiene el manual completo:
- Manual del Empleado
- Código de Conducta
- Política de Beneficios
- Seguridad en el Trabajo
- Uso de Tecnología
- Cumplimiento Inmobiliario
- Licencias y Ausencias

Cada política muestra:
- Versión y fecha de última actualización
- Barra de progreso de reconocimiento (cuántos han leído)
- Click para leer el contenido completo

### Organigrama

La pestaña "Organigrama" muestra la estructura de la empresa:
- Director General en la parte superior
- Cada departamento con su equipo
- Relaciones de reporte (quién reporta a quién)
- Click en cualquier persona para ver su perfil`,
  },
];

export const learningService = {
  async getSections(): Promise<LearningSection[]> {
    await delay(300);
    return [...mockSections];
  },
  async getLessons(sectionId?: string): Promise<Lesson[]> {
    await delay(250);
    if (sectionId) return mockLessons.filter(l => l.sectionId === sectionId);
    return [...mockLessons];
  },
  async getLesson(id: string): Promise<Lesson | undefined> {
    await delay(200);
    return mockLessons.find(l => l.id === id);
  },
  async markComplete(id: string): Promise<boolean> {
    await delay(300);
    const lesson = mockLessons.find(l => l.id === id);
    if (!lesson) return false;
    lesson.completed = !lesson.completed;
    const section = mockSections.find(s => s.id === lesson.sectionId);
    if (section) {
      section.completedCount = mockLessons.filter(l => l.sectionId === section.id && l.completed).length;
    }
    return true;
  },
};
