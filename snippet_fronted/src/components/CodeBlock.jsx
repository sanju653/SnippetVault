import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ code, language }) {
  return (
    <SyntaxHighlighter
      language={language?.toLowerCase() || "javascript"}
      style={vscDarkPlus}
      showLineNumbers={true}
      wrapLongLines={true}
      customStyle={{
        margin: 0,
        padding: "20px",
        borderRadius: "10px",
        fontSize: "14px",
        lineHeight: "1.6",
        background: "#1e1e1e",
      }}
    >
      {code || ""}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;