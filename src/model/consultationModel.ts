import mongoose, { Schema, Document } from 'mongoose';
import {Dog} from "./dogModel";


export interface Consultation extends Document {
    date: Date;
    medicationUsed: string,
    notes: string;
    dogId: Schema.Types.ObjectId;
}


const consultationSchema: Schema = new Schema({
    date: { type: Date, required: true },
    medicationUsed: { type: String, required: true },
    notes: { type: String, required: true },
    dogId: { type: Schema.Types.ObjectId, ref: 'Dog', required: true }
});

const ConsultationModel = mongoose.model<Consultation>('ConsultationModel', consultationSchema);

export default ConsultationModel;