// src/components/OWASPValidator/index.js
import React, { useState, useEffect } from "react";
import { ValidateAPISecurityProvider } from "@site/utils/owasp/index";

// Import components
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import TabNavigation from "./TabNavigation";
import Overview from "./Overview";
import Vulnerabilities from "./Vulnerabilities";

// Styles and utils
import styles from "./styles.module.css";
import { processResults } from "./utils";

export default function OWASPValidator({ apiSpec }) {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedViolations, setExpandedViolations] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const validateApi = async () => {
      try {
        // Check if specification was provided
        if (!apiSpec) {
          throw new Error("OpenAPI specification not provided");
        }

        // Process the specification (check if it's a string or object)
        let specString;
        if (typeof apiSpec === "string") {
          // If it's a base64 encoded string or other encoding, try to decode
          try {
            // Check if it looks like base64
            if (/^[A-Za-z0-9+/=]+$/.test(apiSpec.trim())) {
              specString = atob(apiSpec);
            } else {
              specString = apiSpec;
            }
          } catch (e) {
            // If decoding fails, use the original string
            specString = apiSpec;
          }
        } else {
          // If it's an object, convert to string
          specString = JSON.stringify(apiSpec);
        }

        // Run validation
        const validator = new ValidateAPISecurityProvider();
        const validationResults = await validator.analyzeOpenAPISpec(specString);
        let parsedResults = typeof validationResults === "string"
          ? JSON.parse(validationResults)
          : validationResults;

        // Process the results to add severities and normalize data
        const processedResults = processResults(parsedResults);
        setResults(processedResults);
      } catch (err) {
        console.error("Error in OWASP validation:", err);
        setError(err.message || "Unknown validation error");
      } finally {
        setIsLoading(false);
      }
    };

    validateApi();
  }, [apiSpec]);

  // Function to toggle expansion of violation categories
  const toggleViolationExpansion = (index) => {
    setExpandedViolations((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to navigate to vulnerabilities tab and focus on a specific item
  const navigateToVulnerability = (index) => {
    setActiveTab("vulnerabilities");
    setExpandedViolations((prev) => ({
      ...prev,
      [index]: true,
    }));

    // Use setTimeout to ensure the DOM is updated before scrolling
    setTimeout(() => {
      const element = document.getElementById(`vulnerability-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Add a highlight effect
        element.classList.add(styles.highlightVulnerability);
        setTimeout(() => {
          element.classList.remove(styles.highlightVulnerability);
        }, 2000);
      }
    }, 100);
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  if (!results) {
    return null;
  }

  // Try to parse results if it's a string
  try {
    if (typeof results === "string") {
      const parsedResults = JSON.parse(results);
      return renderResults(parsedResults);
    }
    return renderResults(results);
  } catch (err) {
    return (
      <div className={styles.rawResultsContainer}>
        <h2 className={styles.rawResultsTitle}>OWASP Security Analysis</h2>
        <p>Raw analysis result:</p>
        <pre className={styles.rawResultsPreTag}>{results}</pre>
      </div>
    );
  }

  // Render formatted results
  function renderResults(data) {
    return (
      <div className={styles.container}>
      {/*   <div className={styles.header}>
          <div className={styles.headerTitle}>OWASP API Security Scan</div>
          <div className={styles.headerBadge}>OWASP Guide: Full Report</div>
        </div> */}

        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          violationsCount={data.analysis.owaspViolations.length} 
        />

        {activeTab === "overview" ? (
          <Overview 
            data={data} 
            navigateToVulnerability={navigateToVulnerability} 
          />
        ) : (
          <Vulnerabilities 
            violations={data.analysis.owaspViolations} 
            expandedViolations={expandedViolations} 
            toggleViolationExpansion={toggleViolationExpansion} 
            apiSpec={apiSpec}
          />
        )}
      </div>
    );
  }
}