
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  getSnippetById,
  updateSnippet,
} from "../services/snippetService";
import CodeEditor from "../components/CodeEditor";

function EditSnippet() {
  const { snippetId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load the selected snippet from the backend.
  useEffect(() => {
    let cancelled = false;

    const loadSnippet = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSnippetById(snippetId);

        if (cancelled) return;

        setTitle(data.title || "");
        setLanguage(data.language || "");
        setDescription(data.summary || "");
        setCode(data.codeContent || "");

        const snippetTags = Array.isArray(data.tags)
          ? data.tags
          : typeof data.tags === "string"
            ? data.tags.split(",")
            : [];

        setTags(
          snippetTags
            .map((tag) => tag.trim())
            .filter(Boolean)
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load snippet. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (snippetId) {
      loadSnippet();
    } else {
      setError("Snippet ID is missing.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [snippetId]);

  const handleAddTag = () => {
    const tag = newTag.trim();

    if (
      tag &&
      !tags.some(
        (existingTag) =>
          existingTag.toLowerCase() === tag.toLowerCase()
      )
    ) {
      setTags((previousTags) => [...previousTags, tag]);
      setNewTag("");
    }
  };
//.some() is a built-in JavaScript array method.t checks whether at least one element in an array satisfies a condition.true if at least one element matches.false if no elements match.
  const handleRemoveTag = (tagToRemove) => {
    setTags((previousTags) =>
      previousTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSave = async () => {
    if (!title.trim() || !language.trim() || !code.trim()) {
      setError("Title, programming language, and source code are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateSnippet(snippetId, {
        title: title.trim(),
        language,
        summary: description.trim(),
        codeContent: code,
        tags: tags.join(", "),
      });

      setSuccess("Snippet updated successfully!");

      setTimeout(() => {
        navigate(`/snippets/${snippetId}`);
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update snippet. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="snippet-layout">
        <Sidebar />
        <div className="snippet-main">
          <Navbar />
          <main className="edit-snippet-page">
            <p>Loading snippet...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error && !title && !code) {
    return (
      <div className="snippet-layout">
        <Sidebar />
        <div className="snippet-main">
          <Navbar />
          <main className="edit-snippet-page">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <Link to="/snippets" className="edit-cancel-btn">
              Back to Snippets
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="snippet-layout">
      <Sidebar />

      <div className="snippet-main">
        <Navbar />

        <main className="edit-snippet-page">
          <div className="edit-breadcrumb">
            <Link to="/">Dashboard</Link>
            <i className="bi bi-chevron-right"></i>
            <Link to="/snippets">All Snippets</Link>
            <i className="bi bi-chevron-right"></i>
            <span>Edit Snippet</span>
          </div>

          <section className="edit-page-header">
            <div>
              <div className="edit-heading-icon">
                <i className="bi bi-pencil-square"></i>
              </div>

              <h1>Edit Snippet</h1>
              <p>Update your code, description, and tags.</p>
            </div>

            <span className="edit-snippet-id">
              Snippet ID: {snippetId}
            </span>
          </section>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="status">
              {success}
            </div>
          )}

          <div className="edit-snippet-grid">
            <div className="edit-snippet-main">
              <section className="edit-form-card">
                <div className="edit-card-heading">
                  <div className="edit-card-heading-icon">
                    <i className="bi bi-file-earmark-text"></i>
                  </div>

                  <div>
                    <h2>Basic Information</h2>
                    <p>Update your snippet information.</p>
                  </div>
                </div>

                <div className="edit-form-group">
                  <label htmlFor="snippetTitle">
                    Snippet Title <span>*</span>
                  </label>

                  <input
                    id="snippetTitle"
                    className="form-control"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="snippetDescription">
                    Description
                  </label>

                  <textarea
                    id="snippetDescription"
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="snippetLanguage">
                    Programming Language
                  </label>

                  <select
                    id="snippetLanguage"
                    className="form-select"
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value)
                    }
                    required
                  >
                    <option value="">Select language</option>
                    <option value="Java">Java</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C">C</option>
                    <option value="C++">C++</option>
                    <option value="C#">C#</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="SQL">SQL</option>
                    <option value="TypeScript">TypeScript</option>
                  </select>
                </div>
              </section>

              <section className="edit-form-card">
                <div className="edit-card-heading">
                  <div className="edit-card-heading-icon">
                    <i className="bi bi-code-slash"></i>
                  </div>

                  <div>
                    <h2>Source Code</h2>
                    <p>Edit your saved source code.</p>
                  </div>
                </div>

                <div className="edit-code-editor">
                  <div className="edit-code-toolbar">
                    <div className="edit-code-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <span>{language || "Code"}</span>
                    <span className="edit-code-file">snippet</span>
                  </div>

                  <div className="edit-code-textarea">
  <CodeEditor
    value={code}
    language={language}
    onChange={(value) => setCode(value)}
  />
</div>
                </div>

                <div className="edit-code-footer">
                  <span>
                    <i className="bi bi-info-circle"></i>
                    Keep your code properly formatted.
                  </span>
                </div>
              </section>

              <section className="edit-form-card">
                <div className="edit-card-heading">
                  <div className="edit-card-heading-icon">
                    <i className="bi bi-tags"></i>
                  </div>

                  <div>
                    <h2>Tags</h2>
                    <p>Organize your snippet by topic.</p>
                  </div>
                </div>

                <div className="edit-existing-tags">
                  {tags.map((tag) => (
                    <span className="edit-tag" key={tag}>
                      <i className="bi bi-hash"></i>
                      {tag}

                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag}`}
                        disabled={saving}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  ))}
                </div>

                <div className="edit-add-tag">
                  <input
                    className="form-control"
                    value={newTag}
                    onChange={(event) =>
                      setNewTag(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Enter a new tag"
                    disabled={saving}
                  />

                  <button
                    type="button"
                    className="edit-add-tag-btn"
                    onClick={handleAddTag}
                    disabled={saving}
                  >
                    <i className="bi bi-plus-lg"></i>
                    Add Tag
                  </button>
                </div>
              </section>

              <section className="edit-form-card edit-ai-card">
                <div className="edit-card-heading">
                  <div className="edit-ai-icon">
                    <i className="bi bi-stars"></i>
                  </div>

                  <div>
                    <h2>AI Summary</h2>
                    <p>Plain-English explanation of your snippet.</p>
                  </div>
                </div>

                <div className="edit-ai-summary">
                  {description || "No description available."}
                </div>
              </section>

              <div className="edit-form-actions">
                <Link
                  to={`/snippets/${snippetId}`}
                  className="edit-cancel-btn"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  className="edit-save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <i
                    className={`bi ${
                      saving
                        ? "bi-arrow-repeat"
                        : "bi-check2-circle"
                    }`}
                  ></i>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <aside className="edit-snippet-sidebar">
              <section className="edit-side-card">
                <div className="edit-side-icon">
                  <i className="bi bi-lightbulb"></i>
                </div>

                <h3>Editing Tips</h3>

                <ul>
                  <li>Use a descriptive title.</li>
                  <li>Keep your code readable.</li>
                  <li>Add relevant tags.</li>
                  <li>Write a useful description.</li>
                </ul>
              </section>

              <section className="edit-side-card edit-changes-card">
                <h3>
                  <i className="bi bi-shield-check"></i>
                  Snippet Information
                </h3>

                <div className="edit-side-info">
                  <span>Status</span>
                  <strong className="edit-saved-status">
                    {saving ? "Saving..." : "Ready to save"}
                  </strong>
                </div>

                <div className="edit-side-info">
                  <span>Language</span>
                  <strong>{language}</strong>
                </div>

                <div className="edit-side-info">
                  <span>Total Tags</span>
                  <strong>{tags.length}</strong>
                </div>
              </section>

              <div className="edit-warning-card">
                <i className="bi bi-info-circle"></i>

                <div>
                  <strong>Backend Connected</strong>
                  <p>
                    Your changes will be saved to your account when you
                    select Save Changes.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditSnippet;

