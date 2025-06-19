import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "fallback-secret-token-for-dev";

export function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}