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
  Info,
  Search,
  Calculator,
  Image,
  Link,
  Terminal,
  Cpu
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
  { name: 'Traceroute', href: '/traceroute', icon: Network },
  { name: 'Subnet Calculator', href: '/subnet-calculator', icon: Cpu },
  { name: 'Google Dorks', href: '/google-dorks', icon: Search },
  { name: 'Chmod Calculator', href: '/chmod-calculator', icon: Calculator },
  { name: 'Exif Viewer', href: '/exif-viewer', icon: Image },
  { name: 'URL Parser', href: '/url-parser', icon: Link },
  { name: 'Terminal', href: '/terminal', icon: Terminal },
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="h-full bg-card/50 backdrop-blur-xl border-r border-white/5 flex flex-col">
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
        "lg:block h-full flex flex-col",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"></div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                CyberKit
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Security Suite</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    "hover:bg-white/5 hover:text-white",
                    isActive
                      ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                      : "text-muted-foreground"
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};