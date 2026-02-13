// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import Footer from './Footer';
import { SEO_CONFIG } from '@/lib/seo-config';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    const config = SEO_CONFIG[location.pathname] || SEO_CONFIG['/'];
    
    document.title = config.title;

    const updateMeta = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', config.description);

    updateMeta('og:title', config.title, 'property');
    updateMeta('og:description', config.description, 'property');
    updateMeta('og:url', `https://cyberkit.mylaby.space${location.pathname}`, 'property');

    updateMeta('twitter:title', config.title);
    updateMeta('twitter:description', config.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://cyberkit.mylaby.space${location.pathname}`);
    }

  }, [location]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Sidebar*/}
      <div className="w-full lg:w-72 lg:flex-shrink-0">
        <div className="lg:fixed lg:inset-y-0 lg:w-72">
          <Navigation />
        </div>
      </div>

      {/*Main*/}
      <div className="flex-1">
        <main className="min-h-screen pb-24 pt-4 lg:pt-0">
          {children}
        </main>
      </div>
      
      {/*Footer */}
      <Footer />
    </div>
  );
};