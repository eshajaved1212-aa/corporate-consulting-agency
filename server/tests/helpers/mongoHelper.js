const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

/**
 * Connect to an in-memory MongoDB instance.
 * Call in beforeAll() in each test file that needs DB.
 */
async function connectTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

/**
 * Disconnect and stop the in-memory MongoDB instance.
 * Call in afterAll() in each test file that needs DB.
 */
async function disconnectTestDB() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}

/**
 * Clear all collections between tests.
 * Call in afterEach() in each test file that needs DB.
 */
async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = { connectTestDB, disconnectTestDB, clearTestDB };

