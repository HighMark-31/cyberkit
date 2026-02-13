import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink } from 'lucide-react';

export const GoogleDorks = () => {
  const [site, setSite] = useState('');
  const [filetype, setFiletype] = useState('');
  const [intext, setIntext] = useState('');
  const [intitle, setIntitle] = useState('');
  const [inurl, setInurl] = useState('');

  const generateDork = () => {
    const parts = [];
    if (site) parts.push(`site:${site}`);
    if (filetype) parts.push(`filetype:${filetype}`);
    if (intext) parts.push(`intext:"${intext}"`);
    if (intitle) parts.push(`intitle:"${intitle}"`);
    if (inurl) parts.push(`inurl:"${inurl}"`);
    return parts.join(' ');
  };

  const dork = generateDork();

  const handleSearch = () => {
    if (dork) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(dork)}`, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white text-center">Google Dork Generator</h1>
        <p className="text-muted-foreground text-center">
          Construct advanced Google search queries for OSINT and reconnaissance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/30 border-white/10 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle className="text-white">Query Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Target Site (site:)</Label>
              <Input 
                placeholder="example.com" 
                value={site} 
                onChange={(e) => setSite(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">File Type (filetype:)</Label>
              <Input 
                placeholder="pdf, docx, xls, config" 
                value={filetype} 
                onChange={(e) => setFiletype(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">In Text (intext:)</Label>
              <Input 
                placeholder="password, confidential" 
                value={intext} 
                onChange={(e) => setIntext(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">In Title (intitle:)</Label>
              <Input 
                placeholder="index of" 
                value={intitle} 
                onChange={(e) => setIntitle(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">In URL (inurl:)</Label>
              <Input 
                placeholder="admin, login" 
                value={inurl} 
                onChange={(e) => setInurl(e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-white/10 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle className="text-white">Generated Query</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-background/50 rounded-xl min-h-[100px] break-all font-mono text-sm border border-white/10 relative group text-primary">
              {dork || <span className="text-muted-foreground italic">Start typing to generate query...</span>}
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg" 
              onClick={handleSearch}
              disabled={!dork}
            >
              <Search className="h-4 w-4" />
              Search on Google
              <ExternalLink className="h-4 w-4 opacity-50" />
            </Button>

            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-semibold">Popular Dorks:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><code>site:target.com filetype:pdf</code> - Find public documents</li>
                <li><code>intitle:"index of"</code> - Find open directories</li>
                <li><code>inurl:admin</code> - Find admin panels</li>
                <li><code>site:github.com "target.com"</code> - Find code leaks</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
