import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getSnippetById } from "../services/snippetService";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { explainCode } from "../services/snippetService";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function SnippetDetails() {
  const { snippetId } = useParams();
  const navigate = useNavigate();

  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

// AI code explanation states 
const [explanation, setExplanation] = useState("");
 const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchSnippet = async () => {
      try {
        setLoading(true);
        setError("");
        setSnippet(null);

        const data = await getSnippetById(snippetId);

        if (!cancelled) {
          setSnippet(data);
        }
      } catch (err) {
        console.error("Failed to fetch snippet:", err);

        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? "Snippet not found."
              : err.response?.status === 401
                ? "Your session has expired. Please log in again."
                : "Unable to load this snippet. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSnippet();

    return () => {
      cancelled = true;
    };
  }, [snippetId]);

  const tags = Array.isArray(snippet?.tags)
    ? snippet.tags
    : (snippet?.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  const code = snippet?.codeContent || "";


//backend stores the programming language in snippet.language.highlighting library requires a language identifier it recognizes.
//This function maps your saved language to the appropriate identifier.
const getLanguage = (language) => {
  const normalized = (language || "").trim().toLowerCase();

  const languageMap = {
    java: "java",
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    python: "python",
    py: "python",
    html: "markup",
    xml: "markup",
    css: "css",
    sql: "sql",
    json: "json",
    markdown: "markdown",
    md: "markdown",
    plaintext: "text",
    text: "text",
  };

  return languageMap[normalized] || "text";
};

//const prismLanguage = getLanguage(snippet.language);

//converts a date value into a human-readable date.
  const formatDate = (dateValue) => {//dateValue receives the date(parameter) you want to forma
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      //navigator.clipboard is a browser API. Its writeText() method attempts to copy the provided string into the clipboard.
      alert("Code copied successfully!");
    } catch {
      alert("Unable to copy code. Please select and copy it manually.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this snippet?"
    );

    if (!confirmed) return;

    try {
      const { deleteSnippet } = await import("../services/snippetService");

      await deleteSnippet(snippetId);

      alert("Snippet deleted successfully!");
      navigate("/snippets");
    } catch (err) {
      console.error("Failed to delete snippet:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete snippet. Please try again."
      );
    }
  };


const handleExplainCode = async () => { 
  try { 
    setExplanationLoading(true); 
    setExplanationError("");
     setExplanation("");
      const response = await explainCode(snippetId); 
      setExplanation( response.explanation || "No explanation was returned by the AI." ); 
    } catch (err) { 
      console.error("Failed to explain code:", err); 
      setExplanationError( err.response?.data?.message || "Unable to generate the code explanation. Please try again." );
     }
      finally { 
        setExplanationLoading(false); 
      } 
    };


  if (loading) {
    return (
      <div className="snippet-layout">
        <Sidebar />
        <div className="snippet-main">
          <Navbar />
          <main className="snippet-details-page">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading snippet...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="snippet-layout">
        <Sidebar />
        <div className="snippet-main">
          <Navbar />
          <main className="snippet-details-page">
            <div className="alert alert-danger" role="alert">
              {error || "Snippet not found."}
            </div>
            <Link to="/snippets" className="details-back-btn">
              <i className="bi bi-arrow-left" /> Back to All Snippets
            </Link>
          </main>
        </div>
      </div>
    );
  }
  const prismLanguage = getLanguage(snippet.language);

  return (
    
    <div className="snippet-layout">
      <Sidebar />

      <div className="snippet-main">
        <Navbar />

        <main className="snippet-details-page">
          <div className="details-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <i className="bi bi-chevron-right" />
            <Link to="/snippets">All Snippets</Link>
            <i className="bi bi-chevron-right" />
            <span>Snippet Details</span>
          </div>

          <section className="details-header">
            <div className="details-title-section">
              <div className="details-language-icon">
                <i className="bi bi-filetype-java" />
              </div>

              <div>
                <div className="details-title-meta">
                  <span className="details-language">
                    {snippet.language}
                  </span>
                  <span className="details-status">
                    <i className="bi bi-circle-fill" />
                    Saved
                  </span>
                </div>

                <h1>{snippet.title}</h1>
                <p>Created on {formatDate(snippet.createdAt)}</p>
              </div>
            </div>

            <div className="details-header-actions">
              <button
                type="button"
                className="details-secondary-btn"
                onClick={() => navigate(`/snippets/${snippet.id}/edit`)}
              >
                <i className="bi bi-pencil-square" />
                Edit
              </button>

              <button
                type="button"
                className="details-delete-btn"
                onClick={handleDelete}
              >
                <i className="bi bi-trash3" />
                Delete
              </button>
            </div>
          </section>

          <div className="details-content-grid">
            <div className="details-main-column">
              <section className="details-card details-code-card">
                <div className="details-card-header">
                  <div>
                    <h2>
                      <i className="bi bi-code-slash" />
                      Source Code
                    </h2>
                    <p>Your saved code snippet</p>
                  </div>

                  <button
                    type="button"
                    className="details-copy-btn"
                    onClick={handleCopyCode}
                  >
                    <i className="bi bi-copy" />
                    Copy Code
                  </button>
                </div>

                <div className="details-code-toolbar">
                  <div className="details-window-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <span>{snippet.language}</span>
                  <span>Source code</span>
                </div>

                <div className="details-code-editor">
  <SyntaxHighlighter
    language={prismLanguage}
    style={vscDarkPlus}
    showLineNumbers
    wrapLongLines
    customStyle={{
      margin: 0,
      padding: "20px 0",
      borderRadius: "0 0 10px 10px",
      fontSize: "14px",
      lineHeight: "1.6",
      background: "#1e1e1e",
      overflowX: "auto",
    }}
    codeTagProps={{
      style: {
        fontFamily: "'Consolas', 'Courier New', monospace",
      },
    }}
    lineNumberStyle={{
      minWidth: "3.5em",
      paddingRight: "1em",
      color: "#858585",
      textAlign: "right",
      userSelect: "none",
    }}
  >
    {code}
  </SyntaxHighlighter>
</div>

              </section>

              {/* AI CODE EXPLANATION */}
<section className="details-card details-ai-card">
  <div className="details-card-header">
    <div className="details-ai-heading">
      <div className="details-ai-icon">
        <i className="bi bi-stars" />
      </div>

      <div>
        <h2>AI Code Explanation</h2>
        <p>Understand how your code works, step by step</p>
      </div>
    </div>

    <span className="details-ai-badge">AI Powered</span>
  </div>

  <div className="details-ai-summary">
    <button
      type="button"
      className="details-secondary-btn"
      onClick={handleExplainCode}
      disabled={explanationLoading || !code.trim()}
    >
      {explanationLoading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          Explaining Code...
        </>
      ) : (
        <>
          <i className="bi bi-stars me-2" />
          {explanation ? "Generate Again" : "Explain Code with AI"}
        </>
      )}
    </button>

    {explanationError && (
      <div className="alert alert-danger mt-3" role="alert">
        {explanationError}
      </div>
    )}

    {explanationLoading && (
      <p className="mt-3 mb-0">
        AI is analyzing your code. This may take a little while.
      </p>
    )}

    {!explanationLoading && !explanationError && !explanation && (
      <p className="mt-3 mb-0">
        Click the button to get a beginner-friendly explanation of your code,
        important concepts, and time and space complexity where applicable.
      </p>
    )}

    {explanation && (
      <div className="ai-explanation-result mt-4">
        <h3>
          <i className="bi bi-lightbulb me-2" />
          Code Explanation
        </h3>

        <pre className="ai-explanation-text">{explanation}</pre>
      </div>
    )}
  </div>

  <div className="details-ai-footer">
    <i className="bi bi-lightbulb" />
    <span>
      The AI explains the code without changing your saved snippet.
    </span>
  </div>
</section>

              <section className="details-card details-ai-card">
                <div className="details-card-header">
                  <div className="details-ai-heading">
                    <div className="details-ai-icon">
                      <i className="bi bi-stars" />
                    </div>

                    <div>
                      <h2>AI Summary</h2>
                      <p>Understand your code in simple English</p>
                    </div>
                  </div>

                  <span className="details-ai-badge">AI Summary</span>
                </div>

                <div className="details-ai-summary">
                  <p>
                    {snippet.summary ||
                      "No summary is available for this snippet yet."}
                  </p>
                </div>

                <div className="details-ai-footer">
                  <i className="bi bi-lightbulb" />
                  <span>
                    This summary helps you quickly remember what your code
                    does.
                  </span>
                </div>
              </section>

              <section className="details-card details-tags-card">
                <div className="details-card-header">
                  <div>
                    <h2>
                      <i className="bi bi-tags" />
                      Tags
                    </h2>
                    <p>Topics associated with this snippet</p>
                  </div>
                </div>

                <div className="details-tags-list">
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <span
                        className="details-tag"
                        key={`${tag}-${index}`}
                      >
                        <i className="bi bi-hash" />
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p>No tags available.</p>
                  )}
                </div>
              </section>
            </div>

            <aside className="details-side-column">
              <section className="details-card details-info-card">
                <div className="details-card-header">
                  <h2>
                    <i className="bi bi-info-circle" />
                    Snippet Information
                  </h2>
                </div>

                <div className="details-info-item">
                  <span>Programming Language</span>
                  <strong>{snippet.language}</strong>
                </div>

                <div className="details-info-item">
                  <span>Snippet ID</span>
                  <strong>{snippet.id}</strong>
                </div>

                <div className="details-info-item">
                  <span>Created On</span>
                  <strong>{formatDate(snippet.createdAt)}</strong>
                </div>

                <div className="details-info-item">
                  <span>Last Updated</span>
                  <strong>{formatDate(snippet.updatedAt)}</strong>
                </div>

                <div className="details-info-item">
                  <span>Total Tags</span>
                  <strong>{tags.length} tags</strong>
                </div>
              </section>

              <section className="details-tip-card">
                <div className="details-tip-icon">
                  <i className="bi bi-lightbulb" />
                </div>

                <h3>Developer Tip</h3>

                <p>
                  Use meaningful titles and tags to find saved snippets
                  quickly when you need them.
                </p>
              </section>

              <Link to="/snippets" className="details-back-btn">
                <i className="bi bi-arrow-left" />
                Back to All Snippets
              </Link>
            </aside>
          </div>

          <div className="details-updated-note">
            <i className="bi bi-clock-history" />
            Last updated on {formatDate(snippet.updatedAt)}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SnippetDetails;