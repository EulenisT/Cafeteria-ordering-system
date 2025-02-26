import { GarnitureResponse } from "../../types.ts";
import { useQuery } from "@tanstack/react-query";
import { getGarniture } from "../../api/garnitureApi.ts";

function GarnitureList() {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["garniture"],
    queryFn: getGarniture,
  });

  if (!isSuccess) {
    return <span>Loading...</span>;
  } else if (error) {
    return <span>Error when fetching garniture...</span>;
  } else
    return (
      <table>
        <tbody>
          {data?.map((garniture: GarnitureResponse) => (
            <tr key={garniture.code}>
              <td>{garniture.nom}</td>
              <td>{garniture.disponible}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
}

export default GarnitureList;
