// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utility/jwtUtil'; 
import { log } from 'console';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = await verifyToken(token); 
        
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token', error });
    }
};
