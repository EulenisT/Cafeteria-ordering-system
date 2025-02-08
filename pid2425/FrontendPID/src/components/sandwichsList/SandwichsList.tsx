import {SandwichesResponse} from "../../types.ts";
import {useQuery} from "@tanstack/react-query";
import {getSandwiches} from "../../api/sandwichsapi.ts";

function SandwichsList() {

    const { data, error, isSuccess} = useQuery({
       queryKey: ["sandwichs"],
       queryFn: getSandwiches
    });

    if (!isSuccess) {
        return <span>Loading...</span>
    }
    else if (error) {
        return <span>Error when fetching sandwich...</span>
    }
    else
    return(
        <table>
            <tbody>
            {
                data?.map((sandwich: SandwichesResponse)=>
                    <tr key={sandwich.code}>
                        <td>{sandwich.nom}</td>
                        <td>{sandwich.disponible}</td>
                        <td>{sandwich.prix}</td>
                    </tr>
                )
            }
            </tbody>
        </table>
    );
 }

 export default SandwichsList;
