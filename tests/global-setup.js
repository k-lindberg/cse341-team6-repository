import { MongoMemoryServer } from 'mongodb-memory-server';

const setup = async (project) => {
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 120000
    }
  });

  project.provide('MONGODB_TEST_URI', mongoServer.getUri());

  return async () => {
    await mongoServer.stop();
  };
};

export default setup;