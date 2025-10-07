export function initSentryServer() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return
  // dynamically import to avoid cold starts when not configured
  // @ts-ignore
  return import('@sentry/node').then((Sentry) => {
    Sentry.init({ dsn, tracesSampleRate: 0.1 })
  }).catch(() => undefined)
}
