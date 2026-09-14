import { useMemo, useRef, useState } from 'react'
import { formatDayLabel, formatTime } from '../lib/dates.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'
import { PlusIcon, TrashIcon } from './icons.jsx'

function PostCell({ post, onOpen, onDelete }) {
  return (
    <div
      onClick={() => onOpen(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(post)
        }
      }}
      className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg hover:border-slate-300 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-900">
              {formatDayLabel(post.at)} · {formatTime(post.at)}
            </span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2">{post.title || post.content}</p>
          {post.stats && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
              {post.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(post.id)
          }}
          aria-label={`Eliminar publicación`}
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
        accept="image/*,video/*,.txt"
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
        <span className="text-xs font-medium text-slate-700 mt-2">Nueva Publicación</span>
        <span className="text-[10px] text-slate-400">o arrastrar archivo</span>
      </button>
    </>
  )
}

export default function FacebookFeedPlanner({ onSchedule }) {
  const { posts, account } = useDashboard()
  const [detail, setDetail] = useState(null)

  const facebookPosts = useMemo(() => {
    return posts
      .filter((post) => post.platform === 'facebook')
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 10)
  }, [posts])

  function handleFiles(fileList) {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    onSchedule({ platform: 'facebook', preview: true })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap bg-white">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Feed de Facebook</h2>
          <span className="text-[11px] px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded">
            Comunidad
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSchedule({ platform: 'facebook' })}
          className="px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition flex items-center gap-1.5"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Nueva Publicación
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
              {account.posts} publicaciones · {account.followers} seguidores
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Sincronizado</span>
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {facebookPosts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-xs text-slate-500 mb-3">Las publicaciones que programes aparecerán aquí</p>
            <UploadCell onFiles={handleFiles} />
          </div>
        ) : (
          <>
            {facebookPosts.map((post) => (
              <PostCell
                key={post.id}
                post={post}
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

      {!facebookPosts.length && (
        <p className="text-[11px] text-slate-400 px-4 pb-4 text-center">
          Crea nuevas publicaciones para comenzar a engañar a tu comunidad
        </p>
      )}
    </div>
  )
}
