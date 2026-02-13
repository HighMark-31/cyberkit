// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PasswordResult {
  score: number;
  feedback: {
    suggestions: string[];
    warning: string;
  };
  crack_times_display: {
    offline_slow_hashing_1e4_per_second: string;
    online_no_throttling_10_per_second: string;
  };
}

export const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);

  useEffect(() => {
    if (password) {
      const analysis = zxcvbn(password);
      setResult(analysis as PasswordResult);
    } else {
      setResult(null);
    }
  }, [password]);

  const getStrengthInfo = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { 
          label: 'Weak', 
          color: 'destructive', 
          bgClass: 'security-weak',
          icon: AlertTriangle,
          progress: score === 0 ? 10 : 25
        };
      case 2:
        return { 
          label: 'Fair', 
          color: 'warning', 
          bgClass: 'security-medium',
          icon: Shield,
          progress: 50
        };
      case 3:
        return { 
          label: 'Good', 
          color: 'warning', 
          bgClass: 'security-medium',
          icon: Shield,
          progress: 75
        };
      case 4:
        return { 
          label: 'Strong', 
          color: 'success', 
          bgClass: 'security-strong',
          icon: CheckCircle,
          progress: 100
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'muted', 
          bgClass: '',
          icon: Shield,
          progress: 0
        };
    }
  };

  const strengthInfo = result ? getStrengthInfo(result.score) : null;
  const StrengthIcon = strengthInfo?.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Password Strength Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze the strength and entropy of your passwords against common attacks
        </p>
      </div>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Analysis Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Enter Password to Analyze</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type your password here..."
                className="pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {result && strengthInfo && (
            <div className="space-y-4">
              {/* Strength indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Password Strength</Label>
                  <div className="flex items-center space-x-2">
                    <StrengthIcon className="h-4 w-4" />
                    <Badge 
                      variant="outline" 
                      className={cn("font-medium", strengthInfo.bgClass)}
                    >
                      {strengthInfo.label}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={strengthInfo.progress} 
                  className="h-2"
                />
              </div>

              {/* Crack time estimates */}
              <Card className="bg-code-bg border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Estimated Crack Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Online attack (throttled):</p>
                      <p className="font-mono text-accent">
                        {result.crack_times_display.online_no_throttling_10_per_second}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Offline attack (slow hash):</p>
                      <p className="font-mono text-accent">
                        {result.crack_times_display.offline_slow_hashing_1e4_per_second}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback and suggestions */}
              {(result.feedback.warning || result.feedback.suggestions.length > 0) && (
                <Card className="bg-code-bg border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {result.feedback.warning && (
                      <div className="p-3 rounded-lg security-weak">
                        <p className="text-sm font-medium">⚠️ {result.feedback.warning}</p>
                      </div>
                    )}
                    {result.feedback.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Suggestions to improve:</p>
                        <ul className="space-y-1">
                          {result.feedback.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm flex items-start space-x-2">
                              <span className="text-accent mt-1">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!password && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter a password above to analyze its strength</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};