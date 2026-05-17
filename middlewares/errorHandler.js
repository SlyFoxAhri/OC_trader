// middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
    // Log full error stack traces on the server console for debug transparency
    console.error(`💥 [Error Intercepted]: ${err.message || err}`);
    if (err.stack) console.error(err.stack);

    // Filter Multer specific file-size or upload exception states
    if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Upload rejected. Only image types (JPEG, PNG, WebP, GIF) are allowed! :/' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Upload rejected. Maximum image file size constraint is 5MB! :/' });
    }

    // Default Fallback Error for general runtime exceptions
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        error: 'An unexpected internal server error occurred! Please try again later. :/'
    });
};