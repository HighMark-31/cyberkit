import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ShieldAlert, Scale, AlertTriangle, ExternalLink } from 'lucide-react';

export const TermsGuard = () => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cyberkit_terms_accepted');
    const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';
    
    if (!hasAccepted && !isHomePage) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [location.pathname]);

  const handleAccept = () => {
    if (checked) {
      localStorage.setItem('cyberkit_terms_accepted', 'true');
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[95vw] max-w-2xl bg-card/95 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-500 to-primary animate-pulse" />
        
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 mx-auto mb-1 border border-primary/20 rotate-3 shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary -rotate-3" />
            </div>
            <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-center text-white tracking-tight leading-tight">
              Terms of Service & Ethical Use Agreement
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-muted-foreground space-y-4 text-sm leading-relaxed text-left">
              <div className="bg-red-500/10 p-3 sm:p-4 rounded-xl border border-red-500/20 flex gap-3 mb-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-red-200/80">
                  <span className="font-bold text-red-400">WARNING:</span> This toolkit is for professional security analysis only. Unauthorized access to computer systems is illegal worldwide.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 space-y-4">
                  <div className="flex gap-3">
                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm">Lawful & Authorized Use Only</h4>
                      <p className="text-[11px] sm:text-xs leading-normal">
                        By using CyberKit, you represent and warrant that you are accessing systems, networks, or data for which you are the legitimate owner or have received explicit, written, and verifiable authorization from the owner. 
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm">Developer Indemnification (CYA)</h4>
                      <p className="text-[11px] sm:text-xs leading-normal italic">
                        CyberKit is an open-source educational utility provided "AS IS" without warranties of any kind. Under no circumstances shall the developers, contributors, or HighMark.it be liable for any direct, indirect, incidental, or consequential damages arising from your use or misuse of these tools.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm">Local Processing</h4>
                      <p className="text-[11px] sm:text-xs leading-normal">
                        All computations are performed client-side in your browser. However, your IP address may be exposed to third-party services (APIs, proxies) used by specific tools.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-muted-foreground/80 px-1 italic text-center sm:text-left">
                  You acknowledge that "I was just testing" is not a valid legal defense. You are 100% responsible for your actions.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <div className="space-y-4 mt-4 sm:mt-6 shrink-0">
          <div className="flex items-start space-x-3 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10">
            <Checkbox 
              id="terms" 
              checked={checked}
              onCheckedChange={(val) => setChecked(val as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="terms"
                className="text-[11px] sm:text-xs font-medium text-white cursor-pointer select-none leading-tight"
              >
                I have read, understood, and agree to the <span className="text-primary underline decoration-primary/30 underline-offset-4">Terms of Service</span> and Ethical Use Agreement.
              </Label>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                Checking this box constitutes a digital signature.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction 
              onClick={handleAccept}
              disabled={!checked}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 sm:py-6 rounded-xl transition-all disabled:opacity-50 disabled:grayscale hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 text-sm sm:text-base"
            >
              Confirm & Unlock Tools
            </AlertDialogAction>
          </AlertDialogFooter>
          
          <div className="flex justify-center pb-1">
            <a 
              href="https://github.com/HighMark-31/CyberKit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors p-2"
            >
              View Full License on GitHub <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
