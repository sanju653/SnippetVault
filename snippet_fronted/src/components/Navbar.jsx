import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getAllSnippets } from "../services/snippetService";

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [search, setSearch] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const userName = user?.name?.trim() || "Developer";
  const firstLetter = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const data = await getAllSnippets();
        setSnippets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load navbar search results:", error);
      }
    };

    fetchSnippets();
  }, []);

  const filteredSnippets = snippets.filter((snippet) => {
    const query = search.trim().toLowerCase();

    if (!query) return false;

    const tags = Array.isArray(snippet.tags)
      ? snippet.tags.join(" ")
      : snippet.tags || "";

    return (
      snippet.title?.toLowerCase().includes(query) ||
      snippet.language?.toLowerCase().includes(query) ||
      snippet.summary?.toLowerCase().includes(query) ||
      tags.toLowerCase().includes(query)
    );
  });

  

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="top-navbar">
      <div className="navbar-search">
        <i className="bi bi-search"></i>

        <input
          id="navbar-snippet-search"
          type="text"
          placeholder="Search snippets, languages, tags..."
          aria-label="Search snippets"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setShowResults(true);
          }}
          // onFocus={() => setShowResults(true)}
          // onBlur={() => {
          //   setTimeout(() => setShowResults(false), 150);
          // }}
        />

        {/* <span className="search-shortcut">Ctrl K</span> */}

        {showResults && search.trim() && (
          <div className="navbar-search-results">
            {filteredSnippets.length > 0 ? (
              filteredSnippets.slice(0, 8).map((snippet) => (
                <button
                  type="button"
                  className="navbar-search-result"
                  key={snippet.id}
                  key-id={snippet.id}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setShowResults(false);
                    setSearch("");
                    navigate(`/snippets/${snippet.id}`);
                  }}
                >
                  <i className="bi bi-file-code"></i>

                  <span>
                    <strong>{snippet.title}</strong>
                    <small>
                      {snippet.language}
                    </small>
                  </span>

                  <i className="bi bi-arrow-up-right"></i>
                </button>
              ))
            ) : (
              <div className="navbar-search-empty">
                <i className="bi bi-search"></i>
                No matching snippets found.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="navbar-actions">
        {/* <button
          type="button"
          className="navbar-icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <i className="bi bi-bell"></i>
        </button> */}

        {/* <div className="navbar-divider"></div> */}

        <div className="navbar-profile">
          <div className="profile-avatar">{firstLetter}</div>

          <div className="profile-details">
            <h6>{userName}</h6>
            <span>{user?.email || "My Workspace"}</span>
          </div>

          <button
            type="button"
            className="navbar-icon-btn"
            aria-label="Log out"
            title="Log out"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;