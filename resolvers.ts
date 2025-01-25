import { StarWarsModel, APIFilms, miNumero } from "./types.ts";
import { ObjectId, Collection } from "mongodb";


type addArgs = {
    numero: number;
}

type Context = {
    StarCollection: Collection<StarWarsModel>
}

type idQuery = {
    id: string
}

export const resolvers = {

    Mutation: {
        addPersonaje: async(_:unknown, args: addArgs, ctx: Context): Promise<StarWarsModel> => {
            
            const { numero } = args;

            const url = `https://swapi.dev/api/people/${numero}`
            const data = await fetch(url)
            const response: miNumero = await data.json()

            const name = response.name
            const films = response.films
            const gender = response.gender

            
            const { insertedId } = await ctx.StarCollection.insertOne({
                name,
                films,
                gender
            })
            return { _id: insertedId, 
                name,
                films,
                gender}

},

        deletePersonaje: async(_:unknown, args: idQuery, ctx: Context): Promise <boolean> => {
            const { deletedCount } = await ctx.StarCollection.deleteOne({_id: new ObjectId(args.id)})
            return deletedCount === 1
        },
    },

    Query: {

        getPersonaje: async(_:unknown, args: idQuery, ctx: Context): Promise <StarWarsModel | null> => {
            return await ctx.StarCollection.findOne({_id: new ObjectId(args.id)})
        },

        getPersonajes: async(_:unknown, __: unknown, ctx: Context): Promise <StarWarsModel[]> => {
            return await ctx.StarCollection.find().toArray()
        }    
    },

    Personaje: {
        id: (parent: StarWarsModel): string => parent._id!.toString(),
        films: async (parent: StarWarsModel): Promise<APIFilms[]> => {

            const films = parent.films;
            const updatedFilms = await Promise.all(films.map(async (film) => {
                const data = await fetch(film);
                const response: APIFilms = await data.json();
                return response;
            }));
            return updatedFilms;
        }

},
Films:{
    characters: async (parent: APIFilms): Promise<miNumero[]> => {
        const characters = parent.characters
        console.log(characters)
        for (let i = 0; i < characters.length; i++){
            const data = await fetch(characters[i])
            const response: StarWarsModel = await data.json()
            characters[i] = response
        }
        return characters
    }
}
}
