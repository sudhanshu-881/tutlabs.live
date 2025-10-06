import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { json } from 'express'
import { router } from './routes'

const app = express()
app.use(cors())
app.use(json())

app.use('/api', router)

const port = Number(process.env.PORT) || 5000
app.listen(port, () => {
  console.log(`tutlabs.live API listening on http://localhost:${port}`)
})
