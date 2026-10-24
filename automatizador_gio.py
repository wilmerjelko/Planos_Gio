#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
PLANOS GIO — AUTOMATIZADOR CENTRAL DEL NEGOCIO, PUBLICIDAD E IA (COSTO $0)
===============================================================================
Este programa controla de forma automática:
1. Escaneo de fotos y videos improvisados en ./mis_fotos_y_videos/ y generación
   automática de guiones virales para TikTok, Instagram, Facebook y Shorts.
2. Motor de Cotización Instantánea y Reglas de Negocio (Planos en Todo el Perú
   vs. Remodelación en Lima Metropolitana + Pivot a Distancia para Provincias).
3. Protocolo Anti-No-Pago (50% Inicio - 30% Avance con Marca de Agua - 20% Final).
4. Servidor Web Local + API en http://localhost:8080 para abrir la plataforma.
"""

import argparse
import datetime
import http.server
import json
import os
import socketserver
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = BASE_DIR / "mis_fotos_y_videos"
DATA_DIR = BASE_DIR / "data"
ASSETS_IMG_DIR = BASE_DIR / "assets" / "img"

# Reglas oficiales del negocio Planos Gio (GIO, GRUPO INGENIEROS S.A.C.)
REGLAS_NEGOCIO = {
    "empresa": "Planos Gio",
    "razon_social": "GIO, GRUPO INGENIEROS S.A.C.",
    "nombre_comercial": "GIOGRIN SAC",
    "ruc": "20610282963",
    "partida_registral_sunarp": "15146750",
    "estado_sunat": "ACTIVO / HABIDO (Emisor Electrónico de Factura y Boleta)",
    "domicilio_fiscal": "Av. Arequipa Nro. 1421 Dpto. 1306, Urb. Santa Beatriz, Lima - Lima",
    "gerente_general": "Alonzo Adrian Angulo Chirinos",
    "socio": "Augusto Franco Angulo Chirinos",
    "correo_oficial": "alonzoadrianangulochirinos@gmail.com",
    "yape_whatsapp_principal": "993952844",
    "telefono_secundario": "901632203",
    "cobertura_planos": "Todo el Perú (24 Departamentos + Callao - 100% Online)",
    "cobertura_remodelacion": "Lima Metropolitana y Callao (Obra física)",
    "pivot_provincias": "Pack Remodelación a Distancia (Planos + 3D + Metrado Anti-Engaño)",
    "candado_pagos": {
        "yape_oficial": "993 952 844",
        "visita_o_reserva_inicial_soles": 80,
        "hito_1_inicio_pct": 50,
        "hito_2_avance_marca_agua_pct": 30,
        "hito_3_liberacion_cad_pdf_pct": 20,
    },
    "paquetes_m2": {
        "planos_esencial": {"nombre": "Paquete Esencial (Arquitectura 2D)", "tarifa_m2": 10, "minimo": 450},
        "planos_completo": {"nombre": "Paquete Construcción Segura (Todas las Especialidades)", "tarifa_m2": 18, "minimo": 850},
        "planos_premium3d": {"nombre": "Paquete Premium Visual 360° (Planos + 3D + Metrado)", "tarifa_m2": 24, "minimo": 1200},
        "remodelacion_lima": {"nombre": "Remodelación Integral Llave en Mano (Solo Lima)", "tarifa_m2": 480, "minimo": 2800},
        "remodelacion_distancia": {"nombre": "Pack Remodelación a Distancia (Provincias)", "tarifa_m2": 22, "minimo": 650},
    },
}


def calcular_cotizacion_automatica(ciudad: str, paquete_id: str, m2: float, pisos: int = 1) -> dict:
    """Calcula la inversión, aplica la regla geográfica Lima vs Perú y desglosa los hitos 50-30-20."""
    es_lima = "lima" in ciudad.lower() or "callao" in ciudad.lower()
    regla_aplicada = "Cobertura Estándar"

    if not es_lima and paquete_id == "remodelacion_lima":
        paquete_id = "remodelacion_distancia"
        regla_aplicada = (
            f"PIVOT AUTOMÁTICO ({ciudad}): La obra física es solo en Lima. "
            "Se asignó el Pack Remodelación a Distancia (Planos + 3D + Lista de Materiales)."
        )

    pkg = REGLAS_NEGOCIO["paquetes_m2"].get(paquete_id, REGLAS_NEGOCIO["paquetes_m2"]["planos_completo"])
    factor_pisos = pisos if paquete_id == "remodelacion_lima" else (1.0 + (pisos - 1) * 0.65)
    area_efectiva = round(m2 * factor_pisos)
    total = max(pkg["minimo"], round(area_efectiva * pkg["tarifa_m2"]))

    hito1 = round(total * 0.50)
    hito2 = round(total * 0.30)
    hito3 = total - hito1 - hito2

    m2_total_construido = m2 * pisos
    materiales_referenciales = {
        "bolsas_cemento_aprox": round(m2_total_construido * 3.8),
        "millares_ladrillo_kk_aprox": round(m2_total_construido * 0.038, 1),
        "varillas_fierro_aprox": round(m2_total_construido * 2.4),
        "salidas_agua_luz_aprox": round(m2_total_construido * 0.45),
    }

    return {
        "orden_id": f"PG-2026-{datetime.datetime.now().strftime('%H%M%S')}",
        "ciudad": ciudad,
        "es_lima": es_lima,
        "paquete_id": paquete_id,
        "paquete_nombre": pkg["nombre"],
        "regla_geografica": regla_aplicada,
        "m2_base": m2,
        "pisos": pisos,
        "inversion_total_soles": total,
        "candado_pagos": {
            "hito_1_adelanto_50_soles": hito1,
            "hito_2_avance_30_soles": hito2,
            "hito_3_entrega_20_soles": hito3,
            "opcion_reserva_visita_descontable_soles": 80,
        },
        "metrado_anti_engano_referencial": materiales_referenciales,
    }


def escanear_y_generar_campanas() -> dict:
    """Escanea ./mis_fotos_y_videos/ y ./assets/img/ para generar guiones listos para TikTok/IG."""
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    extensiones_validas = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".webm"}
    archivos_detectados = []

    for carpeta in [MEDIA_DIR, ASSETS_IMG_DIR]:
        if carpeta.exists():
            for archivo in sorted(carpeta.iterdir()):
                if archivo.is_file() and archivo.suffix.lower() in extensiones_validas:
                    archivos_detectados.append(archivo)

    campanas = []
    for idx, archivo in enumerate(archivos_detectados, start=1):
        nombre = archivo.stem.replace("_", " ").title()
        es_remodelacion = "remodelacion" in archivo.stem.lower() or "antes" in archivo.stem.lower()

        if es_remodelacion:
            red_principal = "TikTok + Instagram Reels + YouTube Shorts"
            gancho = f"✨ De obra gris improvisada a remodelación moderna en Lima ({nombre})"
            guion = [
                "00-03s: Muestra la foto/video de obra en bruto. Texto: '¿Quieres remodelar tu casa o depa en Lima sin que el presupuesto se dispare?'",
                "03-12s: Explica cómo primero diseñamos el plano y la vista 3D antes de picar una pared.",
                "12-22s: Muestra el acabado propuesto con lista exacta de materiales para no comprar de más.",
                "22-30s: CTA: 'Cotiza tu remodelación en Lima o tus planos en todo el Perú en el link del perfil.'",
            ]
        else:
            red_principal = "TikTok + Facebook Reels + Instagram"
            gancho = f"🚫 NO construyas sin antes ver este plano y su ahorro de materiales ({nombre})"
            guion = [
                "00-03s: Zoom al plano o vista 3D. Texto: 'El error de S/ 10,000 que muchos cometen al construir en Perú'.",
                "03-12s: Construir sin planos hace que tengas cuartos oscuros y gastes 20% más en cemento y fierro.",
                "12-22s: En Planos Gio entregamos Planos 2D + Vistas 3D + Guía de Materiales Anti-Engaño para todo el Perú.",
                "22-30s: CTA: 'Calcula el precio de tus planos en 10 segundos en nuestra web oficial.'",
            ]

        campanas.append(
            {
                "id": f"POST-{idx:02d}",
                "titulo": nombre,
                "archivo_origen": str(archivo.relative_to(BASE_DIR)).replace("\\", "/"),
                "es_extra": archivo.parent == MEDIA_DIR,
                "red_recomendada": red_principal,
                "gancho_3_segundos": gancho,
                "guion_paso_a_paso": guion,
                "hashtags": "#PlanosPeru #ArquitecturaPeru #RemodelacionLima #ConstruccionSegura #PlanosGio",
                "herramienta_programacion_gratis": "TikTok Studio Web + Meta Business Suite",
            }
        )

    reporte = {
        "fecha_generacion": datetime.datetime.now().isoformat(),
        "total_archivos_multimedia": len(archivos_detectados),
        "reglas_negocio_activas": REGLAS_NEGOCIO,
        "campanas_listas_para_publicar": campanas,
        "simulaciones_ejemplo": [
            calcular_cotizacion_automatica("Arequipa", "planos_completo", 120, 2),
            calcular_cotizacion_automatica("Surco, Lima", "remodelacion_lima", 32, 1),
            calcular_cotizacion_automatica("Trujillo", "remodelacion_lima", 80, 1),
        ],
    }

    json_path = DATA_DIR / "reporte_ejecutivo_gio.json"
    json_path.write_text(json.dumps(reporte, indent=2, ensure_ascii=False), encoding="utf-8")

    # Generar también un archivo Markdown listo para lectura rápida
    md_lines = [
        "# 🚀 Plan de Publicación y Control Automático Generado — Planos Gio",
        f"**Fecha de ejecución:** {reporte['fecha_generacion']}",
        f"**Archivos de fotos/videos procesados:** {len(archivos_detectados)}",
        "",
        "## 1. Guiones Generados Automáticamente para tus Fotos y Videos",
    ]
    for c in campanas:
        md_lines.append(f"### 🎬 {c['id']} — Archivo: `{c['archivo_origen']}`")
        md_lines.append(f"- **Redes:** {c['red_recomendada']}")
        md_lines.append(f"- **Gancho en pantalla (0-3s):** *{c['gancho_3_segundos']}*")
        for paso in c["guion_paso_a_paso"]:
            md_lines.append(f"  - {paso}")
        md_lines.append(f"- **Hashtags:** `{c['hashtags']}`\n")

    md_lines.append("## 2. Simulaciones Automáticas de Cierre y Candado 50-30-20")
    for sim in reporte["simulaciones_ejemplo"]:
        md_lines.append(
            f"- **{sim['ciudad']} ({sim['m2_base']}m², {sim['pisos']} piso/s) → {sim['paquete_nombre']}**: "
            f"Total **S/ {sim['inversion_total_soles']}** | "
            f"Hito 1 (50%): **S/ {sim['candado_pagos']['hito_1_adelanto_50_soles']}** | "
            f"Hito 2 (30%): **S/ {sim['candado_pagos']['hito_2_avance_30_soles']}** | "
            f"Hito 3 (20%): **S/ {sim['candado_pagos']['hito_3_entrega_20_soles']}** "
            f"*({sim['regla_geografica']})*"
        )

    (DATA_DIR / "PLAN_PUBLICACION_LISTO.md").write_text("\n".join(md_lines), encoding="utf-8")
    return reporte


class PlanosGioRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Servidor HTTP que sirve la plataforma web y expone endpoints de automatización."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self):
        if self.path == "/api/status":
            reporte = escanear_y_generar_campanas()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(reporte, ensure_ascii=False).encode("utf-8"))
            return
        super().do_GET()


def iniciar_servidor(port: int = 8080):
    escanear_y_generar_campanas()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), PlanosGioRequestHandler) as httpd:
        print(f"==================================================================")
        print(f"🏗️  PLATAFORMA PLANOS GIO ACTIVA EN: http://localhost:{port}")
        print(f"📊 API de Estado y Campañas:        http://localhost:{port}/api/status")
        print(f"==================================================================")
        httpd.serve_forever()


def main():
    parser = argparse.ArgumentParser(description="Automatizador Central de Planos Gio")
    parser.add_argument("--scan", action="store_true", help="Escanea fotos/videos y genera campañas + reporte ejecutivo")
    parser.add_argument("--serve", action="store_true", help="Inicia el servidor web local en el puerto 8080")
    parser.add_argument("--port", type=int, default=8080, help="Puerto del servidor web (por defecto 8080)")
    args = parser.parse_args()

    if args.serve:
        iniciar_servidor(args.port)
    else:
        reporte = escanear_y_generar_campanas()
        print("✅ Automatización ejecutada con éxito.")
        print(f"📸 Archivos multimedia procesados: {reporte['total_archivos_multimedia']}")
        print(f"📄 Reporte JSON guardado en: {DATA_DIR / 'reporte_ejecutivo_gio.json'}")
        print(f"📘 Plan de Publicación listo en: {DATA_DIR / 'PLAN_PUBLICACION_LISTO.md'}")


if __name__ == "__main__":
    main()
