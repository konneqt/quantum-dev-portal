import React from "react";
import styles from "./styles.module.css";
import { getScoreColor, getScoreDescription } from "../utils";

const SecurityScore = ({ score }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        Security Score
      </div>
      <div
        className={styles.scoreCircle}
        style={{
          border: `3px solid ${getScoreColor(score)}`,
          color: getScoreColor(score),
        }}
      >
        {score}
      </div>
      <div
        className={styles.scoreDescription}
        style={{
          color: getScoreColor(score),
        }}
      >
        {getScoreDescription(score)}
      </div>
      <div className={styles.scoreSubtitle}>
        based on OWASP API Top 10
      </div>
    </div>
  );
};

export default SecurityScore;