import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { createSnippet } from "../services/snippetService";
import CodeEditor from "../components/CodeEditor";


function CreateSnippet() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    codeContent: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a snippet title.");
      return;
    }

    if (!formData.language) {
      setError("Please select a programming language.");
      return;
    }

    if (!formData.codeContent.trim()) {
      setError("Please enter your code.");
      return;
    }

    try {
      setLoading(true);

      await createSnippet({
        title: formData.title.trim(),
        summary: formData.description.trim(),
        language: formData.language,
        codeContent: formData.codeContent,
      });

      navigate("/snippets");
    } catch (err) {
      console.error("Failed to create snippet:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to save your snippet. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };
//determine the file extension, generate a filename, and calculate the number of lines in a code snippet.
  const getFileExtension = (language) => {//language is the parameter that receives the programming language.like getFileExtension("Java");
   //extensions object:stores the relationship between programming languages and their file extensions.
    const extensions = {
      Java: "java",
      JavaScript: "js",
      Python: "py",
      C: "c",
      "C++": "cpp",
      "C#": "cs",
      HTML: "html",
      CSS: "css",
      SQL: "sql",
      React: "jsx",
      "Spring Boot": "java",
      Other: "txt",
    };

    return extensions[language] || "txt";// object property access with a variable.
  };

  const fileExtension = getFileExtension(formData.language);
  const fileName = `snippet.${fileExtension}`;

  

  return (
    <div className="snippet-layout">
      <Sidebar />

      <div className="snippet-main">
        <Navbar />

        <main className="create-snippet-page">
          {/* Page Header */}
          <div className="create-snippet-header">
            <div>
              <div className="breadcrumb-text">
                <Link to="/dashboard">Dashboard</Link>
                <i className="bi bi-chevron-right"></i>
                <span>Create Snippet</span>
              </div>

              <h1>Create New Snippet</h1>

              <p>
                Save your code snippets and keep your knowledge organized.
              </p>
            </div>

            <Link to="/dashboard" className="back-dashboard-btn">
              <i className="bi bi-arrow-left"></i>
              Back to Dashboard
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="create-snippet-grid">
              {/* Main Form */}
              <div className="create-snippet-main">
                <section className="snippet-form-card">
                  <div className="snippet-section-heading">
                    <div className="snippet-heading-icon">
                      <i className="bi bi-file-earmark-code"></i>
                    </div>

                    <div>
                      <h2>Snippet Details</h2>
                      <p>Give your snippet a title and description.</p>
                    </div>
                  </div>

                  <div className="snippet-field">
                    <label htmlFor="title">
                      Snippet Title <span>*</span>
                    </label>

                    <input
                      type="text"
                      id="title"
                      className="form-control"
                      placeholder="e.g. Java Binary Search"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="snippet-field">
                    <label htmlFor="description">
                      Description{" "}
                      <span className="optional-label">Optional</span>
                    </label>

                    <textarea
                      id="description"
                      className="form-control"
                      rows="3"
                      placeholder="Describe what your code does..."
                      value={formData.description}
                      onChange={handleChange}
                      maxLength={2000}
                    />
                  </div>

                  <div className="snippet-field">
                    <label htmlFor="language">
                      Programming Language <span>*</span>
                    </label>

                    <select
                      id="language"
                      className="form-select"
                      value={formData.language}
                      onChange={handleChange}
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
                      <option value="React">React</option>
                      <option value="Spring Boot">Spring Boot</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </section>

                {/* Code Editor */}
                <section className="snippet-form-card code-content-card">
                  <div className="snippet-section-heading">
                    <div className="snippet-heading-icon">
                      <i className="bi bi-code-slash"></i>
                    </div>

                    <div>
                      <h2>Code Content</h2>
                      <p>Write or paste your code below.</p>
                    </div>
                  </div>

                  <div className="snippet-code-editor">
                    <div className="snippet-editor-toolbar">
                      <div className="snippet-editor-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>

                      <div className="snippet-editor-filename">
                        <i className="bi bi-file-code"></i>
                        {fileName}
                      </div>

                      <span className="snippet-editor-language">
                        {formData.language
                          ? formData.language.toUpperCase()
                          : "CODE"}
                      </span>
                    </div>

                      



                      
                   
                    <div className="snippet-editor-body">
  <CodeEditor
    value={formData.codeContent}
    language={formData.language}
    onChange={(value) => {
      setFormData((previousData) => ({
        ...previousData,
        codeContent: value,
      }));
    }}
  />
</div>


                    <div className="snippet-editor-footer">
                      <span>
                        <i className="bi bi-code-square"></i>
                        Code Editor
                      </span>

                      <span>UTF-8</span>
                    </div>
                  </div>
                </section>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="snippet-form-actions">
                  <Link
                    to="/dashboard"
                    className="snippet-cancel-btn"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="snippet-save-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-floppy"></i>
                        Save Snippet
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="create-snippet-sidebar">
                <div className="snippet-tips-card">
                  <div className="snippet-aside-icon tips-icon">
                    <i className="bi bi-lightbulb"></i>
                  </div>

                  <h3>Tips for Better Snippets</h3>

                  <div className="snippet-tip-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Use a clear and descriptive title.</span>
                  </div>

                  <div className="snippet-tip-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Select the correct programming language.</span>
                  </div>

                  <div className="snippet-tip-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Keep your code clean and readable.</span>
                  </div>

                  <div className="snippet-tip-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Add a description for future reference.</span>
                  </div>
                </div>

                <div className="snippet-ai-card">
                  <div className="snippet-aside-icon ai-icon">
                    <i className="bi bi-stars"></i>
                  </div>

                  <h3>AI-Powered Insights</h3>

                  <p>
                    Let AI help you understand and organize your saved code.
                  </p>

                  <div className="snippet-ai-feature">
                    <div>
                      <i className="bi bi-tags"></i>
                    </div>

                    <span>Smart Tags</span>

                    <i className="bi bi-check-circle-fill feature-check"></i>
                  </div>

                  <div className="snippet-ai-feature">
                    <div>
                      <i className="bi bi-chat-left-text"></i>
                    </div>

                    <span>Code Summary</span>

                    <i className="bi bi-check-circle-fill feature-check"></i>
                  </div>
                </div>

                <div className="snippet-privacy-card">
                  <div className="privacy-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>

                  <div>
                    <h4>Your Code, Your Space</h4>

                    <p>
                      Keep your technical knowledge organized in one place.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default CreateSnippet;