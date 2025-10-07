export function initMonitoring() {
  if (typeof window === 'undefined') return
  const sentryDsn = (window as any).__SENTRY_DSN__ || import.meta.env.VITE_SENTRY_DSN
  if (sentryDsn) {
    import('@sentry/browser').then(Sentry => {
      Sentry.init({ dsn: sentryDsn as string, tracesSampleRate: 0.1 })
    }).catch(() => {})
  }
  const posthogKey = (window as any).__POSTHOG_KEY__ || import.meta.env.VITE_POSTHOG_KEY
  const posthogHost = (window as any).__POSTHOG_HOST__ || import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'
  if (posthogKey) {
    import('posthog-js').then(mod => {
      mod.init(posthogKey as string, { api_host: posthogHost as string, capture_pageview: true })
    }).catch(() => {})
  }
}
