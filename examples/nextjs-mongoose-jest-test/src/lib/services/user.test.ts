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
