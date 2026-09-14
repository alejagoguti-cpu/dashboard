import { useMemo, useRef, useState } from 'react'
import { formatDayLabel, formatTime } from '../lib/dates.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'
import { PlusIcon } from './icons.jsx'

function GridCell({ post, preview, onOpen, dragging, onDragStart, onDragEnter, onDragEnd }) {
  return (
    <div
      draggable={!preview}
      onDragStart={() => onDragStart(post?.id)}
      onDragEnter={() => onDragEnter(post?.id)}
      onDragOver={(event) => event.preventDefault()}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(post)
        }
      }}
      className={`grid-cell group relative aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
        preview ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${dragging ? 'opacity-40 ring-2 ring-slate-900' : ''}`}
    >
      <img
        src={post?.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22400%22/%3E%3C/svg%3E'}
        alt={post?.title || 'Publicación'}
        draggable={false}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />

      {post && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[10px] font-medium text-white tracking-wide flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          {formatDayLabel(post.at)} {formatTime(post.at)}
        </div>
      )}

      {!preview && (
        <div className="grid-overlay opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white gap-2 p-3 text-center">
          <span className="text-xs font-medium line-clamp-2 leading-tight">{post?.title || 'Nueva publicación'}</span>
          {post?.stats && (
            <div className="flex items-center gap-3 text-xs text-slate-300">
              {post.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          )}
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
        multiple
        accept="image/*,video/*"
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

export default function FacebookFeedPlanner({ onSchedule }) {
  const { posts, preview, setPreview, account } = useDashboard()
  const [detail, setDetail] = useState(null)
  const [dragId, setDragId] = useState(null)

  const facebookPosts = useMemo(() => {
    return posts
      .filter((post) => post.platform === 'facebook')
      .sort((a, b) => new Date(a.at) - new Date(b.at))
      .slice(0, 8)
  }, [posts])

  function handleFiles(fileList) {
    const images = Array.from(fileList ?? []).filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
    if (images.length === 0) return
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap bg-white">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Feed de Facebook</h2>
          <span className="text-[11px] px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded">
            3×3 Cuadrícula
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

      <div className="p-4">
        <div className={`grid grid-cols-3 ${preview ? 'gap-0.5' : 'gap-2.5'}`}>
          {facebookPosts.length === 0 ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-slate-100 border border-slate-200 animate-pulse" />
              ))}
              {!preview && <UploadCell onFiles={handleFiles} />}
            </>
          ) : (
            <>
              {facebookPosts.map((post) => (
                <GridCell
                  key={post.id}
                  post={post}
                  preview={preview}
                  dragging={dragId === post.id}
                  onOpen={setDetail}
                  onDragStart={setDragId}
                  onDragEnter={(overId) => dragId && setDragId(overId)}
                  onDragEnd={() => setDragId(null)}
                />
              ))}
              {!preview && <UploadCell onFiles={handleFiles} />}
            </>
          )}
        </div>

        {!preview && (
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Arrastra las piezas para reordenar el feed · pulsa una para ver el detalle
          </p>
        )}
      </div>
    </div>
  )
}
