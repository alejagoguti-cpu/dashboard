import { useMemo, useRef, useState } from 'react'
import { formatDayLabel, formatTime } from '../lib/dates.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'
import { PlusIcon, TrashIcon } from './icons.jsx'

function ArticleCell({ article, onOpen, onDelete }) {
  return (
    <div
      onClick={() => onOpen(article)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(article)
        }
      }}
      className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg hover:border-slate-300 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-900">
              {formatDayLabel(article.at)} · {formatTime(article.at)}
            </span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2">{article.title || article.content}</p>
          {article.stats && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
              {article.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(article.id)
          }}
          aria-label={`Eliminar artículo`}
          className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
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
        multiple
        accept="image/*,video/*,.txt,.pdf"
        onChange={(e) => onFiles(e.currentTarget.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragEnter={() => setOver(true)}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setOver(false)
          onFiles(event.dataTransfer.files)
        }}
        className={`p-3 rounded-lg border border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer ${
          over
            ? 'border-slate-500 bg-slate-100'
            : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/50'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600">
          <PlusIcon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-slate-700 mt-2">Nuevo Artículo</span>
        <span className="text-[10px] text-slate-400">o arrastrar archivo</span>
      </button>
    </>
  )
}

export default function LinkedInFeedPlanner({ onSchedule }) {
  const { posts, account, notify, updatePost } = useDashboard()
  const [detail, setDetail] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [driveLink, setDriveLink] = useState('')
  const [editedPost, setEditedPost] = useState(null)

  const linkedinPosts = useMemo(() => {
    return posts
      .filter((post) => post.platform === 'linkedin')
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 10)
  }, [posts])

  function handleFiles(fileList) {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    onSchedule({ platform: 'linkedin', preview: true })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap bg-white">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Feed Profesional</h2>
          <span className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
            B2B
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSchedule({ platform: 'linkedin' })}
          className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-1.5"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Publicar Artículo
        </button>
      </div>

      <div className="px-5 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <img
            src={account.avatar}
            alt={account.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="font-medium text-slate-800">{account.name}</span>
            <span className="text-[11px] text-slate-400 ml-1.5">
              {account.posts} artículos · {account.followers} contactos
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Sincronizado</span>
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {linkedinPosts.length === 0 ? (
          <>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg animate-pulse">
                  <div className="h-3 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-2 bg-slate-200 rounded w-full mb-1"></div>
                  <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <UploadCell onFiles={handleFiles} />
            </div>
          </>
        ) : (
          <>
            {linkedinPosts.map((post) => (
              <ArticleCell
                key={post.id}
                article={post}
                onOpen={setDetail}
                onDelete={() => {}}
              />
            ))}
            <div className="pt-2">
              <UploadCell onFiles={handleFiles} />
            </div>
          </>
        )}
      </div>

      {!linkedinPosts.length && (
        <p className="text-[11px] text-slate-400 px-4 pb-4 text-center">
          Crea nuevos artículos para desarrollar tu estrategia B2B
        </p>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => {
          setDetail(null)
          setEditMode(false)
          setDriveLink('')
          setEditedPost(null)
        }}
        title={editMode ? 'Editar artículo' : detail?.title || 'Detalles'}
        subtitle={editMode ? 'Edita todos los campos de tu publicación' : 'Artículo de LinkedIn'}
        footer={
          editMode ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false)
                  setDriveLink('')
                  setEditedPost(null)
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editedPost && detail) {
                    updatePost(detail.id, editedPost)
                    setEditMode(false)
                    setDriveLink('')
                    setEditedPost(null)
                    setDetail(null)
                    notify('Publicación actualizada')
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                Guardar cambios
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditMode(true)
                  setEditedPost(detail)
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                Cerrar
              </button>
            </>
          )
        }
      >
        {detail && (
          editMode ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Título
                </label>
                <input
                  type="text"
                  value={editedPost?.title || ''}
                  onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Contenido
                </label>
                <textarea
                  value={editedPost?.content || ''}
                  onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Fecha y hora
                </label>
                <input
                  type="datetime-local"
                  value={editedPost?.at || ''}
                  onChange={(e) => setEditedPost({ ...editedPost, at: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {detail.content || detail.title}
              </p>
            </div>
          )
        )}
      </Modal>
    </div>
  )
}
