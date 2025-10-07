import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../components/ui/button'
import { Header } from '../components/Header'
import { Toaster, toast } from '../hooks/use-toast'

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['tutor', 'parent']),
  name: z.string().optional(),
})

type SignupInput = z.infer<typeof SignupSchema>

const SignupPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({ resolver: zodResolver(SignupSchema) })

  const onSubmit = async (data: SignupInput) => {
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error('Could not sign up')
      toast.success('Account created')
      window.location.href = '/'
    } catch (e: any) {
      toast.error(e.message || 'Signup failed')
    }
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-md px-4 py-8">
        <h1 className="mb-4 text-xl font-semibold">Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input className="h-10 w-full rounded-md border px-3" type="email" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input className="h-10 w-full rounded-md border px-3" type="password" {...register('password')} />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm">Role</label>
            <select className="h-10 w-full rounded-md border px-3" {...register('role')}>
              <option value="tutor">Tutor</option>
              <option value="parent">Parent</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm">Name (optional)</label>
            <input className="h-10 w-full rounded-md border px-3" type="text" {...register('name')} />
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full">{isSubmitting ? 'Creating...' : 'Create account'}</Button>
        </form>
      </main>
      <Toaster />
    </div>
  )
}

export default SignupPage
