// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState, useEffect } from 'react';
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
  Cpu,
  ChevronDown,
  ChevronRight,
  User,
  Database,
  Globe,
  FileSearch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const navigationGroups = [
  {
    title: 'Password & Auth',
    items: [
      { name: 'Password Checker', href: '/password-checker', icon: Key },
      { name: 'Password Generator', href: '/password-generator', icon: Lock },
      { name: 'Hash Generator', href: '/hash-generator', icon: Hash },
    ]
  },
  {
    title: 'Network Tools',
    items: [
      { name: 'Ping', href: '/ping', icon: Zap },
      { name: 'Traceroute', href: '/traceroute', icon: Network },
      { name: 'Subnet Calculator', href: '/subnet-calculator', icon: Cpu },
      { name: 'HTTP Headers', href: '/http-headers', icon: Network },
      { name: 'SSL/TLS Checker', href: '/ssl-checker', icon: ShieldCheck },
      { name: 'Advanced DNS Recon', href: '/dns-recon', icon: Globe },
    ]
  },
  {
    title: 'Web Security',
    items: [
      { name: 'Website Scanner', href: '/website-scanner', icon: Search },
      { name: 'XSS Detector', href: '/xss-detector', icon: AlertTriangle },
      { name: 'Log Analyzer', href: '/log-analyzer', icon: FileText },
      { name: 'URL Parser', href: '/url-parser', icon: Link },
      { name: 'Encoder/Decoder', href: '/encoder-decoder', icon: Code },
    ]
  },
  {
    title: 'OSINT & Recon',
    items: [
      { name: 'Sherlock Web', href: '/sherlock-web', icon: User },
      { name: 'Subdomain Finder', href: '/subdomain-finder', icon: Globe },
      { name: 'File Metadata', href: '/metadata-scanner', icon: FileSearch },
      { name: 'Steganography Lab', href: '/steganography-lab', icon: Image },
      { name: 'Google Dorks', href: '/google-dorks', icon: Search },
      { name: 'Whois', href: '/whois', icon: Info },
      { name: 'Exif Viewer', href: '/exif-viewer', icon: Image },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Terminal', href: '/terminal', icon: Terminal },
      { name: 'Chmod Calculator', href: '/chmod-calculator', icon: Calculator },
    ]
  }
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  useEffect(() => {
    // Select one random group to be open initially
    const randomIndex = Math.floor(Math.random() * navigationGroups.length);
    setOpenGroups([navigationGroups[randomIndex].title]);
  }, []);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <nav className="h-full bg-card/50 backdrop-blur-xl border-r border-white/5 flex flex-col">
      {/*Mobile menu*/}
      <div className="lg:hidden p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 shadow-lg shadow-primary/20">
              <Shield className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20"></div>
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              CyberKit
            </span>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-9 w-9"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Navigation*/}
      <div className={cn(
        "lg:flex flex-col h-full transition-all duration-300 ease-in-out",
        isMobileMenuOpen ? "fixed inset-0 top-[69px] z-40 bg-background/95 backdrop-blur-xl overflow-y-auto pb-20" : "hidden"
      )}>
        <div className="hidden lg:block p-6">
          <NavLink to="/" className="flex items-center space-x-3">
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
          </NavLink>
        </div>

        <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
          {/* Dashboard Direct Link */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative mb-4",
                "hover:bg-white/5 hover:text-white",
                isActive
                  ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                  : "text-muted-foreground"
              )
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Shield className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          {navigationGroups.map((group) => (
            <Collapsible
              key={group.title}
              open={openGroups.includes(group.title)}
              onOpenChange={() => toggleGroup(group.title)}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between font-semibold text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-white hover:bg-white/5 mb-1"
                >
                  {group.title}
                  {openGroups.includes(group.title) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
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
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </nav>
  );
};