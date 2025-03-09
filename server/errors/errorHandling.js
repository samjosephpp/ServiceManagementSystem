const errorHandler = (err, req, res, next) => {

    // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ message: message })
}
module.exports = errorHandler;
