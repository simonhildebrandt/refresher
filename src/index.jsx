import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import lunr from "lunr";
import { MdClear } from "react-icons/md";

const App = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [ready, setReady] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("/corpus.json").then((response) => {
      const { idx, documents } = response.data;
      setIndex(lunr.Index.load(idx));
      setDocuments(documents);
      setReady(true);
    });
    // Connect global event handler on window object
    // Load search index data
    // Initialize search component
  }, []);

  useEffect(() => {
    if (ready) doSearch(searchString);
  }, [ready]);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (
        event.target instanceof HTMLButtonElement &&
        !event.target.closest(".sodapop-search") &&
        event.target.className !== "sodapop-search-trigger"
      ) {
        setOpen(false);
      }
    };

    const handleGlobalTrigger = (event) => {
      event.stopPropagation();
      setOpen(true);
    };

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("sodapop-search", handleGlobalTrigger);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("sodapop-search", handleGlobalTrigger);
    };
  }, []);

  if (!open) {
    return null;
  }

  if (!ready) {
    return "loading...";
  }

  function clearInput() {
    {
      setSearchString("");
      setResults([]);
    }
  }

  function doSearch(query) {
    const searchResults = index.search(`*${query}*`);
    setResults(
      searchResults.map((result) => {
        return documents[result.ref];
      }),
    );
  }

  function updateResults(event) {
    const query = event.target.value;
    setSearchString(query);
    if (query.length > 2) {
      console.log({ query });
      doSearch(query);
    } else {
      setResults([]);
    }
  }

  return (
    <div className="sodapop-search">
      <div className="sodapop-search-header">
        <div>Search site contents</div>
        <div
          className="sodapop-search-close-button"
          onClick={() => setOpen(false)}
        >
          <MdClear />
        </div>
      </div>
      <div className="sodapop-search-input">
        <input
          className="sodapop-search-input-field"
          type="text"
          placeholder="Search..."
          value={searchString}
          onChange={updateResults}
        />
        {searchString.length > 0 && (
          <button className="sodapop-search-clear-button" onClick={clearInput}>
            <MdClear />
          </button>
        )}
      </div>
      <div className="sodapop-search-results">
        <ul>
          {results.map((result) => (
            <li key={result.url}>
              <a href={result.url}>{result.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const container = document.getElementById("search-root");
const root = createRoot(container);
root.render(<App />);
