import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import { routes } from './routes';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dogsRoutes from './routes/dogsRoutes';
import cors from 'cors';
import DogModel from './model/dogModel';
import ConsultationModel, { Consultation } from './model/consultationModel';
//import './dotenv.config';




const app: Application = express();
const port = process.env.PORT || 8000;
dotenv.config();

console.log(process.env);

if (!process.env.MONGO_URI){
    console.log("missing uri");
    process.exit(1);
}
const uri = process.env.MONGO_URI;



async function connect() {     //function for connecting to the db
    try {
        await mongoose.connect(uri);
        console.log("Connected to mongodb");
    } catch (error){
        console.error(error);
    }
}

connect();  //call the function





// body-parser
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());



// routes
app.use('/', routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});


const dogsData = [
    { id: 4, name: 'Bubu', weight: 2, age: 3 },
    { id: 5, name: 'Albu', weight: 12.5, age: 7 },
    { id: 6, name: 'Bella', weight: 12, age: 5 },
    { id: 7, name: 'Max', weight: 3, age: 7 }
];

// Function to add dogs to the database
const addDogsToDatabase = async () => {
    try {
        // Loop through each dog data and create DogModel instances
        for (const dogData of dogsData) {
            const dog = new DogModel(dogData);
            // Save each dog to the database
            await dog.save();
            console.log(`Dog ${dog.name} added to the database.`);
        }
        console.log('All dogs added to the database successfully.');
    } catch (error) {
        console.error('Error adding dogs to the database:', error);
    }
};

const consultationsData = [

    {  date: new Date('2024-01-20'), medicationUsed: "Med1", notes: "healthy", dogId: '661e6968aa62e967aedfc9de' }, //11
    {  date: new Date('2024-02-12'), medicationUsed: "Med3", notes: "further consultation needed", dogId: '661e6907aa62e967aedfc9c6' }, //10

];

const addConsultationsToDatabase = async () => {
    try {
        for (const consult of consultationsData) {
            const consul = new ConsultationModel(consult);
            // Save each dog to the database
            await consul.save();
            console.log(`Consultation ${consul.date} added to the database.`);
        }
        console.log('All consultations added to the database successfully.');
    } catch (error) {
        console.error('Error adding consultations to the database:', error);
    }
};

// Call the function to add dogs to the database
//addDogsToDatabase();
//addConsultationsToDatabase();

/*const getConsultationsForDog = async (dogId: string): Promise<Consultation[]> => {
    try {
        // Find consultations where dogId matches the provided dogId
        const consultations = await ConsultationModel.find({ dogId: dogId }).exec();
        return consultations;
    } catch (error) {
        console.error('Error fetching consultations for dog:', error);
        throw new Error('Failed to fetch consultations for dog');
    }
};

// Example usage
const dogId = '661e6d87c47c589f6e98c6db'; // Example ObjectId string of the dog
getConsultationsForDog(dogId)
    .then((consultations) => {
        console.log('Consultations for dog:', consultations);
    })
    .catch((error) => {
        console.error('Error:', error);
    });*/

console.log("After adding");