import ConsultationModel, { Consultation as ConsultationModelInterface } from '../model/consultationModel';
import { Request, Response } from 'express';
import ConsultationRepository from "../repo/ConsultationRepository";
import DogRepository from "../repo/DogRepository";
import {Dog as DogModelInterface} from "../model/dogModel";
import {Dog} from "../model/Dog";

export class ConsultationService {
    private consultationRepository: ConsultationRepository;


    constructor(consultationRepository: ConsultationRepository) {
        this.consultationRepository = consultationRepository;
    }


    getAllConsultations = async (req: Request, res: Response) => {
        try {
            const consults: ConsultationModelInterface[] = await this.consultationRepository.getAllConsultations();
            res.json(consults);
        } catch (error) {
            console.error('Error fetching consultations:', error);
            res.status(500).json({message: 'Failed to fetch consultations'});
        }
    }

    getConsultationById = async (req: Request, res: Response) => {
        const id :string = req.params.id;

        if (!id || id=="") {
            return res.status(400).json({ message: 'Missing or invalid ID' });
        }

        try {

            const consult = await this.consultationRepository.getConsultationById(id);


            if (!consult) {
                return res.status(404).json({ message: 'Consult not found' });
            }


            res.json(consult);
        } catch (error) {
            console.error('Error fetching consultation by ID:', error);
            res.status(500).json({ message: 'An error occurred while fetching the consultation' });
        }
    }

    addConsultation = async (req: Request, res: Response) => {
        const { date, medicationUsed, notes, dogId } = req.body;

        if (notes=="" || medicationUsed=="" || date=="" || dogId=="") {
            return res.status(400).json({ message: 'Missing required fields' });
        }



        try {

            const newConsultFromRepo :ConsultationModelInterface = await this.consultationRepository.addConsultation(date, notes, medicationUsed, dogId);
            res.status(201).json(newConsultFromRepo);
        } catch (error) {
            console.error('Failed to add consultation:', error);
            res.status(500).json({ message: 'Failed to add consultation '  });
        }
    }

    deleteConsultation = async (req: Request, res: Response) => {
        const id : string = req.params.id;

        if (id=="") {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        try {
            const success = await this.consultationRepository.deleteConsultation(id);
            if (success) {
                res.json({ message: 'Consultation deleted successfully' });
            } else {
                res.status(404).json({ message: 'Consultation not found' });
            }
        } catch (error) {
            console.error('Error deleting consultation:', error);
            res.status(500).json({ message: 'An error occurred while deleting the consultation' });
        }
    }


    updateConsultation = async (req: Request, res: Response) => {
        const id :string = req.params.id;
        const { date, medicationUsed, notes, dogId } = req.body;

        if (notes=="" || medicationUsed=="" || date=="" || dogId=="") {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {

            const success : boolean = await this.consultationRepository.updateConsultations(id, date, notes, medicationUsed, dogId );

            if (success) {
                res.json({ message: 'Consultation updated successfully' });
            } else {
                res.status(404).json({ message: 'Consultation not found' });
            }
        } catch (error) {
            console.error('Error updating consultation:', error);
            res.status(500).json({ message: 'An error occurred while updating the consultation' });
        }
    }
}