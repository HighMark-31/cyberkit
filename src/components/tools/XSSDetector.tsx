// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

export const XSSDetector = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any>(null);

  const detectXSS = () => {
    const patterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /eval\s*\(/gi,
      /document\./gi,
      /window\./gi
    ];

    const detected = patterns.map(pattern => ({
      pattern: pattern.source,
      matches: input.match(pattern) || []
    })).filter(result => result.matches.length > 0);

    const riskLevel = detected.length > 3 ? 'high' : detected.length > 1 ? 'medium' : detected.length > 0 ? 'low' : 'none';

    setResults({
      detected,
      riskLevel,
      totalMatches: detected.reduce((sum, d) => sum + d.matches.length, 0)
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-orange-500';
      default: return 'text-green-500';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <XCircle className="h-5 w-5" />;
      case 'medium': return <AlertTriangle className="h-5 w-5" />;
      case 'low': return <AlertTriangle className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">XSS Detector</h1>
        <p className="text-muted-foreground">
          Detect potential Cross-Site Scripting vulnerabilities in your code
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Code Input</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your HTML/JavaScript code here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-64 font-mono"
          />
          <Button onClick={detectXSS} className="w-full">
            Scan for XSS
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getRiskIcon(results.riskLevel)}
              <span>Scan Results</span>
              <Badge className={getRiskColor(results.riskLevel)}>
                {results.riskLevel.toUpperCase()} RISK
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{results.totalMatches}</div>
                <div className="text-sm text-muted-foreground">Potential XSS patterns found</div>
              </div>

              {results.detected.length > 0 ? (
                <div className="space-y-3">
                  {results.detected.map((detection: any, index: number) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="font-semibold text-sm">Pattern: {detection.pattern}</div>
                      <div className="text-sm text-muted-foreground">
                        Matches: {detection.matches.length}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700">No XSS patterns detected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
