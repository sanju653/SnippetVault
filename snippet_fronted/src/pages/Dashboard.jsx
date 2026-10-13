import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SnippetCard from "../components/Snippetcard";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllSnippets } from "../services/snippetService";




function Dashboard() {
   const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useAuthStore((state) => state.user);
const userName = user?.name?.trim() || "Developer";
  

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
          setError("Unable to load your snippets. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const recentSnippets = [...snippets]//The spread syntax creates a new array containing the same elements.Because .sort() modifies the array on which it is called.
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 6);

  const totalLanguages = new Set(
    snippets
      .map((snippet) => snippet.language)//Here, you extract the language from every snippet.
      .filter(Boolean)
  ).size;
  const aiSummaries = snippets.filter(
    (snippet) => snippet.summary?.trim()
  ).length;

  const totalTags = snippets.reduce((total, snippet) => {
    if (!snippet.tags?.trim()) {
      return total;
    }

    return total + snippet.tags.split(",").filter((tag) => tag.trim()).length;
  }, 0);
  //The .reduce() method processes array elements and combines them into a single result.

  const formatUpdatedAt = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    const difference = Date.now() - date.getTime();
    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString();
  };

  const prepareSnippetForCard = (snippet) => ({
    ...snippet,
    tags: snippet.tags
      ? snippet.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    updatedAt: formatUpdatedAt(snippet.updatedAt || snippet.createdAt),
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <p className="welcome-label">YOUR DEVELOPER WORKSPACE</p>

              <h1>
                Welcome back, {" "} 
                {userName} <span>👋</span>
              </h1>

              <p className="welcome-description">
                Organize your code, save your ideas, and let AI help you
                work smarter.
              </p>
            </div>
 <Link to="/snippets/new" className="create-snippet-btn">
              <i className="bi bi-plus-lg"></i>
              New Snippet
            </Link>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-blue">
                <i className="bi bi-code-square"></i>
              </div>

              <div>
                <p>Total Snippets</p>
                <h3>{loading ? "..." : snippets.length}</h3>
                <span className="stat-caption">Your saved code snippets</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-purple">
                <i className="bi bi-code-slash"></i>
              </div>

              <div>
                <p>Languages</p>
                   <h3>{loading ? "..." : totalLanguages}</h3>
                <span className="stat-caption">Languages in your vault</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-green">
                <i className="bi bi-stars"></i>
              </div>

              <div>
                <p>AI Summaries</p>
                  <h3>{loading ? "..." : aiSummaries}</h3>
                <span className="stat-caption"> Snippets with summaries</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-orange">
                <i className="bi bi-tags"></i>
              </div>

              <div>
                <p>Tags Created</p>
                <h3>{loading ? "..." : totalTags}</h3>
                <span className="stat-caption"> Tags across your snippets</span>
              </div>
            </div>
          </section>

          <section className="snippets-section">
            <div className="section-heading">
              <div>
                <h2>Recent Snippets</h2>
                <p>Your recently saved code and technical notes.</p>
              </div>

              <Link to="/snippets" className="view-all-btn">
                View all <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">
                    Loading snippets...
                  </span>
                </div>

                <p className="mt-3 text-muted">
                  Loading your snippets...
                </p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            ) : recentSnippets.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-code-square fs-1 text-muted"></i>

                <h5 className="mt-3">No snippets yet</h5>

                <p className="text-muted">
                  Create your first snippet to start building your vault.
                </p>

                <Link
                  to="/snippets/new"
                  className="btn btn-primary"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Create Your First Snippet
                </Link>
              </div>
            ) : (
              <div className="snippets-grid">
                {recentSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={prepareSnippetForCard(snippet)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="ai-promo">
            <div className="ai-promo-icon">
              <i className="bi bi-stars"></i>
            </div>

            <div className="ai-promo-content">
              <h4>Let AI organize your code</h4>

              <p>
                Save a snippet and let AI generate useful tags and a
                plain-English summary automatically.
              </p>
            </div>

            <span className="ai-promo-badge">
              Powered by Gemini
            </span>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;