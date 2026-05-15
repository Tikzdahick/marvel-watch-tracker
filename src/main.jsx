import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // ?v= changes every build → browser re-fetches and re-evaluates sw.js on each deploy
    navigator.serviceWorker
      .register(`/sw.js?v=${__BUILD_TIME__}`)
      .catch(() => {})

    // When the new SW activates and claims this tab, reload once to load fresh assets.
    // Guard prevents double-reload; only fires on updates (not first install) because
    // on first install there is no previous controller so no controllerchange event fires.
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  })
}
