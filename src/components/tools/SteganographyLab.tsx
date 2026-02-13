import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Lock, Unlock, Download, Upload, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const SteganographyLab = () => {
  const [image, setImage] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const encodeMessage = () => {
    if (!image || !secretMessage) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const message = secretMessage + '\0';
      const binaryMessage = message.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('');

      if (binaryMessage.length > data.length / 4 * 3) {
        toast({
          title: "Error",
          description: "Message is too long for this image.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      for (let i = 0; i < binaryMessage.length; i++) {
        const pixelIndex = Math.floor(i / 3) * 4 + (i % 3);
        data[pixelIndex] = (data[pixelIndex] & 0xFE) | parseInt(binaryMessage[i]);
      }

      ctx.putImageData(imageData, 0, 0);
      setImage(canvas.toDataURL());
      setIsProcessing(false);
      toast({
        title: "Success",
        description: "Message encoded successfully!",
      });
    };
    img.src = image;
  };

  const decodeMessage = () => {
    if (!image) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let binaryMessage = '';
      let message = '';

      for (let i = 0; i < data.length; i++) {
        if (i % 4 === 3) continue;
        binaryMessage += (data[i] & 1).toString();

        if (binaryMessage.length === 8) {
          const charCode = parseInt(binaryMessage, 2);
          if (charCode === 0) break;
          message += String.fromCharCode(charCode);
          binaryMessage = '';
        }
      }

      setDecodedMessage(message);
      setIsProcessing(false);
      if (message) {
        toast({
          title: "Success",
          description: "Message decoded successfully!",
        });
      } else {
        toast({
          title: "No message found",
          description: "Could not find any hidden message in this image.",
          variant: "destructive"
        });
      }
    };
    img.src = image;
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.download = 'stego-image.png';
    link.href = image;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Steganography Lab</h1>
        <p className="text-muted-foreground">Hide secret messages inside images using LSB (Least Significant Bit) technique.</p>
      </div>

      <Alert variant="default" className="bg-primary/5 border-primary/20">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">How it works</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          LSB steganography works by slightly modifying the last bit of each pixel's color value. 
          These changes are invisible to the human eye but can store significant amounts of data.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="encode" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Lock className="w-4 h-4 mr-2" /> Encode Message
          </TabsTrigger>
          <TabsTrigger value="decode" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Unlock className="w-4 h-4 mr-2" /> Decode Message
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4 bg-card/30 border-white/10 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Image & Data
            </CardTitle>
            <CardDescription>Upload an image and interact with hidden data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label htmlFor="image-upload" className="text-white">Source Image</Label>
                <div 
                  className="relative group aspect-video rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center transition-all hover:border-primary/50 hover:bg-white/10 overflow-hidden"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setImage(event.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                >
                  {image ? (
                    <>
                      <img src={image} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Label htmlFor="image-upload" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg font-medium">
                          Change Image
                        </Label>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-8 h-8" />
                      <p className="text-sm">Click or drag image here</p>
                    </div>
                  )}
                  <Input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <TabsContent value="encode" className="m-0 space-y-4">
                  <Label htmlFor="secret-message" className="text-white">Secret Message</Label>
                  <Textarea 
                    id="secret-message"
                    placeholder="Enter the message you want to hide..."
                    className="min-h-[150px] bg-background/50 border-white/10 focus:border-primary/50"
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                  />
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={!image || !secretMessage || isProcessing}
                    onClick={encodeMessage}
                  >
                    {isProcessing ? 'Processing...' : 'Hide Message in Image'}
                  </Button>
                  {image && (
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 hover:bg-white/5"
                      onClick={downloadImage}
                    >
                      <Download className="w-4 h-4 mr-2" /> Download Result
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="decode" className="m-0 space-y-4">
                  <Label className="text-white">Extracted Message</Label>
                  <div className="min-h-[150px] p-4 rounded-lg bg-background/50 border border-white/10 text-white break-words">
                    {decodedMessage || <span className="text-muted-foreground">Decoded message will appear here...</span>}
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={!image || isProcessing}
                    onClick={decodeMessage}
                  >
                    {isProcessing ? 'Processing...' : 'Extract Hidden Message'}
                  </Button>
                </TabsContent>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};