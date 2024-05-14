//import { Dog } from '../model/Dog';
import DogModel, { Dog as DogModelInterface } from '../model/dogModel';
import {Dog} from "../model/Dog";
import ConsultationModel from "../model/consultationModel";



class DogRepository {



  constructor() {

  }




  async getAllDogs(): Promise<DogModelInterface[]> {
    try {

      const dogs = await DogModel.find().lean();
      return dogs;
    } catch (error) {
      console.error('Error fetching dogs from the database:', error);
      throw new Error('Failed to fetch dogs from the database');
    }
  }



  async getDogById(id: number): Promise<DogModelInterface | undefined> {
    try {

      const dog = await DogModel.findOne({ id }).lean();


      if (!dog) {
        return undefined;
      }


      return dog;
    } catch (error) {
      console.error('Error fetching dog from the database:', error);
      throw new Error('Failed to fetch dog from the database');
    }
  }



  async addDog(dog: Dog): Promise<DogModelInterface> {

    try {

      const lastDog = await DogModel.findOne().sort({ id: -1 }).limit(1).lean();
      let lastId:number = 0;
      if (lastDog) {
        lastId = lastDog.id;
      }


      const newDog = await DogModel.create({
        id: lastId + 1,
        name: dog.getName(),
        weight: dog.getWeight(),
        age: dog.getAge()
      });

      console.log('Dog added successfully:', newDog);
      return newDog;
    } catch (error) {
      console.error('Failed to add dog:', error);
      throw new Error('Failed to add dog');
    }
  }




  async updateDog(id: number, name: string, weight: number, age: number): Promise<boolean> {
    try {

      const result = await DogModel.updateOne({ id: id }, { name, weight, age }).lean();


      if (result.modifiedCount && result.modifiedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error updating dog:', error);
      throw new Error('An error occurred while updating the dog');
    }
  }


  async deleteDog(id: number): Promise<boolean> {
    try {

      const dog = await this.getDogById(id);

      if (dog){

        await ConsultationModel.deleteMany({ dogId: dog._id });

      }


      const result = await DogModel.deleteOne({ id: id });
      if (result.deletedCount && result.deletedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error deleting dog from the database:', error);
      throw new Error('Failed to delete dog from the database');
    }
  }



  async totalNumberOfDogs(): Promise<number> {
    try {
      const count:number = await DogModel.countDocuments();
      console.log("total number of dogs in the database: " + count);
      return count;
    } catch (error) {
      console.error('Error counting dogs in the database:', error);
      throw new Error('Failed to count dogs in the database');
    }
  }





  async filterDogsByNamePaginated(name: string, offset: number, limit: number): Promise<DogModelInterface[]> {
    try {
      let query = {};


      if (name !== '--') {
        query = { name: { $regex: new RegExp(name, 'i') } };
      }

      // Fetch paginated dogs based on the query criteria
      const dogs = await DogModel.find(query)
          .skip(offset)
          .limit(limit)
          .lean();


      return dogs;
    } catch (error) {
      console.error('Error filtering dogs by name and pagination:', error);
      throw new Error('An error occurred while filtering dogs');
    }
  }



  async totalNumberOfDogsFiltered(name: string): Promise<number> {
    try {

      const count = await DogModel.countDocuments({ name: { $regex: name, $options: 'i' } });
      return count;
    } catch (error) {
      console.error('Error counting dogs:', error);
      throw new Error('Failed to count dogs');
    }
  }



  totalNumberOfDogsInACategory = async (down: number, up: number): Promise<number> => {
    try {

      const count = await DogModel.countDocuments({ age: { $gte: down, $lte: up } });
      return count;
    } catch (error) {
      console.error('Error counting dogs in age category:', error);
      throw new Error('An error occurred while counting dogs in age category');
    }
  }

}

  export default DogRepository;
