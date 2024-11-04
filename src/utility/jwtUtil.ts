import jwt from 'jsonwebtoken';
import { UserDTO } from '../dto/user.tdo';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; 

export const generateToken = (user: UserDTO): string => {
    return jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '1d' }); 
};

export const verifyToken = (token: string): Promise<jwt.JwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as jwt.JwtPayload);
            }
        });
    });
};
