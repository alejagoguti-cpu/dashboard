# Bitaxus · Instagram Studio & Feed Planner

Dashboard de planificación de contenido para Instagram: cuadrícula 3×3 del feed,
KPIs del mes, calendario semanal de publicaciones y ranking de reels.

Construido con **React 19 + Vite 7 + Tailwind CSS 4**.

## Verlo funcionando

No hace falta instalar nada ni tener n8n: el panel arranca con datos de ejemplo.

- **En GitHub Pages.** Activa *Settings → Pages → Source: **GitHub Actions*** una
  sola vez y cada push a `main` lo publica en `https://<usuario>.github.io/<repo>/`.

  El origen tiene que ser *GitHub Actions*, no *Deploy from a branch*. Con la
  opción de rama, GitHub sirve la raíz del repositorio con Jekyll: eso publica el
  `index.html` de desarrollo, que apunta a `/src/main.jsx`, un fichero que no
  existe compilado. El resultado es una página en blanco con el título correcto.
  Y no da ningún error: los dos despliegues salen en verde y el de Jekyll,
  que termina después, pisa al bueno.
- **En tu ordenador.** Necesitas Node 22: `npm install && npm run dev`.

n8n e Instagram son opcionales y solo hacen falta para datos reales.

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
npm run n8n:import   # importa los 14 workflows, los activa y reinicia n8n
cp .env.example .env # ya trae la configuración local por defecto
npm run dev
```

`npm run n8n:logs` sigue la salida de la instancia y `npm run n8n:down` la para.
Los workflows quedan en un volumen de Docker, así que sobreviven al reinicio.

El reinicio del paso 2 no es opcional: `publish:workflow` marca el workflow como
activo en la base de datos, pero n8n no registra sus webhooks hasta arrancar de
nuevo. Sin reiniciar, las llamadas devuelven 404. El script ya lo hace.

### Puesta en marcha contra tu propia instancia

1. Importa los catorce workflows de `n8n/workflows/` y actívalos. Desde el editor:
   *Workflows → Import from File*.
2. En cada nodo Webhook, ajusta **Allowed Origins (CORS)** al origen desde el que
   sirves el panel (vienen con `http://localhost:5173`).
3. Copia `.env.example` a `.env` y rellena:
   - **Desarrollo:** `VITE_N8N_BASE_URL=/n8n` y `N8N_PROXY_TARGET=https://tu-instancia`.
     Las llamadas salen del mismo origen y Vite las reenvía, así que no hay CORS
     y el paso 2 deja de importar.
   - **Producción:** `VITE_N8N_BASE_URL=https://tu-instancia`.
4. Reinicia el servidor de desarrollo: Vite lee las variables al arrancar.

## Datos reales de Instagram

Con los workflows `07`–`09` activos, el panel deja de usar datos de ejemplo para
el perfil, los KPIs, el feed y los reels: los pide a la Graph API de Meta a
través de n8n. La cabecera muestra **Instagram en vivo** y, al pulsarla, vuelve a
sincronizar.

### Qué necesitas de Meta

1. Una cuenta de Instagram **Business o Creator** vinculada a una página de
   Facebook.
2. Una app en [developers.facebook.com](https://developers.facebook.com) con los
   permisos `instagram_basic`, `instagram_manage_insights`, `pages_show_list` y
   `pages_read_engagement`.
3. Un **token de acceso de larga duración**.
4. El **id de tu cuenta de Instagram** (no el `@usuario`):
   `GET /{page-id}?fields=instagram_business_account`.

### Cómo se configura

El token vive en n8n, nunca en el navegador:

1. En n8n, crea una credencial **Facebook Graph API** y pega el token.
2. Abre cada workflow de Instagram y asígnale esa credencial en sus nodos HTTP.
3. Pon tu `IG_USER_ID` en el nodo *Configuración* de cada uno, o defínelo como
   variable de entorno. Ojo: n8n **bloquea `$env` dentro de los nodos Code** por
   defecto (`N8N_BLOCK_ENV_ACCESS_IN_NODE`); el `docker-compose` de este repo ya
   lo desactiva, y si no, los workflows usan el valor escrito en el nodo.
4. Activa los tres workflows y reinicia n8n.

### Qué se muestra y qué no

Nada se inventa. Si la Graph API no devuelve una métrica, el KPI conserva su
cifra de ejemplo y aparece marcado con una etiqueta **demo**; los avisos
parciales se ven al pasar el cursor por la píldora de Instagram.

Un detalle importante: **la Graph API no expone «retención»**. Con datos en vivo
el panel muestra en su lugar el *visionado medio* (`ig_reels_avg_watch_time`) y,
si falta, el *alcance sobre reproducciones*, cada uno con su nombre. La columna
«retención» solo aparece con los datos de ejemplo.

Los nombres de métrica cambian entre versiones de la Graph API. Están agrupados
en una constante `METRICS` al principio del nodo *Configuración* de cada
workflow, para que ajustarlos sea una línea.

## Datos reales de LinkedIn

Misma mecánica que Instagram, con una diferencia que conviene saber antes de
empezar: **LinkedIn no ofrece analíticas de perfiles personales**. Instagram te
da los datos de tu propia cuenta; LinkedIn solo los de **páginas de empresa**, a
través de la Community Management API.

Y esa API no es autoservicio: hay que solicitar acceso al **Partner Program** de
LinkedIn y que te aprueben. Sin esa aprobación las llamadas fallan, el estudio
se queda con los datos de ejemplo y lo indica con la etiqueta **demo**.

### Qué necesitas

1. Una **página de empresa** en LinkedIn de la que seas administrador.
2. Una app en [LinkedIn Developers](https://www.linkedin.com/developers/)
   verificada con esa página.
3. Acceso aprobado a la **Community Management API**, con los permisos
   `r_organization_social` (estadísticas) y `rw_organization_admin`.
4. El **ORG_ID** numérico de la página (*Admin → Page info*).

### Cómo se configura

1. En n8n, crea una credencial **OAuth2 genérica** con las URLs de LinkedIn
   (`https://www.linkedin.com/oauth/v2/authorization` y `.../accessToken`) y los
   permisos de arriba. La credencial `LinkedIn Community Management` que trae
   n8n de serie sirve para publicar, no para leer estadísticas: sus scopes son
   de escritura.
2. Asigna esa credencial a los nodos HTTP de los dos workflows de LinkedIn.
3. Pon tu `ORG_ID` en el nodo *Configuración*, o define `LINKEDIN_ORG_ID`.
4. Activa los workflows y reinicia n8n.

La cabecera `LinkedIn-Version` es obligatoria y usa formato `AAAAMM`; el valor
por defecto (`202604`) es el mismo que trae el nodo oficial de n8n.

### Las imágenes de las publicaciones

A diferencia de Instagram, LinkedIn **no devuelve la URL de la imagen dentro de
la publicación**: devuelve un URN (`urn:li:image:…`) que hay que resolver aparte.
El workflow recoge los de todas las publicaciones y los pide en una sola llamada
por lotes a `/rest/images` y `/rest/videos`, y reparte el resultado.

De ahí salen los cuatro tipos que muestra el estudio: imagen, carrusel (primera
imagen), vídeo (su miniatura) y texto. Las publicaciones sin media —la mayoría
en LinkedIn— no dejan un hueco roto: su propia entradilla hace de portada.

Las URL de descarga que devuelve LinkedIn caducan, así que sirven para pintar el
panel en el momento, no para guardarlas.

## Datos reales de YouTube

De las tres plataformas, la más sencilla: **sus APIs son de autoservicio** y
funcionan con un canal personal. No hace falta ni página de empresa ni programa
de partners.

Usa dos APIs de Google a la vez:

- **Data API v3** → canal, vídeos, miniaturas, duración y estadísticas públicas.
- **YouTube Analytics** → vistas, retención y suscriptores del periodo.

### Qué necesitas

1. Un proyecto en [Google Cloud Console](https://console.cloud.google.com) con
   **YouTube Data API v3** y **YouTube Analytics API** habilitadas.
2. Credenciales OAuth 2.0 (ID de cliente y secreto).

No hay que configurar ningún id de canal: se resuelve solo con `mine=true`.

### Cómo se configura

En n8n, crea una credencial **YouTube OAuth2 API** y —esto es lo que se pasa por
alto— activa **Custom Scopes**, porque los permisos por defecto no incluyen las
analíticas. Añade:

```
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/yt-analytics.readonly
```

Después asigna esa credencial a los nodos HTTP de los dos workflows, actívalos y
reinicia n8n.

### Lo que YouTube da y las otras no

**Retención real.** Instagram no la expone y hay que conformarse con
aproximaciones; YouTube devuelve `averageViewPercentage`, tanto del canal como de
cada vídeo. El estudio la muestra tal cual, sin rodeos.

También sustituye un KPI: el dato de ejemplo hablaba de *clicks en la
descripción*, que la API no da, así que con datos en vivo ese hueco pasa a
mostrar el **tiempo de visualización**, que es la métrica que YouTube sí mide.
Los workflows pueden renombrar un KPI, no solo cambiarle el valor.

Las tarjetas marcan la duración sobre la miniatura y distinguen **Shorts** de
vídeos largos por su duración.

## Noticias reales por RSS

El panel de Noticias lee feeds RSS de verdad. Es lo más sencillo de conectar de
todo el proyecto: **no hace falta ninguna credencial**, solo las URL de los
medios que quieras seguir.

Edita la lista `FEEDS` en el nodo *Fuentes* del workflow `14-noticias-rss`:

```js
{ url: 'https://www.elespectador.com/arc/outboundfeeds/rss/', source: 'El Espectador', scope: 'co' }
```

`scope` (`co` / `intl`) alimenta el filtro Colombia / Internacional del panel.
Las URL que vienen de fábrica hay que confirmarlas: cambian con el tiempo y
algunos medios retiran sus feeds.

Entre las fuentes de fábrica van los **blogs oficiales** de YouTube, LinkedIn y
Meta: los cambios de producto se anuncian ahí antes de llegar a la prensa.

### Lo que el workflow deduce, y por qué se dice

Un RSS trae titular, enlace, fecha y poco más. **El tema, la plataforma y la
relevancia los deduce el workflow** a partir del texto: busca palabras clave
para el tema y para la plataforma, y puntúa la relevancia combinando cuántos
términos de tu interés aparecen con lo reciente que sea la noticia. Que hable de
una de tus plataformas es la señal que más pesa. Las tres listas están al
principio del nodo *Fuentes*.

Es una heurística, no un dato del medio, y el detalle de cada noticia lo dice.

### Las noticias llegan a cada estudio

Cada estudio muestra un bloque **Novedades de la plataforma** con lo que se ha
publicado sobre ella: un cambio de algoritmo se lee mejor al lado de las
métricas que acaba moviendo. La sección de Noticias añade además un filtro por
plataforma, y una misma noticia puede contar para varias.

### Cuando un feed se cae

No pasa nada: los demás siguen, y el panel indica cuál falló. Detrás hay más
cuidado del que parece. El nodo XML descarta el elemento cuando el cuerpo no es
XML válido, y al desaparecer del flujo desplaza a los siguientes, con lo que los
artículos acabarían **firmados por el medio equivocado**. Por eso hay un nodo
que sustituye cualquier respuesta no válida por un feed vacío: así entran y
salen tantos elementos como fuentes, y la atribución es fiable.

## Temas y competidores con datos reales

Las dos tablas que quedaban con cifras inventadas ya salen de fuentes reales.

### Temas: qué se está publicando, medido

`15-temas-rss` reutiliza el mismo corpus RSS del panel de Noticias y cuenta
**cuántos artículos tocan cada tema** en una ventana de 24 horas, comparándola
con las 24 anteriores. No es volumen de búsqueda ni interés en Google: es
cobertura de prensa, y el panel lo dice en la propia tabla para que nadie lo
lea como otra cosa. Con datos reales la columna deja de llamarse *Volumen
mensual* y pasa a *Noticias*.

Cada fila trae además el titular de muestra que la disparó, con su medio, los
estudios a los que afecta y cuántas piezas **tuyas** tocan ese tema, contadas
sobre tu calendario y tu feed, no sobre la API.

Cuando un tema no aparecía en la ventana anterior no hay con qué comparar, así
que la tendencia sale como `—` en vez de un `+100%` inventado. Un tema con la
misma cobertura en las dos ventanas sí muestra `+0%`: son cosas distintas.

Los temas se editan en el nodo *Fuentes* del workflow, con las palabras clave
que cuentan para cada uno.

### Competidores: solo lo que es público

`16-competidores` consulta las cuentas que sigas y **no necesita que te den
acceso a ellas**:

- **Instagram**, con [Business Discovery][bd] sobre tu propio usuario:
  `business_discovery.username(handle){followers_count,media_count,media.limit(12){...}}`.
  Exige que la otra cuenta sea Business o Creator; una cuenta personal no
  devuelve nada y el panel lo avisa.
- **YouTube**, con `channels?part=snippet,statistics&forHandle=@cuenta`, que es
  público y solo pide la clave de API.

[bd]: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/business_discovery

La cadencia sale de las fechas de las últimas doce publicaciones. La interacción
se calcula **sobre seguidores**, no sobre impresiones: el alcance de una cuenta
ajena no es público. Es un número comparable entre competidores, pero no
coincidirá con el que ellos vean en su propio panel, y la tabla lo advierte.
YouTube no publica *likes* por canal, así que en su lugar va **vistas por
vídeo** y la columna de interacción queda con guion.

Las cuentas a seguir se listan en el nodo *Cuentas*. Añadir una desde el panel
la agrega a la tabla al momento, pero para que se consulte de verdad hay que
darla de alta también ahí; el aviso al añadirla lo recuerda.

### Cuando no hay workflow

Las dos secciones caen a los datos de ejemplo y lo marcan en un distintivo
ámbar. Con el workflow activo el distintivo pasa a verde y se convierte en un
botón que vuelve a consultar. Si la consulta va a medias —una cuenta que no
responde, un feed caído— sigue en ámbar y nombra lo que falló.

## Ideas por Telegram

Le escribes al bot un pensamiento suelto —tal cual te salga, dictado o a
vuelapluma— y vuelve convertido en **pie de Instagram**, **idea de YouTube** o
**guion de 30-45 segundos**. Lo que salga aparece en la bandeja del panel de
Inicio, listo para programar.

### La conversación

Mándale el pensamiento y te pregunta en qué lo conviertes, con un botón por
formato. Si ya lo sabes, ve directo:

```
/ig     los reels de 15 s rinden más que los de 60
/yt     bajar el precio no vence la objeción
/guion  el coste de quedarse igual
```

### Enlazar el chat

Un bot de Telegram es público: cualquiera que dé con él puede escribirle. Por
eso el workflow **solo atiende a los chats enlazados**. El panel enseña un
código de seis caracteres y tú se lo mandas al bot:

```
/vincular K3F7QA
```

El código se quema en cuanto se usa, así que verlo por encima del hombro no
sirve de nada. A cualquier otro chat el bot le responde que no está enlazado, y
nada de lo que escriba entra en la bandeja.

### Qué hace el panel con ellas

Cada idea trae el pensamiento original, el texto redactado y su formato. Desde
la tarjeta puedes **programarla** —el titular llega ya escrito al compositor—,
**copiarla**, **rehacerla en otro formato** o **descartarla**. Rehacer y
descartar viajan a n8n: no son solo un cambio en pantalla.

### El modelo

El nodo *Modelo de lenguaje* viene con Claude (`claude-opus-5`), pero es un
nodo de chat model normal y corriente: cámbialo por el proveedor que uses y el
resto del workflow no se entera. Sin credencial, la cadena falla en blando y el
bot devuelve el pensamiento ordenado **diciendo que no ha pasado por ningún
modelo**, en vez de fingir una publicación.

Las instrucciones de cada formato están en el nodo *Redactar*, en castellano y
sin rodeos. Es lo primero que conviene ajustar a tu voz.

### Dónde se guardan

En los **datos estáticos del workflow**: ni base de datos ni fichero. Sobreviven
a los reinicios y se quedan las últimas 40. Es una bandeja personal; dos
ejecuciones simultáneas leen cada una su copia, así que no vale para un equipo
escribiendo a la vez.

### Webhooks que consume el panel

| Ruta | Método | Cuándo se llama | Cuerpo |
| --- | --- | --- | --- |
| `bitaxus/schedule-post` | POST | Al programar una publicación | `{ id, at, format, title, score }` |
| `bitaxus/cancel-post` | POST | Al cancelar una publicación | `{ id }` |
| `bitaxus/feed-order` | POST | Al pulsar *Guardar Orden* | `{ order: [{ id, title, scheduleId }] }` |
| `bitaxus/dm-flows` | GET | Al abrir *Automatización DMs* | — |
| `bitaxus/generate-hooks` | POST | Al abrir *Hooks & Copies* o recargar | `{ tool, batch }` |
| `bitaxus/inspect-hashtags` | POST | Al abrir *Inspector de Hashtags* o recargar | `{ tool, batch }` |
| `bitaxus/ig-overview` | GET | Al cargar y al cambiar de rango | `?range=7d\|30d\|90d\|12m` |
| `bitaxus/ig-media` | GET | Al cargar el feed | — |
| `bitaxus/ig-reels` | GET | Al cargar el ranking de reels | — |
| `bitaxus/li-overview` | GET | Al abrir el estudio de LinkedIn | `?range=7d\|30d\|90d\|12m` |
| `bitaxus/li-posts` | GET | Al abrir el estudio de LinkedIn | `?count=10` |
| `bitaxus/yt-overview` | GET | Al abrir el estudio de YouTube | `?range=7d\|30d\|90d\|12m` |
| `bitaxus/yt-videos` | GET | Al abrir el estudio de YouTube | `?count=6` |
| `bitaxus/news` | GET | Al abrir Noticias y en cada estudio | `?limit=20` |
| `bitaxus/topics` | GET | Al abrir Temas | — |
| `bitaxus/competitors` | GET | Al abrir Competidores | — |
| `bitaxus/ideas` | GET | Al abrir Inicio | — |
| `bitaxus/idea` | POST | Al rehacer o descartar una idea | `{ id, accion, formato }` |

`schedule-post` recibe también `platform` y puede devolver `{ executionId }`, que
el panel guarda junto a la publicación. Las tres herramientas aceptan
`[{ text, metric }]`, `{ results: [...] }` o `{ flows: [...] }`, y también
`{ name, active }`, que se normaliza.

### Verificado contra n8n real

Los diecisiete workflows se importaron, activaron y ejecutaron en una instancia real
de n8n (2.35.7). Comprobado de punta a punta:

- Los diecisiete webhooks responden 200 con el cuerpo esperado.
- Los de Instagram, LinkedIn y YouTube se probaron contra **APIs simuladas** que
  reproducen las respuestas de Meta, LinkedIn y Google: el panel pinta perfil,
  KPIs, feed, reels, publicaciones y vídeos reales. Lo que **no** se ha podido
  verificar son las APIs en sí — este entorno no las alcanza y su documentación está
  bloqueada, así que los nombres de métrica y los endpoints hay que
  confirmarlos contra la versión que uses.
- n8n activa desde una *versión publicada*: importar no basta, hay que publicar
  y reiniciar. Editar la fila del workflow en la base de datos no surte efecto.
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
| **Noticias** | Prensa colombiana e internacional más los blogs oficiales de las plataformas. Las piezas destacadas llevan portada; el resto va en lista compacta. Buscador y filtros por país, plataforma y relevancia. Cada titular abre su detalle y permite crear una publicación a partir de él. |
| **Temas** | Tabla ordenable de volumen y tendencia. Pulsar una fila abre el diálogo de programación con el tema como título. |
| **Formatos** | Comparativa de Reel, Carrusel, Imagen y Story por alcance, engagement y retención. |
| **YouTube / LinkedIn** | Estudio de cada plataforma: sus KPIs, sus novedades y su propia cola. Con la API conectada añaden lo ya publicado, con imagen y rendimiento real. |
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
│   ├── usePlatformData.js       Carga desde n8n: resumen y lista, fallando por separado
│   └── useOutsideClick.js       Cierre por clic fuera y Escape
├── lib/
│   ├── dates.js                 Semana, etiquetas relativas y conversión de inputs
│   └── n8n.js                   Cliente de webhooks: URLs, timeout y errores
├── assets/                      Portadas SVG y avatar
├── components/
│   ├── sections/                Una pantalla por entrada de la navegación
│   │   └── TelegramInbox.jsx    Bandeja de ideas del bot, dentro de Inicio
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

Sin workflows conectados toda la interfaz se alimenta de `src/data/dashboard.js`.
Con ellos activos cada sección prefiere el dato real y deja el de ejemplo como
respaldo, siempre señalado.

## Notas

- **Los titulares de ejemplo** solo se usan mientras no haya feeds RSS
  conectados. Están atribuidos a medios reales porque son los que este panel
  agregaría, pero no son noticias publicadas, y el panel lo advierte en la lista
  y en el detalle. Con el workflow `14-noticias-rss` activo el aviso desaparece
  y se leen noticias de verdad.
- **Temas y competidores** funcionan igual: sin `15-temas-rss` y `16-competidores`
  activos muestran cifras de ejemplo y lo avisan en ámbar.
- **La bandeja de Telegram** también: sin `17-ideas-telegram` enseña tres ideas
  de muestra. Para verlo así sin tocar nada, `npm run build:demo` compila el
  panel sin ninguna URL de n8n y `npm run preview:demo` lo sirve.
- **Los medios no usan sus logos.** Cada uno se identifica con un monograma
  sobre un color derivado de su propio nombre, así que es estable y no hay
  ningún recurso de marca que mantener.

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
