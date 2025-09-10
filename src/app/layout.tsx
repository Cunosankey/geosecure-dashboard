import "../styles/globals.scss";
import { FilterProvider } from "../context/FilterContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FilterProvider>
          {children}
        </FilterProvider>
      </body>
    </html>
  );
}
