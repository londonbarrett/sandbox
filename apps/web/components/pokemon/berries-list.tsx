import { sleep } from "./pokemon-list"

export default async function BerriesList() {
  const request = await fetch("https://pokeapi.co/api/v2/berry?limit=1000")
  const data = await request.json()
  await sleep(3000)
  return (
    <div className="flex-1">
      <h1 className="border-b-2 border-gray-300">Berries</h1>
      <ul>
        {data.results.map((berry: { name: string, url: string }) => (
          <li key={berry.name}>
            <a href={berry.url} target="_blank" rel="noopener noreferrer">
              {berry.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
