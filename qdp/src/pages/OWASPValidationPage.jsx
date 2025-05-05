import React, { useState, useEffect } from "react";
import { IconSparkles } from "@tabler/icons-react";
import { useLocation } from "@docusaurus/router";
import { useColorMode } from "@docusaurus/theme-common";
import OWASPValidator from "../components/owaspValidator/index";
import Notification from "../components/Notification";
import Layout from "@theme/Layout"; 
function OWASPValidationContent({
  apiSpec,
  submitted,
  isLoading,
  fileName,
  runOwaspValidation,
}) {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "1rem",
        borderRadius: "8px",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
      }}
    >
      <header
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "1rem",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h1
            style={{
              color: isDarkMode ? "#fff" : "#333",
              marginBottom: "0.25rem",
              marginTop: "1rem",
              fontSize: "1.5rem",
            }}
          >
            OWASP API Security Validator
          </h1>
          <p style={{ color: isDarkMode ? "#aaa" : "#666", fontSize: "1rem" }}>
            Validate your OpenAPI specification against the OWASP API Security
            Top 10 (2023)
          </p>
        </div>

        <button
          type="button"
          style={{
            background:
              "linear-gradient(to right, rgb(87, 150, 243), rgb(162, 177, 219))",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "999px",
            cursor: isLoading || !apiSpec ? "not-allowed" : "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            opacity: isLoading || !apiSpec ? 0.7 : 1,
          }}
          onClick={runOwaspValidation}
          disabled={isLoading || !apiSpec}
        >
          <IconSparkles stroke={2} size={18} />
          {isLoading ? "Loading API..." : "Scan for Vulnerabilities with AI"}
        </button>
      </header>

      {fileName && (
        <div
          style={{
            margin: "1rem 0",
            padding: "1rem",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: isDarkMode ? "#2a2a2a" : "",
            color: isDarkMode ? "#fff" : "#000",
          }}
        >
          <div>
            <strong>OpenApi Specification:</strong> {fileName}
          </div>
        </div>
      )}

      <div style={{ margin: "1rem 0.5rem" }}>
        {submitted && apiSpec && <OWASPValidator apiSpec={apiSpec} />}
      </div>
    </div>
  );
}

export default function OWASPValidationPage() {
  const [apiSpec, setApiSpec] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "info" });
  const location = useLocation();

  useEffect(() => {
    const loadApiFile = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const apiName = params.get("apiName");

        if (apiName) {
          setIsLoading(true);
          setFileName("");
          setSubmitted(false);

          const possibleExtensions = [".json", ".yaml", ".yml"];
          let fileFound = false;

          for (const ext of possibleExtensions) {
            try {
              const fileModule = await import(
                `../../cli/apis/${apiName}${ext}`
              );

              let content;

              if (ext === ".json") {
                content = JSON.stringify(fileModule.default, null, 2);
              } else {
                content = fileModule.default;
              }

              setApiSpec(content);
              setFileName(`${apiName}${ext}`);
              fileFound = true;
              break;
            } catch (error) {
              console.error(`File not found with extension ${ext}:`, error);
            }
          }

          if (!fileFound) {
            setNotification({
              message: `No API specification file found for: ${apiName}`,
              type: "error",
            });
            setApiSpec("");
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading API file:", error);
        setNotification({
          message: "Error loading API file. Check the console for details.",
          type: "error",
        });
        setIsLoading(false);
      }
    };

    loadApiFile();
  }, [location]);

  const runOwaspValidation = (e) => {
    if (e) e.preventDefault();
    if (apiSpec) {
      setSubmitted(true);
      setSubmitted(false);
      setTimeout(() => {
        setSubmitted(true);
      }, 100);
    } else {
      setNotification({
        message: "No OpenAPI specification found to validate",
        type: "warning",
      });
    }
  };

  const notificationComponent = notification.message ? (
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={() => setNotification({ message: "", type: "info" })}
    />
  ) : null;

  return (
    <Layout
    title={`OWASP Validation `}
    description="OWASP API Security validation page"
  >
    <div className="container margin-vert--lg">
      {notificationComponent}
      <OWASPValidationContent
        apiSpec={apiSpec}
        submitted={submitted}
        fileName={fileName}
        isLoading={isLoading}
        runOwaspValidation={runOwaspValidation}
      />
    </div>
  </Layout>
  );
}