import { List, ListItem, ListItemText, Typography } from "@mui/material";

//Este componente no esta siendo usado, debe ser llamado en HomePage

// Definimos la interfaz para tipar los elementos de la lista
interface HistoryItem {
  name: string;
  price: number;
  sandwichName?: string;
  sandwichPrice?: number;
  garnitureName?: string;
  garniturePrice?: number;
}

// Tipamos las props del componente
interface HistoriqueProps {
  listItems: HistoryItem[];
}

export function Historique({ listItems }: HistoriqueProps) {
  return (
    <div
      style={{
        overflowY: "scroll",
        height: "40%",
        border: "1px solid #ddd",
        padding: "10px",
        marginTop: "50px",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Historique
      </Typography>
      <List>
        {listItems.length > 0 ? (
          listItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* Usamos sandwichName o garnitureName para el nombre */}
              <ListItemText
                primary={item.sandwichName || item.garnitureName}
                sx={{ flex: 1 }}
              />

              {/* Usamos sandwichPrice o garniturePrice para el precio */}
              <ListItemText
                primary={(() => {
                  const price = item.sandwichPrice || item.garniturePrice;
                  return price !== undefined ? price.toFixed(2) : "0.00";
                })()}
                sx={{ textAlign: "right", flex: 0.3 }}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            Aucun historique disponible.
          </Typography>
        )}
      </List>
    </div>
  );
}
