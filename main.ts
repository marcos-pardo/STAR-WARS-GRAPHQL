import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient} from "mongodb";
import { StarWarsModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";


const MONGO_URL = Deno.env.get("MONGO_URL")
if(!MONGO_URL)throw new Error("Please provide a MONGO_URL");

  const mongoClient = new MongoClient(MONGO_URL)
  await mongoClient.connect()

console.info("Conectado a Mongo")

const mongodb = mongoClient.db("API_STAR_WARS_2")
const StarCollection = mongodb.collection<StarWarsModel>("StarWars")

const server = new ApolloServer({
  typeDefs: schema, resolvers
})

const {url} = await startStandaloneServer(server,{
  context: async()=>({
    StarCollection
  }),
  listen: { port: 8056 }
})

console.info(`server ready at ${url}`)