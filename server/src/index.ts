import 'dotenv/config'
import createApp from './app'

const app = createApp('/api')

const port = Number(process.env.PORT) || 5000
app.listen(port, () => {
  console.log(`tutlabs.live API listening on http://localhost:${port}`)
})
