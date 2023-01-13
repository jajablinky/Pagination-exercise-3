import React, { useState, useRef, useCallback } from "react";

import "./App.css";
import UseBookSearch from "./UseBookSearch";

function App() {
  const [query, setQuery] = useState(null);
  const [pageNumber, setPagenumber] = useState(1);

  const { books, hasMore, isLoading, error } = UseBookSearch(query, pageNumber);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPagenumber((prevPageNumber) => prevPageNumber + 1);
            console.log("visible");
          }
        },
        { rootMargin: "400px" }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPagenumber(1);
  };
  return (
    <div className="App">
      <h1>Book Search</h1>
      <h2> Infinity Scroll</h2>
      <p>
        Purely an exercise in pre-fetching using root margin
        <br /> to make a request to API early so it gives the effect of minimal
        loading for user
      </p>
      <input type="text" onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <div>{isLoading && "Loading..."}</div>
      <div>{error && "Error..."}</div>
      <div></div>
    </div>
  );
}

export default App;
