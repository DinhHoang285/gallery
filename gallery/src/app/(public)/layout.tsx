import Header from '@/assets/layouts/header';
import Navigation from '@/assets/layouts/navigation';

import { ReactNode } from 'react';

const MainLayoutTheme = ({ children }: { children: ReactNode; }) => {
  return (
    <div className="body-sidebar-content">
      <Header />
      <Navigation />
      {children}
    </div>
  );
}

export default MainLayoutTheme;