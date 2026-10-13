//This component uses CodeMirror's dark theme and built-in line numbers. It doesn't require your old manually generated line-number elements.

import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";import { StreamLanguage } from "@codemirror/language";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { shell } from "@codemirror/legacy-modes/mode/shell";


function CodeEditor({ value, onChange, language }) {
const getLanguageExtension = () => {
switch (language) {
case "Java":
case "Spring Boot":
return java();


  case "JavaScript":
    return javascript();

  case "React":
    return javascript({ jsx: true });

  case "Python":
    return python();

  case "SQL":
    return sql();

  case "HTML":
    return html();

  case "CSS":
    return css();

  case "C":
  case "C++":
    return cpp();

  case "Other":
    return StreamLanguage.define(shell);

  default:
    return [];
}


};

return (
<CodeMirror
value={value}
height="350px"
theme={oneDark}
extensions={[getLanguageExtension()]}
onChange={onChange}
basicSetup={{
lineNumbers: true,
foldGutter: true,
highlightActiveLine: false,
bracketMatching: true,
autocompletion: true,
}}
placeholder="// Write or paste your code here..."
/>
);
}


export default CodeEditor;
