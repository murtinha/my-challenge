import { useGifs } from "../context/GifContext";
import { Gif } from "../types";

export default function AnimalsList() {
  const { gifs, error } = useGifs();

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {gifs?.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {gifs.map((gif: Gif) => (
              <img key={gif.id} src={gif.url} alt={gif.category} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
