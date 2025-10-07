import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../components/ui/button'
import { Header } from '../components/Header'
import { Toaster, toast } from '../hooks/use-toast'

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) })

type LoginInput = z.infer<typeof LoginSchema>

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) })

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error('Invalid email or password')
      toast.success('Logged in')
      window.location.href = '/'
    } catch (e: any) {
      toast.error(e.message || 'Login failed')
    }
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-md px-4 py-8">
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
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
          <Button disabled={isSubmitting} type="submit" className="w-full">{isSubmitting ? 'Signing in...' : 'Sign in'}</Button>
        </form>
      </main>
      <Toaster />
    </div>
  )
}

export default LoginPage
