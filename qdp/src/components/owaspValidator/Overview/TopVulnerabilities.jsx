import React from "react";
import styles from "./styles.module.css";
import { getSeverityColor, owaspMap } from "../utils";

const TopVulnerabilities = ({ violations, navigateToVulnerability }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>Top Vulnerabilities</div>
      <div>
        {violations.map((violation, idx) => {
          // Map to correct OWASP category
          const mapped = owaspMap[violation.category] || {
            id: `API${idx + 1}:2023`,
            name: violation.category || `Security Violation ${idx + 1}`,
          };

          return (
            <div
              key={idx}
              className={`${styles.vulnerabilityItem} ${idx < violations.length - 1 ? styles.vulnerabilityItemBorder : ''}`}
            >
              <div className={styles.vulnerabilityHeader}>
                <div className={styles.vulnerabilityTitle}>
                  {mapped.name}
                </div>
                <div
                  className={styles.severityBadge}
                  style={{
                    backgroundColor: getSeverityColor(violation.severity),
                  }}
                >
                  {violation.severity || "Critical"}
                </div>
              </div>
              <div className={styles.instanceCount}>
                {violation.occurrences?.length || 1} instances
              </div>
              <div className={styles.vulnerabilityAction}>
                <button
                  onClick={() => navigateToVulnerability(idx)}
                  className={styles.linkButton}
                >
                  View details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopVulnerabilities;
