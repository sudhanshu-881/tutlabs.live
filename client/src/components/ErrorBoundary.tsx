import React from 'react'

export class ErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: any, info: any) {
    // TODO: send to logging provider
    console.error('ErrorBoundary caught', error, info)
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-6">Something went wrong. Please refresh.</div>
    }
    return this.props.children
  }
}
