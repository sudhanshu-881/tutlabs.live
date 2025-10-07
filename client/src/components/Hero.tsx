import React from 'react'
import { Button } from './ui/button'

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-[hsl(var(--accent))] to-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Find the right tutor near you</h1>
          <p className="mt-3 text-muted-foreground">Discover experienced tutors by subject, availability and distance. Post your needs and start learning fast.</p>
          <div className="mt-6 flex gap-3">
            <a href="/signup"><Button>Get started</Button></a>
            <a href="#search"><Button variant="outline">Browse tutors</Button></a>
          </div>
        </div>
      </div>
    </section>
  )
}
