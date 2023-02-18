import { connect, ConnectOptions, Mongoose, set } from "mongoose";
import Logger from "./logger";

declare global {
  var mongoose: undefined | Mongoose;
  var __MONGO_URI__: string;
}

const opts: ConnectOptions = {};

async function setupMongoDb() {
  let MONGODB_URI = process.env.MONGODB_URI as string;

  if (process.env.NODE_ENV === "test" && !MONGODB_URI) {
    MONGODB_URI = (global as any).__MONGO_URI__;
  }

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
