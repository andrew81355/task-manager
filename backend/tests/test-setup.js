import {MongoMemoryServer} from 'mongodb-memory-server-global'; // Use global version for binary caching
import mongoose from 'mongoose';

let mongoServer;

export const setupTestDB = () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {useUnifiedTopology: true});
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase(); // Clean up after each test
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop(); // Stop the in-memory server
    });
};
