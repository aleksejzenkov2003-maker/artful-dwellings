import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CityProvider } from "@/contexts/CityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import PropertyCatalog from "./pages/PropertyCatalog";
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
import Otzyvy from "./pages/Otzyvy";
import NotFound from "./pages/NotFound";

// Auth
import Auth from "./pages/Auth";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplexes from "./pages/admin/AdminComplexes";
import AdminComplexEdit from "./pages/admin/AdminComplexEdit";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminServices from "./pages/admin/AdminServices";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminStats from "./pages/admin/AdminStats";
import AdminCities from "./pages/admin/AdminCities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              
              {/* Property Catalog Pages */}
              <Route path="/nedvizhimost" element={<PropertyCatalog pageType="all" />} />
              <Route path="/novostroyki" element={<PropertyCatalog pageType="novostroyki" />} />
              <Route path="/vtorichnaya-nedvizhimost" element={<PropertyCatalog pageType="secondary" />} />
              <Route path="/ekskluziv" element={<PropertyCatalog pageType="exclusive" />} />
              <Route path="/gotovaya-nedvizhimost" element={<PropertyCatalog pageType="secondary" initialStatus="completed" />} />
              
              {/* Property Detail */}
              <Route path="/novostroyki/:slug" element={<ResidentialComplex />} />
              
              {/* Services */}
              <Route path="/uslugi" element={<Uslugi />} />
              <Route path="/uslugi/:slug" element={<ServicePage />} />
              <Route path="/ipoteka" element={<Ipoteka />} />
              
              {/* Company */}
              <Route path="/o-kompanii" element={<OKompanii />} />
              <Route path="/partneram" element={<Partneram />} />
              
              {/* Content */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/akcii" element={<Akcii />} />
              <Route path="/akcii/:slug" element={<AkciiDetail />} />
              <Route path="/otzyvy" element={<Otzyvy />} />
              <Route path="/kontakty" element={<Kontakty />} />
              
              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Admin routes - open access for development */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/complexes" element={<AdminComplexes />} />
              <Route path="/admin/complexes/:id" element={<AdminComplexEdit />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/blog/:id" element={<AdminBlogEdit />} />
              <Route path="/admin/promotions" element={<AdminPromotions />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/team" element={<AdminTeam />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/leads" element={<AdminLeads />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="/admin/cities" element={<AdminCities />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
