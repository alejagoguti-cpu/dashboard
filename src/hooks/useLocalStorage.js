import { useEffect, useRef, useState } from 'react'

/**
 * Estado persistido en localStorage. Se degrada a estado en memoria cuando el
 * almacenamiento no está disponible (modo privado, cookies bloqueadas).
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  // La primera renderización no debe reescribir lo que se acaba de leer.
  const hydrated = useRef(false)

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Sin persistencia disponible: el estado sigue viviendo en memoria.
    }
  }, [key, value])

  return [value, setValue]
}
