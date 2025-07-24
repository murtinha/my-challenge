import { createContext, ReactNode, useContext, useState } from "react";
import { CombinedError, gql, useQuery } from "urql";
import { Gif } from "../types";
import { getRandomOffset } from "../utils";

const query = gql`
  query GifsByCategory($category: String!, $offset: Int!) {
    gifs(
      where: { category: { _eq: $category } }
      limit: 10
      offset: $offset
      order_by: { id: asc }
    ) {
      url
      category
      id
    }
    gifs_aggregate(where: { category: { _eq: $category } }) {
      aggregate {
        count
      }
    }
  }
`;

interface GifContextType {
  gifs: Gif[];
  category: string | null;
  count: number;
  fetching: boolean;
  error?: CombinedError;
  fetchForCategory: (category: string) => void;
  refetch: () => void;
}

const GifContext = createContext<GifContextType | null>(null);

export function useGifs() {
  const context = useContext(GifContext);
  if (!context) {
    throw new Error("useGifs must be used within a GifProvider");
  }
  return context;
}

export function GifProvider({ children }: { children: ReactNode }) {
  const [variables, setVariables] = useState<{
    category: string;
    offset: number;
  } | null>(null);

  const [result, reexecuteQuery] = useQuery({
    query,
    variables: variables || {},
    pause: variables === null,
  });

  const { data, fetching, error } = result;

  const gifs = data?.gifs || [];
  const count = data?.gifs_aggregate?.aggregate?.count ?? 0;

  const fetchForCategory = (newCategory: string) => {
    const newOffset = getRandomOffset(count);
    setVariables({ category: newCategory, offset: newOffset });
  };

  const refetch = () => {
    const newOffset = getRandomOffset(count);
    setVariables({ category: variables?.category || "", offset: newOffset });
    reexecuteQuery({ requestPolicy: "network-only" });
  };

  const contextValue: GifContextType = {
    gifs,
    category: variables?.category || null,
    count,
    fetching,
    error,
    fetchForCategory,
    refetch,
  };

  return (
    <GifContext.Provider value={contextValue}>{children}</GifContext.Provider>
  );
}
