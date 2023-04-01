import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Passagens from "./pages/Passagens";
export default function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Passagens/>
        </QueryClientProvider>
    )
}