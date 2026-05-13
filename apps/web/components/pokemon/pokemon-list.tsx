import z from "zod"
import PokemonItem from "./pokemon-item"

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const PokemonDTOSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  url: z.string().nonempty(),
})

export type PokemonDTO = z.infer<typeof PokemonDTOSchema>

async function getPokemon() {
  const list = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
  const data = await list.json()
  return data.results
}

export default async function PokemonList() {
  await sleep(5000)
  const pokemonList = await getPokemon()
  console.log("Pokemon list", pokemonList)
  return (
    <div className="flex-1">
      <h1 className="border-b-2 border-gray-300">Pokemons</h1>
      <ul>
        {pokemonList.map((pokemon: PokemonDTO) => (
          <PokemonItem key={pokemon.name} data={pokemon} />
        ))}
      </ul>
    </div>
  )
}