import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import SandwichsList from "./components/SandwichsList.tsx";
import GarnitureList from "./components/GarnitureList.tsx";


const queryClient = new QueryClient();

function App() {

  return (
    <>
      <div>
          <QueryClientProvider client={queryClient}>
              <SandwichsList />
              <GarnitureList />
          </QueryClientProvider>
      </div>
    </>
  )
}

export default App
