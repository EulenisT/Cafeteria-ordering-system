import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Compte from "./components/compte/Compte.tsx";
import Historique from "./components/historique/Historique.tsx";
import HomePage from "./components/homepage/HomePage.tsx";
import Menu from "./components/menu/Menu.tsx";
import Panier from "./components/panier/Panier.tsx";
import Personnaliser from "./components/personnaliser/Personnaliser.tsx";
import PageNotFound from "./components/pageNotFound/PageNotFound.tsx";

const queryClient = new QueryClient();

function App() {

  return (
    <>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="compte" element={<Compte />} />
                    <Route path="historique" element={<Historique />} />
                    <Route path="panier" element={<Panier />} />
                    <Route path="personnaliser" element={<Personnaliser />} />
                    <Route path="*" element={<PageNotFound />}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </>
  )
}

export default App
