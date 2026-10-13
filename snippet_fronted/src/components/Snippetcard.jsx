import { Link } from "react-router-dom";

function SnippetCard({ snippet }) {
  const tags = Array.isArray(snippet.tags)
    ? snippet.tags
    : (snippet.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  return (
    <div className="snippet-card">
      <div className="snippet-card-top">
        <div className="language-label">
          <i className="bi bi-file-code"></i>
          <span>{snippet.language || "Unknown"}</span>
        </div>

        <button
          type="button"
          className="snippet-more-btn"
          aria-label={`More options for ${snippet.title}`}
          title="More options"
        >
          <i className="bi bi-three-dots"></i>
        </button>
      </div>

      <h5 className="snippet-title">
        {snippet.title || "Untitled Snippet"}
      </h5>

      <p className="snippet-description">
        {snippet.summary || "No summary available for this snippet yet."}
      </p>

      <div className="snippet-tags">
        {tags.map((tag, index) => (
          <span className="snippet-tag" key={`${tag}-${index}`}>
            #{tag}
          </span>
        ))}
      </div>

      <div className="snippet-card-footer">
        <span>
          <i className="bi bi-clock"></i>{" "}
          {snippet.updatedAt || "Recently"}
        </span>

        <Link
          to={`/snippets/${snippet.id}`}
          className="snippet-view-btn"
        >
          View snippet <i className="bi bi-arrow-up-right"></i>
        </Link>
      </div>
    </div>
  );
}

export default SnippetCard;