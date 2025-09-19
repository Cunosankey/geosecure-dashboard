import "../styles/globals.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterProvider } from "../context/FilterContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <FilterProvider>
            {children}
          </FilterProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
