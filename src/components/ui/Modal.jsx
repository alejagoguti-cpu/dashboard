import { useEffect, useRef } from 'react'
import useOutsideClick from '../../hooks/useOutsideClick.js'
import { CloseIcon } from '../icons.jsx'

export default function Modal({ open, onClose, title, subtitle, children, footer, width = 'max-w-lg' }) {
  const panel = useRef(null)
  useOutsideClick(panel, onClose, open)

  // El fondo no debe desplazarse mientras el diálogo está abierto.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
    >
      <div
        ref={panel}
        className={`w-full ${width} max-h-[85vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-lg`}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
