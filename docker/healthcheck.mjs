import mongoose from 'mongoose'

try {
  await mongoose.connect('mongodb://127.0.0.1:27017/plotavela', { serverSelectionTimeoutMS: 3000 })
  await mongoose.connection.db.admin().ping()
  const origin = `http://127.0.0.1:${process.env.PORT || 5000}`
  const api = await fetch(`${origin}/api/properties`, { signal: AbortSignal.timeout(2000) })
  if (!api.ok || !Array.isArray((await api.json()).properties)) throw new Error('API unavailable')
  const web = await fetch(origin, { signal: AbortSignal.timeout(2000) })
  if (!web.ok || !(await web.text()).includes('<div id="root"></div>')) throw new Error('Frontend unavailable')
} catch {
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
