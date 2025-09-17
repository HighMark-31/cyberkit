// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Key,
  Lock,
  Code,
  Hash,
  Network,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Menu,
  X,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Shield },
  { name: 'Password Checker', href: '/password-checker', icon: Key },
  { name: 'Password Generator', href: '/password-generator', icon: Lock },
  { name: 'Encoder/Decoder', href: '/encoder-decoder', icon: Code },
  { name: 'Hash Generator', href: '/hash-generator', icon: Hash },
  { name: 'HTTP Headers', href: '/http-headers', icon: Network },
  { name: 'Log Analyzer', href: '/log-analyzer', icon: FileText },
  { name: 'XSS Detector', href: '/xss-detector', icon: AlertTriangle },
  { name: 'SSL/TLS Checker', href: '/ssl-checker', icon: ShieldCheck },
  { name: 'Ping', href: '/ping', icon: Zap },
  { name: 'Whois', href: '/whois', icon: Info },
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-r border-border cyber-card">
      {/*Mobile menu*/}
      <div className="lg:hidden p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full justify-start"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4 mr-2" /> : <Menu className="h-4 w-4 mr-2" />}
          {isMobileMenuOpen ? 'Close Menu' : 'Security Tools'}
        </Button>
      </div>

      {/* Navigation*/}
      <div className={cn(
        "lg:block",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">CyberKit</h1>
              <p className="text-xs text-muted-foreground">Security Tools Suite</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-smooth",
                    "hover:bg-accent/50 hover:text-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 cyber-glow"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border mt-4">
          <p className="text-xs text-muted-foreground">
            Open source cybersecurity tools for professionals
          </p>
        </div>
      </div>
    </nav>
  );
};