import Header from '@/assets/layouts/header';
import { ReactNode } from 'react';

const MainLayoutTheme = ({ children }: { children: ReactNode; }) => {
  return (
    <div className="body-sidebar-content">
      <Header />
      {children}
    </div>
  );
}

export default MainLayoutTheme;