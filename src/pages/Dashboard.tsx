// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Zap,
  Target,
  Lock as LockIcon,
  ArrowRight
} from 'lucide-react';
import { toolCategories } from '@/lib/tools-config';

const securityStats = [
  {
    label: 'Tools Available',
    value: '23',
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
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-background border border-white/10 p-8 sm:p-16 text-center">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm px-4 py-1.5 text-sm">
            v2.0 Now Available
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Security Tools for the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Modern Web
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A professional suite of client-side cybersecurity utilities. 
            Perform audits, generate secure credentials, and analyze threats directly from your browser.
          </p>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl pointer-events-none">
          <div className="w-[500px] h-[500px] bg-primary/30 rounded-full mix-blend-screen" />
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
      <div className="space-y-16">
        {toolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="text-xl font-semibold text-white/90 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
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
                    className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    
                    {/* New Badge */}
                    {/* @ts-ignore */}
                    {tool.isNew && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">New</Badge>
                      </div>
                    )}

                    <div className="relative z-10 mb-6">
                      <div className="p-4 rounded-2xl bg-background/50 border border-white/5 group-hover:border-primary/20 group-hover:text-primary transition-all duration-300 group-hover:scale-110 shadow-lg shadow-black/20">
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    
                    <div className="relative z-10 space-y-3">
                      <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <ArrowRight className="h-4 w-4 text-primary" />
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
