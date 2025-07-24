import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { createClient, Provider } from "urql";
import AnimalAutocomplete from "./components/AnimalAutocomplete";

import AnimalsList from "./components/AnimalsList";
import { GifProvider } from "./context/GifContext";

let client = createClient({
  url: "http://localhost:8080/v1/graphql",
});

function App() {
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ margin: 24 }}>
          <GifProvider>
            <AnimalAutocomplete />
            <AnimalsList />
          </GifProvider>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
