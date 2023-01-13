import React, { useState, useRef, useCallback } from "react";
import UseBookSearch from "./UseBookSearch";

function App() {
  // State being passed into UseBookSearch custom hook //
  // changed dependent on handleSearch (input typing) //
  const [query, setQuery] = useState(null);
  const [pageNumber, setPagenumber] = useState(1);

  // Destructured variables of state from custom hook
  const { books, hasMore, isLoading, error } = UseBookSearch(query, pageNumber);

  // Observer logic using hooks: (useRef, useCallback) to create a intersectionObserver //
  // based on what is the last book that has been rendered on display
  // pageNumber state is changed once isIntersectiong triggering a new set of books to be rendered in addition
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

  // booksRender applying ref to last item based on
  const booksRender = books.map((book, index) => {
    if (books.length - 1 === index) {
      return (
        <div ref={lastBookElementRef} key={book}>
          {book}
        </div>
      );
    } else {
      return <div key={book}>{book}</div>;
    }
  });

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
      {booksRender}
      <div>{isLoading && "Loading..."}</div>
      <div>{error && "Error..."}</div>
      <div></div>
    </div>
  );
}

export default App;
