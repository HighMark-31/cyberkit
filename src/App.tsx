// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { PasswordChecker } from "@/components/tools/PasswordChecker";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { EncoderDecoder } from "@/components/tools/EncoderDecoder";
import { HashGenerator } from "@/components/tools/HashGenerator";
import { LogAnalyzer } from "@/components/tools/LogAnalyzer";
import { XSSDetector } from "@/components/tools/XSSDetector";
import { SSLChecker } from "@/components/tools/SSLChecker";
import { HTTPHeaders } from "@/components/tools/HTTPHeaders";
import { Ping } from "@/components/tools/Ping";
import { Whois } from "@/components/tools/Whois";
import { Traceroute } from "@/components/tools/Traceroute";
import { SubnetCalculator } from "@/components/tools/SubnetCalculator";
import { GoogleDorks } from "@/components/tools/GoogleDorks";
import { ChmodCalculator } from "@/components/tools/ChmodCalculator";
import { ExifViewer } from "@/components/tools/ExifViewer";
import { UrlParser } from "@/components/tools/UrlParser";
import { Terminal } from "@/components/tools/Terminal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/password-checker" element={<PasswordChecker />} />
            <Route path="/password-generator" element={<PasswordGenerator />} />
            <Route path="/encoder-decoder" element={<EncoderDecoder />} />
            <Route path="/hash-generator" element={<HashGenerator />} />
            <Route path="/log-analyzer" element={<LogAnalyzer />} />
            <Route path="/xss-detector" element={<XSSDetector />} />
            <Route path="/ssl-checker" element={<SSLChecker />} />
            <Route path="/http-headers" element={<HTTPHeaders />} />
            <Route path="/ping" element={<Ping />} />
            <Route path="/whois" element={<Whois />} />
            <Route path="/traceroute" element={<Traceroute />} />
            <Route path="/subnet-calculator" element={<SubnetCalculator />} />
            <Route path="/google-dorks" element={<GoogleDorks />} />
            <Route path="/chmod-calculator" element={<ChmodCalculator />} />
            <Route path="/exif-viewer" element={<ExifViewer />} />
            <Route path="/url-parser" element={<UrlParser />} />
            <Route path="/terminal" element={<Terminal />} />
            {}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
