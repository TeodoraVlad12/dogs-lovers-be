import UserRepo from "../repo/UserRepo";
import {Request, Response} from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel, {User} from "../model/userModel";


interface CustomRequest extends Request {
    user?: User;
}




export class UserService {
    private userRepository: UserRepo;


    constructor(userRepository: UserRepo) {
        this.userRepository = userRepository;
    }

    getAccountByUsername = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        try {
            // Authenticate user using UserRepository
            const isUserAuthenticated = await this.userRepository.searchByUsername(username, password);

            if (!isUserAuthenticated) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Find the user by username
            const user: User | null = await UserModel.findOne({ username });

            if (!user) {
                return res.status(401).json({ message: 'No account with this username' });
            }

            const secretKey: string | undefined = process.env.JWT_SECRET;

            // If the password is valid, generate a JWT token
            const token = jwt.sign({ userId: user._id }, 'abc1def2ghi3', { expiresIn: '1h' });

            // Send the token in the response
            res.status(200).json({ token });
        } catch (error) {
            console.error('Error in searching username/password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    /*getAccountByUsername = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const logedIn = await this.userRepository.searchByUsername(username, hashedPassword);

            const secretKey  = process.env.JWT_SECRET;


            if (!logedIn){
                res.status(401).json({ message: 'No account with this username'});
            } else{
                res.json(logedIn);}




        } catch (error) {
            console.error('Error in searching username/password:', error);
            res.status(402).json({ message: 'Wrong password'});
        }
    }*/

    register = async (req: Request, res: Response) => {
        const { username, password , email, country} = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds, higher means more secure but slower



            const registered :boolean = await this.userRepository.register(username, hashedPassword, email, country);

            if (!registered){
                res.status(401).json({ message: 'There is already an account with this username'});
            } else{
                res.json(registered);}




        } catch (error) {
            console.error('Error in registering:', error);
            res.status(402).json({ message: 'Register failed'});
        }
    }

    getUserDetails = async (req: CustomRequest, res: Response) => {
        try {
            // Extract user ID from the request object (assuming it's attached by the verifyToken middleware)
            const userId = req.user?._id;

            if (!userId) {
                return res.status(401).json({ message: 'User ID not found' });
            }

            // Fetch user details from the database using the user ID
            const user = await this.userRepository.getUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Extract relevant user details
            const userDetails = {
                username: user.username,
                email: user.email,
                country: user.country
            };

            res.json(userDetails);
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };





}

