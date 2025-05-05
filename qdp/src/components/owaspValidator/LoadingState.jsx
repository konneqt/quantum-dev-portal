import React from "react";
import styles from "./styles.module.css";

const LoadingState = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
      <p className={styles.loadingTitle}>Analyzing API security...</p>
      <p className={styles.loadingSubtitle}>This may take a few seconds.</p>
    </div>
  );
};

export default LoadingState;