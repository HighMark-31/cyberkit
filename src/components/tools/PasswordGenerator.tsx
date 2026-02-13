// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Key, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'il1Lo0O'
};

const WORDS = [
  'apple', 'brave', 'cloud', 'dance', 'eagle', 'flame', 'green', 'house', 'ice', 'jump',
  'kite', 'light', 'moon', 'night', 'ocean', 'peace', 'quiet', 'river', 'stone', 'tiger',
  'umbrella', 'voice', 'water', 'xenon', 'yellow', 'zebra', 'forest', 'mountain', 'sunset', 'galaxy'
];

export const PasswordGenerator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'password' | 'passphrase'>('password');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');
  
  const [passwordOptions, setPasswordOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const [passphraseOptions, setPassphraseOptions] = useState({
    wordCount: 4,
    separator: '-',
    includeNumbers: false,
    capitalize: true,
  });

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (passwordOptions.includeUppercase) charset += CHARSET.uppercase;
    if (passwordOptions.includeLowercase) charset += CHARSET.lowercase;
    if (passwordOptions.includeNumbers) charset += CHARSET.numbers;
    if (passwordOptions.includeSymbols) charset += CHARSET.symbols;

    if (passwordOptions.excludeSimilar) {
      for (const char of CHARSET.similar) {
        charset = charset.replace(new RegExp(char, 'g'), '');
      }
    }

    if (!charset) {
      toast({
        title: 'Error',
        description: 'Please select at least one character type',
        variant: 'destructive',
      });
      return;
    }

    let password = '';
    for (let i = 0; i < passwordOptions.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(password);
  }, [passwordOptions, toast]);

  const generatePassphrase = useCallback(() => {
    const selectedWords = [];
    for (let i = 0; i < passphraseOptions.wordCount; i++) {
      let word = WORDS[Math.floor(Math.random() * WORDS.length)];
      
      if (passphraseOptions.capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      if (passphraseOptions.includeNumbers && Math.random() > 0.5) {
        word += Math.floor(Math.random() * 100);
      }
      
      selectedWords.push(word);
    }

    const passphrase = selectedWords.join(passphraseOptions.separator);
    setGeneratedPassphrase(passphrase);
  }, [passphraseOptions]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Password copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { level: 'weak', color: 'destructive' };
    if (password.length < 12) return { level: 'fair', color: 'warning' };
    if (password.length < 16) return { level: 'good', color: 'warning' };
    return { level: 'strong', color: 'success' };
  };

  const currentPassword = activeTab === 'password' ? generatedPassword : generatedPassphrase;
  const strength = currentPassword ? getPasswordStrength(currentPassword) : null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Secure Password Generator</h1>
        <p className="text-muted-foreground">
          Genera password sicure e personalizzabili utilizzando algoritmi crittograficamente sicuri
        </p>
      </div>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Generated Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tab selector */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'password' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('password')}
              className="flex-1"
            >
              <Key className="h-4 w-4 mr-2" />
              Password
            </Button>
            <Button
              variant={activeTab === 'passphrase' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('passphrase')}
              className="flex-1"
            >
              <Type className="h-4 w-4 mr-2" />
              Passphrase
            </Button>
          </div>

          {/* Generated output */}
          {currentPassword && (
            <Card className="bg-code-bg border-border/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Generated {activeTab === 'password' ? 'Password' : 'Passphrase'}</Label>
                    {strength && (
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full border",
                        strength.color === 'success' ? 'security-strong' :
                        strength.color === 'warning' ? 'security-medium' : 'security-weak'
                      )}>
                        {strength.level}
                      </span>
                    )}
                  </div>
                  <Textarea
                    value={currentPassword}
                    readOnly
                    className="font-mono text-accent bg-transparent border-none resize-none"
                    rows={Math.ceil(currentPassword.length / 60)}
                  />
                  <Button
                    onClick={() => copyToClipboard(currentPassword)}
                    className="w-full"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Password options */}
          {activeTab === 'password' && (
            <Card className="bg-code-bg border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Password Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* Length slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Length</Label>
                    <span className="text-sm text-accent font-mono">{passwordOptions.length}</span>
                  </div>
                  <Slider
                    value={[passwordOptions.length]}
                    onValueChange={(value) => 
                      setPasswordOptions(prev => ({ ...prev, length: value[0] }))
                    }
                    min={4}
                    max={128}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Character type options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'includeUppercase', label: 'Uppercase (A-Z)' },
                    { key: 'includeLowercase', label: 'Lowercase (a-z)' },
                    { key: 'includeNumbers', label: 'Numbers (0-9)' },
                    { key: 'includeSymbols', label: 'Symbols (!@#...)' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={passwordOptions[key as keyof GeneratorOptions] as boolean}
                        onCheckedChange={(checked) => 
                          setPasswordOptions(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="excludeSimilar"
                    checked={passwordOptions.excludeSimilar}
                    onCheckedChange={(checked) => 
                      setPasswordOptions(prev => ({ ...prev, excludeSimilar: checked }))
                    }
                  />
                  <Label htmlFor="excludeSimilar" className="text-sm">
                    Exclude similar characters (il1Lo0O)
                  </Label>
                </div>

                <Button 
                  onClick={generatePassword} 
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      generatePassword();
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Password
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Passphrase options */}
          {activeTab === 'passphrase' && (
            <Card className="bg-code-bg border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Passphrase Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* Word count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Number of Words</Label>
                    <span className="text-sm text-accent font-mono">{passphraseOptions.wordCount}</span>
                  </div>
                  <Slider
                    value={[passphraseOptions.wordCount]}
                    onValueChange={(value) => 
                      setPassphraseOptions(prev => ({ ...prev, wordCount: value[0] }))
                    }
                    min={2}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Separator */}
                <div className="space-y-2">
                  <Label htmlFor="separator" className="text-sm">Word Separator</Label>
                  <Input
                    id="separator"
                    value={passphraseOptions.separator}
                    onChange={(e) => 
                      setPassphraseOptions(prev => ({ ...prev, separator: e.target.value }))
                    }
                    className="font-mono"
                    maxLength={3}
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="capitalize"
                      checked={passphraseOptions.capitalize}
                      onCheckedChange={(checked) => 
                        setPassphraseOptions(prev => ({ ...prev, capitalize: checked }))
                      }
                    />
                    <Label htmlFor="capitalize" className="text-sm">Capitalize first letter</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeNumbersPassphrase"
                      checked={passphraseOptions.includeNumbers}
                      onCheckedChange={(checked) => 
                        setPassphraseOptions(prev => ({ ...prev, includeNumbers: checked }))
                      }
                    />
                    <Label htmlFor="includeNumbersPassphrase" className="text-sm">Add random numbers</Label>
                  </div>
                </div>

                <Button onClick={generatePassphrase} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Passphrase
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};