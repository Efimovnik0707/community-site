'use client'

import { useEffect } from 'react'

/**
 * Adds a copy button to every <pre> block inside a container.
 * Mount this as a sibling to the prose container, passing the container ref or using a wrapper.
 */
export function CodeCopyButton({ containerId }: { containerId: string }) {
  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const pres = container.querySelectorAll('pre')
    pres.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return

      // Wrap pre in relative container if not already
      pre.style.position = 'relative'

      const btn = document.createElement('button')
      btn.className = 'code-copy-btn'
      btn.textContent = 'Копировать'
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')
        const text = code ? code.textContent : pre.textContent
        if (text) {
          await navigator.clipboard.writeText(text)
          btn.textContent = '✓ Скопировано'
          setTimeout(() => { btn.textContent = 'Копировать' }, 2000)
        }
      })
      pre.appendChild(btn)
    })

    return () => {
      const container = document.getElementById(containerId)
      if (!container) return
      container.querySelectorAll('.code-copy-btn').forEach((btn) => btn.remove())
    }
  }, [containerId])

  return null
}
