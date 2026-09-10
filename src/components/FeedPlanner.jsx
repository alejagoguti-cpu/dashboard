import { useMemo, useRef, useState } from 'react'
import { formatDayLabel, formatTime } from '../lib/dates.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'
import { CarouselIcon, PlusIcon, ReelIcon, TrashIcon } from './icons.jsx'

const formatIcons = {
  reel: ReelIcon,
  carousel: CarouselIcon,
}

function FeedCell({ slot, post, preview, onOpen, dragging, onDragStart, onDragEnter, onDragEnd }) {
  const FormatIcon = slot.format ? formatIcons[slot.format] : null
  const isNext = post?.isNext

  return (
    <div
      draggable={!preview}
      onDragStart={() => onDragStart(slot.id)}
      onDragEnter={() => onDragEnter(slot.id)}
      onDragOver={(event) => event.preventDefault()}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(slot)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(slot)
        }
      }}
      className={`grid-cell group relative aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
        preview ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${dragging ? 'opacity-40 ring-2 ring-slate-900' : ''}`}
    >
      <img
        src={slot.image}
        alt={slot.alt}
        draggable={false}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />

      {!preview && post && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[10px] font-medium text-white tracking-wide flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${isNext ? 'bg-emerald-400' : 'bg-slate-300'}`}
          />
          {formatDayLabel(post.at)} {formatTime(post.at)}
        </div>
      )}

      {!preview && FormatIcon && (
        <div className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-xs rounded text-white">
          <FormatIcon className="w-3 h-3" />
        </div>
      )}

      {!preview && (
        <div className="grid-overlay opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white gap-2 p-3 text-center">
          <span className="text-xs font-medium line-clamp-2 leading-tight">{slot.title}</span>
          {slot.stats && (
            <div className="flex items-center gap-3 text-xs text-slate-300">
              {slot.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          )}
          {slot.note && <span className="text-[11px] text-slate-300">{slot.note}</span>}
        </div>
      )}
    </div>
  )
}

function UploadCell({ onFiles }) {
  const input = useRef(null)
  const [over, setOver] = useState(false)

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          onFiles(event.target.files)
          event.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setOver(false)
          onFiles(event.dataTransfer.files)
        }}
        className={`group relative aspect-square rounded-lg border border-dashed transition flex flex-col items-center justify-center p-3 text-center cursor-pointer ${
          over
            ? 'border-slate-500 bg-slate-100'
            : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/50'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600">
          <PlusIcon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-slate-700 mt-2">Subir Publicación</span>
        <span className="text-[10px] text-slate-400">o arrastrar archivo</span>
      </button>
    </>
  )
}

export default function FeedPlanner({ onSchedule }) {
  const { slots, posts, preview, setPreview, moveSlot, addSlot, removeSlot, dirty, saveOrder, resetOrder, notify, busy, account, instagram } =
    useDashboard()
  const saving = busy === 'saveOrder'

  const [dragId, setDragId] = useState(null)
  const [detail, setDetail] = useState(null)

  // La primera publicación de la cola se marca en verde; el resto, en gris.
  const postsById = useMemo(() => {
    const sorted = posts
      .filter((post) => (post.platform ?? 'instagram') === 'instagram')
      .sort((a, b) => new Date(a.at) - new Date(b.at))
    return new Map(sorted.map((post, index) => [post.id, { ...post, isNext: index === 0 }]))
  }, [posts])

  function handleFiles(fileList) {
    const images = Array.from(fileList ?? []).filter((file) => file.type.startsWith('image/'))

    if (images.length === 0) {
      notify('Solo se admiten archivos de imagen')
      return
    }

    images.forEach((file, index) => {
      addSlot({
        id: `local-${Date.now()}-${index}`,
        local: true,
        image: URL.createObjectURL(file),
        alt: file.name,
        title: file.name.replace(/\.[^.]+$/, ''),
        note: 'Borrador sin programar',
      })
    })

    notify(`${images.length} pieza${images.length > 1 ? 's' : ''} añadida${images.length > 1 ? 's' : ''} al feed`, 'success')
  }

  const detailPost = detail ? postsById.get(detail.scheduleId) : null

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap bg-white">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Feed Planner</h2>
          <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
            3×3 Cuadrícula
          </span>
          {dirty && (
            <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
              Cambios sin guardar
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              type="button"
              onClick={resetOrder}
              className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
            >
              Descartar
            </button>
          )}
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            aria-pressed={preview}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition border ${
              preview
                ? 'bg-slate-100 text-slate-900 border-slate-300'
                : 'text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {preview ? 'Salir de vista previa' : 'Previsualizar'}
          </button>
          <button
            type="button"
            onClick={saveOrder}
            disabled={!dirty || saving}
            className="px-2.5 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition disabled:opacity-40 disabled:hover:bg-slate-900"
          >
            {saving ? 'Guardando…' : 'Guardar Orden'}
          </button>
        </div>
      </div>

      <div className="px-5 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <img
            src={account.avatar}
            alt={account.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="font-medium text-slate-800">{account.handle}</span>
            <span className="text-[11px] text-slate-400 ml-1.5">
              {account.posts} publicaciones · {account.followers} seguidores
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
          <span className={`w-1.5 h-1.5 rounded-full ${dirty ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span>{dirty ? 'Pendiente de sincronizar' : 'Sincronizado'}</span>
        </div>
      </div>

      <div className="p-4">
        <div className={`grid grid-cols-3 ${preview ? 'gap-0.5' : 'gap-2.5'}`}>
          {slots.map((slot) => (
            <FeedCell
              key={slot.id}
              slot={slot}
              post={slot.scheduleId ? postsById.get(slot.scheduleId) : null}
              preview={preview}
              dragging={dragId === slot.id}
              onOpen={setDetail}
              onDragStart={setDragId}
              onDragEnter={(overId) => dragId && moveSlot(dragId, overId)}
              onDragEnd={() => setDragId(null)}
            />
          ))}
          {!preview && <UploadCell onFiles={handleFiles} />}
        </div>

        {!preview && (
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Arrastra las piezas para reordenar el feed · pulsa una para ver el detalle
          </p>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-slate-500 text-[11px]">Mostrando {slots.length} piezas visuales</span>
        <a
          href={account.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-slate-700 hover:text-slate-900 transition"
        >
          Ver feed en Instagram →
        </a>
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.title}
        subtitle={
          detailPost
            ? `Programado para ${formatDayLabel(detailPost.at)} a las ${formatTime(detailPost.at)}`
            : 'Sin programar'
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                removeSlot(detail.id)
                setDetail(null)
                notify('Pieza eliminada del feed')
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              Eliminar del feed
            </button>
            <button
              type="button"
              onClick={() => {
                const title = detail.title
                setDetail(null)
                onSchedule({ title, platform: 'instagram' })
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
            >
              {detailPost ? 'Reprogramar' : 'Programar'}
            </button>
          </>
        }
      >
        {detail && (
          <div className="flex gap-4">
            <img
              src={detail.image}
              alt={detail.alt}
              className="w-32 h-32 rounded-lg object-cover bg-slate-900 flex-shrink-0"
            />
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <span className="text-slate-400">Formato: </span>
                {detail.format === 'reel' ? 'Reel' : detail.format === 'carousel' ? 'Carrusel' : 'Imagen'}
              </p>
              <p>
                <span className="text-slate-400">Posición en el feed: </span>
                {slots.findIndex((slot) => slot.id === detail.id) + 1} de {slots.length}
              </p>
              {detail.stats && (
                <p>
                  <span className="text-slate-400">Métricas: </span>
                  {detail.stats.join(' · ')}
                </p>
              )}
              {detail.note && <p className="text-slate-500">{detail.note}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
