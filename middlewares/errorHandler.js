

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const status = err.status || 'ERROR'
    const name = err.name || 'Unknown ERROR'
    const message = err.message
    const stack = err.stack
    res.status(statusCode)
    res.json({
        name,
        status,
        statusCode,
        message,
        stack,
    })
}

module.exports = errorHandler 