import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const DisplayCodeContext = ({ line, apiSpec, contextLines = 2 }) => {
  const [codeContext, setCodeContext] = useState({
    before: [],
    highlight: "",
    after: [],
    lineNumbers: { start: 0, highlight: 0, end: 0 },
  });

  useEffect(() => {
    if (!apiSpec || !line) return;

    try {
      // Split the API spec into lines
      const specLines = apiSpec.split("\n");

      // Calculate the line numbers to display (with context)
      const startLine = Math.max(0, line - 1 - contextLines);
      const endLine = Math.min(specLines.length - 1, line - 1 + contextLines);

      // Get the lines before, the problematic line, and lines after
      const before = specLines.slice(startLine, line - 1);
      const highlight = specLines[line - 1] || "// Line not found";
      const after = specLines.slice(line, endLine + 1);

      setCodeContext({
        before,
        highlight,
        after,
        lineNumbers: {
          start: startLine + 1,
          highlight: line,
          end: endLine + 1,
        },
      });
    } catch (error) {
      console.error("Error extracting code context:", error);
      setCodeContext({
        before: [],
        highlight: `// Error extracting line ${line}: ${error.message}`,
        after: [],
        lineNumbers: { start: 0, highlight: line, end: 0 },
      });
    }
  }, [line, apiSpec, contextLines]);

  return (
    <div className={styles.codeContextContainer}>
      {/* Line numbers column */}
      <div className={styles.lineNumberColumn}>
        {codeContext.before.map((_, idx) => (
          <div key={`before-${idx}`}>{codeContext.lineNumbers.start + idx}</div>
        ))}
        <div className={styles.lineNumberHighlight}>
          {codeContext.lineNumbers.highlight}
        </div>
        {codeContext.after.map((_, idx) => (
          <div key={`after-${idx}`}>
            {codeContext.lineNumbers.highlight + idx + 1}
          </div>
        ))}
      </div>

      {/* Code content */}
      <div className={styles.codeContent}>
        {codeContext.before.map((line, idx) => (
          <div key={`before-line-${idx}`}>{line}</div>
        ))}
        <div className={styles.lineHighlight}>
          {codeContext.highlight}
        </div>
        {codeContext.after.map((line, idx) => (
          <div key={`after-line-${idx}`}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCodeContext;