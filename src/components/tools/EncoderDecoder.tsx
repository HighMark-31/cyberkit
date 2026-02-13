// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, ArrowUpDown, Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type EncodingType = 'base64' | 'hex' | 'url' | 'html';
type Operation = 'encode' | 'decode';

export const EncoderDecoder = () => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encodingType, setEncodingType] = useState<EncodingType>('base64');
  const [operation, setOperation] = useState<Operation>('encode');
  const [error, setError] = useState('');

  const performOperation = () => {
    if (!input.trim()) {
      setError('Please enter some text to process');
      setOutput('');
      return;
    }

    setError('');

    try {
      let result = '';

      if (operation === 'encode') {
        switch (encodingType) {
          case 'base64':
            result = btoa(unescape(encodeURIComponent(input)));
            break;
          case 'hex':
            result = Array.from(new TextEncoder().encode(input))
              .map(byte => byte.toString(16).padStart(2, '0'))
              .join('');
            break;
          case 'url':
            result = encodeURIComponent(input);
            break;
          case 'html':
            result = input
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#x27;')
              .replace(/\//g, '&#x2F;');
            break;
        }
      } else {
        switch (encodingType) {
          case 'base64':
            result = decodeURIComponent(escape(atob(input)));
            break;
          case 'hex':
            if (!/^[0-9a-fA-F]*$/.test(input)) {
              throw new Error('Invalid hex string');
            }
            if (input.length % 2 !== 0) {
              throw new Error('Hex string must have even length');
            }
            const bytes = [];
            for (let i = 0; i < input.length; i += 2) {
              bytes.push(parseInt(input.substr(i, 2), 16));
            }
            result = new TextDecoder().decode(new Uint8Array(bytes));
            break;
          case 'url':
            result = decodeURIComponent(input);
            break;
          case 'html':
            result = input
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#x27;/g, "'")
              .replace(/&#x2F;/g, '/');
            break;
        }
      }

      setOutput(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid input for decoding';
      setError(errorMessage);
      setOutput('');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const swapInputOutput = () => {
    if (output && !error) {
      setInput(output);
      setOutput('');
      setOperation(operation === 'encode' ? 'decode' : 'encode');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const getEncodingInfo = (type: EncodingType) => {
    const info = {
      base64: {
        name: 'Base64',
        description: 'Binary-to-text encoding scheme using A-Z, a-z, 0-9, +, /',
        example: 'Hello World → SGVsbG8gV29ybGQ='
      },
      hex: {
        name: 'Hexadecimal',
        description: 'Base-16 encoding using 0-9 and A-F characters',
        example: 'Hello → 48656c6c6f'
      },
      url: {
        name: 'URL Encoding',
        description: 'Percent-encoding for safe transmission in URLs',
        example: 'Hello World! → Hello%20World%21'
      },
      html: {
        name: 'HTML Entities',
        description: 'HTML character entity references for special characters',
        example: '<script> → &lt;script&gt;'
      }
    };
    return info[type];
  };

  const currentInfo = getEncodingInfo(encodingType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Encoder / Decoder</h1>
        <p className="text-muted-foreground">
          Codifica e decodifica testi utilizzando diversi algoritmi standard
        </p>
      </div>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Text Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Encoding Type</Label>
              <Select value={encodingType} onValueChange={(value: EncodingType) => setEncodingType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base64">Base64</SelectItem>
                  <SelectItem value="hex">Hexadecimal</SelectItem>
                  <SelectItem value="url">URL Encoding</SelectItem>
                  <SelectItem value="html">HTML Entities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operation</Label>
              <Select value={operation} onValueChange={(value: Operation) => setOperation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encode">Encode</SelectItem>
                  <SelectItem value="decode">Decode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Encoding info */}
          <Card className="bg-code-bg border-border/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-accent">
                    {currentInfo.name}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentInfo.description}</p>
                <p className="text-sm font-mono text-accent">{currentInfo.example}</p>
              </div>
            </CardContent>
          </Card>

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="input">
              Input ({operation === 'encode' ? 'Plain Text' : `${currentInfo.name} Encoded`})
            </Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text to ${operation}...`}
              className="min-h-[120px] font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  performOperation();
                }
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={performOperation} 
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  performOperation();
                }
              }}
            >
              <Code className="h-4 w-4 mr-2" />
              {operation === 'encode' ? 'Encode' : 'Decode'}
            </Button>
            <Button variant="outline" onClick={swapInputOutput} disabled={!output || !!error}>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Swap
            </Button>
            <Button variant="outline" onClick={clear}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Output */}
          {(output || error) && (
            <div className="space-y-2">
              <Label htmlFor="output">
                Output ({operation === 'encode' ? `${currentInfo.name} Encoded` : 'Plain Text'})
              </Label>
              {error ? (
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-destructive">❌ {error}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    id="output"
                    value={output}
                    readOnly
                    className="min-h-[120px] font-mono bg-code-bg text-accent"
                  />
                  <Button variant="outline" onClick={() => copyToClipboard(output)} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Result
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};