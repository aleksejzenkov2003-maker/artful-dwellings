import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Novostroyki from "./pages/Novostroyki";
import ResidentialComplex from "./pages/ResidentialComplex";
import Uslugi from "./pages/Uslugi";
import ServicePage from "./pages/ServicePage";
import Ipoteka from "./pages/Ipoteka";
import OKompanii from "./pages/OKompanii";
import Partneram from "./pages/Partneram";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Akcii from "./pages/Akcii";
import AkciiDetail from "./pages/AkciiDetail";
import Kontakty from "./pages/Kontakty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/novostroyki" element={<Novostroyki />} />
          <Route path="/gotovaya-nedvizhimost" element={<Novostroyki initialStatus="completed" />} />
          <Route path="/novostroyki/:slug" element={<ResidentialComplex />} />
          <Route path="/uslugi" element={<Uslugi />} />
          <Route path="/uslugi/:slug" element={<ServicePage />} />
          <Route path="/ipoteka" element={<Ipoteka />} />
          <Route path="/o-kompanii" element={<OKompanii />} />
          <Route path="/partneram" element={<Partneram />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/akcii" element={<Akcii />} />
          <Route path="/akcii/:slug" element={<AkciiDetail />} />
          <Route path="/kontakty" element={<Kontakty />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
