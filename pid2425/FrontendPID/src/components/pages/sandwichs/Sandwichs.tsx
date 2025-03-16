// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getSandwiches } from "../../../api/sandwichsApi.ts";
// import { getGarniture } from "../../../api/garnitureApi.ts";
// import { getSauces } from "../../../api/saucesApi.ts";
// import {
//   SandwichesResponse,
//   GarnitureResponse,
//   SaucesResponse,
// } from "../../../types.ts";
// import { useDispatch } from "react-redux";
// import { addPersonalizedSandwich } from "../../../store/expense/expense-slice.ts";
//
// import {
//   Grid,
//   Card,
//   CardActionArea,
//   CardMedia,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   List,
//   ListItem,
//   Checkbox,
//   ListItemText,
//   ListItemButton,
// } from "@mui/material";
//
// import pouletCurry from "../../../assets/images/pouletCurry.png";
// import boulette from "../../../assets/images/boulette.png";
// import fromage from "../../../assets/images/fromage.png";
// import jambonFromage from "../../../assets/images/jambonFromage.png";
// import AddSandwichNotification from "../../snackbar/AddSandwichNotification.tsx";
// import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.tsx";
// import MySingleSauceNotification from "../../snackbar/MySingleSauceNotification.tsx";
//
// const imageMap: { [key: string]: string } = {
//   "Poulet Curry": pouletCurry,
//   Boulette: boulette,
//   Fromage: fromage,
//   "Jambon Fromage": jambonFromage,
// };
//
// export default function Sandwichs() {
//   const { data, error, isSuccess } = useQuery({
//     queryKey: ["sandwichs"],
//     queryFn: getSandwiches,
//   });
//   const dispatch = useDispatch();
//
//   // États pour la fenêtre modale et pour la notification
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentSandwich, setCurrentSandwich] =
//     useState<SandwichesResponse | null>(null);
//   const [selectedGarnitures, setSelectedGarnitures] = useState<string[]>([]);
//   const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
//   const [addSandwichNotificationOpen, setAddSandwichNotificationOpen] =
//     useState(false);
//   const [singleSauceNotificationOpen, setSingleSauceNotificationOpen] =
//     useState(false);
//
//   // Requêtes pour garnitures et sauces (activées uniquement lorsque la fenêtre modale est ouverte)
//   const { data: garnitureData, isLoading: garnitureLoading } = useQuery({
//     queryKey: ["garniture"],
//     queryFn: getGarniture,
//     enabled: modalOpen,
//   });
//
//   const { data: saucesData, isLoading: saucesLoading } = useQuery({
//     queryKey: ["sauces"],
//     queryFn: getSauces,
//     enabled: modalOpen,
//   });
//
//   if (!isSuccess) {
//     return <LoadingSpinner />;
//   } else if (error) {
//     return <span>Erreur...</span>;
//   }
//
//   // En cliquant sur une carte, la fenêtre modale s’ouvre
//   const handleCardClick = (sandwich: SandwichesResponse) => {
//     setCurrentSandwich(sandwich);
//     setSelectedGarnitures([]);
//     setSelectedSauces([]);
//     setModalOpen(true);
//   };
//
//   // Garniture
//   const toggleGarniture = (garniture: GarnitureResponse) => {
//     if (!garniture.disponible) return;
//     setSelectedGarnitures((prev) =>
//       prev.includes(garniture.nom)
//         ? prev.filter((name) => name !== garniture.nom)
//         : [...prev, garniture.nom],
//     );
//   };
//
//   // Sauces
//   const toggleSauces = (sauce: SaucesResponse) => {
//     if (!sauce.disponible) return;
//
//     // Si la salsa ya está seleccionada, se deselecciona
//     if (selectedSauces.includes(sauce.nom)) {
//       setSelectedSauces((prev) => prev.filter((name) => name !== sauce.nom));
//     } else {
//       // Si ya hay una salsa seleccionada, muestra la notificación y no añade otra
//       if (selectedSauces.length >= 1) {
//         setSingleSauceNotificationOpen(true); // Aquí se muestra la notificación
//         return;
//       }
//       // Si no hay salsa seleccionada, se añade la nueva
//       setSelectedSauces((prev) => [...prev, sauce.nom]);
//     }
//   };
//
//   // Lors de l’enregistrement, l’action est expédiée, la sélection est effacée et la notification est affichée
//   const handleModalSave = () => {
//     if (currentSandwich) {
//       dispatch(
//         addPersonalizedSandwich({
//           sandwichName: currentSandwich.nom,
//           sandwichPrice: currentSandwich.prix,
//           garnitures: selectedGarnitures,
//           sauces: selectedSauces,
//         }),
//       );
//     }
//     setModalOpen(false);
//     setCurrentSandwich(null);
//     setSelectedGarnitures([]);
//     setSelectedSauces([]);
//     setAddSandwichNotificationOpen(true);
//   };
//
//   // Contenu de la fenêtre modale
//   const renderModalContent = () => (
//     <>
//       <DialogTitle sx={{ mt: 1, fontFamily: "cursive", fontWeight: "bold" }}>
//         Type de sandwich : {currentSandwich?.nom}
//       </DialogTitle>
//       <DialogContent dividers>
//         <Typography
//           variant="subtitle1"
//           sx={{ mt: 1, fontFamily: "cursive", fontWeight: "bold" }}
//         >
//           Garnitures:
//         </Typography>
//         {garnitureLoading ? (
//           <CircularProgress size={20} />
//         ) : (
//           <List>
//             {garnitureData?.map((item: GarnitureResponse) => (
//               <ListItem key={item.nom} component="li" disablePadding>
//                 <ListItemButton
//                   onClick={() => toggleGarniture(item)}
//                   disabled={!item.disponible}
//                   sx={{
//                     backgroundColor: "transparent",
//                     "&:hover": { backgroundColor: "#FCE4EC" },
//                   }}
//                 >
//                   <Checkbox
//                     sx={{
//                       color: "#E1B0AC",
//                       "&.Mui-checked": { color: "#E1B0AC" },
//                     }}
//                     checked={selectedGarnitures.includes(item.nom)}
//                     disabled={!item.disponible}
//                   />
//                   <ListItemText
//                     primary={item.nom}
//                     secondary={
//                       item.disponible ? "Disponible" : "Non disponible"
//                     }
//                   />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         )}
//         <Typography
//           variant="subtitle1"
//           sx={{ mt: 2, fontFamily: "cursive", fontWeight: "bold" }}
//         >
//           Sauces:
//         </Typography>
//         {saucesLoading ? (
//           <CircularProgress size={20} />
//         ) : (
//           <List>
//             {saucesData?.map((item: SaucesResponse) => (
//               <ListItem key={item.nom} component="li" disablePadding>
//                 <ListItemButton
//                   onClick={() => toggleSauces(item)}
//                   disabled={!item.disponible}
//                   sx={{
//                     backgroundColor: "transparent",
//                     "&:hover": { backgroundColor: "#FCE4EC" },
//                   }}
//                 >
//                   <Checkbox
//                     sx={{
//                       color: "#E1B0AC",
//                       "&.Mui-checked": { color: "#E1B0AC" },
//                     }}
//                     checked={selectedSauces.includes(item.nom)}
//                     disabled={!item.disponible}
//                   />
//                   <ListItemText
//                     primary={item.nom}
//                     secondary={
//                       item.disponible ? "Disponible" : "Non disponible"
//                     }
//                   />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button
//           onClick={() => setModalOpen(false)}
//           variant="outlined"
//           sx={{
//             color: "#E1B0AC",
//             borderColor: "#E1B0AC",
//             "&:hover": { backgroundColor: "#FCE4EC" },
//           }}
//         >
//           Annuler
//         </Button>
//         <Button
//           onClick={handleModalSave}
//           variant="contained"
//           sx={{
//             backgroundColor: "#E1B0AC",
//             "&:hover": { backgroundColor: "#E1B0AC" },
//           }}
//         >
//           Envoyer au panier
//         </Button>
//       </DialogActions>
//     </>
//   );
//
//   return (
//     <>
//       <Grid container spacing={4} justifyContent="center" alignItems="center">
//         {data?.map((sandwich: SandwichesResponse) => (
//           <Grid
//             key={sandwich.code}
//             item
//             xs={12}
//             sm={6}
//             md={3}
//             display="flex"
//             justifyContent="center"
//           >
//             <Card
//               sx={{
//                 maxWidth: 345,
//                 border: "none",
//                 backgroundColor: "transparent",
//                 transition: "background-color 0.3s ease",
//                 "&:hover": { backgroundColor: "#F8E7E3" },
//               }}
//             >
//               <CardActionArea onClick={() => handleCardClick(sandwich)}>
//                 <CardMedia
//                   component="img"
//                   height="140"
//                   image={imageMap[sandwich.nom] || pouletCurry}
//                   alt={sandwich.nom}
//                 />
//                 <CardContent>
//                   <Typography
//                     gutterBottom
//                     variant="h5"
//                     component="div"
//                     sx={{ fontFamily: "cursive" }}
//                   >
//                     {sandwich.nom}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ fontFamily: "cursive" }}
//                   >
//                     {sandwich.disponible ? "Disponible" : "Non disponible"} -{" "}
//                     {sandwich.prix} €
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <Dialog
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         {renderModalContent()}
//       </Dialog>
//       <AddSandwichNotification
//         open={addSandwichNotificationOpen}
//         onClose={(_: any, reason: string) => {
//           if (reason !== "clickaway") setAddSandwichNotificationOpen(false);
//         }}
//       />
//
//       <MySingleSauceNotification
//         open={singleSauceNotificationOpen}
//         onClose={(_: any, reason?: string) => {
//           if (reason !== "clickaway") setSingleSauceNotificationOpen(false);
//         }}
//       />
//     </>
//   );
// }

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSandwiches } from "../../../api/sandwichsApi.ts";
import { getGarniture } from "../../../api/garnitureApi.ts";
import { getSauces } from "../../../api/saucesApi.ts";
import {
  SandwichesResponse,
  GarnitureResponse,
  SaucesResponse,
} from "../../../types.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store"; // Asegúrate de tener tu tipo RootState
import { addPersonalizedSandwich } from "../../../store/expense/expense-slice.ts";

import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import pouletCurry from "../../../assets/images/pouletCurry.png";
import boulette from "../../../assets/images/boulette.png";
import fromage from "../../../assets/images/fromage.png";
import jambonFromage from "../../../assets/images/jambonFromage.png";
import AddSandwichNotification from "../../snackbar/AddSandwichNotification.tsx";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.tsx";
import MySingleSauceNotification from "../../snackbar/MySingleSauceNotification.tsx";
import MaxSandwichNotification from "../../snackbar/MaxSandwichNotification.tsx";

const imageMap: { [key: string]: string } = {
  "Poulet Curry": pouletCurry,
  Boulette: boulette,
  Fromage: fromage,
  "Jambon Fromage": jambonFromage,
};

export default function Sandwichs() {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["sandwichs"],
    queryFn: getSandwiches,
  });
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentSandwich, setCurrentSandwich] =
    useState<SandwichesResponse | null>(null);
  const [selectedGarnitures, setSelectedGarnitures] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [addSandwichNotificationOpen, setAddSandwichNotificationOpen] =
    useState(false);
  const [singleSauceNotificationOpen, setSingleSauceNotificationOpen] =
    useState(false);
  const [maxSandwichNotificationOpen, setMaxSandwichNotificationOpen] =
    useState(false);

  const { currentUser, carts } = useSelector(
    (state: RootState) => state.EXPENSE,
  );
  const personalizedSandwiches =
    currentUser && carts[currentUser]
      ? carts[currentUser].personalizedSandwiches
      : [];

  // Requêtes pour garnitures et sauces (activées uniquement lorsque la fenêtre modale est ouverte)
  const { data: garnitureData, isLoading: garnitureLoading } = useQuery({
    queryKey: ["garniture"],
    queryFn: getGarniture,
    enabled: modalOpen,
  });

  const { data: saucesData, isLoading: saucesLoading } = useQuery({
    queryKey: ["sauces"],
    queryFn: getSauces,
    enabled: modalOpen,
  });

  if (!isSuccess) {
    return <LoadingSpinner />;
  } else if (error) {
    return <span>Erreur...</span>;
  }

  // En cliquant sur une carte, la fenêtre modale s’ouvre
  const handleCardClick = (sandwich: SandwichesResponse) => {
    setCurrentSandwich(sandwich);
    setSelectedGarnitures([]);
    setSelectedSauces([]);
    setModalOpen(true);
  };

  // Garniture
  const toggleGarniture = (garniture: GarnitureResponse) => {
    if (!garniture.disponible) return;
    setSelectedGarnitures((prev) =>
      prev.includes(garniture.nom)
        ? prev.filter((name) => name !== garniture.nom)
        : [...prev, garniture.nom],
    );
  };

  // Sauces
  const toggleSauces = (sauce: SaucesResponse) => {
    if (!sauce.disponible) return;

    if (selectedSauces.includes(sauce.nom)) {
      setSelectedSauces((prev) => prev.filter((name) => name !== sauce.nom));
    } else {
      if (selectedSauces.length >= 1) {
        setSingleSauceNotificationOpen(true);
        return;
      }
      setSelectedSauces((prev) => [...prev, sauce.nom]);
    }
  };

  // Lors de l’enregistrement, l’action est expédiée, la sélection est effacée et la notification est affichée
  const handleModalSave = () => {
    // Vérifier si le panier contient déjà 5 sandwichs
    if (personalizedSandwiches.length >= 5) {
      setMaxSandwichNotificationOpen(true);
      return;
    }

    if (currentSandwich) {
      dispatch(
        addPersonalizedSandwich({
          sandwichName: currentSandwich.nom,
          sandwichPrice: currentSandwich.prix,
          garnitures: selectedGarnitures,
          sauces: selectedSauces,
        }),
      );
    }
    setModalOpen(false);
    setCurrentSandwich(null);
    setSelectedGarnitures([]);
    setSelectedSauces([]);
    setAddSandwichNotificationOpen(true);
  };

  // Contenu de la fenêtre modale
  const renderModalContent = () => (
    <>
      <DialogTitle sx={{ mt: 1, fontFamily: "cursive", fontWeight: "bold" }}>
        Type de sandwich : {currentSandwich?.nom}
      </DialogTitle>
      <DialogContent dividers>
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, fontFamily: "cursive", fontWeight: "bold" }}
        >
          Garnitures:
        </Typography>
        {garnitureLoading ? (
          <CircularProgress size={20} />
        ) : (
          <List>
            {garnitureData?.map((item: GarnitureResponse) => (
              <ListItem key={item.nom} component="li" disablePadding>
                <ListItemButton
                  onClick={() => toggleGarniture(item)}
                  disabled={!item.disponible}
                  sx={{
                    backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "#FCE4EC" },
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#E1B0AC",
                      "&.Mui-checked": { color: "#E1B0AC" },
                    }}
                    checked={selectedGarnitures.includes(item.nom)}
                    disabled={!item.disponible}
                  />
                  <ListItemText
                    primary={item.nom}
                    secondary={
                      item.disponible ? "Disponible" : "Non disponible"
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        <Typography
          variant="subtitle1"
          sx={{ mt: 2, fontFamily: "cursive", fontWeight: "bold" }}
        >
          Sauces:
        </Typography>
        {saucesLoading ? (
          <CircularProgress size={20} />
        ) : (
          <List>
            {saucesData?.map((item: SaucesResponse) => (
              <ListItem key={item.nom} component="li" disablePadding>
                <ListItemButton
                  onClick={() => toggleSauces(item)}
                  disabled={!item.disponible}
                  sx={{
                    backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "#FCE4EC" },
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#E1B0AC",
                      "&.Mui-checked": { color: "#E1B0AC" },
                    }}
                    checked={selectedSauces.includes(item.nom)}
                    disabled={!item.disponible}
                  />
                  <ListItemText
                    primary={item.nom}
                    secondary={
                      item.disponible ? "Disponible" : "Non disponible"
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setModalOpen(false)}
          variant="outlined"
          sx={{
            color: "#E1B0AC",
            borderColor: "#E1B0AC",
            "&:hover": { backgroundColor: "#FCE4EC" },
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleModalSave}
          variant="contained"
          sx={{
            backgroundColor: "#E1B0AC",
            "&:hover": { backgroundColor: "#E1B0AC" },
          }}
        >
          Envoyer au panier
        </Button>
      </DialogActions>
    </>
  );

  return (
    <>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {data?.map((sandwich: SandwichesResponse) => (
          <Grid
            key={sandwich.code}
            item
            xs={12}
            sm={6}
            md={3}
            display="flex"
            justifyContent="center"
          >
            <Card
              sx={{
                maxWidth: 345,
                border: "none",
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#F8E7E3" },
              }}
            >
              <CardActionArea onClick={() => handleCardClick(sandwich)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={imageMap[sandwich.nom] || pouletCurry}
                  alt={sandwich.nom}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontFamily: "cursive" }}
                  >
                    {sandwich.nom}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "cursive" }}
                  >
                    {sandwich.disponible ? "Disponible" : "Non disponible"} -{" "}
                    {sandwich.prix} €
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        {renderModalContent()}
      </Dialog>
      <AddSandwichNotification
        open={addSandwichNotificationOpen}
        onClose={(_: any, reason: string) => {
          if (reason !== "clickaway") setAddSandwichNotificationOpen(false);
        }}
      />

      <MySingleSauceNotification
        open={singleSauceNotificationOpen}
        onClose={(_: any, reason?: string) => {
          if (reason !== "clickaway") setSingleSauceNotificationOpen(false);
        }}
      />

      <MaxSandwichNotification
        open={maxSandwichNotificationOpen}
        onClose={(_: any, reason?: string) => {
          if (reason !== "clickaway") setMaxSandwichNotificationOpen(false);
        }}
      />
    </>
  );
}
