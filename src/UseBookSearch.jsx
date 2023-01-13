import { useState, useEffect } from "react";
import axios from "axios";

const UseBookSearch = (query, pageNumber) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    // storing our cancel request
    let controller = new AbortController();

    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      signal: controller.signal,
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [
            ...new Set(
              ...prevBooks,
              res.data.docs.map((b) => b.title)
            ),
          ];
        });
        setHasMore(res.data.docs.length);
        setIsLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          return;
        } else {
          setError(true);
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [query, pageNumber]);

  return { books, isLoading, error, hasMore };
};

export default UseBookSearch;
