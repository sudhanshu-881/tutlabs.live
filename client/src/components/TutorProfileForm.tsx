import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Toaster, toast } from '../hooks/use-toast'

const Schema = z.object({
  bio: z.string().max(5000).optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  subjects: z.string().optional(),
  ratePerHour: z.coerce.number().int().positive().optional(),
  city: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  availableMon: z.boolean().optional(),
  availableTue: z.boolean().optional(),
  availableWed: z.boolean().optional(),
  availableThu: z.boolean().optional(),
  availableFri: z.boolean().optional(),
  availableSat: z.boolean().optional(),
  availableSun: z.boolean().optional(),
})

type Input = z.infer<typeof Schema>

export const TutorProfileForm: React.FC = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Input>({ resolver: zodResolver(Schema) })

  const onSubmit = async (data: Input) => {
    const payload = {
      ...data,
      subjects: data.subjects ? data.subjects.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    const res = await fetch('/api/tutors/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return toast.error('Failed to save profile')
    toast.success('Profile saved')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm">Bio</label>
        <textarea className="min-h-[100px] w-full rounded-md border p-2" {...register('bio')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Education</label>
          <input className="h-10 w-full rounded-md border px-3" {...register('education')} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Experience</label>
          <input className="h-10 w-full rounded-md border px-3" {...register('experience')} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Subjects (comma-separated)</label>
          <input className="h-10 w-full rounded-md border px-3" {...register('subjects')} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Rate per hour</label>
          <input className="h-10 w-full rounded-md border px-3" type="number" {...register('ratePerHour')} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm">City</label>
          <input className="h-10 w-full rounded-md border px-3" {...register('city')} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Latitude</label>
          <input className="h-10 w-full rounded-md border px-3" type="number" step="0.0000001" {...register('latitude')} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Longitude</label>
          <input className="h-10 w-full rounded-md border px-3" type="number" step="0.0000001" {...register('longitude')} />
        </div>
      </div>
      <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
          <label key={d} className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register(`available${d}` as const)} />
            <span>{d}</span>
          </label>
        ))}
      </fieldset>
      <Button disabled={isSubmitting} type="submit">{isSubmitting ? 'Saving...' : 'Save profile'}</Button>
      <Toaster />
    </form>
  )
}
