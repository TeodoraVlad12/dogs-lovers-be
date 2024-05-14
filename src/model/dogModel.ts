import mongoose, { Schema, Document } from 'mongoose';


export interface Dog extends Document {
    id: number;
    name: string;
    weight: number;
    age: number;
}

const dogSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    age: { type: Number, required: true }
});


const DogModel = mongoose.model<Dog>('DogModel', dogSchema);


export default DogModel;
