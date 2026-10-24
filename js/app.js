/* ==========================================================================
   PLANOS GIO - Motor Principal de Automatización Comercial, IA, Video y CRM
   ========================================================================== */

(function () {
  const DATA = window.PLANOS_GIO_DATA;
  let crmLeads = [];
  let calendarItems = [];
  let currentQuote = null;
  let reelAnimFrame = null;
  let reelImg = new Image();
  let watermarkImg = new Image();

  // Inicialización al cargar el DOM
  document.addEventListener("DOMContentLoaded", () => {
    loadPersistedState();
    populateSelectors();
    renderPortfolio();
    calculateInstantQuote();
    initAIChat();
    initContentFactory();
    initWatermarkStudio();
    renderCRM();
    renderCalendar();
  });

  function loadPersistedState() {
    const savedLeads = localStorage.getItem("planos_gio_crm_leads");
    if (savedLeads) {
      try {
        crmLeads = JSON.parse(savedLeads);
      } catch (e) {
        crmLeads = [...DATA.initialLeads];
      }
    } else {
      crmLeads = [...DATA.initialLeads];
    }

    const savedCal = localStorage.getItem("planos_gio_calendar");
    if (savedCal) {
      try {
        calendarItems = JSON.parse(savedCal);
      } catch (e) {
        calendarItems = [...DATA.calendar30Days];
      }
    } else {
      calendarItems = [...DATA.calendar30Days];
    }
  }

  function saveCRMState() {
    localStorage.setItem("planos_gio_crm_leads", JSON.stringify(crmLeads));
    renderCRM();
  }

  // Navegación por pestañas principales
  window.switchMainTab = function (tabId) {
    const sections = ["web-publica", "cotizador", "agente-ia", "fabrica-redes", "panel-ceo"];
    sections.forEach((sec) => {
      const el = document.getElementById("sec-" + sec);
      const btn = document.getElementById("nav-" + sec);
      if (el) {
        if (sec === tabId) {
          el.classList.remove("hidden");
        } else {
          el.classList.add("hidden");
        }
      }
      if (btn) {
        if (sec === tabId) {
          btn.className = "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 text-slate-950 shadow transition";
        } else {
          btn.className = "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800 transition";
        }
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Poblar selectores de Departamentos y Paquetes
  function populateSelectors() {
    const citySelect = document.getElementById("q-city");
    if (citySelect) {
      citySelect.innerHTML = DATA.config.departamentosPeru
        .map((d) => `<option value="${d.id}" data-lima="${d.isLima}">${d.name}</option>`)
        .join("");
    }

    const pkgSelect = document.getElementById("q-package");
    if (pkgSelect) {
      pkgSelect.innerHTML = Object.values(DATA.config.pricingPerM2)
        .map((p) => `<option value="${p.id}">${p.name} — (${p.scopePeru})</option>`)
        .join("");
      pkgSelect.value = "planos_completo";
    }
  }

  // Renderizar Galería de Portafolio + Subida de Fotos Improvisadas
  function renderPortfolio() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    grid.innerHTML = DATA.portfolio
      .map(
        (item) => `
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-amber-500/60 transition">
        <div>
          <div class="relative h-56 overflow-hidden bg-slate-950">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
            <span class="absolute top-3 left-3 bg-slate-950/90 text-amber-400 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full">
              ${item.type}
            </span>
            <span class="absolute bottom-3 right-3 bg-emerald-600/95 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
              ${item.metrics}
            </span>
          </div>
          <div class="p-5 space-y-2.5">
            <div class="text-xs font-semibold text-sky-400 flex items-center gap-1">
              <span>📍</span> ${item.location}
            </div>
            <h3 class="text-lg font-bold text-white">${item.title}</h3>
            <div class="text-xs bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5">
              <p class="text-rose-300"><b>❌ Problema inicial:</b> ${item.beforeProblem}</p>
              <p class="text-emerald-300"><b>✅ Solución Planos Gio:</b> ${item.solution}</p>
            </div>
          </div>
        </div>
        <div class="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-400">Ref: <b class="text-white">${item.priceRef}</b></span>
          <button onclick="switchMainTab('cotizador')" class="text-xs font-bold text-amber-400 hover:text-amber-300">
            Cotizar Similar →
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Permitir al usuario agregar una foto propia al portafolio en vivo
  window.addCustomPortfolioPhoto = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const title = prompt("Título del trabajo (ej. Remodelación de Baño en San Miguel o Plano Casa 90m²):", "Nuevo Proyecto Real - Planos Gio") || "Proyecto Real - Planos Gio";
      const loc = prompt("Ciudad / Distrito (ej. Los Olivos, Lima o Arequipa):", "Lima, Perú") || "Perú";
      DATA.portfolio.unshift({
        id: "proj-custom-" + Date.now(),
        title: title,
        location: loc,
        type: "Foto Real de Obra / Proyecto",
        image: e.target.result,
        metrics: "Proyecto Verificado Planos Gio",
        beforeProblem: "Espacio capturado en campo antes del desarrollo técnico de Planos Gio.",
        solution: "Distribución optimizada, planos de especialidades y control de materiales.",
        priceRef: "Cotización personalizada según m²"
      });
      renderPortfolio();
    };
    reader.readAsDataURL(file);
  };

  // ==========================================================================
  // MÓDULO 1: COTIZADOR INSTANTÁNEO + REGLA GEOGRÁFICA + ESTIMADOR MATERIALES
  // ==========================================================================
  window.calculateInstantQuote = function () {
    const cityEl = document.getElementById("q-city");
    const pkgEl = document.getElementById("q-package");
    const m2El = document.getElementById("q-m2");
    const floorsEl = document.getElementById("q-floors");
    const nameEl = document.getElementById("q-client-name");
    const phoneEl = document.getElementById("q-client-phone");

    if (!cityEl || !pkgEl || !m2El || !floorsEl) return;

    const cityId = cityEl.value;
    const cityObj = DATA.config.departamentosPeru.find((d) => d.id === cityId) || DATA.config.departamentosPeru[0];
    let pkgId = pkgEl.value;
    const m2 = Math.max(15, Math.min(1000, Number(m2El.value) || 100));
    const floors = Math.max(1, Math.min(6, Number(floorsEl.value) || 1));

    const m2Label = document.getElementById("q-m2-label");
    if (m2Label) m2Label.textContent = m2 + " m²";

    // Regla Geográfica Inteligente: Remodelación Física solo en Lima; si es Provincia, Pivot Automático
    const geoAlert = document.getElementById("q-geo-alert");
    if (!cityObj.isLima && pkgId === "remodelacion_lima") {
      pkgId = "remodelacion_distancia";
      pkgEl.value = "remodelacion_distancia";
      if (geoAlert) {
        geoAlert.classList.remove("hidden");
        geoAlert.innerHTML = `
          <b>💡 Regla Geográfica Aplicada Automáticamente (${cityObj.name}):</b> La ejecución de obra física la realizamos exclusivamente en Lima Metropolitana. Para <b>${cityObj.name}</b> hemos activado el <b>📦 Pack Remodelación a Distancia (Planos + 3D + Lista exacta de materiales)</b> para que tu maestro local lo ejecute perfecto y sin sobrecostos.
        `;
      }
    } else if (geoAlert) {
      geoAlert.classList.add("hidden");
    }

    const pkg = DATA.config.pricingPerM2[pkgId];

    // Factor de pisos: 1er piso = 100%, pisos adicionales = 65% por nivel (estándar competitivo en Perú)
    const floorMultiplier = pkg.category === "remodelacion" ? floors : 1 + (floors - 1) * 0.65;
    const effectiveArea = Math.round(m2 * floorMultiplier);
    const rawTotal = Math.round(effectiveArea * pkg.ratePerM2);
    const totalPrice = Math.max(pkg.minPrice, rawTotal);

    // Desglose Blindado 50% - 30% - 20%
    const hito1 = Math.round(totalPrice * 0.5);
    const hito2 = Math.round(totalPrice * 0.3);
    const hito3 = totalPrice - hito1 - hito2;

    // Tiempo estimado
    const estDays = pkg.deliveryDaysBase + (floors - 1) * 2 + (m2 > 150 ? 2 : 0);

    // Estimación Preliminar de Materiales ("Metrado Anti-Engaño" referencial por m2)
    const totalBuiltM2 = m2 * floors;
    const estCementoBolsas = Math.round(totalBuiltM2 * 3.8);
    const estLadrillosMillar = (totalBuiltM2 * 0.038).toFixed(1);
    const estFierroVarillas = Math.round(totalBuiltM2 * 2.4);
    const estPuntosElecSan = Math.round(totalBuiltM2 * 0.45);

    const orderId = "PG-2026-" + Math.floor(1000 + Math.random() * 9000);

    currentQuote = {
      id: orderId,
      clientName: (nameEl && nameEl.value.trim()) || "Cliente Web",
      phone: (phoneEl && phoneEl.value.trim()) || "Pendiente",
      city: cityObj.name,
      isLima: cityObj.isLima,
      serviceId: pkg.id,
      serviceName: pkg.name,
      m2: m2,
      floors: floors,
      totalPrice: totalPrice,
      hito1Amount: hito1,
      hito2Amount: hito2,
      hito3Amount: hito3,
      estDays: estDays,
      includes: pkg.includes,
      materials: {
        cemento: estCementoBolsas,
        ladrillos: estLadrillosMillar,
        fierro: estFierroVarillas,
        puntos: estPuntosElecSan
      }
    };

    // Actualizar UI del Cotizador
    document.getElementById("res-pkg-name").textContent = pkg.name;
    document.getElementById("res-scope-badge").textContent = `${cityObj.name} • ${m2} m² (${floors} ${floors === 1 ? "nivel" : "niveles"})`;
    document.getElementById("res-total-price").textContent = "S/ " + totalPrice.toLocaleString("es-PE");
    document.getElementById("res-days").textContent = estDays + " días hábiles";

    document.getElementById("res-h1").textContent = "S/ " + hito1.toLocaleString("es-PE");
    document.getElementById("res-h2").textContent = "S/ " + hito2.toLocaleString("es-PE");
    document.getElementById("res-h3").textContent = "S/ " + hito3.toLocaleString("es-PE");

    const incList = document.getElementById("res-includes-list");
    if (incList) {
      incList.innerHTML = pkg.includes
        .map((inc) => `<li class="flex items-start gap-2 text-xs text-slate-200"><span class="text-emerald-400 font-bold">✔</span> <span>${inc}</span></li>`)
        .join("");
    }

    document.getElementById("mat-cemento").textContent = `~${estCementoBolsas} bolsas`;
    document.getElementById("mat-ladrillo").textContent = `~${estLadrillosMillar} millares`;
    document.getElementById("mat-fierro").textContent = `~${estFierroVarillas} varillas`;
    document.getElementById("mat-puntos").textContent = `~${estPuntosElecSan} salidas`;
  };

  // Guardar Cotización en CRM, Generar Contrato PDF y pasar al Agente IA
  window.confirmAndLockQuote = function (actionType) {
    calculateInstantQuote();
    const nameInput = document.getElementById("q-client-name");
    const phoneInput = document.getElementById("q-client-phone");

    const clientName = (nameInput && nameInput.value.trim()) || "Cliente Interesado";
    const clientPhone = (phoneInput && phoneInput.value.trim()) || "Por confirmar";

    currentQuote.clientName = clientName;
    currentQuote.phone = clientPhone;

    // Registrar en CRM automáticamente
    const newLead = {
      id: currentQuote.id,
      clientName: clientName,
      phone: clientPhone,
      city: currentQuote.city,
      serviceId: currentQuote.serviceId,
      serviceName: currentQuote.serviceName,
      m2: currentQuote.m2,
      floors: currentQuote.floors,
      totalPrice: currentQuote.totalPrice,
      hito1Amount: currentQuote.hito1Amount,
      hito2Amount: currentQuote.hito2Amount,
      hito3Amount: currentQuote.hito3Amount,
      stage: "lead_nuevo",
      source: "Cotizador Instantáneo Web",
      notes: `Cotizó ${currentQuote.m2}m² (${currentQuote.floors} pisos) en ${currentQuote.city}. Pendiente abono del 50% (S/ ${currentQuote.hito1Amount}) o Reserva S/ 80.`
    };

    crmLeads.unshift(newLead);
    saveCRMState();
    populateContractFromLead(newLead.id);

    if (actionType === "ia") {
      switchMainTab("agente-ia");
      appendChatMessage(
        "user",
        `Hola Gio IA, acabo de cotizar en la web: Soy ${clientName} de ${currentQuote.city}, quiero el ${currentQuote.serviceName} para ${currentQuote.m2} m² (${currentQuote.floors} pisos). Código ${currentQuote.id}. ¿Cómo aseguramos el inicio?`
      );
      setTimeout(() => {
        const reply = generateAIReply(
          `Soy ${clientName} de ${currentQuote.city}, quiero ${currentQuote.serviceName} para ${currentQuote.m2}m2 y ${currentQuote.floors} pisos`,
          currentQuote
        );
        appendChatMessage("ai", reply);
      }, 450);
    } else if (actionType === "contract") {
      switchMainTab("panel-ceo");
      const contractEl = document.getElementById("printable-contract");
      if (contractEl) contractEl.scrollIntoView({ behavior: "smooth" });
    } else if (actionType === "whatsapp") {
      const msg = encodeURIComponent(
        `Hola *Planos Gio — GIO, GRUPO INGENIEROS S.A.C. (RUC 20610282963)* 🏗️, generé mi Orden de Pre-Cotización *#${currentQuote.id}* en la web:\n` +
          `👤 Cliente: ${clientName}\n` +
          `📍 Ciudad: ${currentQuote.city}\n` +
          `📐 Servicio: ${currentQuote.serviceName}\n` +
          `📏 Área: ${currentQuote.m2} m² (${currentQuote.floors} niveles)\n` +
          `💰 Inversión Total: S/ ${currentQuote.totalPrice}\n` +
          `🔒 Adelanto 50% para iniciar: *S/ ${currentQuote.hito1Amount}* (vía Yape 993 952 844)\n\n` +
          `Quiero recibir mi Orden de Servicio formal y confirmar mi abono para iniciar.`
      );
      window.open(`https://wa.me/${DATA.config.whatsappNumber}?text=${msg}`, "_blank");
    }
  };

  // ==========================================================================
  // MÓDULO 2: AGENTE DE VENTAS IA 24/7 CON REGLAS DE NEGOCIO Y CIERRE
  // ==========================================================================
  function initAIChat() {
    const chatBox = document.getElementById("ai-chat-messages");
    if (!chatBox) return;
    chatBox.innerHTML = "";
    appendChatMessage(
      "ai",
      `¡Hola! Soy **Gio IA**, el Asesor Arquitectónico y Comercial de **Planos Gio — GIO, GRUPO INGENIEROS S.A.C. (RUC 20610282963)** 🏗️🇵🇪.\n\nEstoy programado con todas nuestras políticas oficiales:\n- 🏛️ **Empresa 100% Formal (Activo y Habido en SUNAT):** Emitimos **Factura y Boleta Electrónica**, con domicilio fiscal en **Av. Arequipa 1421 Dpto. 1306, Santa Beatriz, Lima** (Partida SUNARP N° 15146750).\n- 📐 **Diseño de Planos (2D, Especialidades y 3D):** Atendemos en **TODO EL PERÚ** 100% online.\n- 🛠️ **Remodelación y Ejecución de Obra:** Exclusivo en **Lima Metropolitana y Callao** (y tenemos el *Pack Remodelación a Distancia* si estás en provincia).\n- 🔒 **Garantía de Pago Seguro:** Trabajamos con Orden de Servicio formal en 3 hitos (**50% inicio - 30% avance en visor protegido - 20% contra-entrega**) al **Yape Oficial 993 952 844**.\n\nCuéntame: **¿En qué ciudad estás, cuántos m² tiene tu terreno o espacio y qué deseas realizar?**`
    );
  }

  function appendChatMessage(sender, text) {
    const chatBox = document.getElementById("ai-chat-messages");
    if (!chatBox) return;

    const div = document.createElement("div");
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\n/g, "<br/>");

    if (sender === "ai") {
      div.className = "flex items-start gap-3";
      div.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow">
          IA
        </div>
        <div class="bg-slate-800/90 border border-slate-700 text-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-2xl shadow">
          ${formatted}
        </div>
      `;
    } else {
      div.className = "flex items-start justify-end gap-3";
      div.innerHTML = `
        <div class="bg-amber-500 text-slate-950 font-medium rounded-2xl rounded-tr-none px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-xl shadow">
          ${formatted}
        </div>
      `;
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  window.sendUserChatMessage = async function () {
    const input = document.getElementById("ai-chat-input");
    if (!input || !input.value.trim()) return;
    const userText = input.value.trim();
    input.value = "";
    appendChatMessage("user", userText);

    const apiKeyEl = document.getElementById("gemini-api-key");
    const apiKey = apiKeyEl ? apiKeyEl.value.trim() : "";

    if (apiKey) {
      // Si el usuario colocó su API Key gratuita de Google Gemini, usamos Gemini 2.5 Flash con el System Prompt comercial
      try {
        const systemPrompt = `Eres Gio IA, el cerrador de ventas estrella de 'Planos Gio' — marca oficial de GIO, GRUPO INGENIEROS S.A.C. (RUC 20610282963, Partida Registral SUNARP 15146750, Domicilio Fiscal: Av. Arequipa 1421 Dpto. 1306, Urb. Santa Beatriz, Lima; Gerente General: Alonzo Adrian Angulo Chirinos; Emisor Electrónico SUNAT de Factura y Boleta; Yape y WhatsApp Oficial: 993 952 844).
REGLAS ESTRICTAS DE NEGOCIO:
1. DISEÑO DE PLANOS (Arquitectura, Estructuras, Eléctricas, Sanitarias, Vistas 3D): Cobertura en TODO EL PERÚ (Lima y las 24 regiones). Tarifas base: Paquete Esencial S/10 por m2 (mín S/450), Paquete Construcción Segura Completo S/18 por m2 (mín S/850), Paquete Premium 3D + Metrado Anti-Engaño S/24 por m2 (mín S/1200).
2. REMODELACIÓN FÍSICA (Obra civil, drywall, enchapes, cocina, baño): EXCLUSIVO EN LIMA METROPOLITANA Y CALLAO. Costo referencial S/480 por m2 intervenido. Si el cliente está en provincia y pide remodelación, hazle un PIVOT COMERCIAL inmediato ofreciéndole el 'Pack Remodelación a Distancia' (S/22 por m2, mín S/650) que incluye planos de remodelación, render 3D y lista exacta de materiales para que su maestro local lo construya sin engañarlo.
3. POLÍTICA ANTI-NO-PAGO (CERO TRABAJO GRATIS): Jamás hacemos bosquejos ni visitas gratis. La pre-cotización en web es gratis, pero para iniciar un plano se firma la Orden de Servicio Digital con el esquema 50% de adelanto al iniciar (Yape Oficial 993 952 844), 30% al aprobar la distribución (se muestra con marca de agua protegida) y 20% contra-entrega antes de liberar el AutoCAD (.DWG) y PDF de alta resolución. Si quiere Visita Técnica en Lima o Reserva Inicial de Diagnóstico, cuesta S/80 descontables al 100% del proyecto.
4. ESTILO: Persuasivo, empático, claro, usa Soles (S/), destaca nuestra formalidad empresarial (RUC 20610282963 - Factura/Boleta Electrónica), y SIEMPRE termina con una pregunta de cierre indicando el Yape 993 952 844.`;

        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: userText }] }]
            })
          }
        );
        const data = await resp.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          appendChatMessage("ai", candidateText);
          return;
        }
      } catch (err) {
        console.warn("Fallback al motor comercial local:", err);
      }
    }

    // Motor Comercial Autónomo Local (100% Gratis, Instantáneo y sin API Key requerida)
    setTimeout(() => {
      const reply = generateAIReply(userText, null);
      appendChatMessage("ai", reply);
    }, 350);
  };

  function generateAIReply(userText, quoteObj) {
    const lower = userText.toLowerCase();

    // Si viene directamente desde el botón del cotizador con quoteObj
    if (quoteObj) {
      const limaMsg = quoteObj.isLima
        ? `Como estás en **${quoteObj.city}**, también tienes disponible nuestra **Visita Técnica Presencial por S/ 80** (100% descontables de tu presupuesto total).`
        : `Atendemos **${quoteObj.city}** de forma 100% digital mediante videollamada por Google Meet/Zoom y envío de planos listos para plotear.`;

      return (
        `¡Excelente decisión, **${quoteObj.clientName}**! Ya registré tu Orden **#${quoteObj.id}** en nuestro sistema.\n\n` +
        `📋 **Resumen Oficial de tu Cotización:**\n` +
        `• **Servicio:** ${quoteObj.serviceName}\n` +
        `• **Ubicación y Área:** ${quoteObj.city} — ${quoteObj.m2} m² (${quoteObj.floors} nivel/es)\n` +
        `• **Inversión Total Cerrada:** **S/ ${quoteObj.totalPrice.toLocaleString("es-PE")}**\n` +
        `• **Bono Diferenciador Incluido:** Estimación de Materiales Anti-Engaño (~${quoteObj.materials.cemento} bolsas de cemento y ~${quoteObj.materials.ladrillos} millares de ladrillo).\n\n` +
        `🔒 **¿Cómo aseguramos tu servicio hoy mismo con GIO, GRUPO INGENIEROS S.A.C. (RUC 20610282963)?**\n` +
        `1️⃣ **Hito 1 (50% de Inicio = S/ ${quoteObj.hito1Amount.toLocaleString("es-PE")}):** Se emite tu Orden de Servicio formal + Boleta/Factura Electrónica y empezamos la distribución.\n` +
        `2️⃣ **Hito 2 (30% = S/ ${quoteObj.hito2Amount.toLocaleString("es-PE")}):** Al aprobar la distribución en nuestro Visor Protegido.\n` +
        `3️⃣ **Hito 3 (20% = S/ ${quoteObj.hito3Amount.toLocaleString("es-PE")}):** Contra-entrega final para liberar los PDFs en Alta Resolución y editables AutoCAD.\n\n` +
        `${limaMsg}\n\n` +
        `👉 **Puedes realizar el abono del 50% (S/ ${quoteObj.hito1Amount.toLocaleString("es-PE")}) o tu Reserva de Diagnóstico (S/ 80 descontables) al Yape Oficial: 993 952 844 y enviarnos captura al WhatsApp 993 952 844. ¿Emitimos tu Orden de Servicio ahora?**`
      );
    }

    // 1. Manejo de Objeciones: "Gratis", "Bosquejo antes de pagar", "Pago todo al final", "Desconfianza"
    if (
      lower.includes("gratis") ||
      lower.includes("sin adelanto") ||
      lower.includes("pago al final") ||
      lower.includes("bosquejo") ||
      lower.includes("dibujo previo") ||
      lower.includes("desconfi")
    ) {
      return (
        `Te entiendo perfectamente 🤝. En el Perú muchos clientes han tenido malas experiencias con informales, y por eso somos una empresa constituida (**GIO, GRUPO INGENIEROS S.A.C. — RUC 20610282963**, Partida SUNARP N° **15146750**, con sede en **Av. Arequipa 1421 Dpto. 1306, Lima**):\n\n` +
        `1. **Respaldo Legal y Comprobante SUNAT:** Emitimos **Orden de Servicio Oficial + Boleta o Factura Electrónica** desde el primer sol.\n` +
        `2. **¿Por qué no hacemos bosquejos gratis?** Porque un plano seguro requiere horas de cálculo real de arquitectura e ingeniería para que no pierdas miles de soles en obra.\n` +
        `3. **Opción de Micro-Reserva Segura (Solo S/ 80):** Si aún no deseas abonar el 50% del paquete, puedes iniciar con nuestra **Reserva de Diagnóstico y Esquema Preliminar por solo S/ 80** a nuestro **Yape Oficial 993 952 844**. ¡Esos S/ 80 se descuentan al 100% del precio de tus planos!\n\n` +
        `👉 **¿Te parece bien que emitamos tu Orden de Reserva por S/ 80 al Yape 993 952 844 para tener nuestra primera sesión técnica hoy mismo?**`
      );
    }

    // 2. Detectar ubicación (Provincias vs Lima) y metraje
    const m2Match = lower.match(/(\d{2,3})\s*(m2|m²|metros)/);
    const detectedM2 = m2Match ? parseInt(m2Match[1], 10) : 100;

    const provincesKeywords = [
      "arequipa", "trujillo", "piura", "huancayo", "cusco", "cuzco", "chiclayo",
      "ica", "chimbote", "huaraz", "cajamarca", "puno", "juliaca", "tarapoto",
      "tacna", "huanuco", "ayacucho", "pucallpa", "iquitos", "tumbes", "moquegua", "provincia"
    ];
    const matchedProvince = provincesKeywords.find((prov) => lower.includes(prov));
    const isRemodelRequest = lower.includes("remodela") || lower.includes("cocina") || lower.includes("baño") || lower.includes("drywall") || lower.includes("ampliar");

    // Caso A: Pide Remodelación pero está en Provincia -> PIVOT COMERCIAL AUTOMÁTICO
    if (matchedProvince && isRemodelRequest) {
      const distPrice = Math.max(650, detectedM2 * 22);
      const distH1 = Math.round(distPrice * 0.5);
      return (
        `¡Qué gran proyecto tienes en **${matchedProvince.toUpperCase()}**! 🇵🇪\n\n` +
        `Te comento nuestra regla de cobertura con total transparencia:\n` +
        `• La **ejecución de mano de obra física** la realizamos exclusivamente en **Lima Metropolitana**.\n` +
        `• **¡PERO tenemos la solución exacta para ti en ${matchedProvince.toUpperCase()}!** Con nuestro **📦 Pack Remodelación a Distancia**, diseñamos todo tu proyecto 100% online para que tu maestro de obra local lo construya sin errores ni desperdicio de materiales.\n\n` +
        `📐 **Para un área aprox. de ${detectedM2} m², tu Pack Remodelación a Distancia incluye:**\n` +
        `✔ Planos de demolición y nueva distribución con medidas exactas.\n` +
        `✔ **Vistas 3D del Antes y Después** para que veas cómo quedará.\n` +
        `✔ **Lista exacta de materiales y enchapes** (así ningún maestro te pide material de más).\n` +
        `✔ 1 videollamada directa con tu maestro para explicarle los planos.\n\n` +
        `💰 **Inversión Total:** **S/ ${distPrice.toLocaleString("es-PE")}** (Inicias hoy con el **50% = S/ ${distH1.toLocaleString("es-PE")}** o separas diagnóstico con **S/ 80 descontables**).\n\n` +
        `👉 **¿Generamos tu Orden de Servicio para ${matchedProvince.toUpperCase()} ahora mismo?**`
      );
    }

    // Caso B: Pide Remodelación en Lima
    if (isRemodelRequest) {
      const remArea = m2Match ? detectedM2 : 30;
      const remPrice = Math.max(2800, remArea * 480);
      return (
        `¡Excelente! Para **Lima Metropolitana y Callao** realizamos el servicio completo de **Remodelación Llave en Mano (Diseño 3D + Ejecución de Obra con Garantía)** 🛠️✨.\n\n` +
        `📊 **Estimado referencial para ~${remArea} m² intervenidos:**\n` +
        `• **Inversión referencial:** Desde **S/ ${remPrice.toLocaleString("es-PE")}** (incluye diseño 3D previo, mano de obra calificada y supervisión).\n` +
        `• **Paso 1 Obligatorio (Candado de Calidad):** Agendamos una **Visita Técnica de Levantamiento + Propuesta de Presupuesto en Lima** por **S/ 80** (vía Yape/Plin/BCP), monto que se **descuenta al 100%** al contratar la remodelación.\n\n` +
        `👉 **¿En qué distrito de Lima te encuentras y qué día te acomoda mejor para programar la Visita Técnica?**`
      );
    }

    // Caso C: Pide Diseño de Planos (Todo el Perú)
    const fullPrice = Math.max(850, detectedM2 * 18);
    const fullH1 = Math.round(fullPrice * 0.5);
    const locationText = matchedProvince ? matchedProvince.toUpperCase() : "tu ciudad (atendemos en TODO EL PERÚ)";

    return (
      `¡Con gusto te ayudo con los planos para **${locationText}**! 📐🇵🇪\n\n` +
      `Para un área referencial de **${detectedM2} m² (1 nivel)**, estas son nuestras 3 opciones oficiales:\n` +
      `1. 🥉 **Paquete Esencial (Solo Arquitectura 2D):** **S/ ${Math.max(450, detectedM2 * 10).toLocaleString("es-PE")}**\n` +
      `2. 🥇 **Paquete Construcción Segura (Arquitectura + Estructuras + Eléctricas + Sanitarias + Guía de Materiales Anti-Engaño):** **S/ ${fullPrice.toLocaleString("es-PE")}** *(El más elegido)*\n` +
      `3. 💎 **Paquete Premium Visual 360° (Todo lo anterior + Vistas 3D Realistas):** **S/ ${Math.max(1200, detectedM2 * 24).toLocaleString("es-PE")}**\n\n` +
      `🔒 **Modalidad de Pago Seguro (3 Hitos):**\n` +
      `• **50% al iniciar** (S/ ${fullH1.toLocaleString("es-PE")} en el Paquete Construcción Segura) con Orden de Servicio formal.\n` +
      `• **30% al aprobar la distribución** en nuestro Visor Web con Marca de Agua.\n` +
      `• **20% contra-entrega final** para liberar tus PDFs HD y archivos AutoCAD (.DWG).\n\n` +
      `👉 **¿Cuál de los 3 paquetes se ajusta mejor a lo que buscas para generar tu Orden de Servicio?**`
    );
  }

  // Simulador en 1 clic de escenarios reales de ventas
  window.simulateAIScenario = function (scenarioKey) {
    let promptText = "";
    if (scenarioKey === "arequipa_planos") {
      promptText = "Hola, soy de Arequipa y tengo un terreno de 120 m2. Quiero hacer los planos completos de mi casa, ¿cómo trabajan a distancia y cuánto cuesta?";
    } else if (scenarioKey === "lima_remodelacion") {
      promptText = "Hola, estoy en Surco (Lima) y quiero remodelar mi cocina y baño de 35 m2 en total. ¿Van a domicilio?";
    } else if (scenarioKey === "trujillo_pivot") {
      promptText = "Hola, vivo en Trujillo y quiero que vengan a remodelar mi sala con drywall y luces LED de 50 m2.";
    } else if (scenarioKey === "objecion_gratis") {
      promptText = "Me interesa el plano de 100 m2, pero ¿me pueden hacer un bosquejo gratis primero y les pago todo al final cuando me entreguen?";
    }

    appendChatMessage("user", promptText);
    setTimeout(() => {
      const reply = generateAIReply(promptText, null);
      appendChatMessage("ai", reply);
    }, 350);
  };

  // ==========================================================================
  // MÓDULO 3: FÁBRICA DE REDES SOCIALES + ESTUDIO DE VIDEO 9:16 EN CANVAS
  // ==========================================================================
  function initContentFactory() {
    const tplSelect = document.getElementById("cf-template");
    if (tplSelect) {
      tplSelect.innerHTML = DATA.improvisedScripts
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join("");
    }
    reelImg.src = "assets/img/antes_despues_remodelacion.jpg";
    reelImg.onload = () => {
      loadContentTemplate();
      startReelCanvasAnimation();
    };
  }

  window.loadContentTemplate = function () {
    const tplSelect = document.getElementById("cf-template");
    if (!tplSelect) return;
    const tpl = DATA.improvisedScripts.find((t) => t.id === tplSelect.value) || DATA.improvisedScripts[0];

    document.getElementById("cf-hook").value = tpl.hookText;
    document.getElementById("cf-sub").value = tpl.overlaySubtitle;
    document.getElementById("cf-cta").value = tpl.ctaBanner;
    document.getElementById("cf-caption").value = tpl.caption;

    const stepsContainer = document.getElementById("cf-script-steps");
    if (stepsContainer) {
      stepsContainer.innerHTML = tpl.scriptSteps
        .map((s) => `<div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">${s}</div>`)
        .join("");
    }
  };

  window.uploadImprovisedMediaForReel = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      reelImg = new Image();
      reelImg.onload = () => {
        startReelCanvasAnimation();
      };
      reelImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  window.switchPresetReelImage = function (imgPath) {
    reelImg = new Image();
    reelImg.onload = () => {
      startReelCanvasAnimation();
    };
    reelImg.src = imgPath;
  };

  function startReelCanvasAnimation() {
    const canvas = document.getElementById("reel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (reelAnimFrame) cancelAnimationFrame(reelAnimFrame);

    let tick = 0;
    function renderFrame() {
      tick += 0.008;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      // Efecto Ken Burns (Zoom & Pan suave para darle vida a cualquier foto improvisada)
      if (reelImg && reelImg.complete && reelImg.naturalWidth > 0) {
        const scale = 1.08 + Math.sin(tick) * 0.06;
        const imgAspect = reelImg.naturalWidth / reelImg.naturalHeight;
        const canvasAspect = w / h;
        let drawW, drawH;
        if (imgAspect > canvasAspect) {
          drawH = h * scale;
          drawW = drawH * imgAspect;
        } else {
          drawW = w * scale;
          drawH = drawW / imgAspect;
        }
        const offsetX = (w - drawW) / 2 + Math.cos(tick * 0.8) * 14;
        const offsetY = (h - drawH) / 2;
        ctx.drawImage(reelImg, offsetX, offsetY, drawW, drawH);
      }

      // Gradientes superior e inferior para legibilidad tipo TikTok/Reels
      const topGrad = ctx.createLinearGradient(0, 0, 0, 170);
      topGrad.addColorStop(0, "rgba(15,23,42,0.92)");
      topGrad.addColorStop(1, "rgba(15,23,42,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, 170);

      const botGrad = ctx.createLinearGradient(0, h - 220, 0, h);
      botGrad.addColorStop(0, "rgba(15,23,42,0)");
      botGrad.addColorStop(1, "rgba(15,23,42,0.96)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, h - 220, w, 220);

      // Badge superior de Marca
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.roundRect(20, 22, w - 40, 34, 8);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🏗️ PLANOS GIO • PLANOS (PERÚ) & REMODELACIÓN (LIMA)", w / 2, 44);

      // Gancho Viral Principal (Caja blanca/oscura arriba)
      const hookText = (document.getElementById("cf-hook") && document.getElementById("cf-hook").value) || "🚫 NO construyas sin ver esto...";
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(18, 68, w - 36, 78, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      wrapCanvasText(ctx, hookText, w / 2, 98, w - 56, 22);

      // Subtítulo Dinámico en el tercio inferior
      const subText = (document.getElementById("cf-sub") && document.getElementById("cf-sub").value) || "Planos 2D/3D + Metrado Anti-Engaño";
      ctx.fillStyle = "rgba(16, 185, 129, 0.92)";
      ctx.beginPath();
      ctx.roundRect(20, h - 148, w - 40, 48, 10);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      wrapCanvasText(ctx, subText, w / 2, h - 120, w - 54, 18);

      // CTA Inferior con pulso
      const ctaText = (document.getElementById("cf-cta") && document.getElementById("cf-cta").value) || "Cotiza en 10 seg en el link del perfil 👇";
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.roundRect(20, h - 86, w - 40, 52, 12);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 13px sans-serif";
      wrapCanvasText(ctx, ctaText, w / 2, h - 55, w - 54, 18);

      // Barra de progreso de retención TikTok
      const progress = ((tick * 25) % 100) / 100;
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(0, h - 6, w * progress, 6);

      reelAnimFrame = requestAnimationFrame(renderFrame);
    }

    renderFrame();
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let lines = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    const startY = lines.length > 1 ? y - (lineHeight / 2) * (lines.length - 1) : y;
    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), x, startY + i * lineHeight);
    });
  }

  // Exportar / Grabar el Video Vertical 9:16 real (.webm) para subir a TikTok/Reels
  window.recordAndDownloadReelVideo = function () {
    const canvas = document.getElementById("reel-canvas");
    const statusEl = document.getElementById("reel-record-status");
    if (!canvas || typeof canvas.captureStream !== "function") {
      alert("Tu navegador permite descargar la captura directamente.");
      return;
    }

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    if (statusEl) {
      statusEl.textContent = "🔴 Grabando clip de 5 segundos en formato TikTok 9:16...";
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TikTok_Reel_Planos_Gio_${Date.now()}.webm`;
      a.click();
      if (statusEl) {
        statusEl.textContent = "✅ ¡Video vertical descargado! Listo para subir a TikTok Studio o Meta Business Suite.";
      }
    };

    recorder.start();
    setTimeout(() => {
      recorder.stop();
    }, 5000);
  };

  window.copyCaptionToClipboard = function () {
    const cap = document.getElementById("cf-caption");
    if (!cap) return;
    navigator.clipboard.writeText(cap.value);
    const btn = document.getElementById("btn-copy-caption");
    if (btn) {
      const old = btn.textContent;
      btn.textContent = "✅ ¡Copiado al portapapeles!";
      setTimeout(() => (btn.textContent = old), 2000);
    }
  };

  // Renderizar Calendario de 30 Días
  function renderCalendar() {
    const tbody = document.getElementById("calendar-tbody");
    if (!tbody) return;
    tbody.innerHTML = calendarItems
      .map(
        (c, idx) => `
      <tr class="border-b border-slate-800 hover:bg-slate-900/60">
        <td class="py-2.5 px-3 font-bold text-amber-400">Día ${c.day}</td>
        <td class="py-2.5 px-3 text-slate-200">${c.network}</td>
        <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-sky-300 text-xs">${c.pillar}</span></td>
        <td class="py-2.5 px-3 font-medium text-white">${c.title}</td>
        <td class="py-2.5 px-3 text-slate-400">${c.assetType}</td>
        <td class="py-2.5 px-3">
          <select onchange="updateCalendarStatus(${idx}, this.value)" class="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-semibold">
            <option value="Listo para publicar" ${c.status === "Listo para publicar" ? "selected" : ""}>Listo para publicar</option>
            <option value="Programado" ${c.status === "Programado" ? "selected" : ""}>Programado ✅</option>
            <option value="Publicado" ${c.status === "Publicado" ? "selected" : ""}>Publicado 🚀</option>
            <option value="Pendiente grabar" ${c.status === "Pendiente grabar" ? "selected" : ""}>Pendiente grabar</option>
          </select>
        </td>
      </tr>
    `
      )
      .join("");
  }

  window.updateCalendarStatus = function (idx, newStatus) {
    if (calendarItems[idx]) {
      calendarItems[idx].status = newStatus;
      localStorage.setItem("planos_gio_calendar", JSON.stringify(calendarItems));
    }
  };

  // ==========================================================================
  // MÓDULO 4: CENTRO CEO — BLINDADOR CON MARCA DE AGUA + CRM + CONTRATOS PDF
  // ==========================================================================
  function initWatermarkStudio() {
    watermarkImg.src = "assets/img/plano_3d_isometrico.jpg";
    watermarkImg.onload = () => {
      renderWatermarkedBlueprint();
    };
  }

  window.uploadBlueprintForWatermark = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      watermarkImg = new Image();
      watermarkImg.onload = () => {
        renderWatermarkedBlueprint();
      };
      watermarkImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  window.renderWatermarkedBlueprint = function () {
    const canvas = document.getElementById("watermark-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const clientText = (document.getElementById("wm-client") && document.getElementById("wm-client").value) || "CLIENTE: CARLOS MENDOZA (#PG-2026-1041)";
    const statusText = (document.getElementById("wm-status") && document.getElementById("wm-status").value) || "AVANCE HITO 1 (50% ABONADO) - PROHIBIDA SU EJECUCIÓN";

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    if (watermarkImg && watermarkImg.complete && watermarkImg.naturalWidth > 0) {
      ctx.drawImage(watermarkImg, 0, 0, w, h);
    }

    // Capa semi-transparente de seguridad
    ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
    ctx.fillRect(0, 0, w, h);

    // Patrón diagonal repetitivo imposible de recortar sin dañar el plano
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = "center";

    for (let y = -h; y < h; y += 90) {
      for (let x = -w; x < w; x += 360) {
        ctx.fillStyle = "rgba(245, 158, 11, 0.34)";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText("🔒 GIO, GRUPO INGENIEROS S.A.C. (RUC 20610282963)", x, y);
        ctx.fillStyle = "rgba(255, 255, 255, 0.30)";
        ctx.font = "bold 12px monospace";
        ctx.fillText(clientText, x, y + 20);
      }
    }
    ctx.restore();

    // Membrete de Candado Legal inferior
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.fillRect(0, h - 54, w, 54);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, h - 54, w, 54);

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`🔒 GIO, GRUPO INGENIEROS S.A.C. (RUC 20610282963) — ${clientText}`, 16, h - 30);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${statusText} • Los archivos HD y AutoCAD (.DWG) se liberan al liquidar el Hito 3 (20% final).`, 16, h - 12);
  };

  window.downloadWatermarkedImage = function () {
    const canvas = document.getElementById("watermark-canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Plano_Protegido_Planos_Gio_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Renderizar CRM y Métricas Financieras
  function renderCRM() {
    const tbody = document.getElementById("crm-tbody");
    if (!tbody) return;

    let totalPipeline = 0;
    let totalCollected = 0;

    tbody.innerHTML = crmLeads
      .map((lead, idx) => {
        totalPipeline += lead.totalPrice;
        if (lead.stage === "hito1_pagado") totalCollected += lead.hito1Amount;
        else if (lead.stage === "hito2_revision") totalCollected += lead.hito1Amount + lead.hito2Amount;
        else if (lead.stage === "hito3_liquidado") totalCollected += lead.totalPrice;

        return `
        <tr class="border-b border-slate-800 hover:bg-slate-900/60">
          <td class="py-3 px-3 font-mono text-xs font-bold text-amber-400">${lead.id}</td>
          <td class="py-3 px-3">
            <div class="font-bold text-white text-xs sm:text-sm">${lead.clientName}</div>
            <div class="text-xs text-slate-400">📍 ${lead.city} • 📱 ${lead.phone}</div>
          </td>
          <td class="py-3 px-3">
            <div class="text-xs font-semibold text-sky-300">${lead.serviceName}</div>
            <div class="text-xs text-slate-400">${lead.m2} m² (${lead.floors} nivel/es) • Vía: ${lead.source}</div>
          </td>
          <td class="py-3 px-3 text-xs">
            <div class="font-bold text-white">Total: S/ ${lead.totalPrice.toLocaleString("es-PE")}</div>
            <div class="text-emerald-400">50%: S/ ${lead.hito1Amount} | 30%: S/ ${lead.hito2Amount} | 20%: S/ ${lead.hito3Amount}</div>
          </td>
          <td class="py-3 px-3">
            <select onchange="updateLeadStage(${idx}, this.value)" class="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-300">
              <option value="lead_nuevo" ${lead.stage === "lead_nuevo" ? "selected" : ""}>🟡 1. Lead Captado (Sin Pago)</option>
              <option value="hito1_pagado" ${lead.stage === "hito1_pagado" ? "selected" : ""}>🟢 2. Adelanto 50% Pagado (En Diseño)</option>
              <option value="hito2_revision" ${lead.stage === "hito2_revision" ? "selected" : ""}>🔵 3. Hito 2 (80% Pagado - Marca Agua)</option>
              <option value="hito3_liquidado" ${lead.stage === "hito3_liquidado" ? "selected" : ""}>🏆 4. 100% Liquidado (CAD Entregado)</option>
            </select>
          </td>
          <td class="py-3 px-3 space-x-1">
            <button onclick="populateContractFromLead('${lead.id}')" class="px-2.5 py-1.5 rounded bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
              📄 Orden PDF
            </button>
          </td>
        </tr>
      `;
      })
      .join("");

    const kpiPipeline = document.getElementById("kpi-pipeline");
    const kpiCollected = document.getElementById("kpi-collected");
    const kpiCount = document.getElementById("kpi-count");
    if (kpiPipeline) kpiPipeline.textContent = "S/ " + totalPipeline.toLocaleString("es-PE");
    if (kpiCollected) kpiCollected.textContent = "S/ " + totalCollected.toLocaleString("es-PE");
    if (kpiCount) kpiCount.textContent = crmLeads.length + " proyectos";
  }

  window.updateLeadStage = function (idx, newStage) {
    if (crmLeads[idx]) {
      crmLeads[idx].stage = newStage;
      saveCRMState();
    }
  };

  window.populateContractFromLead = function (leadId) {
    const lead = crmLeads.find((l) => l.id === leadId) || crmLeads[0];
    if (!lead) return;

    document.getElementById("ct-order-id").textContent = lead.id;
    document.getElementById("ct-date").textContent = new Date().toLocaleDateString("es-PE");
    document.getElementById("ct-client-name").textContent = lead.clientName;
    document.getElementById("ct-client-city").textContent = lead.city;
    document.getElementById("ct-service-name").textContent = lead.serviceName;
    document.getElementById("ct-area").textContent = `${lead.m2} m² (${lead.floors} nivel/es)`;
    document.getElementById("ct-total").textContent = "S/ " + lead.totalPrice.toLocaleString("es-PE");
    document.getElementById("ct-h1").textContent = "S/ " + lead.hito1Amount.toLocaleString("es-PE");
    document.getElementById("ct-h2").textContent = "S/ " + lead.hito2Amount.toLocaleString("es-PE");
    document.getElementById("ct-h3").textContent = "S/ " + lead.hito3Amount.toLocaleString("es-PE");

    // Actualizar también el blindador con el nombre de este cliente
    const wmClientInput = document.getElementById("wm-client");
    if (wmClientInput) {
      wmClientInput.value = `CLIENTE: ${lead.clientName.toUpperCase()} (${lead.id})`;
      renderWatermarkedBlueprint();
    }
  };
})();
