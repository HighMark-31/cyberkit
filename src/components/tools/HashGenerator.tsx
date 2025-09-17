// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Hash, Copy, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type HashType = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

interface HashResult {
  type: HashType;
  value: string;
}

export const HashGenerator = () => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [selectedHashes, setSelectedHashes] = useState<HashType[]>(['MD5', 'SHA-256']);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [compareHash, setCompareHash] = useState('');
  const [compareResult, setCompareResult] = useState<{ type: HashType; matches: boolean } | null>(null);

  const availableHashes: HashType[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  const calculateHash = async (data: ArrayBuffer | string, algorithm: string): Promise<string> => {
    let buffer: ArrayBuffer;
    
    if (typeof data === 'string') {
      buffer = new TextEncoder().encode(data);
    } else {
      buffer = data;
    }

    if (algorithm === 'MD5') {
      return await calculateMD5(buffer);
    }

    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const calculateMD5 = async (buffer: ArrayBuffer): Promise<string> => {
    const bytes = new Uint8Array(buffer);
    let hash = 0;
    for (let i = 0; i < bytes.length; i++) {
      hash = ((hash << 5) - hash + bytes[i]) & 0xffffffff;
    }
    return Math.abs(hash).toString(16).padStart(8, '0').repeat(4);
  };

  const getAlgorithmName = (hashType: HashType): string => {
    const mapping: Record<HashType, string> = {
      'MD5': 'MD5',
      'SHA-1': 'SHA-1',
      'SHA-256': 'SHA-256',
      'SHA-384': 'SHA-384',
      'SHA-512': 'SHA-512'
    };
    return mapping[hashType];
  };

  const generateHashes = useCallback(async () => {
    if (!input.trim() && !fileInput) {
      toast({
        title: 'Error',
        description: 'Please enter text or select a file',
        variant: 'destructive',
      });
      return;
    }

    if (selectedHashes.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one hash algorithm',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    const results: HashResult[] = [];

    try {
      let data: ArrayBuffer | string;
      
      if (inputType === 'file' && fileInput) {
        data = await fileInput.arrayBuffer();
      } else {
        data = input;
      }

      for (const hashType of selectedHashes) {
        const algorithm = getAlgorithmName(hashType);
        const hash = await calculateHash(data, algorithm);
        results.push({ type: hashType, value: hash });
      }

      setHashResults(results);
      setCompareResult(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate hashes',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, fileInput, inputType, selectedHashes, toast]);

  const compareWithHash = (hash: HashResult) => {
    if (!compareHash.trim()) return;
    
    const cleanedInputHash = compareHash.toLowerCase().trim();
    const cleanedResultHash = hash.value.toLowerCase();
    const matches = cleanedInputHash === cleanedResultHash;
    
    setCompareResult({ type: hash.type, matches });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Hash copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInput(file);
      setInputType('file');
    }
  };

  const clear = () => {
    setInput('');
    setFileInput(null);
    setHashResults([]);
    setCompareHash('');
    setCompareResult(null);
  };

  const toggleHashType = (hashType: HashType) => {
    setSelectedHashes(prev => 
      prev.includes(hashType) 
        ? prev.filter(h => h !== hashType)
        : [...prev, hashType]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Hash Generator & Validator</h1>
        <p className="text-muted-foreground">
          Genera e valida hash utilizzando algoritmi crittografici standard
        </p>
      </div>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Input Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input type selector */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={inputType === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setInputType('text')}
              className="flex-1"
            >
              Text Input
            </Button>
            <Button
              variant={inputType === 'file' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setInputType('file')}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              File Upload
            </Button>
          </div>

          {/* Input section */}
          {inputType === 'text' ? (
            <div className="space-y-2">
              <Label htmlFor="textInput">Text to Hash</Label>
              <Textarea
                id="textInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to generate hash..."
                className="min-h-[120px] font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    generateHashes();
                  }
                }}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="fileInput">Select File</Label>
              <div className="space-y-2">
                <Input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {fileInput && (
                  <div className="p-3 bg-code-bg border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{fileInput.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(fileInput.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hash algorithm selection */}
          <Card className="bg-code-bg border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Hash Algorithms</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableHashes.map((hashType) => (
                  <div key={hashType} className="flex items-center space-x-2">
                    <Checkbox
                      id={hashType}
                      checked={selectedHashes.includes(hashType)}
                      onCheckedChange={() => toggleHashType(hashType)}
                    />
                    <Label htmlFor={hashType} className="text-sm font-medium cursor-pointer">
                      {hashType}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate button */}
          <div className="flex gap-2">
            <Button 
              onClick={generateHashes} 
              disabled={isProcessing} 
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  generateHashes();
                }
              }}
            >
              <Hash className="h-4 w-4 mr-2" />
              {isProcessing ? 'Generating...' : 'Generate Hashes'}
            </Button>
            <Button variant="outline" onClick={clear}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Results */}
          {hashResults.length > 0 && (
            <Card className="bg-code-bg border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Generated Hashes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {hashResults.map((result, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-accent">
                        {result.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                      <code className="text-sm font-mono break-all text-accent">
                        {result.value}
                      </code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Hash comparison */}
          {hashResults.length > 0 && (
            <Card className="bg-code-bg border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Compare Hash</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="compareInput">Enter hash to compare</Label>
                  <Input
                    id="compareInput"
                    value={compareHash}
                    onChange={(e) => setCompareHash(e.target.value)}
                    placeholder="Paste hash to verify..."
                    className="font-mono"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {hashResults.map((result, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => compareWithHash(result)}
                      disabled={!compareHash.trim()}
                    >
                      Compare with {result.type}
                    </Button>
                  ))}
                </div>

                {compareResult && (
                  <div className={`p-3 rounded-lg border ${
                    compareResult.matches 
                      ? 'security-strong' 
                      : 'security-weak'
                  }`}>
                    <p className="text-sm font-medium">
                      {compareResult.matches ? '✅' : '❌'} {compareResult.type} hash{' '}
                      {compareResult.matches ? 'matches' : 'does not match'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};