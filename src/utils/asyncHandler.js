const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next)
        } catch (error) {
            await res.status(error.code || 500).json({
                success: false,
                message: error.message
            })
        }

    }
}

export default asyncHandler;