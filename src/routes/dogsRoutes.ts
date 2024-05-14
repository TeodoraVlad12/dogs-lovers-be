
import express from 'express';
import { Router, Request, Response } from 'express';
import { Dog } from '../model/Dog';
import {DogService} from "../controller/DogService";
import DogRepository from "../repo/DogRepository";
import {ConsultationService} from "../controller/ConsultationService";
import ConsultationRepository from "../repo/ConsultationRepository";
import UserRepo from "../repo/UserRepo";
import {UserService} from "../controller/UserService";
import { verifyToken } from '../middleware/Middleware';

const router = express.Router();



const dogRepository : DogRepository = new DogRepository();
const dogService : DogService = new DogService(dogRepository);

const consultationRepository: ConsultationRepository = new ConsultationRepository();
const consultationService: ConsultationService = new ConsultationService(consultationRepository);

const userRepository : UserRepo = new UserRepo();
const userService :     UserService = new UserService(userRepository);

//GET DOGS
router.get('/dogs',verifyToken, dogService.getAllDogs);

router.get('/dogs/total',verifyToken, dogService.totalNumberOfDogs);

//GET BY ID
router.get('/dogs/:id', verifyToken,dogService.getDogById);

//ADD DOG
router.post('/dogs',verifyToken,  dogService.addDog);

//UPDATE DOG
router.put('/dogs/:id',verifyToken, dogService.updateDog);

//DELETE DOG
router.delete('/dogs/:id',verifyToken, dogService.deleteDog);

// Filter dogs by name
//router.get('/dogs/filter/:name', dogService.filterDogsByName);

router.get('/dogs/filter/number/:name', verifyToken, dogService.numberFilteredDogs);

router.get('/dogs/chart/categories',verifyToken,  dogService.numberDogsCategories);

router.get('/dogs/filter/pagination/:name',verifyToken,  dogService.filterDogsByNamePagination);

router.get('/dogs/consultation/:id', dogService.getConsultationsForDog);




// Filter dogs by age
//router.get('/dogs/filter/age/:age', dogService.filterDogsByAge);



router.get('/consultations', consultationService.getAllConsultations);
router.get('/consultations/:id', consultationService.getConsultationById);
router.post('/consultations', consultationService.addConsultation);
router.delete('/consultations/:id', consultationService.deleteConsultation);
router.put('/consultations/:id', consultationService.updateConsultation);




router.post('/login', userService.getAccountByUsername );
router.post('/register', userService.register);
router.get('/userDetails', verifyToken, userService.getUserDetails);

export default router;
