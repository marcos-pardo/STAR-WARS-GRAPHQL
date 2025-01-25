import { OptionalId } from "mongodb";

export type StarWarsModel = OptionalId<{
    //numero: number,
    name: string,
    gender: string,
    films: APIFilms[]
}>

export type APIFilms = {
    title: string,
    episode_id: string,
    characters: StarWarsModel[]
}

export type miNumero = {
    name: string,
    gender: string,
    films: APIFilms[]
}