import React from "react";
import { useColorMode } from '@docusaurus/theme-common';
import styles from "./styles.module.css";

const TabNavigation = ({ activeTab, setActiveTab, violationsCount }) => {
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  
  return (
    <div className={styles.tabContainer}>
      <TabButton 
        label="Overview" 
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
              fill={activeTab === "overview" 
                ? (isDarkTheme ? "#4dabf5" : "#2196f3") 
                : (isDarkTheme ? "#aaa" : "#666")}
            />
          </svg>
        }
        isActive={activeTab === "overview"}
        onClick={() => setActiveTab("overview")}
      />
      
      <TabButton 
        label="Vulnerabilities" 
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z"
              fill={activeTab === "vulnerabilities" 
                ? (isDarkTheme ? "#4dabf5" : "#2196f3") 
                : (isDarkTheme ? "#aaa" : "#666")}
            />
          </svg>
        }
        isActive={activeTab === "vulnerabilities"}
        onClick={() => setActiveTab("vulnerabilities")}
        badge={violationsCount > 0 ? violationsCount : null}
      />
    </div>
  );
};

// Helper component for tab buttons
const TabButton = ({ label, icon, isActive, onClick, badge = null }) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
    >
      <div className={styles.tabContent}>
        {icon}
        {label}
        {badge !== null && (
          <span className={styles.tabBadge}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;