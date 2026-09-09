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

## Estructura

```
src/
├── App.jsx                  Composición de la página (sidebar + rejilla de 12 columnas)
├── index.css                Tema de Tailwind, scrollbar y hover del feed
├── components/
│   ├── Sidebar.jsx          Navegación lateral y tarjeta de usuario
│   ├── Header.jsx           Título, selector de rango y acción principal
│   ├── KpiCards.jsx         Cuatro métricas superiores
│   ├── FeedPlanner.jsx      Cuadrícula 3×3 con overlays y slot de subida
│   ├── ContentTools.jsx     Tarjetas de herramientas asistidas por IA
│   ├── WeeklyCalendar.jsx   Semana + próximas publicaciones
│   ├── TopReels.jsx         Top 3 de reels con barra de retención
│   └── icons.jsx            Todos los SVG en un único módulo
└── data/
    └── dashboard.js         Contenido y métricas de demostración
```

Toda la interfaz se alimenta de `src/data/dashboard.js`, así que conectarla a una
API real solo requiere sustituir ese módulo.

## Imágenes

Las miniaturas apuntan al CDN temporal de Google Stitch
(`lh3.googleusercontent.com/aida-public/...`), del que salió el diseño. Esos
enlaces caducan: reemplaza las URLs del objeto `media` en `src/data/dashboard.js`
por assets propios antes de desplegar.
