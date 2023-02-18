---
title: 'Writing Jest tests in a NextJs + Mongoose Application'
slug: 'writing-jest-tests-in-a-nextjs-mongoose-application'
date_published: 2023-02-17T22:53:16.898Z
date_updated: 2023-02-17T22:53:16.898Z
tags: Mongoose, Jest, NextJs, MongoDb, Jest tests
---

### Background

Ever struggled with Javascript/Typescript? You write code correctly, and you check every dependency but things just don't seem to work. I had a similar struggle when I set out to write Jest tests for a NextJs service I was trying to build. One additional complexity was that this service depended on Mongoose/MongoDB. I wanted to be able to test my service function with dummy data. Which meant connecting to and seeding a MongoDB database with relevant data and testing against that dataset. I could use the cloud providers like MongoDB Atlas and maybe that would have made my life easier. But I wanted to avoid a public (internet) n/w connection. So after some search, I found this article - '[Jest with Mongodb](https://jestjs.io/docs/mongodb)'. And while this looked promising it was short-lived. `@shelf/jest-mongodb` works just fine, but it didn't work with my want for seeding the database well. As I soon found out after further reading Jest creates a sandbox environment for each test suite. This made me think it would soon become a performance concern if we had multiple connections, multiple instances of the seeding function and multiple mongo servers running at the same time. 

This led me down many rabbit holes in an attempt to find a solution. From using the `[globalSetup](https://jestjs.io/docs/configuration#globalsetup-string)` to set up the connection and seed the database (only to discover that Jest globals are not shared between globalSetup and test-suites), to attempting to use singletons and dependency injection in tests. But nothing seemed to work. However, I did eventually get to a solution that worked. This tutorial will guide you to that minimal working solution, that worked for me and hopefully will help anyone going down a similar path of struggle.


### Getting Started
Let's start by using a `create-next-app` to create our minimal project. I'll be working with a typescript. We can use the below command to setup the project (feel free to use the project name of your choice) -

```bash
npx create-next-app nextjs-mongoose-jest-test --ts
```

next, we will install some of the `npm` dependencies we'll need -

```bash
npm i --save mongoose 
```
And the following devDependencies - 

```bash
npm i --save-dev jest @types/jest
```

### Setting up Jest
To get started with Jest I'll be using NextJs's Rust-based compiler. If you are keen on using babel, you can follow the installation [instructions for babel + NextJs here](https://nextjs.org/docs/testing#setting-up-jest-with-babel). To continue with using NextJs's Rust-based compiler let's create a `jest.config.js` file with the following content. 

```js file=jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'node',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

```
You can go ahead and test to check if Jest works, and doesn't throw any errors by writing a minimal test file.

### Creating dummy Models and wrapping the Service
Let's create 2 simple dummy Models for our tests. I created two models `user` and `organization` as follows - 

```ts file=/src/models/User.ts
import { model, models, Schema } from "mongoose";

export type IUser = {
  name: string;
  age: number;
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model("User", UserSchema);

export default User;
```
and 
```ts file=/src/models/Organization.ts

import { model, models, Schema } from "mongoose";

export type IOrganization = {
  name: string;
  website: string;
};

const OrgSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Organization =
  models.Organization || model("Organization", OrgSchema);

export default Organization;
```

Now you would technically not want to use the models directly in your API routes/controllers. So to follow the good practice of segregation of concern, you'd probably want to wrap the connection and the associated model logic in an API service.

So here is what the simple `user` and `organization` service content looks like.

```ts file=/src/lib/services/user.ts
import User, { IUser } from "../../models/User";

export const fetchUsers = () => User.find({});

export const fetchUser = (id: string) => User.findById(id);

export const createUser = ({ name, age }: IUser) => {
  const user = new User({ name, age });
  return user.save();
};

export const updateUser = (id: string, updates: Partial<IUser>) =>
  User.findByIdAndUpdate(id, updates, { new: true }).exec();

export const deleteUser = (id: string) =>
  User.findByIdAndDelete(id, { new: true }).exec();
```
And

```ts file=/src/lib/services/organization.ts
import { Types } from "mongoose";
import Organization, { IOrganization } from "../../models/Organization";

export const fetchOrgs = () => Organization.find({});

export const fetchOrg = (id: string | Types.ObjectId) =>
  Organization.findById(id);

export const createOrg = ({ name, website }: IOrganization) => {
  const newOrg = new Organization({ name, website });
  return newOrg.save();
};

export const updateOrgById = (
  id: string | Types.ObjectId,
  updates: Partial<IOrganization>
) => Organization.findByIdAndUpdate(id, updates, { new: true }).exec();

export const deleteOrgById = (id: string | Types.ObjectId) =>
  Organization.findByIdAndDelete(id, { new: true }).exec();

```

### Setting up Mongoose connection
Next, let's set up our mongoose connection. Let's create a helper `database.ts` file with the following content -

```ts file=/src/lib/database.ts
import { connect, ConnectOptions, Mongoose, set } from "mongoose";
import Logger from "./logger";

declare global {
  var mongoose: undefined | Mongoose;
  var __MONGO_URI__: string;
}

const opts: ConnectOptions = {};

async function setupMongoDb() {
  let MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI for connection to mongo database."
    );
  }

  set("strictQuery", true);

  if (process.env.MONGO_DEBUG) {
    set("debug", true);
  }

  try {
    if (!(global as any).mongoose) {
      Logger.debug("Creating new Mongoose Connection.");
      (global as any).mongoose = await connect(MONGODB_URI, opts);
    }
    Logger.debug("Mongoose connected successfully.");
    return (global as any).mongoose;
  } catch (e: any) {
    Logger.error("Mongoose connection failed.");
    Logger.error(e?.message || e, ` || URI: ${MONGODB_URI}`);
    throw new Error(e?.message || e);
  }
}

export default setupMongoDb;
```
This async function will help set up a mongoose connection, assuming that the `MONGODB_URI` environment is set. 

### Seeding the MongoDB before Jest tests
This was the tricky part and took some research and reading through documentation to figure this out. To seed the database only once and make global data available in tests we have to set up a custom environment. To do this we first need to install `jest-environment-node`. We'll also be using the `mongodb-memory-server` so we can spin up a memory database seed our data and destroy the database after the tests, enabling the tests to be run agnostic of n/w or hardware overheads (mostly). 

```bash
npm i --save-dev jest-environment-node mongodb-memory-server
```

To create a module that sets up our jest environment, the module needs to export a class that contains the `setup`, `teardown` and `getVmContext` methods. Both `setup` and `teardown` are async functions. The class can also optionally include an async function `handleTestEvent` to bind to events fired by Jest. You can read more about [JestEnvironment and the events exposed here](https://jestjs.io/docs/configuration#testenvironment-string). 

Now let's create the environment module `customJestEnv.ts` with the following content. 

```ts file=/src/lib/customJestEnv.ts
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
    if (event.name === "test_start") {
      // ...
    }
  }
}

export default CustomJestEnv;
```

Here in the `setup` function I create a new MongoDB memory server and use the `getUri` method to get the connection string to the database. This returns a URI with a random database name (in version 6.9.6). We can now use this URI to connect mongoose. I use another module/class `Seed` which is a helper module to seed the database, which we'll get to shortly. The `teardown` method is where we can ensure that we close any open connection to MongoDB to prevent Jest from giving us an "openhandle" warning. Let's add a `seed.ts` file with the following content (adapt it to your needs). 

```ts file=/src/seed.ts
import { ConnectionStates, Mongoose } from "mongoose";
import orgMocks from "./services/mocks/organizations.json";
import userMocks from "./services/mocks/users.json";
import { createOrg, fetchOrgs } from "./services/organization";
import { createUser, fetchUsers } from "./services/user";

export enum SeedStatus {
  initial = "initial",
  started = "started",
  completed = "completed",
}

export class Seed {
  client: Mongoose;
  private testData = new Map<string, any>();
  status = SeedStatus.initial;

  constructor(client: Mongoose) {
    this.client = client;
  }

  async seedData() {
    if (this.status === SeedStatus.initial) {
      this.status = SeedStatus.started;
      await Promise.all([this.seedOrgs(), this.seedUsers()]);

      const results = await Promise.all([fetchOrgs(), fetchUsers()]);

      this.testData.set("organizations", results[0]);
      this.testData.set("users", results[1]);

      this.status = SeedStatus.completed;
    }
  }

  getTestData(key?: string) {
    return (
      (this.testData.get(key as any) as Record<string, any>) ||
      (this.testData as Map<string, any>)
    );
  }

  private async seedOrgs() {
    const orgsPromises = orgMocks.map((org) => createOrg(org));
    await Promise.all(orgsPromises);
  }

  private async seedUsers() {
    const userPromises = userMocks.map((user) => createUser(user));
    await Promise.all(userPromises);
  }
}
```

This file uses `.json` mock files that contain an array of dummy objects with a dummy value, you could even probably use Faker.js instead of JSON files if that is your preference. I also can expose the test data and function to retrieve test data to individual tests via the shared global object.

### Adding Tests
And finally, we can add our tests. And here is an example of how you'd write a simple test to use the connection and data we seeded earlier.

```ts file=/src/lib/services/user.test.ts
import { Document, Mongoose, Types } from "mongoose";
import {IUser} from "../../models/User";
import setupMongoDb from "../database";
import userMock from "./mocks/users.json";
import {fetchUsers} from "./user";

describe("Organization Test", () => {
  let mongoose: Mongoose | undefined;
  let users: (Document<unknown, any, IUser> &
    IUser & { _id: Types.ObjectId })[];

  beforeAll(async () => {
    mongoose = await setupMongoDb();
    users = (globalThis as any).getTestData("users");
  });

  afterAll(async () => {
    await mongoose?.connection.close();
  });

  test("createOrg test creating Organizations list", async () => {
    let test = await fetchUsers();
    expect(test).toHaveLength(userMock.length);
    expect(users).toHaveLength(userMock.length);
  });
});
```
and

```ts file=/src/lib/services/organization.test.ts
import { Document, Mongoose, Types } from "mongoose";
import { IOrganization } from "../../models/Organization";
import setupMongoDb from "../database";
import { fetchOrgs } from "./organization";
import orgMocks from "./mocks/organizations.json";

describe("Organization Test", () => {
  let mongoose: Mongoose | undefined;
  let orgs: (Document<unknown, any, IOrganization> &
    IOrganization & { _id: Types.ObjectId })[];

  beforeAll(async () => {
    mongoose = await setupMongoDb();
    orgs = (globalThis as any).getTestData("organizations");
  });

  afterAll(async () => {
    await mongoose?.connection.close();
  });

  test("createOrg test creating Organizations list", async () => {
    let test = await fetchOrgs();
    expect(test).toHaveLength(orgMocks.length);
    expect(orgs).toHaveLength(orgMocks.length);
  });
});
```

Now when we open a terminal and navigate to the project's root folder and run `npx jest` you should be greeted with successful tests like below - 
![Passing Jest Tests]('passing-jest-tests.png')


### Final words
I hope this tutorial helped some of you, who might find yourself in a similar situation trying to find a working solution. If you did enjoy or find this useful please drop in a word and/or like this article.