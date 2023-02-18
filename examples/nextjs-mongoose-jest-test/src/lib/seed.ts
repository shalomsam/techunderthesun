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
