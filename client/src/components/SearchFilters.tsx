import React from 'react'
import { Button } from './ui/button'

export const SearchFilters: React.FC<{ onSearch?: (q: { subject: string; city: string }) => void }>= ({ onSearch }) => {
  const [subject, setSubject] = React.useState('')
  const [city, setCity] = React.useState('')
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="h-10 w-full rounded-md border px-3"
        placeholder="Subject (e.g., Math)"
      />
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="h-10 w-full rounded-md border px-3"
        placeholder="City"
      />
      <Button onClick={() => onSearch?.({ subject, city })}>Search</Button>
    </div>
  )
}
