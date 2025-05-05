import React from "react";
import styles from "./styles.module.css";
import { getSeverityColor, owaspMap } from "../utils";

const RecommendedActions = ({ violations, navigateToVulnerability }) => {
  return (
    <div className={styles.recommendedActionsContainer}>
      <div className={styles.sectionHeader}>
        Recommended Actions
      </div>

      <div className={styles.cardContent}>
        {violations.map((violation, idx) => {
          // Map to correct OWASP category
          const mapped = owaspMap[violation.category] || {
            id: `API${idx + 1}:2023`,
            name: violation.category || `Security Violation ${idx + 1}`,
          };

          // Get first suggestion from occurrences if available
          const description =
            violation.occurrences && violation.occurrences.length > 0
              ? violation.occurrences[0].suggestion
              : "Implement appropriate security controls to mitigate this vulnerability.";

          return (
            <div
              key={idx}
              className={`${styles.actionItem} ${idx < violations.length - 1 ? styles.actionItemBorder : ''}`}
            >
              <div className={styles.actionHeader}>
                <div className={styles.actionHeaderLeft}>
                  <div
                    className={styles.severityBadge}
                    style={{
                      backgroundColor: getSeverityColor(violation.severity),
                    }}
                  >
                    {violation.severity || "Critical"}
                  </div>
                  <div className={styles.actionTitle}>{mapped.name}</div>
                </div>
                <button
                  className={styles.primaryButton}
                  onClick={() => navigateToVulnerability(idx)}
                >
                  Fix issues
                </button>
              </div>
              <div className={styles.actionDescription}>
                {description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedActions;