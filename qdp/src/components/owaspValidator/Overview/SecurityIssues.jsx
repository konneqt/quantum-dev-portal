import React from "react";
import styles from "./styles.module.css";
import { getSeverityColor } from "../utils";

const SecurityIssues = ({ violations }) => {
  // Count violations by severity
  const criticalCount = violations.filter(v => v.severity === "Critical").length;
  const highCount = violations.filter(v => v.severity === "High").length;
  const mediumCount = violations.filter(v => v.severity === "Medium").length;
  const lowCount = violations.filter(v => v.severity === "Low").length;

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>Security Issues</div>
      <div className={styles.severityList}>
        <SeverityItem color="#f44336" label="Critical" count={criticalCount} />
        <SeverityItem color="#ff9800" label="High" count={highCount} />
        <SeverityItem color="#ff9800" label="Medium" count={mediumCount} opacity="0.7" />
        <SeverityItem color="#4caf50" label="Low" count={lowCount} />
      </div>
      <div className={styles.totalRow}>
        <span>Total Issues</span>
        <span className={styles.totalCount}>
          {violations.length}
        </span>
      </div>
    </div>
  );
};

const SeverityItem = ({ color, label, count, opacity = "1" }) => {
  return (
    <div className={styles.severityItem}>
      <div className={styles.severityLabel}>
        <div
          className={styles.severityDot}
          style={{
            backgroundColor: color,
            opacity: opacity,
          }}
        ></div>
        <span>{label}</span>
      </div>
      <span>{count}</span>
    </div>
  );
};

export default SecurityIssues;
