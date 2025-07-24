COPY gifs(url, category) FROM '/docker-entrypoint-initdb.d/data.tsv' WITH (FORMAT text);
