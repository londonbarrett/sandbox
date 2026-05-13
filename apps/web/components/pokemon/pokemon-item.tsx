import { PokemonDTO } from "./pokemon-list"

export default function PokemonItem({ data }: { data: PokemonDTO }) {
  return (
    <li>
      <a href={data.url} target="_blank" rel="noopener noreferrer">
        {data.name}
      </a>
    </li>
  )
}