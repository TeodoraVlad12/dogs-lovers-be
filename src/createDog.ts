// createDog.ts

//import Dog from './model/dogModel'; // Import Dog model from dogModel.ts
const Dog = require('./model/dogModel').default;
// Example usage
const createDog = async () => {
    try {
        const dog = new Dog({
            id: 100, // Manually assign an ID
            name: 'Rex',
            weight: 10,
            age: 3
        });
        await dog.save();
        console.log('Dog created successfully:', dog);
    } catch (error) {
        console.error('Error creating dog:', error);
    }
};

createDog(); // Call the function to create a dog
