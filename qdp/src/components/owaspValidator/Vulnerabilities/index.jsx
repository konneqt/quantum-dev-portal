import React from "react";
import VulnerabilityItem from "./VulnerabilityItem";
import styles from "./styles.module.css";

const Vulnerabilities = ({ 
  violations, 
  expandedViolations,
  toggleViolationExpansion,
  apiSpec
}) => {
  return (
    <div className={styles.vulnerabilitiesContainer}>
      {/* Vulnerability List */}
      <div className={styles.vulnerabilityList}>
        <div className={styles.vulnerabilityListHeader}>
          All Vulnerabilities ({violations.length})
        </div>

        {violations.map((violation, idx) => (
          <VulnerabilityItem
            key={idx}
            violation={violation}
            index={idx}
            isExpanded={expandedViolations[idx]}
            toggleExpansion={() => toggleViolationExpansion(idx)}
            isLast={idx === violations.length - 1}
            apiSpec={apiSpec}
          />
        ))}
      </div>
    </div>
  );
};

export default Vulnerabilities;