const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  console.error(err)

  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message = `${field} already exists`
  }

  // mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map(e => e.message).join(', ')
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // hide unknown errors in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    message = 'Something went wrong'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export default errorHandler