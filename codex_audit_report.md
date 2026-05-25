# Codex Audit Report: Atelier-Prestige-Luxembourg-SPA

**Realizado por:** Codex CLI (Agente Autónomo)
**Modo:** Zero-Token (Recursos delegados a Codex)

A continuación se presentan los hallazgos de la auditoría de seguridad, rendimiento, diseño y código fuente:

## 🔴 Riesgos Críticos (Alta Prioridad)
* **Seguridad de Datos:** El formulario guarda datos personales en `localStorage` en `src/pages/index.astro`.
* **Fallas de Producción:** Existen llamadas a endpoints backend (`/api/estimate` y `/api/contact`) en un entorno configurado como sitio estático para GitHub Pages. Estas peticiones fallarán en producción.
* **Rendimiento de Carga:** Tailwind CSS se está ejecutando directamente en el navegador mediante un bundle CDN de ~419 KB en `src/pages/index.astro`, lo cual bloquea el renderizado y afecta los Web Vitals.

## 🟡 Advertencias (Media Prioridad)
* **Arquitectura SEO:** El archivo `Layout.astro` contiene la configuración de SEO y Open Graph, pero la página principal `index.astro` no lo está utilizando/heredando.
* **Optimización de Media:** Imágenes PNG muy pesadas en `public/assets` (hasta ~897 KB) sin un pipeline responsive ni formatos modernos como WebP/AVIF.
* **Privacidad (GDPR):** El fallback a WhatsApp transfiere datos recopilados en el formulario a un tercero (Meta) sin el consentimiento explícito y documentado del usuario.

## 🔵 Mejoras de Mantenibilidad (Baja Prioridad)
* CSS duplicado en algunas secciones.
* Enlaces vacíos (`href="#"`).
* Problemas de accesibilidad: Imágenes usan el atributo `data-alt` en lugar del estándar `alt`.
* Javascript *inline* demasiado extenso; se recomienda separarlo en módulos.

---
*Nota: La ejecución de `npm audit` y `npm run build` en el entorno de Codex fue bloqueada preventivamente por el sandbox de seguridad (solo-lectura) para proteger el entorno local de modificaciones no autorizadas durante el escaneo.*
