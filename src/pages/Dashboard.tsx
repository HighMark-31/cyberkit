// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
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
  ArrowRight,
  Zap,
  Target,
  Lock as LockIcon,
  Search,
  Calculator,
  Image,
  Link as LinkIcon,
  Terminal,
  Cpu
} from 'lucide-react';

const toolCategories = [
  {
    title: 'Password Security',
    description: 'Tools for password analysis and generation',
    tools: [
      { 
        name: 'Password Checker', 
        href: '/password-checker', 
        icon: Key,
        description: 'Analyze password strength with advanced scoring'
      },
      { 
        name: 'Password Generator', 
        href: '/password-generator', 
        icon: Lock,
        description: 'Generate secure passwords and passphrases'
      }
    ]
  },
  {
    title: 'System & Terminal',
    description: 'Command line simulation and system utilities',
    tools: [
      { 
        name: 'Terminal', 
        href: '/terminal', 
        icon: Terminal,
        description: 'Full Linux terminal simulator with 100+ commands'
      },
      { 
        name: 'Chmod Calculator', 
        href: '/chmod-calculator', 
        icon: Calculator,
        description: 'Visual permission calculator (r/w/x)'
      }
    ]
  },
  {
    title: 'Network Analysis',
    description: 'Network diagnostics and calculation tools',
    tools: [
      { 
        name: 'Subnet Calculator', 
        href: '/subnet-calculator', 
        icon: Cpu,
        description: 'IPv4/IPv6 subnetting and CIDR calculation'
      },
      { 
        name: 'HTTP Headers', 
        href: '/http-headers', 
        icon: Network,
        description: 'Analyze HTTP security headers'
      },
      { 
        name: 'SSL/TLS Checker', 
        href: '/ssl-checker', 
        icon: ShieldCheck,
        description: 'Examine SSL certificate details'
      },
      {
        name: 'Traceroute',
        href: '/traceroute',
        icon: Network,
        description: 'Trace packet path across network'
      }
    ]
  },
  {
    title: 'OSINT & Recon',
    description: 'Information gathering and intelligence',
    tools: [
      {
        name: 'Google Dorks',
        href: '/google-dorks',
        icon: Search,
        description: 'Generate advanced search queries'
      },
      {
        name: 'Exif Viewer',
        href: '/exif-viewer',
        icon: Image,
        description: 'Extract hidden metadata from images'
      },
      {
        name: 'Whois',
        href: '/whois',
        icon: Network,
        description: 'Lookup domain registration information'
      }
    ]
  },
  {
    title: 'Web Utilities',
    description: 'Data processing and manipulation',
    tools: [
      { 
        name: 'URL Parser', 
        href: '/url-parser', 
        icon: LinkIcon,
        description: 'Parse, build, and modify URLs'
      },
      { 
        name: 'Encoder/Decoder', 
        href: '/encoder-decoder', 
        icon: Code,
        description: 'Base64, Hex, URL, and HTML encoding'
      },
      { 
        name: 'Hash Generator', 
        href: '/hash-generator', 
        icon: Hash,
        description: 'MD5, SHA family hash generation'
      }
    ]
  },
  {
    title: 'Threat Detection',
    description: 'Vulnerability scanning and log analysis',
    tools: [
      {
        name: 'Log Analyzer',
        href: '/log-analyzer',
        icon: FileText,
        description: 'Analyze log files for security patterns'
      },
      {
        name: 'XSS Detector',
        href: '/xss-detector',
        icon: AlertTriangle,
        description: 'Detect and analyze XSS vulnerabilities'
      },
      {
        name: 'Ping',
        href: '/ping',
        icon: Zap,
        description: 'Test network connectivity and latency'
      }
    ]
  }
];

const securityStats = [
  {
    label: 'Tools Available',
    value: '11',
    icon: Zap,
    description: 'Professional cybersecurity utilities'
  },
  {
    label: 'Client-Side',
    value: '100%',
    icon: LockIcon,
    description: 'All processing happens locally'
  },
  {
    label: 'Open Source',
    value: 'Yes',
    icon: Target,
    description: 'Transparent and auditable code'
  }
];

export const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 sm:p-10 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-background border border-white/10 p-8 sm:p-12">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            v2.0 Now Available
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Security Tools for the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Modern Web
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A professional suite of client-side cybersecurity utilities. 
            Perform audits, generate secure credentials, and analyze threats directly from your browser.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5">
              View Documentation
            </Button>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-50 blur-3xl pointer-events-none">
          <div className="w-96 h-96 bg-primary/30 rounded-full" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <Badge variant="secondary" className="bg-white/5 text-xs font-normal">
                  Live
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <p className="font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground/60">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tools Section */}
      <div className="space-y-12">
        {toolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="text-xl font-semibold text-white/90 px-4 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
                {category.title}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.tools.map((tool, toolIndex) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={toolIndex}
                    to={tool.href}
                    className="group relative flex flex-col p-6 rounded-2xl border border-white/5 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    
                    <div className="relative z-10 flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-background/50 border border-white/5 group-hover:border-primary/20 group-hover:text-primary transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                      <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};
