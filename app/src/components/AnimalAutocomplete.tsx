import {
  Autocomplete,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { useQuery } from "urql";
import { useGifs } from "../context/GifContext";
import { Gif } from "../types";

interface Props {
  onSubmit: (category: string) => void;
}

const query = `
  query DistinctAnimalGifs {
    gifs(distinct_on: category, order_by: { category: asc }) {
      category
      id
      url
    }
  }
`;

export default function AnimalAutocomplete() {
  const [result] = useQuery<{ gifs: Gif[] }>({ query });
  const { data, fetching } = result;
  const {
    refetch,
    fetchForCategory: selectAnimal,
    fetching: fetchingGifs,
    category: animal,
  } = useGifs();

  const filteredGifs = data?.gifs.filter((gif) => gif.id !== 1) || [];

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Autocomplete
        options={filteredGifs}
        loading={fetching}
        getOptionLabel={(option) => option.category}
        onChange={(event, newValue) => selectAnimal(newValue?.category || "")}
        renderInput={(params) => (
          <TextField {...params} label="Select an animal" variant="outlined" />
        )}
        style={{ width: 300 }}
      />

      <Button
        variant="contained"
        startIcon={
          fetchingGifs ? (
            <CircularProgress size={16} color="inherit" />
          ) : undefined
        }
        disabled={!animal || fetchingGifs}
        onClick={refetch}
      >
        Search
      </Button>
    </Stack>
  );
}
