import { useState, useEffect, useRef } from 'react'

export function useSmartNav() {
  const [visible, setVisible] = useState(true)
  const [atTop, setAtTop] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const suppressUntil = useRef(0)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const scrollingUp = currentY < lastScrollY.current
        const delta = Math.abs(currentY - lastScrollY.current)

        setAtTop(currentY < 10)

        if (delta > 5) {
          if (Date.now() < suppressUntil.current) {
            lastScrollY.current = currentY
          } else {
            setVisible(scrollingUp || currentY < 100)
            lastScrollY.current = currentY
          }
        }

        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function suppress() {
    setVisible(true)
    suppressUntil.current = Date.now() + 1000
  }

  return { visible, atTop, suppress }
}
