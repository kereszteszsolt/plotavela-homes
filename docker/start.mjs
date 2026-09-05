import { randomBytes } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

try {
  await mkdir('/data/uploads', { recursive: true })
  if (!process.env.JWT_SECRET) {
    try {
      process.env.JWT_SECRET = await readFile('/data/jwt-secret', 'utf8')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      process.env.JWT_SECRET = randomBytes(48).toString('hex')
      await writeFile('/data/jwt-secret', process.env.JWT_SECRET, { mode: 0o600, flag: 'wx' })
    }
  }
  if (!process.env.JWT_SECRET.trim()) throw new Error('JWT secret must not be empty')
  await import('../backend/server.js')
} catch (error) {
  console.error(`Backend startup failed: ${error.message}`)
  process.exit(1)
}
