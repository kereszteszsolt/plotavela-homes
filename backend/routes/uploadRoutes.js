import path from 'path'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import express from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 },
})

router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
  const file = req.file
  if (!file) {
    res.status(400)
    throw new Error('Choose a JPEG or PNG image')
  }
  const extension = path.extname(file.originalname).toLowerCase()
  const png = file.mimetype === 'image/png' && extension === '.png' &&
    file.buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const jpeg = file.mimetype === 'image/jpeg' && ['.jpg', '.jpeg'].includes(extension) &&
    file.buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
  if (!png && !jpeg) {
    res.status(400)
    throw new Error('Only JPEG and PNG images are accepted')
  }
  const filename = `image-${randomUUID()}${png ? '.png' : '.jpg'}`
  await mkdir('uploads', { recursive: true })
  await writeFile(path.join('uploads', filename), file.buffer, { flag: 'wx' })
  res.send(`/uploads/${filename}`)
}))

export default router
