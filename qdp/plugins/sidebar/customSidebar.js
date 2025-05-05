import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';
import { useSidebarData } from './hooks/useSidebarData';

import DocSidebar from '@theme/DocSidebar';

export default function CustomSidebar(props) {
  const location = useLocation();
  const sidebarData = useSidebarData();
  
  return (
    <BrowserOnly>
      {() => {
        if (!sidebarData) {
          return <div>Carregando sidebar...</div>;
        }
        
        return (
          <div className="docusaurus-custom-sidebar">
            <DocSidebar
              sidebar={sidebarData}
              path={location.pathname}
              {...props}
            />
          </div>
        );
      }}
    </BrowserOnly>
  );
}
