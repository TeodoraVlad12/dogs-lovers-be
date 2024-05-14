import mongoose, { Schema, Document } from 'mongoose';



export interface User extends Document {
    username: string;
    password: string;
    email?: string;
    country?: string

}


const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {type: String },
    country: {type: String}

});

const UserModel = mongoose.model<User>('UserModel', userSchema);

export default UserModel;