import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel, {User} from '../model/userModel';


interface CustomRequest extends Request {
    user?: User;
}



export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!process.env.JWT_SECRET){
        console.log("missing jwt key");
        process.exit(1);
    }
    const jwt_key = process.env.JWT_SECRET;
    console.log("aici1");
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log("aici2");

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Synchronously verify the token
        console.log("token: ", token);
        const decoded = jwt.verify(token, jwt_key) as JwtPayload;
        console.log("aici3");

        // Asynchronously look up the user in the database
        UserModel.findById(decoded.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Attach the user object to the request for further processing
                req.user = user;
                next(); // Pass control to the next middleware or route handler
            })
            .catch(error => {
                console.error('Error verifying user:', error);
                return res.status(500).json({ message: 'Internal server error' });
            });
    } catch (error) {
        console.error('Failed to authenticate token:', error);
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
};
