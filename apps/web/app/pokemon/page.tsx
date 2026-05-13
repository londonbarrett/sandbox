import BerriesList from "@/components/pokemon/berries-list"
import PokemonList from "@/components/pokemon/pokemon-list"
import { Suspense } from "react"

export default function PokemonPage() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Pokemon and Berries</h1>
      <div className="flex w-full">
        <Suspense fallback={<div>Loading Pokemons...</div>}>
          <PokemonList />
        </Suspense>
        <Suspense fallback={<div>Loading Berries...</div>}>
          <BerriesList />
        </Suspense>
      </div>
    </div>
  )
}
