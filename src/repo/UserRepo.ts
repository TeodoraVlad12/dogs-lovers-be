import UserModel, { User as UserModelInterface } from "../model/userModel";
import DogModel from "../model/dogModel";
import bcrypt from 'bcrypt';


class UserRepo {
    constructor() {}

    async searchByUsername(username: string, password: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ username }).lean();

            if (!user) {
                return false;
            }

            // Compare the provided password with the hashed password stored in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Incorrect password');
            }

            return true;
        } catch (error) {
            console.error('Error fetching username or password from the database:', error);
            throw new Error('Failed to fetch username or password from the database');
        }
    }

    /*async searchByUsername(username: string, password: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ username: username }).lean();

            if (!user) {
                return false;
            }

            if (password !== user.password) {
                throw new Error('Incorrect password');
            }

            return true;
        } catch (error) {
            console.error('Error fetching username or password from the database:', error);
            throw new Error('Failed to fetch username or password from the database');
        }
    }*/

    async register(username: string, password: string, email: string, country: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ username: username }).lean();

            if (user) {
                return false;
            }

            const newUser = await UserModel.create({
                username: username,
                password: password,
                email: email,
                country: country

            });

            console.log('User added successfully:', newUser);


            return true;
        } catch (error) {
            console.error('Error fetching username or password from the database:', error);
            throw new Error('Failed to fetch username or password from the database');
        }
    }

    async getUserById(id: string): Promise<UserModelInterface | null> {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (error) {
            console.error('Error fetching user from the database by ID:', error);
            throw new Error('Failed to fetch user from the database by ID');
        }
    }
}


export default UserRepo;