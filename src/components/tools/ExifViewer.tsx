import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Image, Upload, Trash2, MapPin } from 'lucide-react';
import exifr from 'exifr';
import { useToast } from '@/hooks/use-toast';

export const ExifViewer = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMetadata(null);

    try {
      const data = await exifr.parse(selectedFile);
      if (data) {
        setMetadata(data);
      } else {
        toast({
          title: "No EXIF Data",
          description: "No metadata found in this image",
          variant: "default"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to parse EXIF data",
        variant: "destructive"
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const reset = () => {
    setFile(null);
    setMetadata(null);
    setPreview(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">EXIF Data Viewer</h1>
        <p className="text-muted-foreground">
          Extract hidden metadata from images locally in your browser
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className={`cyber-card border-dashed transition-colors ${isDragging ? 'border-primary bg-primary/5' : ''}`}>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center space-y-4"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
                  <img src={preview} alt="Preview" className="max-h-[400px] w-auto object-contain" />
                  <Button 
                    variant="destructive"
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Upload an image</h3>
                    <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                  </div>
                  <input
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="file-upload"
                    onChange={handleFileSelect}
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="mt-2 pointer-events-none">
                      Select File
                    </Button>
                  </Label>
                </>
              )}
            </CardContent>
          </Card>
          
          <div className="text-sm text-muted-foreground text-center">
            <p className="flex items-center justify-center gap-2">
              <Image className="h-4 w-4" />
              Supports JPG, PNG, TIFF, HEIC
            </p>
          </div>
        </div>

        <Card className="cyber-card flex flex-col h-full max-h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Metadata
              {metadata && (
                <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-white/5 rounded-full">
                  {Object.keys(metadata).length} tags found
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {metadata ? (
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead className="w-[150px]">Tag</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(metadata).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium font-mono text-xs">{key}</TableCell>
                      <TableCell className="break-all text-sm">
                        {value instanceof Date ? value.toLocaleString() : 
                         typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <MapPin className="h-12 w-12 mb-4 opacity-20" />
                <p>Upload an image to view EXIF data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
