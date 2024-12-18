import { MapNewRoute } from "./MapNewRoute";
import { NewRouteForm } from "./NewRouteForm";
export async function searchDirections(source: string, destination: string) {
  const [sourceResponse, destinationResponse] = await Promise.all([
    fetch(`http://localhost:3000/places?text=${source}`, {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }),
    fetch(`http://localhost:3000/places?text=${destination}`, {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }),
  ]);
  if (!sourceResponse.ok) {
    console.error(await sourceResponse.text());
    throw new Error("Failed to fetch source data");
  }
  if (!destinationResponse.ok) {
    console.error(await destinationResponse.text());
    throw new Error("Failed to fetch destination data");
  }
  const [sourceData, destinationData] = await Promise.all([sourceResponse.json(), destinationResponse.json()]);
  const placeSourceId = sourceData.candidates[0].place_id;
  const placeDestinationId = destinationData.candidates[0].place_id;
  const directionsResponse = await fetch(`http://localhost:3000/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`, {
    // cache: "force-cache", //default
    // next: {
    //   revalidate: 1 * 60 * 60 * 24, // 1 dia
    // },
  });
  if (!directionsResponse.ok) {
    console.error(await directionsResponse.text());
    throw new Error("Failed to fetch directions");
  }
  const directionsData = await directionsResponse.json();
  return {
    directionsData,
    placeSourceId,
    placeDestinationId,
  };
}
export async function NewRoutePage({ searchParams }: { searchParams: Promise<{ source: string; destination: string }> }) {
  const { source, destination } = await searchParams;
  const result = source && destination ? await searchDirections(source, destination) : null;
  let directionsData = null;
  let placeSourceId = null;
  let placeDestinationId = null;
  if (result) {
    directionsData = result.directionsData;
    placeSourceId = result.placeSourceId;
    placeDestinationId = result.placeDestinationId;
  }
  return (
    <div className="flex flex-1 w-full h-full">
      <div className="w-1/3 p-4 h-full">
        <h4 className="text-3xl text-contrast mb-2">Nova rota</h4>
        <form className="flex flex-col space-y-4" method="get">
          <div className="relative">
            <input
              id="source"
              name="source"
              type="search"
              placeholder=""
              defaultValue={source}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="source"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Origem
            </label>
          </div>
          <div className="relative">
            <input
              id="destination"
              name="destination"
              type="search"
              placeholder=""
              defaultValue={destination}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="destination"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Destino
            </label>
          </div>
          <button type="submit" className="bg-main text-primary p-2 rounded text-xl font-bold">
            Pesquisar
          </button>
        </form>
        {directionsData && (
          <div className="mt-4 p-4 border rounded text-contrast">
            <ul>
              <li className="mb-2">
                <strong>Origem:</strong> {directionsData.routes[0].legs[0].start_address}
              </li>
              <li className="mb-2">
                <strong>Destino:</strong> {directionsData.routes[0].legs[0].end_address}
              </li>
              <li className="mb-2">
                <strong>Distância:</strong> {directionsData.routes[0].legs[0].distance.text}
              </li>
              <li className="mb-2">
                <strong>Duração:</strong> {directionsData.routes[0].legs[0].duration.text}
              </li>
            </ul>
            <NewRouteForm>
              {placeSourceId && <input type="hidden" name="sourceId" defaultValue={placeSourceId} />}
              {placeDestinationId && <input type="hidden" name="destinationId" defaultValue={placeDestinationId} />}
              <button type="submit" className="bg-main text-primary font-bold p-2 rounded mt-4">
                Adicionar rota
              </button>
            </NewRouteForm>
          </div>
        )}
      </div>
      <MapNewRoute directionsData={directionsData} />
    </div>
  );
}
export default NewRoutePage;
