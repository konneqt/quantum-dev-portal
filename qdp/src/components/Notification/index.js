// src/components/Notification/index.js
import React from "react";
import { useColorMode } from '@docusaurus/theme-common';
import styles from "./styles.module.css";

export default function Notification({ message, type = "info", onClose }) {
  const { colorMode } = useColorMode();
  
  if (!message) return null;

  return (
    <div className={`${styles.notificationContainer} ${styles[type]}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}