// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Sidebar*/}
      <div className="w-full lg:w-72 lg:flex-shrink-0">
        <div className="lg:fixed lg:inset-y-0 lg:w-72">
          <Navigation />
        </div>
      </div>

      {/*Main*/}
      <div className="flex-1 lg:pl-72">
        <main className="min-h-screen pb-24 pt-4 lg:pt-0">
          {children}
        </main>
      </div>
      
      {/*Footer */}
      <Footer />
    </div>
  );
};