import { useEffect, useState } from 'react';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';

export function useSidebarData() {
  const sidebarFromContext = useDocsSidebar();
  
  const [customSidebarData, setCustomSidebarData] = useState(null);
  
  useEffect(() => {
    if (!sidebarFromContext && window.DocusaurusSidebarData) {
      setCustomSidebarData(window.DocusaurusSidebarData);
    }
  }, [sidebarFromContext]);
  
  return sidebarFromContext || customSidebarData;
}
