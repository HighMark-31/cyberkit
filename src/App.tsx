// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy loading pages and tools
const Dashboard = lazy(() => import("@/pages/Dashboard").then(module => ({ default: module.Dashboard })));
const PasswordChecker = lazy(() => import("@/components/tools/PasswordChecker").then(module => ({ default: module.PasswordChecker })));
const PasswordGenerator = lazy(() => import("@/components/tools/PasswordGenerator").then(module => ({ default: module.PasswordGenerator })));
const EncoderDecoder = lazy(() => import("@/components/tools/EncoderDecoder").then(module => ({ default: module.EncoderDecoder })));
const HashGenerator = lazy(() => import("@/components/tools/HashGenerator").then(module => ({ default: module.HashGenerator })));
const LogAnalyzer = lazy(() => import("@/components/tools/LogAnalyzer").then(module => ({ default: module.LogAnalyzer })));
const XSSDetector = lazy(() => import("@/components/tools/XSSDetector").then(module => ({ default: module.XSSDetector })));
const SSLChecker = lazy(() => import("@/components/tools/SSLChecker").then(module => ({ default: module.SSLChecker })));
const HTTPHeaders = lazy(() => import("@/components/tools/HTTPHeaders").then(module => ({ default: module.HTTPHeaders })));
const Ping = lazy(() => import("@/components/tools/Ping").then(module => ({ default: module.Ping })));
const Whois = lazy(() => import("@/components/tools/Whois").then(module => ({ default: module.Whois })));
const Traceroute = lazy(() => import("@/components/tools/Traceroute").then(module => ({ default: module.Traceroute })));
const SubnetCalculator = lazy(() => import("@/components/tools/SubnetCalculator").then(module => ({ default: module.SubnetCalculator })));
const GoogleDorks = lazy(() => import("@/components/tools/GoogleDorks").then(module => ({ default: module.GoogleDorks })));
const ChmodCalculator = lazy(() => import("@/components/tools/ChmodCalculator").then(module => ({ default: module.ChmodCalculator })));
const ExifViewer = lazy(() => import("@/components/tools/ExifViewer").then(module => ({ default: module.ExifViewer })));
const UrlParser = lazy(() => import("@/components/tools/UrlParser").then(module => ({ default: module.UrlParser })));
const Terminal = lazy(() => import("@/components/tools/Terminal").then(module => ({ default: module.Terminal })));
const SteganographyLab = lazy(() => import("@/components/tools/SteganographyLab").then(module => ({ default: module.SteganographyLab })));
const WebsiteScanner = lazy(() => import("@/components/tools/WebsiteScanner").then(module => ({ default: module.WebsiteScanner })));
const SherlockWeb = lazy(() => import("@/components/tools/SherlockWeb").then(module => ({ default: module.SherlockWeb })));
const DNSRecon = lazy(() => import("@/components/tools/DNSRecon").then(module => ({ default: module.DNSRecon })));
const SubdomainFinder = lazy(() => import("@/components/tools/SubdomainFinder").then(module => ({ default: module.SubdomainFinder })));
const FileMetadataScanner = lazy(() => import("@/components/tools/FileMetadataScanner").then(module => ({ default: module.FileMetadataScanner })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
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
              <Route path="/steganography-lab" element={<SteganographyLab />} />
              <Route path="/website-scanner" element={<WebsiteScanner />} />
              <Route path="/sherlock-web" element={<SherlockWeb />} />
              <Route path="/dns-recon" element={<DNSRecon />} />
              <Route path="/subdomain-finder" element={<SubdomainFinder />} />
              <Route path="/metadata-scanner" element={<FileMetadataScanner />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
