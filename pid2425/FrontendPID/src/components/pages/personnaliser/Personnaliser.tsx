import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGarniture } from "../../../api/garnitureApi.ts";
import { getSauces } from "../../../api/saucesApi.ts";
import { GarnitureResponse, SaucesResponse } from "../../../types.ts";
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Divider,
    IconButton,
    Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function Personnaliser() {

    const [hoveredGarnitureIndex, setHoveredGarnitureIndex] = useState<number | null>(null);
    const [hoveredSauceIndex, setHoveredSauceIndex] = useState<number | null>(null);

    const { data: garnitureData, isLoading: garnitureLoading } = useQuery({
        queryKey: ["garniture"],
        queryFn: getGarniture,
    });

    const { data: saucesData, isLoading: saucesLoading } = useQuery({
        queryKey: ["sauces"],
        queryFn: getSauces,
    });

    if (garnitureLoading || saucesLoading) {
        return (
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
                Loading garniture or sauces...
            </Typography>
        );
    }

    const handleAddClick = (item: GarnitureResponse | SaucesResponse) => {
        console.log("Item added:", item);
        // Lógica para agregar al carrito
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Garnitures */}
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 1,
                    fontFamily: "cursive",
                    fontWeight: "bold",
                }}
            >
                Garnitures:
            </Typography>
            <Box sx={{ paddingBottom: "25px" }}>
                <List>
                    {garnitureData?.map((item: GarnitureResponse, index: number) => (
                        <React.Fragment key={item.nom}>
                            <ListItem
                                alignItems="flex-start"
                                style={{
                                    position: "relative",
                                    backgroundColor: hoveredGarnitureIndex === index && item.disponible ? "#f9e1e6" : "transparent",
                                    transition: "background-color 0.3s ease",
                                    cursor: item.disponible ? "pointer" : "default",
                                }}
                                onMouseEnter={() => item.disponible && setHoveredGarnitureIndex(index)}
                                onMouseLeave={() => item.disponible && setHoveredGarnitureIndex(null)}
                            >
                                <ListItemAvatar>
                                    <Avatar alt={item.nom} src="https://via.placeholder.com/40" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="span">
                                            {item.nom} - ${item.prix.toFixed(2)}
                                        </Typography>
                                    }
                                    secondary={`Disponibilité : ${item.disponible ? "Disponible" : "Non disponible"}`}
                                />
                                <IconButton
                                    onClick={() => handleAddClick(item)}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        backgroundColor: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#f0f0f0",
                                        },
                                    }}
                                    disabled={!item.disponible}
                                >
                                    <AddIcon />
                                </IconButton>
                            </ListItem>
                            {index < garnitureData.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            {/* Sauces */}
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 1,
                    fontFamily: "cursive",
                    fontWeight: "bold",
                }}
            >
                Sauces:
            </Typography>
            <Box sx={{ paddingBottom: "70px" }}>
                <List>
                    {saucesData?.map((item: SaucesResponse, index: number) => (
                        <React.Fragment key={item.nom}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    position: "relative",
                                    backgroundColor: hoveredSauceIndex === index && item.disponible ? "#f9e1e6" : "transparent",
                                    transition: "background-color 0.3s ease",
                                    cursor: item.disponible ? "pointer" : "default",
                                }}
                                onMouseEnter={() => item.disponible && setHoveredSauceIndex(index)}
                                onMouseLeave={() => item.disponible && setHoveredSauceIndex(null)}
                            >
                                <ListItemAvatar>
                                    <Avatar alt={item.nom} src="https://via.placeholder.com/40" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="span">
                                            {item.nom} - ${item.prix.toFixed(2)}
                                        </Typography>
                                    }
                                    secondary={`Disponibilité: ${item.disponible ? "Disponible" : "Non disponible"}`}
                                />
                                <IconButton
                                    onClick={() => handleAddClick(item)}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        backgroundColor: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#f0f0f0",
                                        },
                                    }}
                                    disabled={!item.disponible}
                                >
                                    <AddIcon />
                                </IconButton>
                            </ListItem>
                            {index < saucesData.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
