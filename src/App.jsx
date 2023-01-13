import React, { useState, useRef } from "react";

import "./App.css";
import UseBookSearch from "./UseBookSearch";

function App() {
  const [query, setQuery] = useState(null);

  const [pageNumber, setPagenumber] = useState(1);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPagenumber(1);
  };

  const { books, hasMore, isLoading, error } = UseBookSearch(query, pageNumber);
  return (
    <div className="App">
      <input type="text" onChange={handleSearch}></input>
      {books.map((book) => {
        return <div key={book}>{book}</div>;
      })}
      <div>{isLoading && "Loading..."}</div>
      <div>{error && "Error..."}</div>
      <div></div>
    </div>
  );
}

export default App;
