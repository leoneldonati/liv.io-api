import { MONGO_CREDENTIALS } from "@const";
import { MongoClient, type MongoClientOptions } from "mongodb";

const url = `mongodb+srv://leonelroman:${MONGO_CREDENTIALS.DB_PASS}@cluster0.fo3dmlm.mongodb.net/?w=majority`;

const client = new MongoClient(url, {
  retryWrites: true,
  appName: "Cluster0",
} as MongoClientOptions);

export const connectToDb = async () => {
  await client.connect().catch(() => client.close());
};

export const userModel = client
  .db(MONGO_CREDENTIALS.DB_NAME)
  .collection("users");

export const postModel = client
  .db(MONGO_CREDENTIALS.DB_NAME)
  .collection("posts");

export const historiesModel = client
  .db(MONGO_CREDENTIALS.DB_NAME)
  .collection("histories");

export const communityModel = client
  .db(MONGO_CREDENTIALS.DB_NAME)
  .collection("communities");
