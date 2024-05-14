import mongoose from "mongoose";
import { DogService } from './controller/DogService';
import DogRepository from "./repo/DogRepository";
import { Request, Response } from 'express';
import {ConsultationService} from "./controller/ConsultationService";
import ConsultationRepository from "./repo/ConsultationRepository";
import DogModel from "./model/dogModel";
import ConsultationModel from "./model/consultationModel";
import UserRepo from "./repo/UserRepo";
import {UserService} from "./controller/UserService";
import UserModel from "./model/userModel";

// Create mocks for Request and Response
const mockRequest = {} as Request;
const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

res.json.mockReturnValue(res);

const uri = "mongodb+srv://teovlad03:dogsapppassword@dogsappcluster.zhslf8l.mongodb.net/TestsDogs?retryWrites=true&w=majority&appName=DogsAppCluster";


afterAll(async () => {
    try {

        await DogModel.deleteMany({});


        await ConsultationModel.deleteMany({});

        await UserModel.deleteMany({});


        await mongoose.connection.close();

        console.log("Cleanup completed successfully");
    } catch (error) {
        console.error("Cleanup error:", error);
    }
});

async function connect() {     //function for connecting to the db
    try {
        await mongoose.connect(uri);
        console.log("Connected to mongodb");
    } catch (error){
        console.error(error);
    }
}



connect();
console.log("Connected to db");


describe('Adding', () => {
    let dogService: DogService;
    let dogRepository: DogRepository;

    let consultationService: ConsultationService;
    let consultationRepo: ConsultationRepository;

    beforeEach(() => {
        dogRepository = new DogRepository();
        dogService = new DogService(dogRepository);

        consultationRepo = new ConsultationRepository();
        consultationService = new ConsultationService(consultationRepo);

    });

    test('Should add a dog', async () => {
        const req: Request = {
            body: {
                name: 'Ci',
                weight: 2,
                age: 10
            }
        } as Request;

        await dogService.addDog(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        const responseBody = res.json.mock.calls[0][0];
        expect(responseBody.name).toBe('Ci');
        expect(responseBody.weight).toBe(2);
        expect(responseBody.age).toBe(10);

        const dogId : string = responseBody._id;
        const date: Date = new Date();



        const reqCons: Request = {
            body: {
                date: date,
                medicationUsed: 'Medication',
                notes: 'Notes',
                dogId: dogId
            }
        } as Request;

        const resCons: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await consultationService.addConsultation(reqCons, resCons);

        expect(resCons.status).toHaveBeenCalledWith(201);
        const responseBodyCons = resCons.json.mock.calls[0][0];
        console.log("Test body: " + responseBodyCons);
        expect(responseBodyCons.medicationUsed).toBe('Medication');
        expect(responseBodyCons.notes).toBe('Notes');
        expect(responseBodyCons.date).toBe(date);
        expect(responseBodyCons.dogId).toBe(dogId);



    });

    test('Should handle failed dog addition', async () => {
        const req: Request = {
            body: {
                name: '',
                weight: 2,
                age: 10
            }
        } as Request;



        // Define a new response object
        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the addDog method
        await dogService.addDog(req, res);

        // Verify that the appropriate status and message are returned
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    test('Should handle failed consultation addition', async () => {
        const req: Request = {
            body: {
                date: '',
                medicationUsed: 'Medication',
                notes: 'Notes',
                dogId: 'invalidDogId' // Simulating an invalid dog ID
            }
        } as Request;

        // Define a new response object
        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the addConsultation method
        await consultationService.addConsultation(req, res);

        // Verify that the appropriate status and message are returned
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });



});



describe('Updating', () => {
    let dogService: DogService;
    let dogRepository: DogRepository;

    let consultationService: ConsultationService;
    let consultationRepo: ConsultationRepository;

    beforeEach(() => {
        dogRepository = new DogRepository();
        dogService = new DogService(dogRepository);

        consultationRepo = new ConsultationRepository();
        consultationService = new ConsultationService(consultationRepo);

    });

    test('Should update a dog', async () => {
        // Add a new dog to update
        const addDogRequest: Request = {
            body: {
                name: 'Max',
                weight: 2,
                age: 10
            }
        } as Request;
        const addDogResponse: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await dogService.addDog(addDogRequest, addDogResponse);
        const addedDogId = addDogResponse.json.mock.calls[0][0].id;

        const stringId = addDogResponse.json.mock.calls[0][0]._id;


        mockRequest.params = { id: addedDogId };
        mockRequest.body = { name: 'Updated Name', weight: 30, age: 7 };


        const updateDogResponse: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await dogService.updateDog(mockRequest, updateDogResponse);

            // Verify that the dog is updated successfully

            expect(updateDogResponse.json).toHaveBeenCalledWith({message: 'Dog updated successfully'});


        const reqCons: Request = {
            body: {
                date: new Date(),
                medicationUsed: 'Medication',
                notes: 'Notes',
                dogId: stringId
            }
        } as Request;

        const resCons: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await consultationService.addConsultation(reqCons, resCons);
        const addedConsId = resCons.json.mock.calls[0][0]._id;

        mockRequest.params = { id: addedConsId };
        mockRequest.body = { date: new Date(),
            medicationUsed: 'MedicationNew',
            notes: 'NotesNew',
            dogId: stringId };


        const updateConsResponse: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await consultationService.updateConsultation(mockRequest, updateConsResponse);

        // Verify that the dog is updated successfully

        expect(updateConsResponse.json).toHaveBeenCalledWith({message: 'Consultation updated successfully'});


    });

    test('Should not update a dog', async () => {
        // Add a new dog to update
        const addDogRequest: Request = {
            body: {
                name: '',
                weight: 2 ,
                age: 10
            }
        } as Request;
        const addDogResponse: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await dogService.addDog(addDogRequest, addDogResponse);
        const addedDogId = addDogResponse.json.mock.calls[0][0].id;




        mockRequest.params = {id: addedDogId};
        mockRequest.body = {name: 'Updated Name', weight: 30, age: 7};


        const updateDogResponse: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await dogService.updateDog(mockRequest, updateDogResponse);



        expect(updateDogResponse.status).toHaveBeenCalledWith(500);


    });
});


    describe('Deleting', () => {

        let dogService: DogService;
        let dogRepository: DogRepository;

        let consultationService: ConsultationService;
        let consultationRepo: ConsultationRepository;

        beforeEach(() => {
            dogRepository = new DogRepository();
            dogService = new DogService(dogRepository);

            consultationRepo = new ConsultationRepository();
            consultationService = new ConsultationService(consultationRepo);

        });

        test('Should delete a dog and associated consultations', async () => {
            // Add a new dog to update
            const addDogRequest: Request = {
                body: {
                    name: 'Max',
                    weight: 2,
                    age: 10
                }
            } as Request;
            const addDogResponse: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await dogService.addDog(addDogRequest, addDogResponse);
            const addedDogId = addDogResponse.json.mock.calls[0][0].id;

            const stringId = addDogResponse.json.mock.calls[0][0]._id;


            const date: Date = new Date();



            const reqCons: Request = {
                body: {
                    date: date,
                    medicationUsed: 'Medication',
                    notes: 'Notes',
                    dogId: stringId
                }
            } as Request;

            const resCons: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await consultationService.addConsultation(reqCons, resCons);

            const idCons = resCons.json.mock.calls[0][0]._id;

            console.log("Id cons:" + idCons);

            mockRequest.params = { id: addedDogId };

            const deleteDogResponse: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };



            await dogService.deleteDog(mockRequest, deleteDogResponse);



            expect(deleteDogResponse.json).toHaveBeenCalledWith({message: 'Dog deleted successfully'});


            //see if the consultation associated with the dog was deleted


            mockRequest.params = { id: idCons };
            const getConsResponse: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await consultationService.getConsultationById(mockRequest, getConsResponse);
            expect(getConsResponse.json).toHaveBeenCalledWith({message: 'Consult not found'});


    });

        test('Should delete a consultation', async () => {

            const req: Request = {
                body: {
                    name: 'Ci',
                    weight: 2,
                    age: 10
                }
            } as Request;

            await dogService.addDog(req, res);

            const responseBody = res.json.mock.calls[0][0];


            const dogId : string = responseBody._id;



            const reqCons: Request = {
                body: {
                    date: new Date(),
                    medicationUsed: 'Medication',
                    notes: 'Notes',
                    dogId: dogId
                }
            } as Request;

            const resCons: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await consultationService.addConsultation(reqCons, resCons);


            const responseBodyCons = resCons.json.mock.calls[0][0];
            const idCons = responseBodyCons._id;

            mockRequest.params = { id: idCons };

            const deleteConsResponse: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };



            await consultationService.deleteConsultation(mockRequest, deleteConsResponse);



            expect(deleteConsResponse.json).toHaveBeenCalledWith({message: 'Consultation deleted successfully'});




        });



});


describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepo;

    beforeEach(() => {
        userRepository = new UserRepo(); // Initialize your UserRepository mock
        userService = new UserService(userRepository); // Initialize your UserService with the mock UserRepository
    });

    describe('register', () => {
        it('should register a new user', async () => {
            // Mock request and response objects
            const req: any = {
                body: {
                    username: 'test_user',
                    password: 'test_password',
                    email: 'test@example.com',
                    country: 'TestCountry'
                }
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Call the register function
            await userService.register(req, res);

            // Assertions

            expect(res.json).toHaveBeenCalledWith(true);
        });

        it('should handle registration failure', async () => {
            // Mock request and response objects
            const req: any = {
                body: {
                    username: 'existing_user', // Assuming this username already exists
                    password: 'test_password',
                    email: 'test',
                    country: 'TestCountry'
                }
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Call the register function
            await userService.register(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
        });
    });

    describe('logIn', () => {
        it('should log in a user', async () => {
            // Mock request and response objects
            const req: any = {
                body: {
                    username: 'test_user',
                    password: 'test_password'
                }
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Call the login function
            await userService.getAccountByUsername(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);

        });

        it('should handle login failure', async () => {
            // Mock request and response objects
            const req: any = {
                body: {
                    username: 'nonexistent_user', // Assuming this username doesn't exist
                    password: 'test_password'
                }
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Call the login function
            await userService.getAccountByUsername(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
        });
    });
});










