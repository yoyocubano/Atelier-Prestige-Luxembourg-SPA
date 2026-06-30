# Atelier Prestige — Google Sheets Setup Guide

## 1. Crear el Google Sheet

1. Ir a **sheets.google.com** → Crear nueva hoja: `Atelier Prestige - Boutique`
2. Copiar el **Sheet ID** de la URL:
   `https://docs.google.com/spreadsheets/d/**ESTE-ES-EL-ID**/edit`

## 2. Estructura de la hoja

### Pestaña "Products" (catálogo)
| A: id | B: name | C: cat | D: price | E: img | F: desc | G: machine |
|-------|---------|--------|----------|--------|---------|------------|
| m1 | Bandana brodée... | pets | 22 | https://... | Desc... | Bordadora |

**Categorías válidas:** `pets` · `baby` · `memories` · `custom`

### Pestaña "Orders" (pedidos — creada automáticamente)
| Order ID | Timestamp | Name | Email | Phone | Items | Total € | Notes | Status | Created |

## 3. Hacer la hoja de productos pública (solo lectura)

1. Pestaña "Products" → `Compartir` → `Cualquiera con el enlace` → `Lector`
2. Esto permite que el frontend lea el catálogo sin autenticación

## 4. Configurar Google Apps Script

1. En el Sheet: `Extensiones` → `Apps Script`
2. Pegar el contenido de `apps-script/Code.gs`
3. Ejecutar `setupProductsSheet()` una vez
4. `Implementar` → `Nueva implementación` → Tipo: **App web**
5. Ejecutar como: **Yo** | Acceso: **Cualquiera**
6. Copiar la URL de implementación

## 5. Conectar con la boutique

En `src/pages/boutique.astro`, buscar las líneas:

```js
const SHEET_ID = '';          // ← Pegar el Sheet ID aquí
const APPS_SCRIPT_URL = '';   // ← Pegar la URL del Apps Script aquí
```

## 6. Márgenes objetivo (del plan de negocio)

| Máquina | Costo | Margen |
|---------|-------|--------|
| Cortadora (€350-420) | ~17% | **83%** |
| Láser (€400-550) | ~15-30% | **70-85%** |
| Bordadora (€550-680) | ~20-35% | **65-80%** |

**Target Luxemburgo:** €158K salario promedio · €176M/año en regalos
