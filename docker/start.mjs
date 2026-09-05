import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import mongoose from 'mongoose'

const children = new Set()
let stopping = false
let exitCode = 0

function stop(code) {
  if (stopping) return
  stopping = true
  exitCode = code
  for (const child of children) child.kill('SIGTERM')
  if (!children.size) process.exit(exitCode)
  setTimeout(() => {
    for (const child of children) child.kill('SIGKILL')
  }, 25000).unref()
}

function start(command, args) {
  const child = spawn(command, args, { stdio: 'inherit', env: process.env })
  children.add(child)
  child.once('error', (error) => {
    console.error(`Cannot start ${command}: ${error.message}`)
    children.delete(child)
    stop(1)
  })
  child.once('exit', (code, signal) => {
    children.delete(child)
    if (!stopping) {
      console.error(`${command} exited unexpectedly (${signal || code})`)
      stop(1)
    }
    if (!children.size) process.exit(exitCode)
  })
}

process.on('SIGTERM', () => stop(0))
process.on('SIGINT', () => stop(0))

try {
  // This launcher always owns its loopback database, never a host's existing DB.
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/plotavela'
  await mkdir('/data/mongo', { recursive: true })
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
  if (stopping) process.exit(exitCode)

  start('mongod', [
    '--bind_ip', '127.0.0.1', '--port', '27017', '--nounixsocket',
    '--dbpath', '/data/mongo', '--wiredTigerCacheSizeGB', '0.25',
  ])
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 })
  await mongoose.connection.db.admin().ping()
  await mongoose.disconnect()
  if (!stopping) start('node', ['backend/server.js'])
} catch (error) {
  console.error(`Container startup failed: ${error.message}`)
  stop(1)
}
