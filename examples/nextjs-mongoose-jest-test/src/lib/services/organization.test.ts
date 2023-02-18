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
