import {Dog} from "../model/Dog";
import { Request, Response } from 'express';
import DogRepository from "../repo/DogRepository";
import DogModel, { Dog as DogModelInterface } from '../model/dogModel';
import ConsultationModel, {Consultation} from "../model/consultationModel";


export class DogService {
    private dogRepository: DogRepository;


    constructor(dogRepository: DogRepository) {
        this.dogRepository = dogRepository;
    }




    getAllDogs = async (req: Request, res: Response) => {
        try {
            const dogs: DogModelInterface[] = await this.dogRepository.getAllDogs();
            res.json(dogs);
        } catch (error) {
            console.error('Error fetching dogs:', error);
            res.status(500).json({ message: 'Failed to fetch dogs' });
        }
    }




    getDogById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Missing or invalid ID' });
        }

        try {

            const dog = await this.dogRepository.getDogById(id);


            if (!dog) {
                return res.status(404).json({ message: 'Dog not found' });
            }


            res.json(dog);
        } catch (error) {
            console.error('Error fetching dog by ID:', error);
            res.status(500).json({ message: 'An error occurred while fetching the dog' });
        }
    }




    addDog = async (req: Request, res: Response) => {
        const { name, weight, age } = req.body;
        console.log("New add request");
        console.log("name: ", name, " weight: ", weight, "age: ", age);

        if (!name || !weight || !age) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newDog : Dog = new Dog(0, name, weight, age);
        console.log(newDog);

        try {

            const newDogFromRepo :DogModelInterface = await this.dogRepository.addDog(newDog);
            res.status(201).json(newDogFromRepo);
        } catch (error) {
            console.error('Failed to add dog:', error);
            res.status(500).json({ message: 'Failed to add dog' });
            console.log(error);
        }
    }




    updateDog = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { name, weight, age } = req.body;
        console.log("New update request");

        if (!name || !weight || !age) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {

            const success = await this.dogRepository.updateDog(id,  name, parseFloat(weight), parseFloat(age) );

            if (success) {
                res.json({ message: 'Dog updated successfully' });
            } else {
                res.status(404).json({ message: 'Dog not found' });
            }
        } catch (error) {
            console.error('Error updating dog:', error);
            res.status(500).json({ message: 'An error occurred while updating the dog' });
        }
    }


    deleteDog = async (req: Request, res: Response) => {
        const id : number = parseInt(req.params.id);
        console.log("New delete request");

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        try {
            const success = await this.dogRepository.deleteDog(id);
            if (success) {
                res.json({ message: 'Dog deleted successfully' });
            } else {
                res.status(404).json({ message: 'Dog not found' });
            }
        } catch (error) {
            console.error('Error deleting dog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the dog' });
        }
    }

    totalNumberOfDogs = async (req: Request, res: Response) => {
        try {
            // Call the repository method to get the total number of dogs
            const totalDogs = await this.dogRepository.totalNumberOfDogs();
            res.json({ totalDogs });
        } catch (error) {
            console.error('Error counting dogs:', error);
            res.status(500).json({ message: 'Failed to count dogs' });
        }
    }





    filterDogsByNamePagination = async (req: Request, res: Response) => {
        try {
            console.log("We are in the filter dogs by name pagination");
            const name = req.params.name;
            const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
            const limit = parseInt(req.query.limit as string) || 10; // Default to limit 10 if not provided
            const offset = (page - 1) * limit; // Calculate offset

            // Fetch paginated and filtered dogs directly from the repository
            const paginatedDogs = await this.dogRepository.filterDogsByNamePaginated(name, offset, limit);

            res.json(paginatedDogs);
        } catch (error) {
            console.error('Error filtering dogs by name:', error);
            res.status(500).json({ message: 'An error occurred while filtering dogs' });
        }
    }

    numberFilteredDogs = async (req: Request, res: Response) => {
        try {
            console.log("hello");
            const name = req.params.name.trim();



            console.log("name"+name);

            if (name != "--") {
                // Fetch all dogs matching the name
                const totalFilteredDogs : number =  await this.dogRepository.totalNumberOfDogsFiltered(name);
                console.log("number service: " + totalFilteredDogs);
                res.json(totalFilteredDogs);
            } else {
                // If name is empty, fetch all dogs
                const totalFilteredDogs : number =  await this.dogRepository.totalNumberOfDogs();
                res.json(totalFilteredDogs);
            }




        } catch (error) {
            console.error('Error filtering dogs by name:', error);
            res.status(500).json({ message: 'An error occurred while filtering dogs' });
        }
    }

    numberDogsCategories = async (req: Request, res: Response) => {
        console.log("in numberDogsCategories");
        try {
            const zeroThree : number = await this.dogRepository.totalNumberOfDogsInACategory(0,3);
            const fourSeven : number = await this.dogRepository.totalNumberOfDogsInACategory(4,7);
            const eightTen : number = await this.dogRepository.totalNumberOfDogsInACategory(8,100);

            console.log("0-3" + zeroThree);
            console.log("4-7" + fourSeven);
            console.log("8-10" + eightTen);



            res.json({
                zeroThree: zeroThree,
                fourSeven: fourSeven,
                eightTen: eightTen
            });


        } catch (error) {
            console.error('Error counting dogs for chart:', error);
            res.status(400).json({ message: 'An error occurred while counting dogs for chart' });
        }
    };

    getConsultationsForDog = async (req: Request, res: Response)  => {
        const id : number = parseInt(req.params.id);
        const dog = await this.dogRepository.getDogById(id);

        if (!dog) {
            return res.status(404).json({ message: 'Dog not found' });
        }

        try {

            const stringId = dog._id;
            console.log("stringId dog: " + stringId);

            const consultations = await ConsultationModel.find({ dogId: stringId });
            res.json(consultations);
        } catch (error) {
            console.error('Error fetching consultations for dog:', error);
            throw new Error('Failed to fetch consultations for dog');
        }
    };



    /*filterDogsByAge = (req: Request, res: Response) => {
        const age = req.params.age;

        if (!age) {
            return res.status(400).json({ message: 'Age parameter is missing' });
        }


        const allDogs = this.dogRepository.getAllDogs();
        const filteredDogs = allDogs.filter(dog => dog.getAge()==parseInt(age));
        res.json(filteredDogs);

    }
*/



}