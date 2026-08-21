const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/user/login');
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.clearCookie('token');
        res.redirect('/user/login');
    }
}

module.exports = requireAuth;