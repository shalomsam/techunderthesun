import { JestEnvironmentConfig, EnvironmentContext } from "@jest/environment";
import NodeEvironment from "jest-environment-node";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";
import setupMongoDb from "./database";
import Logger from "./logger";
import { Seed } from "./seed";

class CustomJestEnv extends NodeEvironment {
  testPath: string;
  docblockPragmas: Record<string, string | string[]>;
  mongod: MongoMemoryServer | undefined;
  mongoose: Mongoose | undefined;
  seed: any;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    try {
      await super.setup();
      const mongod = new MongoMemoryServer();
      await mongod.start();

      // this.mongo = this.global.mongo = await MongoMemoryServer.create();
      this.mongod = mongod;
      // await this.mongo.start();
      process.env.MONGODB_URI = this.global.__MONGO_URI__ =
        await this.mongod.getUri();

      this.mongoose = await setupMongoDb();
      const seedModule = new Seed(this.mongoose as Mongoose);
      await seedModule.seedData();

      this.global.seedComplete = true;
      this.global.getTestData = seedModule.getTestData;
      this.global.testData = seedModule.getTestData() as Map<string, any>;

      await this.mongoose?.connection.close();
    } catch (e: any) {
      Logger.error("Test Error -> ", e?.message || e);
    }
  }

  async teardown() {
    await super.teardown();
    await this.mongoose?.connection.close();
    await this.mongod?.stop();
  }

  getVmContext() {
    return super.getVmContext();
  }

  async handleTestEvent(event: any, _state: any) {
    // console.log('event >> ', event.name);
    if (event.name === "test_start") {
      // ...
    }
  }
}

export default CustomJestEnv;
