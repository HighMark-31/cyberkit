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
  Lock as LockIcon
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
    title: 'Encoding & Hashing',
    description: 'Data transformation and integrity verification',
    tools: [
      { 
        name: 'Encoder/Decoder', 
        href: '/encoder-decoder', 
        icon: Code,
        description: 'Base64, Hex, URL, and HTML encoding/decoding'
      },
      { 
        name: 'Hash Generator', 
        href: '/hash-generator', 
        icon: Hash,
        description: 'MD5, SHA family hash generation and validation'
      }
    ]
  },
  {
    title: 'Network Security',
    description: 'Web security analysis and monitoring',
    tools: [
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
      }
    ]
  },
  {
    title: 'Threat Analysis',
    description: 'Security vulnerability detection',
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
      }
    ]
  },
  {
    title: 'Network Info',
    description: 'Network diagnostic and information tools',
    tools: [
      {
        name: 'Ping',
        href: '/ping',
        icon: Zap,
        description: 'Test network connectivity and latency'
      },
      {
        name: 'Whois',
        href: '/whois',
        icon: Network,
        description: 'Lookup domain registration information'
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
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CyberKit
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Professional Security Tools Suite</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            A comprehensive collection of cybersecurity tools for professionals.
            All tools run client-side ensuring your data never leaves your device.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {securityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="cyber-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tool Categories */}
        <div className="space-y-8">
          {toolCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {category.tools.map((tool, toolIndex) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={toolIndex} className="cyber-card hover:cyber-glow transition-all duration-smooth">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <span>{tool.name}</span>
                          </div>
                          <Badge variant="outline" className="text-accent">
                            Ready
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                        <Button asChild className="w-full group">
                          <Link to={tool.href}>
                            Launch Tool
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center mt-1">
                <Shield className="h-4 w-4 text-success" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-success">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">
                  All tools in this suite operate entirely client-side. Your sensitive data is processed
                  locally in your browser and never transmitted to external servers. This ensures maximum
                  privacy and security for your cybersecurity analysis tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a
              href="https://highmark.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Highmark.it
            </a>{' '}
            - An open source project.{' '}
            <a
              href="https://github.com/HighMark-31/cyberkit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
