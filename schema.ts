export const schema = `#graphql

    type Personaje {
        id: ID!
        name: String!
        gender: String!
        films: [Films]!
    }

    type Films {
        title: String!
        episode_id: String!
        characters: [Personaje]!
    }
    

    type Query {
        getPersonaje(id:ID!): Personaje
        getPersonajes: [Personaje!]!
    }

    type Mutation {
        addPersonaje(numero: Int!): Personaje!
        deletePersonaje(id: ID!): Boolean!
    }

`