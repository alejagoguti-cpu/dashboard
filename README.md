# Bitaxus · Instagram Studio & Feed Planner

Dashboard de planificación de contenido para Instagram: cuadrícula 3×3 del feed,
KPIs del mes, calendario semanal de publicaciones y ranking de reels.

Construido con **React 19 + Vite 7 + Tailwind CSS 4**.

## Desarrollo

```bash
npm install
cp .env.example .env   # opcional: solo para conectar con n8n
npm run dev            # servidor de desarrollo
npm run build          # build de producción en dist/
npm run preview        # sirve el build
```

## Integración con n8n

El panel funciona en dos modos. Sin configurar, todo se guarda en el navegador.
Con `VITE_N8N_BASE_URL` definido, las acciones disparan workflows reales y la
cabecera muestra **n8n conectado**.

### Por qué webhooks y no la Public API

El navegador habla con n8n **solo por webhooks**. La Public API (`/api/v1`)
queda descartada por dos motivos, ambos comprobados en el código de n8n:

1. Su clave es de instancia. Cualquier variable `VITE_*` acaba en el bundle, así
   que incrustarla la deja a la vista de quien abra las herramientas de
   desarrollo.
2. Aunque se aceptara ese riesgo, no funcionaría: el CORS de n8n
   (`packages/cli/src/middlewares/cors.ts`) devuelve un
   `Access-Control-Allow-Headers` que **no incluye `x-n8n-api-key`**, y el
   preflight falla.

Los nodos Webhook declaran `supportsCORS`, traen su propia opción de orígenes
permitidos y admiten Header Auth, que es lo que necesita un frontend. Lo que el
panel necesita leer se expone con un nodo *Respond to Webhook*.

### Puesta en marcha con n8n local (recomendado para empezar)

Requiere Docker.

```bash
npm run n8n:up       # levanta n8n en http://localhost:5678
                     # (la primera vez, crea la cuenta de propietario en el navegador)
npm run n8n:import   # importa los 6 workflows, los activa y reinicia n8n
cp .env.example .env # ya trae la configuración local por defecto
npm run dev
```

`npm run n8n:logs` sigue la salida de la instancia y `npm run n8n:down` la para.
Los workflows quedan en un volumen de Docker, así que sobreviven al reinicio.

El reinicio del paso 2 no es opcional: `publish:workflow` marca el workflow como
activo en la base de datos, pero n8n no registra sus webhooks hasta arrancar de
nuevo. Sin reiniciar, las llamadas devuelven 404. El script ya lo hace.

### Puesta en marcha contra tu propia instancia

1. Importa los seis workflows de `n8n/workflows/` y actívalos. Desde el editor:
   *Workflows → Import from File*.
2. En cada nodo Webhook, ajusta **Allowed Origins (CORS)** al origen desde el que
   sirves el panel (vienen con `http://localhost:5173`).
3. Copia `.env.example` a `.env` y rellena:
   - **Desarrollo:** `VITE_N8N_BASE_URL=/n8n` y `N8N_PROXY_TARGET=https://tu-instancia`.
     Las llamadas salen del mismo origen y Vite las reenvía, así que no hay CORS
     y el paso 2 deja de importar.
   - **Producción:** `VITE_N8N_BASE_URL=https://tu-instancia`.
4. Reinicia el servidor de desarrollo: Vite lee las variables al arrancar.

### Webhooks que consume el panel

| Ruta | Método | Cuándo se llama | Cuerpo |
| --- | --- | --- | --- |
| `bitaxus/schedule-post` | POST | Al programar una publicación | `{ id, at, format, title, score }` |
| `bitaxus/cancel-post` | POST | Al cancelar una publicación | `{ id }` |
| `bitaxus/feed-order` | POST | Al pulsar *Guardar Orden* | `{ order: [{ id, title, scheduleId }] }` |
| `bitaxus/dm-flows` | GET | Al abrir *Automatización DMs* | — |
| `bitaxus/generate-hooks` | POST | Al abrir *Hooks & Copies* o recargar | `{ tool, batch }` |
| `bitaxus/inspect-hashtags` | POST | Al abrir *Inspector de Hashtags* o recargar | `{ tool, batch }` |

`schedule-post` recibe también `platform` y puede devolver `{ executionId }`, que
el panel guarda junto a la publicación. Las tres herramientas aceptan
`[{ text, metric }]`, `{ results: [...] }` o `{ flows: [...] }`, y también
`{ name, active }`, que se normaliza.

### Verificado contra n8n real

Los seis workflows se importaron, activaron y ejecutaron en una instancia real
de n8n (2.35.7). Comprobado de punta a punta:

- Los seis webhooks responden 200 con el cuerpo esperado.
- El panel dispara los workflows por el proxy de Vite y recibe el `executionId`
  real que devuelve n8n.
- *Programar publicación* responde al instante y deja la ejecución en estado
  `waiting` hasta la hora indicada, en vez de bloquear la respuesta. El nodo
  *Respond to Webhook* va **antes** del *Wait* justo por eso: al revés, el panel
  agotaría su timeout de 10 s esperando a la hora de publicar.
- El CORS del webhook devuelve el origen configurado en **Allowed Origins**, de
  modo que un origen distinto queda bloqueado por el navegador. De ahí que haya
  que ajustarlo, o usar el proxy de desarrollo y olvidarse.

### Manejo de errores

Las escrituras van primero a n8n y solo tocan el estado local si el workflow
responde bien: si falla, el diálogo de programación sigue abierto con los datos
escritos y el error de n8n se muestra tal cual. La lectura de flujos de DMs es la
excepción: ante un fallo cae a los datos de ejemplo y avisa. Un 404 en un webhook
casi siempre significa **workflow inactivo**, y así lo indica el mensaje.

## Secciones

Las diez entradas de la navegación tienen pantalla propia; no queda ninguna vacía.

| Sección | Qué hace |
| --- | --- |
| **Inicio** | Resumen: KPIs, próximas publicaciones de todas las plataformas, accesos a los estudios y mejor pieza del mes. |
| **Noticias** | Titulares del sector con buscador y filtro por relevancia. Cada uno abre su detalle y permite crear una publicación a partir de él. |
| **Temas** | Tabla ordenable de volumen y tendencia. Pulsar una fila abre el diálogo de programación con el tema como título. |
| **Formatos** | Comparativa de Reel, Carrusel, Imagen y Story por alcance, engagement y retención. |
| **YouTube / LinkedIn** | Estudio reducido de cada plataforma: sus KPIs y su propia cola de publicación. |
| **Instagram** | El estudio completo del diseño: feed 3×3, herramientas, calendario semanal y reels. |
| **Analíticas** | KPIs por rango y tabla de reels comparada con la media del canal. |
| **Calendario** | Vista mensual navegable con todas las publicaciones programadas, coloreadas por plataforma. |
| **Competidores** | Cuentas en seguimiento, ordenables; se pueden añadir y quitar. |

## Qué hace cada control

| Control | Comportamiento |
| --- | --- |
| Tarjeta de usuario | Menú de cuenta: **Ver perfil** (datos reales del panel), **Configuración** (el rango por defecto se aplica al instante) y **Cerrar sesión** (con confirmación y pantalla de vuelta). |
| `Últimos 30 días` | Selector de rango (7 días / 30 días / 90 días / 12 meses). Recalcula los cuatro KPIs, con delta en rojo cuando la métrica cae. |
| `Programar Publicación` | Formulario con plataforma, formato, fecha y hora. Los formatos cambian según la plataforma. Valida el título, puntúa la franja horaria y, con n8n conectado, dispara el workflow y solo cierra si responde bien. |
| Cuadrícula del feed | Arrastrar reordena las piezas; pulsar abre el detalle con opción de eliminar o reprogramar. |
| `Previsualizar` | Alterna la vista tipo perfil de Instagram: sin etiquetas, overlays ni hueco de subida. |
| `Guardar Orden` | Persiste el orden en `localStorage` y lo envía a n8n si está conectado. Se habilita solo con cambios pendientes; `Descartar` revierte al último guardado. |
| `Subir Publicación` | Selector de archivos y zona de arrastre. Acepta varias imágenes y las añade al feed. |
| `Ver feed en Instagram` | Abre el perfil real en una pestaña nueva. |
| Herramientas de contenido | Las tres abren sus resultados, con `Generar otra tanda` y copia al portapapeles. Con n8n conectado, **las tres** leen de su propio workflow. |
| Flechas del calendario | Navegan entre semanas; la etiqueta central vuelve a la semana actual. |
| Días de la semana | Filtran la lista de publicaciones a ese día; `Ver todas` quita el filtro. |
| Publicación programada | La `×` la cancela en n8n y limpia su etiqueta en la cuadrícula. |
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
├── lib/
│   ├── dates.js                 Semana, etiquetas relativas y conversión de inputs
│   └── n8n.js                   Cliente de webhooks: URLs, timeout y errores
├── assets/                      Portadas SVG y avatar
├── components/
│   ├── sections/                Una pantalla por entrada de la navegación
│   ├── AccountModals.jsx        Perfil, configuración y cierre de sesión
│   ├── LoggedOut.jsx            Pantalla tras cerrar sesión
│   ├── Sidebar.jsx              Navegación y menú de cuenta
│   ├── Header.jsx               Título, selector de rango y acción principal
│   ├── KpiCards.jsx             Métricas del rango activo
│   ├── FeedPlanner.jsx          Cuadrícula, drag & drop, subida y detalle
│   ├── ContentTools.jsx         Herramientas asistidas por IA
│   ├── WeeklyCalendar.jsx       Semana, cola de publicaciones y espacio libre
│   ├── TopReels.jsx             Ranking y análisis de reels
│   ├── ScheduleModal.jsx        Formulario de programación
│   ├── icons.jsx                Todos los SVG en un único módulo
│   └── ui/                      Modal y avisos reutilizables
└── data/dashboard.js            Contenido y métricas de demostración

n8n/workflows/                   Workflows listos para importar en tu instancia
```

Toda la interfaz se alimenta de `src/data/dashboard.js`, así que conectarla a una
API real solo requiere sustituir ese módulo.

## Notas

- **Persistencia.** El orden del feed y las publicaciones programadas se guardan en
  `localStorage`. Las imágenes que subes en la sesión son object URLs y no
  sobreviven a una recarga.
- **Fechas.** El panel trabaja sobre la fecha real. El diseño fijaba la semana del
  24 al 30 de agosto de 2026, pero con un calendario mensual navegable esa fecha
  congelada dejaba la cola siempre en el pasado; las publicaciones de demostración
  se sitúan ahora en relación con hoy.
- **Imágenes.** Las portadas son SVG del propio repositorio (`src/assets`), no
  enlaces externos: el panel no hace ninguna petición a un CDN y nada caduca.
  Sustitúyelas por tus propios assets cuando tengas el material real.
