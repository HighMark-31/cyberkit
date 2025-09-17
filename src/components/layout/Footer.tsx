// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import React, { useState } from 'react';
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
    <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <span>
            CyberKit is a Free & OpenSource Project of <a href="https://highmark.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Highmark.it</a> - Using this site agree the{' '}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button className="text-primary hover:underline cursor-pointer">
                  TOS
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Terms of Service</DialogTitle>
                </DialogHeader>
                {tosContent}
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsOpen(false)} variant="outline">
                    Chiudi
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;