import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileSearch, Upload, Info, FileText, Calendar, User, ShieldCheck, Image, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import exifr from 'exifr';

interface MetadataField {
  label: string;
  value: string;
  category: 'General' | 'Security' | 'Author' | 'Technical' | 'EXIF';
}

export const FileMetadataScanner = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState<MetadataField[]>([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setMetadata([]);

    try {
      const fields: MetadataField[] = [];

      fields.push(
        { label: 'File Name', value: file.name, category: 'General' },
        { label: 'File Size', value: `${(file.size / 1024).toFixed(2)} KB`, category: 'General' },
        { label: 'MIME Type', value: file.type || 'application/octet-stream', category: 'General' },
        { label: 'Last Modified', value: new Date(file.lastModified).toLocaleString(), category: 'General' }
      );

      if (file.type.startsWith('image/') || file.type === 'image/tiff') {
        try {
            const exifData = await exifr.parse(file, { tiff: true, xmp: true, icc: true, iptc: true, jfif: true, ihdr: true });
            
            if (exifData) {
                if (exifData.Make || exifData.Model) {
                    fields.push({ label: 'Device', value: `${exifData.Make || ''} ${exifData.Model || ''}`.trim(), category: 'EXIF' });
                }
                if (exifData.Software) {
                    fields.push({ label: 'Software', value: exifData.Software, category: 'Technical' });
                }
                if (exifData.DateTimeOriginal) {
                    fields.push({ label: 'Date Taken', value: new Date(exifData.DateTimeOriginal).toLocaleString(), category: 'EXIF' });
                }
                if (exifData.Artist || exifData.author) {
                    fields.push({ label: 'Author/Artist', value: exifData.Artist || exifData.author, category: 'Author' });
                }
                if (exifData.latitude && exifData.longitude) {
                    fields.push({ label: 'GPS Coordinates', value: `${exifData.latitude}, ${exifData.longitude}`, category: 'Security' });
                    fields.push({ label: 'Security Warning', value: 'GPS Data Found! This image reveals location.', category: 'Security' });
                }
                
                Object.keys(exifData).forEach(key => {
                    const val = exifData[key];
                    if (!['Make', 'Model', 'Software', 'DateTimeOriginal', 'Artist', 'latitude', 'longitude'].includes(key)) {
                        if (typeof val === 'string' || typeof val === 'number') {
                             if (String(val).length < 100) {
                                 fields.push({ label: key, value: String(val), category: 'Technical' });
                             }
                        }
                    }
                });
            }
        } catch (err) {
            console.warn("EXIF extraction failed:", err);
        }
      }

      setMetadata(fields);
      toast({ title: "Analysis Complete", description: `Extracted ${fields.length} metadata fields.` });

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to analyze file.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">File Metadata Scanner</h1>
        <p className="text-muted-foreground">Extract real metadata from files using browser APIs. Supports deep EXIF analysis for images.</p>
      </div>

      <Card className="bg-card/30 border-white/10 border-dashed backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-lg hover:border-primary/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-white">
                  {isProcessing ? 'Analyzing file...' : 'Drop file here or click to upload'}
                </p>
                <p className="text-sm text-muted-foreground">Images (JPG, PNG, HEIC) provide detailed EXIF. Others provide basic info.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {metadata.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metadata.map((field, i) => (
            <Card key={i} className="bg-card/30 border-white/5">
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  field.category === 'Security' ? 'bg-red-500/10 text-red-500' :
                  field.category === 'Author' ? 'bg-blue-500/10 text-blue-500' :
                  field.category === 'EXIF' ? 'bg-yellow-500/10 text-yellow-500' :
                  field.category === 'Technical' ? 'bg-purple-500/10 text-purple-500' :
                  'bg-white/10 text-white'
                }`}>
                  {field.category === 'Security' ? <AlertTriangle className="w-4 h-4" /> :
                   field.category === 'Author' ? <User className="w-4 h-4" /> :
                   field.category === 'EXIF' ? <Image className="w-4 h-4" /> :
                   field.category === 'Technical' ? <Info className="w-4 h-4" /> :
                   <FileText className="w-4 h-4" />}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{field.label}</p>
                  <p className="text-white font-mono text-sm break-words">{field.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};