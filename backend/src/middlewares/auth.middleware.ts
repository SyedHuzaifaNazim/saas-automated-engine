import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Admin Access Required' });
        }
    });
};