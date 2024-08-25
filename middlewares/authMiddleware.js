import jwt from 'jsonwebtoken'

const isAuthenticated = async (request, response, next) => {
    try {
        const token = request.cookies.token;
        if (!token) {
            return response.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.id = decoded.id;
        next();
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Internal Server Error through middleware'
        });
    }
};

export default isAuthenticated;