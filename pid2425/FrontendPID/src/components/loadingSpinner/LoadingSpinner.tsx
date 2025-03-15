import { Grid, CircularProgress as MuiCircularProgress } from "@mui/material";

function LoadingSpinner() {
    return (
        <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "50vh" }}
        >
            <Grid item>
                <MuiCircularProgress sx={{ color: "#FFB6C1" }} />
            </Grid>
        </Grid>
    );
}

export default LoadingSpinner;
