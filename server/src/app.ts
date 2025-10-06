import express from 'express'
import cors from 'cors'
import { json } from 'express'
import { router } from './routes'

export function createApp(basePath: string = '/') {
  const app = express()
  app.use(cors())
  app.use(json())
  app.use(basePath, router)
  return app
}

export default createApp
