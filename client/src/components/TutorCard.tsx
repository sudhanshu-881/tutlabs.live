import React from 'react'
import { Button } from './ui/button'

export interface TutorCardProps {
  name: string
  subjects: string[]
  ratePerHour: number
  city?: string
}

export const TutorCard: React.FC<TutorCardProps> = ({ name, subjects, ratePerHour, city }) => {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg">{name}</div>
        <div className="text-sm text-muted-foreground">{city}</div>
      </div>
      <div className="mt-2 text-sm">Subjects: {subjects.join(', ')}</div>
      <div className="mt-2 text-sm">Rate: ${ratePerHour}/hr</div>
      <div className="mt-3">
        <Button>View Profile</Button>
      </div>
    </div>
  )
}
