const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  const inputError = ['CastError', 'ValidationError', 'MulterError'].includes(err.name)
  const statusCode = res.statusCode !== 200 ? res.statusCode
    : err.code === 11000 ? 409 : inputError ? 400 : err.status || 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export { notFound, errorHandler }
