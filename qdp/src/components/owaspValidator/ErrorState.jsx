import React from "react";
import styles from "./styles.module.css";

const ErrorState = ({ error }) => {
  return (
    <div className={styles.errorContainer}>
      <h3 className={styles.errorTitle}>Security validation error</h3>
      <p className={styles.errorMessage}>{error}</p>
    </div>
  );
};

export default ErrorState;