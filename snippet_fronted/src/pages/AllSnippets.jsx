import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SnippetCard from "../components/Snippetcard";
import { getAllSnippets } from "../services/snippetService";

function AllSnippets() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllSnippets();

        setSnippets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch snippets:", err);

        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load snippets. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  // Get unique languages from actual snippets
  const languages = useMemo(() => {
    return [
      ...new Set(
        snippets
          .map((snippet) => snippet.language)
          .filter(Boolean)
      ),
    ].sort();
  }, [snippets]);

  // Search and filter actual snippets
  const filteredSnippets = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return snippets.filter((snippet) => {
      const matchesSearch =
        !searchText ||
        snippet.title?.toLowerCase().includes(searchText) ||
        snippet.language?.toLowerCase().includes(searchText) ||
        snippet.summary?.toLowerCase().includes(searchText) ||
        (Array.isArray(snippet.tags)
          ? snippet.tags
          : (snippet.tags || "").split(",")
        ).some((tag) => tag.trim().toLowerCase().includes(searchText));

      const matchesLanguage =
        !selectedLanguage || snippet.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [snippets, search, selectedLanguage]);

  // Convert backend data into the format expected by SnippetCard
  const prepareSnippetForCard = (snippet) => {
    const tags = Array.isArray(snippet.tags)
      ? snippet.tags
      : (snippet.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

    let updatedAt = "Recently";

    const dateValue = snippet.updatedAt || snippet.createdAt;

    if (dateValue) {
     const date = new Date(`${dateValue}+05:30`);

      if (!Number.isNaN(date.getTime())) {
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) {
          updatedAt = "Just now";
        } else if (minutes < 60) {
          updatedAt = `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
        } else if (hours < 24) {
          updatedAt = `${hours} hour${hours === 1 ? "" : "s"} ago`;
        } else if (days === 1) {
          updatedAt = "Yesterday";
        } else if (days < 7) {
          updatedAt = `${days} days ago`;
        } else {
          updatedAt = date.toLocaleDateString();
        }
      }
    }

    return {
      ...snippet,
      tags,
      updatedAt,
    };
  };

  return (
    <div className="snippet-layout">
      <Sidebar />

      <div className="snippet-main">
        <Navbar />

        <main className="all-snippets-page">
          {/* Page Header */}
          <section className="all-snippets-header">
            <div>
              <div className="all-snippets-breadcrumb">
                <Link to="/dashboard">Dashboard</Link>
                <i className="bi bi-chevron-right"></i>
                <span>All Snippets</span>
              </div>

              <h1>All Snippets</h1>

              <p>
                Manage, explore, and organize all your saved code snippets.
              </p>
            </div>

            <Link
              to="/snippets/new"
              className="all-snippets-create-btn"
            >
              <i className="bi bi-plus-lg"></i>
              Create Snippet
            </Link>
          </section>

          {/* Search and Filters */}
          <section className="all-snippets-toolbar">
            <div className="all-snippets-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search snippets by title, language, or tag..."
                aria-label="Search snippets"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="all-snippets-filters">
              <select
                className="form-select"
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                aria-label="Filter by language"
              >
                <option value="">All Languages</option>

                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="all-snippets-filter-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedLanguage("");
                }}
                title="Clear search and filters"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset
              </button>
            </div>
          </section>

          {/* Results */}
          <section className="all-snippets-results">
            <div className="all-snippets-results-heading">
              <div>
                <h2>Your Collection</h2>
                <p>Browse your saved programming knowledge.</p>
              </div>

              <span className="all-snippets-count">
                {filteredSnippets.length}{" "}
                {filteredSnippets.length === 1 ? "snippet" : "snippets"}
              </span>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>

                <p className="mt-3">Loading your snippets...</p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty Collection */}
            {!loading && !error && snippets.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-code-square fs-1 text-secondary"></i>

                <h4 className="mt-3">No snippets yet</h4>

                <p className="text-secondary">
                  Save your first code snippet to start building your collection.
                </p>

                <Link
                  to="/snippets/new"
                  className="btn btn-primary"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Create Your First Snippet
                </Link>
              </div>
            )}

            {/* No Search Results */}
            {!loading &&
              !error &&
              snippets.length > 0 &&
              filteredSnippets.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-search fs-1 text-secondary"></i>

                  <h4 className="mt-3">No matching snippets</h4>

                  <p className="text-secondary">
                    Try another search term or change the language filter.
                  </p>

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSearch("");
                      setSelectedLanguage("");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            {/* Dynamic Snippet Cards */}
            {!loading && !error && filteredSnippets.length > 0 && (
              <div className="all-snippets-grid">
                {filteredSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={prepareSnippetForCard(snippet)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default AllSnippets;