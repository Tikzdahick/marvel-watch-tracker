import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('[MVT] main.jsx loaded, mode:', import.meta.env?.MODE)

// ── Global error traps ────────────────────────────────────────────────────────
window.onerror = (msg, src, line, col, err) => {
  console.error('[MVT] window.onerror:', msg, 'at', src, line, col, err)
}
window.addEventListener('unhandledrejection', e => {
  console.error('[MVT] unhandledrejection:', e.reason)
})

// ── Error Boundary (class component — the only way to catch render errors) ───
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[MVT] ErrorBoundary caught render error:', error)
    console.error('[MVT] Component stack:', info?.componentStack)
    this.setState({ info })
  }
  render() {
    if (this.state.hasError) {
      const { error, info } = this.state
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#0a0a0a',
          color: '#E81C2E', padding: 24, fontFamily: 'monospace',
          overflowY: 'auto', zIndex: 99999,
        }}>
          <h2 style={{ color: '#F5C518', marginBottom: 8 }}>⚠️ App Render Error</h2>
          <p style={{ marginBottom: 8 }}><strong>Message:</strong> {error?.message}</p>
          <pre style={{ fontSize: 11, color: '#aaa', whiteSpace: 'pre-wrap', marginBottom: 12 }}>
            {error?.stack}
          </pre>
          <h3 style={{ color: '#F5C518', marginBottom: 4 }}>Component Stack:</h3>
          <pre style={{ fontSize: 11, color: '#888', whiteSpace: 'pre-wrap' }}>
            {info?.componentStack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Mount ─────────────────────────────────────────────────────────────────────
try {
  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('#root element not found in DOM')
  const root = createRoot(rootEl)
  console.log('[MVT] createRoot OK — rendering...')
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
  console.log('[MVT] render() dispatched')
} catch (e) {
  console.error('[MVT] FATAL mount error:', e)
  const el = document.getElementById('root') || document.body
  el.innerHTML = `<div style="color:#E81C2E;background:#0a0a0a;padding:24px;font-family:monospace;position:fixed;inset:0;overflow:auto">
    <h2 style="color:#F5C518">⚠️ Fatal Mount Error</h2>
    <p>${e?.message}</p>
    <pre style="font-size:11px;color:#aaa">${e?.stack}</pre>
  </div>`
}

// ── Service Worker ────────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`/sw.js?v=${__BUILD_TIME__}`)
      .catch(err => console.warn('[MVT] SW registration failed:', err))

    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  })
}
