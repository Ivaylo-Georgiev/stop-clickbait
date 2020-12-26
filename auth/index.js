require('dotenv').config();
const jwt = require('jsonwebtoken');
const path = require('path');

function authenticateJWTQueryString(req, res, next) {
    const accessToken = req.query.accessToken;

    if (accessToken === 'null' || accessToken === undefined) {
        res.status(401);
        res.sendFile(path.join(__dirname, '../html/unauthorized.html'));
        return;
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403);
            res.sendFile(path.join(__dirname, '../html/forbidden.html'));
            return;
        }
        req.user = user;
        next();
    });
};

module.exports.authenticateJWTQueryString = authenticateJWTQueryString;