import { 
  Key, 
  Lock, 
  Hash, 
  Zap, 
  Network, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Search, 
  AlertTriangle, 
  FileText, 
  Link, 
  Code, 
  User, 
  FileSearch, 
  Image, 
  Info, 
  Terminal, 
  Calculator 
} from 'lucide-react';

export const toolCategories = [
  {
    title: 'Password & Auth',
    description: 'Tools for password analysis, generation and hashing',
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
    title: 'Network Tools',
    description: 'Analyze and test network infrastructure',
    tools: [
      { 
        name: 'Ping', 
        href: '/ping', 
        icon: Zap,
        description: 'Test host reachability and latency'
      },
      { 
        name: 'Traceroute', 
        href: '/traceroute', 
        icon: Network,
        description: 'Map the path packets take to a host'
      },
      { 
        name: 'Subnet Calculator', 
        href: '/subnet-calculator', 
        icon: Cpu,
        description: 'Calculate IP ranges and CIDR notation'
      },
      { 
        name: 'HTTP Headers', 
        href: '/http-headers', 
        icon: Network,
        description: 'Analyze security headers of a website'
      },
      { 
        name: 'SSL/TLS Checker', 
        href: '/ssl-checker', 
        icon: ShieldCheck,
        description: 'Verify certificate validity and chain'
      },
      { 
        name: 'Advanced DNS Recon', 
        href: '/dns-recon', 
        icon: Globe,
        description: 'Deep analysis of DNS records & security',
        isNew: true
      }
    ]
  },
  {
    title: 'Web Security',
    description: 'Vulnerability scanning and web data processing',
    tools: [
      {
        name: 'Website Scanner',
        href: '/website-scanner',
        icon: Search,
        description: 'Vulnerability and misconfiguration audit',
        isNew: true
      },
      {
        name: 'XSS Detector',
        href: '/xss-detector',
        icon: AlertTriangle,
        description: 'Detect and analyze XSS vulnerabilities',
        isNew: true
      },
      {
        name: 'Log Analyzer',
        href: '/log-analyzer',
        icon: FileText,
        description: 'Analyze log files for security patterns',
        isNew: true
      },
      { 
        name: 'URL Parser', 
        href: '/url-parser', 
        icon: Link,
        description: 'Parse, build, and modify URLs'
      },
      { 
        name: 'Encoder/Decoder', 
        href: '/encoder-decoder', 
        icon: Code,
        description: 'Base64, Hex, URL, and HTML encoding'
      }
    ]
  },
  {
    title: 'OSINT & Recon',
    description: 'Information gathering and intelligence',
    tools: [
      {
        name: 'Sherlock Web',
        href: '/sherlock-web',
        icon: User,
        description: 'Cross-check username availability on socials',
        isNew: true
      },
      {
        name: 'Subdomain Finder',
        href: '/subdomain-finder',
        icon: Globe,
        description: 'Passive discovery of target subdomains',
        isNew: true
      },
      {
        name: 'File Metadata',
        href: '/metadata-scanner',
        icon: FileSearch,
        description: 'Extract hidden metadata from documents',
        isNew: true
      },
      {
        name: 'Steganography Lab',
        href: '/steganography-lab',
        icon: Image,
        description: 'Hide secret messages inside images (LSB)',
        isNew: true
      },
      {
        name: 'Google Dorks',
        href: '/google-dorks',
        icon: Search,
        description: 'Generate advanced search queries'
      },
      {
        name: 'Whois',
        href: '/whois',
        icon: Info,
        description: 'Lookup domain registration information'
      },
      {
        name: 'Exif Viewer',
        href: '/exif-viewer',
        icon: Image,
        description: 'Extract hidden metadata from images'
      }
    ]
  },
  {
    title: 'System',
    description: 'Command line simulation and system utilities',
    tools: [
      { 
        name: 'Terminal', 
        href: '/terminal', 
        icon: Terminal,
        description: 'Full Linux terminal simulator with 100+ commands',
        isNew: true
      },
      { 
        name: 'Chmod Calculator', 
        href: '/chmod-calculator', 
        icon: Calculator,
        description: 'Visual permission calculator (r/w/x)'
      }
    ]
  }
];
