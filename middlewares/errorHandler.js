odule.exports = (err, req, res, next) => {
    console.error(`[Error]: ${err.message || err}`);
    if (err.stack) console.error(err.stack);

    if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Upload rejected. Only image types (JPEG, PNG, WebP, GIF) are allowed! :/' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Upload rejected. Maximum image file size constraint is 5MB! :/' });
    }

    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        error: 'An unexpected internal server error occurred! Please try again later. :/'
    });
};