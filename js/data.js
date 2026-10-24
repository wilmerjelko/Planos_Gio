/* ==========================================================================
   PLANOS GIO - Base de Datos de Reglas de Negocio, Tarifas, CRM y Marketing
   ========================================================================== */

window.PLANOS_GIO_DATA = {
  config: {
    brandName: "Planos Gio",
    razonSocial: "GIO, GRUPO INGENIEROS S.A.C.",
    nombreComercial: "GIOGRIN SAC",
    ruc: "20610282963",
    estadoSunat: "ACTIVO / HABIDO (Emisor Electrónico de Factura y Boleta)",
    partidaRegistral: "15146750",
    domicilioFiscal: "Av. Arequipa Nro. 1421 Dpto. 1306, Urb. Santa Beatriz, Lima - Lima",
    gerenteGeneral: "Alonzo Adrian Angulo Chirinos",
    socio: "Augusto Franco Angulo Chirinos",
    emailOficial: "alonzoadrianangulochirinos@gmail.com",
    tagline: "Diseño de Planos en Todo el Perú & Remodelaciones en Lima",
    whatsappNumber: "51993952844",
    whatsappDisplay: "+51 993 952 844",
    telefonoSecundario: "+51 901 632 203",
    yapeNumber: "993 952 844",
    yapePlinHolder: "GIO, GRUPO INGENIEROS S.A.C. / Alonzo Angulo — Yape: 993 952 844",
    comprobantes: "Factura Electrónica y Boleta de Venta Electrónica",
    visitaTecnicaLimaFee: 80, // S/ 80 descontables al 100% si contrata
    reservaPlanoExpressFee: 60, // S/ 60 reserva inicial para indecisos (descontable)
    paymentMilestones: {
      hito1: 50, // 50% al iniciar y emitir Orden de Servicio
      hito2: 30, // 30% al aprobar distribución 2D (enviada con marca de agua)
      hito3: 20  // 20% contra-entrega para liberar archivos CAD (.dwg) y PDF HD
    },
    pricingPerM2: {
      // Diseño de Planos (Todo el Perú) - Tarifas competitivas por m2 techado
      planos_esencial: {
        id: "planos_esencial",
        name: "🥉 Paquete Esencial (Arquitectura 2D)",
        category: "planos",
        scopePeru: "Todo el Perú",
        ratePerM2: 10,
        minPrice: 450,
        deliveryDaysBase: 4,
        includes: [
          "Plano de Distribución Arquitectónica 2D optimizada",
          "Cortes y Elevaciones de fachada principal",
          "Cuadro de vanos (puertas y ventanas) e iluminación natural",
          "1 reunión de revisión en vivo por Zoom / Google Meet",
          "Entrega final en PDF listo para plotear + AutoCAD (.DWG)"
        ]
      },
      planos_completo: {
        id: "planos_completo",
        name: "🥇 Paquete Construcción Segura (Todas las Especialidades)",
        category: "planos",
        scopePeru: "Todo el Perú",
        ratePerM2: 18,
        minPrice: 850,
        deliveryDaysBase: 7,
        badge: "MÁS VENDIDO EN PERÚ",
        includes: [
          "Arquitectura completa (Distribución, Cortes y Elevaciones)",
          "Estructuras (Cimentación, Columnas, Vigas y Losa aligerada)",
          "Instalaciones Eléctricas (Luminarias, Tomacorrientes, Tablero)",
          "Instalaciones Sanitarias (Agua fría/caliente y Desagüe)",
          "Guía de Materiales Clave Anti-Engaño (Cemento, Fierro, Ladrillo)",
          "Entrega en PDF Alta Resolución + Archivos AutoCAD (.DWG)"
        ]
      },
      planos_premium3d: {
        id: "planos_premium3d",
        name: "💎 Paquete Premium Visual 360° (Planos + 3D + Metrado)",
        category: "planos",
        scopePeru: "Todo el Perú",
        ratePerM2: 24,
        minPrice: 1200,
        deliveryDaysBase: 9,
        includes: [
          "Todas las especialidades del Paquete Construcción Segura",
          "Vistas 3D Fotorealistas e Isometría de distribución",
          "Recorrido Visual para ver tu casa desde el celular antes de construir",
          "Presupuesto Referencial de Obra y Cómputo de Materiales Anti-Robo",
          "Asesoría para dudas de tu maestro de obra durante el inicio"
        ]
      },
      // Remodelación Física (Exclusivo Lima Metropolitana y Callao)
      remodelacion_lima: {
        id: "remodelacion_lima",
        name: "🛠️ Remodelación Integral Llave en Mano (Exclusivo Lima)",
        category: "remodelacion",
        scopePeru: "Solo Lima Metropolitana y Callao",
        ratePerM2: 480, // Mano de obra + acabados base referenciales por m2 intervenido
        minPrice: 2800,
        deliveryDaysBase: 14,
        includes: [
          "Visita Técnica de levantamiento en Lima (S/ 80 descontables)",
          "Diseño de distribución + Propuesta 3D del espacio a remodelar",
          "Mano de obra especializada (Drywall, Enchapes, Pintura, Gasfitería, Electricidad)",
          "Supervisión técnica con cronograma cerrado y garantía escrita",
          "Limpieza final y entrega con acta de conformidad"
        ]
      },
      // Pivot Comercial Automático para Clientes de Provincia que piden Remodelación
      remodelacion_distancia: {
        id: "remodelacion_distancia",
        name: "📦 Pack Remodelación a Distancia (Para Provincias)",
        category: "distancia",
        scopePeru: "Todo el Perú (100% Online)",
        ratePerM2: 22,
        minPrice: 650,
        deliveryDaysBase: 6,
        includes: [
          "Levantamiento guiado por videollamada con tus fotos y medidas actuales",
          "Planos de Demolición y Nueva Distribución paso a paso para tu maestro",
          "Vistas 3D del Antes y Después (Cocina, Baño, Sala o Fachada)",
          "Lista exacta de materiales y acabados (evita compras de más en tu ciudad)",
          "1 videollamada directa con tu maestro de obra local para explicarle el plano"
        ]
      }
    },
    departamentosPeru: [
      { id: "Lima", name: "Lima Metropolitana / Callao", isLima: true },
      { id: "Arequipa", name: "Arequipa", isLima: false },
      { id: "La Libertad", name: "La Libertad (Trujillo)", isLima: false },
      { id: "Piura", name: "Piura", isLima: false },
      { id: "Junin", name: "Junín (Huancayo)", isLima: false },
      { id: "Cusco", name: "Cusco", isLima: false },
      { id: "Lambayeque", name: "Lambayeque (Chiclayo)", isLima: false },
      { id: "Ica", name: "Ica", isLima: false },
      { id: "Ancash", name: "Áncash (Chimbote / Huaraz)", isLima: false },
      { id: "Cajamarca", name: "Cajamarca", isLima: false },
      { id: "Puno", name: "Puno (Juliaca)", isLima: false },
      { id: "San Martin", name: "San Martín (Tarapoto)", isLima: false },
      { id: "Tacna", name: "Tacna", isLima: false },
      { id: "Huanuco", name: "Huánuco", isLima: false },
      { id: "Ayacucho", name: "Ayacucho", isLima: false },
      { id: "Ucayali", name: "Ucayali (Pucallpa)", isLima: false },
      { id: "Loreto", name: "Loreto (Iquitos)", isLima: false },
      { id: "Apurimac", name: "Apurímac", isLima: false },
      { id: "Moquegua", name: "Moquegua", isLima: false },
      { id: "Tumbes", name: "Tumbes", isLima: false },
      { id: "Pasco", name: "Pasco", isLima: false },
      { id: "Huancavelica", name: "Huancavelica", isLima: false },
      { id: "Amazonas", name: "Amazonas", isLima: false },
      { id: "Madre de Dios", name: "Madre de Dios", isLima: false }
    ]
  },

  portfolio: [
    {
      id: "proj-1",
      title: "Vivienda Unifamiliar 120 m² (2 Pisos + Azotea)",
      location: "Huancayo, Junín (Servicio 100% Online)",
      type: "Diseño de Planos + 3D + Metrado",
      image: "assets/img/plano_3d_isometrico.jpg",
      metrics: "Ahorró S/ 4,200 en fierro y ladrillo gracias al metrado exacto",
      beforeProblem: "El cliente tenía un lote de 6x20m y su maestro quería hacer un pasadizo oscuro sin ventilación.",
      solution: "Diseñamos corte isométrico 3D con jardín interior de luz, 3 dormitorios amplios y planos completos de estructuras.",
      priceRef: "S/ 2,160 (Pagado en 3 hitos: 50% - 30% - 20%)"
    },
    {
      id: "proj-2",
      title: "Remodelación Integral de Sala-Cocina Concepto Abierto",
      location: "Surco, Lima Metropolitana",
      type: "Diseño + Ejecución de Remodelación en Lima",
      image: "assets/img/antes_despues_remodelacion.jpg",
      metrics: "Entregado en 12 días hábiles sin sobrecostos",
      beforeProblem: "Foto tomada en obra bruta con muros mal aplomados y cocina cerrada pequeña.",
      solution: "Demolición controlada de tabique no estructural, cielo raso en drywall con luz indirecta LED y barra de cuarzo.",
      priceRef: "S/ 14,500 (Con contrato y supervisión diaria)"
    },
    {
      id: "proj-3",
      title: "Metodología Blindada Planos Gio (Ciclo 4 Pasos)",
      location: "Cobertura Nacional 24 Departamentos",
      type: "Sistema Automatizado de Atención y Entrega",
      image: "assets/img/infografia_ciclo.jpg",
      metrics: "Cotización en 10 segundos y entregas 100% garantizadas",
      beforeProblem: "Los clientes temían pagar adelantos sin documento formal o no entender los planos técnicos.",
      solution: "Implementamos Orden de Servicio Digital, Visor con Marca de Agua y Vistas 3D incluidas.",
      priceRef: "Consulta Instantánea Gratis en Web"
    }
  ],

  improvisedScripts: [
    {
      id: "tpl-error-lote",
      name: "🔥 Plantilla 1: 'El Error de los S/ 10,000 en terrenos de 90 a 120 m²'",
      bestFor: "Foto o video corto mostrando un plano en pantalla o un cuarto oscuro/mal distribuido",
      targetNetwork: "TikTok + Instagram Reels + Facebook Reels",
      targetAudience: "Dueños de terrenos en todo el Perú (Provincias y Lima)",
      hookText: "🚫 NO construyas en un lote de 6x15m sin ver esto...",
      overlaySubtitle: "3 dormitorios + Tragaluces + Ahorro de material 📐🇵🇪",
      ctaBanner: "Cotiza tu plano en 10 seg en el link del perfil 👇",
      scriptSteps: [
        "⏱️ [00-03s GANCHO VISUAL]: Muestra tu foto o video improvisado con zoom lento. Texto grande arriba: 'Si tienes un terreno de 90m² o 120m², NO cometas este error al construir'.",
        "⏱️ [03-12s DOLOR DEL CLIENTE]: 'Muchos construyen solo con la idea del maestro y terminan con cuartos oscuros, baños sin ventilación y gastando 20% más en fierro y cemento innecesario.'",
        "⏱️ [12-23s SOLUCIÓN PLANOS GIO]: Muestra captura del plano 2D/3D: 'En Planos Gio diseñamos tu casa para cualquier ciudad del Perú con vistas 3D y guía de materiales para que nadie te engañe.'",
        "⏱️ [23-30s CIERRE A LA VENTA]: '¿Quieres saber cuánto cuesta el plano de tu terreno hoy mismo? Entra al Cotizador Instantáneo en el link de mi perfil o comenta PLANO.'"
      ],
      caption: "¿Tienes un terreno y no sabes cómo distribuirlo para que entre buena luz y no desperdiciar dinero en material? 🏗️🇵🇪 En Planos Gio diseñamos tus planos completos (Arquitectura, Estructuras, Eléctricas, Sanitarias y 3D) para TODO EL PERÚ y realizamos remodelaciones en LIMA. 👉 Usa nuestro Cotizador Instantáneo en el link del perfil. #PlanosPeru #ArquitecturaPeru #ConstruccionPeru #TerrenosPeru #RemodelacionLima #DiseñoDeCasas"
    },
    {
      id: "tpl-antes-despues",
      name: "🛠️ Plantilla 2: 'De Obra Improvisada a Remodelación Moderna en Lima'",
      bestFor: "Fotos o videos cortos grabados con celular en plena obra (ladrillo, polvo, drywall, enchape)",
      targetNetwork: "TikTok + Instagram Reels + YouTube Shorts",
      targetAudience: "Propietarios de departamentos y casas en Lima Metropolitana",
      hookText: "✨ Así transformamos este espacio en Lima en 12 días...",
      overlaySubtitle: "Diseño 3D + Mano de Obra Garantizada en Lima 🛠️",
      ctaBanner: "Agenda tu Visita Técnica en Lima desde la Web 👇",
      scriptSteps: [
        "⏱️ [00-03s GANCHO VISUAL]: Pon los primeros 3 segundos de tu video improvisado en obra (ruido real de obra o música en tendencia bajita). Texto: 'Mira cómo estaba este espacio antes de intervenirlo...'",
        "⏱️ [03-12s PROCESO REAL]: 'El cliente en Lima quería modernizar su sala y cocina sin que la obra se alargue meses ni le cambien el presupuesto a mitad de camino.'",
        "⏱️ [12-22s DIFERENCIADOR]: 'Primero hicimos el plano y vista 3D para que apruebe cada detalle, y luego ejecutamos drywall, iluminación LED y acabados con contrato cerrado.'",
        "⏱️ [22-30s CIERRE A LA VENTA]: 'Si estás en Lima y quieres remodelar tu depa o casa, cotiza en 10 segundos en nuestra web oficial o escríbenos al WhatsApp del perfil.'"
      ],
      caption: "No remodeles a ciegas en Lima 🛠️✨ Primero visualiza cómo quedará en 3D y conoce el presupuesto exacto antes de picar una sola pared. En Planos Gio nos encargamos del diseño en todo el Perú y la remodelación completa en Lima Metropolitana. #RemodelacionLima #DepartamentosLima #DrywallLima #DiseñoInterioresPeru #PlanosGio"
    },
    {
      id: "tpl-precios-transparentes",
      name: "💰 Plantilla 3: '¿Cuánto cuesta realmente hacer los planos de tu casa en Perú?'",
      bestFor: "Cualquier foto de plano impreso, pantalla de AutoCAD o corte 3D",
      targetNetwork: "TikTok + Facebook Reels (Alto volumen de comentarios)",
      targetAudience: "Personas comparando precios en Lima y Provincias",
      hookText: "💰 ¿Cuánto cuesta el plano de una casa de 100m² en Perú?",
      overlaySubtitle: "Un error en obra cuesta S/ 8,000. Tu plano cuesta una fracción ✅",
      ctaBanner: "Calcula el precio exacto de tus m² en nuestra Web 👇",
      scriptSteps: [
        "⏱️ [00-03s GANCHO DIRECTO]: '¿Cuánto cuesta realmente mandar a hacer los planos de una casa de 100 m² en el Perú este año? Te digo la verdad sin rodeos.'",
        "⏱️ [03-14s CONTRASTE DE VALOR]: 'Construir un piso de 100m² te cuesta más de S/ 80,000 en materiales y mano de obra. Hacerlo sin planos hace que desperdicies entre S/ 5,000 y S/ 12,000 en columnas mal puestas o cuartos que luego hay que picar.'",
        "⏱️ [14-23s OFERTA CLARA]: 'Con nuestro Paquete Construcción Segura tienes Arquitectura, Estructuras, Eléctricas, Sanitarias y Guía de Materiales por una mínima fracción, pagando en 3 partes seguras (50% - 30% - 20%).'",
        "⏱️ [23-30s LLAMADO A LA ACCIÓN]: 'Entra ahora mismo a nuestra web en el perfil, pon los metros cuadrados de tu terreno y la calculadora te dará el precio al instante.'"
      ],
      caption: "Construir sin planos sale 10 veces más caro 💸📐 Calcula gratis cuánto cuestan los planos de tu terreno según tus m² en nuestro Cotizador Web Oficial (Atendemos a los 24 departamentos del Perú). #PrecioDePlanos #ConstruccionSegura #IngenieriaCivilPeru #PlanosDeCasas #AutocadPeru"
    }
  ],

  calendar30Days: [
    { day: 1, network: "TikTok + IG Reels", pillar: "Dolor / Error Común", title: "3 errores al distribuir un lote de 6x15m en Perú", assetType: "Captura AutoCAD + Foto obra", status: "Listo para publicar", leadsExpected: "8-15 leads" },
    { day: 2, network: "Instagram + FB", pillar: "Portafolio Antes/Después", title: "Antes (Obra gris) vs Propuesta 3D Sala-Cocina en Lima", assetType: "Foto improvisada + Render", status: "Listo para publicar", leadsExpected: "5-10 leads" },
    { day: 3, network: "TikTok + Shorts", pillar: "Transparencia de Precios", title: "¿Cuánto cuesta el plano de una casa de 120m² en 2026?", assetType: "Video corto pantalla + Cotizador", status: "Programado", leadsExpected: "15-30 leads" },
    { day: 4, network: "TikTok + IG Reels", pillar: "Ahorro de Materiales", title: "Cómo evitar que te pidan 50 bolsas de cemento de más", assetType: "Foto bolsas cemento / obra", status: "Pendiente grabar", leadsExpected: "10-20 leads" },
    { day: 5, network: "Facebook + IG", pillar: "Prueba Social / Confianza", title: "Así entregamos planos a distancia en Arequipa y Huancayo", assetType: "Captura Orden de Servicio + Visor", status: "Listo para publicar", leadsExpected: "6-12 leads" },
    { day: 6, network: "TikTok + Shorts", pillar: "Remodelación Lima", title: "Cuánto cuesta remodelar un baño antiguo en Lima sin sorpresas", assetType: "Video corto baño en obra", status: "Pendiente grabar", leadsExpected: "10-18 leads" },
    { day: 7, network: "Todas las Redes", pillar: "Oferta Directa de Cierre", title: "Usa gratis nuestra Calculadora de Planos y Materiales online", assetType: "Grabación de la Web Planos Gio", status: "Listo para publicar", leadsExpected: "12-25 leads" }
  ],

  initialLeads: [
    {
      id: "PG-2026-1041",
      clientName: "Carlos Mendoza",
      phone: "987654321",
      city: "Arequipa",
      serviceId: "planos_completo",
      serviceName: "🥇 Paquete Construcción Segura (Todas las Especialidades)",
      m2: 120,
      floors: 2,
      totalPrice: 2808,
      hito1Amount: 1404,
      hito2Amount: 842,
      hito3Amount: 562,
      stage: "hito1_pagado", // lead_nuevo | hito1_pagado | hito2_revision | hito3_liquidado
      source: "TikTok (Video Lote 120m²)",
      notes: "Abonó el 50% (S/ 1,404) por Yape tras recibir Orden de Servicio PDF. Entregar Avance 1 con Marca de Agua el viernes."
    },
    {
      id: "PG-2026-1042",
      clientName: "Lucía Paredes",
      phone: "912345678",
      city: "Lima Metropolitana / Callao",
      serviceId: "remodelacion_lima",
      serviceName: "🛠️ Remodelación Integral Llave en Mano (Exclusivo Lima)",
      m2: 28,
      floors: 1,
      totalPrice: 13440,
      hito1Amount: 6720,
      hito2Amount: 4704,
      hito3Amount: 2016,
      stage: "hito2_revision",
      source: "Instagram Reels (Antes/Después Cocina)",
      notes: "Pagó Visita Técnica S/ 80 en Surco y luego firmó contrato con 50% de adelanto. Enchapes al 60%."
    },
    {
      id: "PG-2026-1043",
      clientName: "Jorge Quispe",
      phone: "945678123",
      city: "Junín (Huancayo)",
      serviceId: "remodelacion_distancia",
      serviceName: "📦 Pack Remodelación a Distancia (Para Provincias)",
      m2: 65,
      floors: 1,
      totalPrice: 1430,
      hito1Amount: 715,
      hito2Amount: 429,
      hito3Amount: 286,
      stage: "lead_nuevo",
      source: "Cotizador Web + Agente IA",
      notes: "Pidió remodelación en Huancayo; el Agente IA aplicó Pivot a Pack Remodelación a Distancia. Esperando Yape del 50%."
    }
  ]
};
