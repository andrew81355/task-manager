import { MongoMemoryServer } from "mongodb-memory-server-global";
import mongoose from "mongoose";

let mongoServer = null;

export const setupTestDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useUnifiedTopology: true });
  });

  afterEach(async () => {
    // Clean up after each test
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    // Stop the in-memory server
    await mongoServer.stop();
  });
};
