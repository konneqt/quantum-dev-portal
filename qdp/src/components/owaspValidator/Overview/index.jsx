import React from "react";
import styles from "./styles.module.css"; // Adicione um arquivo CSS para estilos específicos
import SecurityScore from "./SecurityScore";
import SecurityIssues from "./SecurityIssues";
import TopVulnerabilities from "./TopVulnerabilities";
import RecommendedActions from "./RecommendedActions";

const Overview = ({ data, navigateToVulnerability }) => {
  return (
    <div className={styles.overviewContainer}>
      {/* Main Content Grid */}
      <div className={styles.gridContainer}>
        <SecurityScore score={data.analysis.score} />
        <SecurityIssues violations={data.analysis.owaspViolations} />
        <TopVulnerabilities 
          violations={data.analysis.owaspViolations.slice(0, 3)} 
          navigateToVulnerability={navigateToVulnerability} 
        />
      </div>

      {/* Recommended Actions */}
      <RecommendedActions 
        violations={data.analysis.owaspViolations.slice(0, 3)} 
        navigateToVulnerability={navigateToVulnerability}
      />
    </div>
  );
};

export default Overview;