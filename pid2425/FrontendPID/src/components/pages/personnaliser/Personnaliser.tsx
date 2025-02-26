import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useQuery } from "@tanstack/react-query";
import { getGarniture } from "../../../api/garnitureApi.ts";
import { GarnitureResponse } from "../../../types.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const columns: GridColDef[] = [
  { field: "nom", headerName: "Garniture", width: 130 },
  {
    field: "disponible",
    headerName: "Disponibilité",
    width: 130,
    renderCell: (params) => (
      <IconButton>
        {params.value ? (
          <CheckCircleIcon sx={{ color: "green" }} />
        ) : (
          <CancelIcon sx={{ color: "red" }} />
        )}
      </IconButton>
    ),
  },
];

export default function Personnaliser() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["garniture"],
    queryFn: getGarniture,
  });

  if (isLoading) {
    return (
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "50vh" }}
      >
        <Grid item>
          <CircularProgress sx={{ color: "#FFB6C1" }} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return <span>Erreur...</span>;
  }

  const rows = data?.map((garniture: GarnitureResponse, index: number) => ({
    id: index + 1,
    nom: garniture.nom,
    disponible: garniture.disponible,
  }));

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        isRowSelectable={(params) => params.row.disponible}
      />
    </Paper>
  );
}
