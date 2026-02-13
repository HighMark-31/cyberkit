// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tosContent = (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold mb-2">Terms of Service - CyberKit</h3>
        <p>By using CyberKit, you agree to the following terms and conditions:</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-1">1. Legal Use</h4>
        <p>CyberKit is designed exclusively for legitimate educational and cybersecurity purposes. It is forbidden to use this tool for illegal, harmful, or unauthorized activities.</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-1">2. User Responsibility</h4>
        <p>The user is fully responsible for their use of the tools provided. Highmark.it assumes no responsibility for damages resulting from the improper use of the software.</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-1">3. Security and Privacy</h4>
        <p>All processed data remains local on your device. We do not collect, store, or transmit personal or sensitive information.</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-1">4. Limitations</h4>
        <p>The software is provided "as is" without warranties of any kind. Use for penetration testing must be authorized by the owner of the target system.</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-1">5. Open Source Project</h4>
        <p>CyberKit is an open source project. The source code is available for review and contributions from the community.</p>
      </div>
      
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          By using this site you automatically agree to these terms of service.
        </p>
      </div>
    </div>
  );

  return (
    <footer className="fixed bottom-0 right-0 left-0 lg:left-72 bg-background/80 backdrop-blur-md border-t border-white/5 z-40 transition-all duration-300">
      <div className="px-6 py-3">
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              CyberKit OpenSource Project by <a href="https://highmark.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors font-medium">Highmark.it</a>
            </span>
            <span className="w-px h-3 bg-white/10"></span>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button className="hover:text-foreground transition-colors">
                  Terms of Service
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-white/10 bg-zinc-950/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>Terms of Service</DialogTitle>
                </DialogHeader>
                {tosContent}
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsOpen(false)} variant="outline" className="border-white/10 hover:bg-white/5">
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;