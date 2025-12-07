require('dotenv').config()
const { app } = require('./app')
const { prisma } = require('./lib/prisma')

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

async function shutdown() {
  console.log('Shutting down...')
  try { await prisma.$disconnect() } catch (e) {}
  server.close(() => process.exit(0))
}
