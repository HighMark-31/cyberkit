// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const LogAnalyzer = () => {
  const [logData, setLogData] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeLogs = () => {
    const lines = logData.split('\n');
    const errors = lines.filter(line => line.toLowerCase().includes('error'));
    const warnings = lines.filter(line => line.toLowerCase().includes('warn'));
    const infos = lines.filter(line => line.toLowerCase().includes('info'));

    setAnalysis({
      totalLines: lines.length,
      errors: errors.length,
      warnings: warnings.length,
      infos: infos.length,
      suspiciousPatterns: lines.filter(line =>
        line.includes('unauthorized') ||
        line.includes('failed login') ||
        line.includes('suspicious')
      ).length
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Log Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze log files for security patterns and anomalies
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Log Input</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your log data here..."
            value={logData}
            onChange={(e) => setLogData(e.target.value)}
            className="min-h-64"
          />
          <Button onClick={analyzeLogs} className="w-full">
            Analyze Logs
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{analysis.totalLines}</div>
                <div className="text-sm text-muted-foreground">Total Lines</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{analysis.errors}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{analysis.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{analysis.infos}</div>
                <div className="text-sm text-muted-foreground">Info</div>
              </div>
            </div>

            {analysis.suspiciousPatterns > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-red-700">
                    {analysis.suspiciousPatterns} suspicious patterns detected
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
