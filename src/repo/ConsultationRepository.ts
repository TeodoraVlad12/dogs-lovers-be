import ConsultationModel, { Consultation as ConsultationModelInterface } from '../model/consultationModel';
import DogModel, {Dog as DogModelInterface} from "../model/dogModel";
import {Dog} from "../model/Dog";



class ConsultationRepository {


    constructor() {

    }

    async getAllConsultations(): Promise<ConsultationModelInterface[]> {
        try {

            const consults = await ConsultationModel.find().lean();
            return consults;
        } catch (error) {
            console.error('Error fetching consultations from the database:', error);
            throw new Error('Failed to fetch consultations from the database');
        }
    }


    async getConsultationById(id: string): Promise<ConsultationModelInterface | undefined> {
        try {

            const consult = await ConsultationModel.findOne({  _id: id }).lean();


            if (!consult) {
                return undefined;
            }


            return consult;
        } catch (error) {
            console.error('Error fetching consultation from the database:', error);
            throw new Error('Failed to fetch consultation from the database');
        }
    }


    async addConsultation(date: Date, notes: string, medications: string, dogId: string): Promise<ConsultationModelInterface> {

        const existingDog = await DogModel.findById(dogId);

        if (!existingDog) {
            throw new Error('Dog not found with ID: ' + dogId);
        }

        try {


            const newConsult = await ConsultationModel.create({

                date: date,
                medicationUsed: medications,
                notes: notes,
                dogId: dogId
            });

            console.log('Consultation added successfully:', newConsult);
            return newConsult;
        } catch (error) {
            console.error('Failed to add consultation:', error);
            throw new Error('Failed to add consultation');
        }
    }

    async deleteConsultation(id: string): Promise<boolean> {


        try {


            const result = await ConsultationModel.deleteOne({ _id: id });
            if (result.deletedCount && result.deletedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error deleting consultation from the database:', error);
            throw new Error('Failed to delete consultation from the database');
        }
    }

    async updateConsultations(id:string, date: Date, notes: string, medications: string, dogId: string): Promise<boolean> {

        const existingDog = await DogModel.findById(dogId);

        if (!existingDog) {
            throw new Error('Dog not found with ID: ' + dogId);
        }

        try {

            const result = await ConsultationModel.updateOne({ _id: id }, { date, notes, medications, dogId }).lean();

            console.log("id for update: " + id);

            if (result.modifiedCount && result.modifiedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error updating consultation:', error);
            throw new Error('An error occurred while updating the consultation');
        }
    }



}

export default ConsultationRepository;