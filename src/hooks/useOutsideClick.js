import { useEffect } from 'react'

/** Ejecuta `handler` al pulsar fuera de `ref` o al presionar Escape. */
export default function useOutsideClick(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return

    function onPointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) handler()
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') handler()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [ref, handler, active])
}
