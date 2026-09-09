# Bitaxus · Instagram Studio & Feed Planner

Dashboard de planificación de contenido para Instagram: cuadrícula 3×3 del feed,
KPIs del mes, calendario semanal de publicaciones y ranking de reels.

Construido con **React 19 + Vite 7 + Tailwind CSS 4**.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # sirve el build
```

## Qué hace cada control

| Control | Comportamiento |
| --- | --- |
| Navegación lateral | Cambia de sección. Solo Instagram tiene pantalla diseñada; el resto muestra un estado vacío con vuelta al estudio. |
| Tarjeta de usuario | Despliega el menú de cuenta (perfil, cambio de cuenta, configuración, cerrar sesión). |
| `Últimos 30 días` | Selector de rango (7 días / 30 días / 90 días / 12 meses). Recalcula los cuatro KPIs, con delta en rojo cuando la métrica cae. |
| `Programar Publicación` | Abre el formulario de programación (título, formato, fecha, hora). Valida el título y puntúa la franja horaria. |
| Cuadrícula del feed | Arrastrar reordena las piezas; pulsar abre el detalle con opción de eliminar o reprogramar. |
| `Previsualizar` | Alterna la vista tipo perfil de Instagram: sin etiquetas, overlays ni hueco de subida. |
| `Guardar Orden` | Persiste el orden en `localStorage`. Se habilita solo con cambios pendientes; `Descartar` revierte al último guardado. |
| `Subir Publicación` | Selector de archivos y zona de arrastre. Acepta varias imágenes y las añade al feed. |
| `Ver feed en Instagram` | Abre el perfil real en una pestaña nueva. |
| Herramientas de contenido | Cada tarjeta abre sus resultados, con `Generar otra tanda` y copia al portapapeles. |
| Flechas del calendario | Navegan entre semanas; la etiqueta central vuelve a la semana actual. |
| Días de la semana | Filtran la lista de publicaciones a ese día; `Ver todas` quita el filtro. |
| Publicación programada | La `×` la cancela y limpia su etiqueta en la cuadrícula. |
| `Agendar` (espacio libre) | Abre el formulario con la fecha y el formato sugeridos. |
| `Top 3` | Alterna entre los 3 y los 5 mejores reels. |
| Fila de reel | Abre el detalle con vistas, retención, comentarios y guardados. |
| `Ver análisis detallado` | Tabla comparativa de todos los reels frente a la media del canal. |

Los diálogos se cierran con Escape o pulsando fuera, y las acciones confirman con
un aviso temporal.

## Estructura

```
src/
├── App.jsx                      Composición de la página y diálogo de programación
├── index.css                    Tema de Tailwind, scrollbar y hover del feed
├── state/DashboardContext.jsx   Estado compartido: sección, rango, feed, programación, avisos
├── hooks/
│   ├── useLocalStorage.js       Estado persistido, con degradación a memoria
│   └── useOutsideClick.js       Cierre por clic fuera y Escape
├── lib/dates.js                 Semana, etiquetas relativas y conversión de inputs
├── components/
│   ├── Sidebar.jsx              Navegación y menú de cuenta
│   ├── Header.jsx               Título, selector de rango y acción principal
│   ├── KpiCards.jsx             Métricas del rango activo
│   ├── FeedPlanner.jsx          Cuadrícula, drag & drop, subida y detalle
│   ├── ContentTools.jsx         Herramientas asistidas por IA
│   ├── WeeklyCalendar.jsx       Semana, cola de publicaciones y espacio libre
│   ├── TopReels.jsx             Ranking y análisis de reels
│   ├── ScheduleModal.jsx        Formulario de programación
│   ├── PlaceholderSection.jsx   Secciones sin pantalla diseñada
│   ├── icons.jsx                Todos los SVG en un único módulo
│   └── ui/                      Modal y avisos reutilizables
└── data/dashboard.js            Contenido y métricas de demostración
```

Toda la interfaz se alimenta de `src/data/dashboard.js`, así que conectarla a una
API real solo requiere sustituir ese módulo.

## Notas

- **Persistencia.** El orden del feed y las publicaciones programadas se guardan en
  `localStorage`. Las imágenes que subes en la sesión son object URLs y no
  sobreviven a una recarga.
- **Fecha de referencia.** El calendario parte del martes 25 de agosto de 2026, la
  fecha del diseño, definida en `REFERENCE_TODAY` (`src/lib/dates.js`). Cámbiala por
  `new Date()` para trabajar sobre la fecha real.
- **Imágenes.** Las miniaturas apuntan al CDN temporal de Google Stitch
  (`lh3.googleusercontent.com/aida-public/...`), del que salió el diseño. Esos
  enlaces caducan: reemplaza las URLs del objeto `media` en `src/data/dashboard.js`
  por assets propios antes de desplegar.
