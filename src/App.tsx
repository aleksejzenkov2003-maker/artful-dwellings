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
import Thanks from "./pages/Thanks";

// Auth
import Auth from "./pages/Auth";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplexes from "./pages/admin/AdminComplexes";
import AdminComplexBuildings from "./pages/admin/AdminComplexBuildings";
import AdminComplexEdit from "./pages/admin/AdminComplexEdit";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminServices from "./pages/admin/AdminServices";
import AdminServiceEdit from "./pages/admin/AdminServiceEdit";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminTeamEdit from "./pages/admin/AdminTeamEdit";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminStats from "./pages/admin/AdminStats";
import AdminCities from "./pages/admin/AdminCities";
import AdminHomepage from "./pages/admin/AdminHomepage";
import AdminAwards from "./pages/admin/AdminAwards";
import AdminTimeline from "./pages/admin/AdminTimeline";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import BrokerPage from "./pages/BrokerPage";

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
              <Route path="/broker/:slug" element={<BrokerPage />} />
              <Route path="/thanks" element={<Thanks />} />
              
              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Admin routes - protected with authentication */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/homepage" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminHomepage /></ProtectedRoute>} />
              <Route path="/admin/complexes" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminComplexes /></ProtectedRoute>} />
              <Route path="/admin/complexes/:id" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminComplexEdit /></ProtectedRoute>} />
              <Route path="/admin/complexes/:complexId/buildings" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminComplexBuildings /></ProtectedRoute>} />
              <Route path="/admin/blog" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminBlog /></ProtectedRoute>} />
              <Route path="/admin/blog/:id" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminBlogEdit /></ProtectedRoute>} />
              <Route path="/admin/promotions" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminPromotions /></ProtectedRoute>} />
              <Route path="/admin/services" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminServices /></ProtectedRoute>} />
              <Route path="/admin/services/:id" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminServiceEdit /></ProtectedRoute>} />
              <Route path="/admin/team" element={<ProtectedRoute requiredRoles={["super_admin", "admin"]}><AdminTeam /></ProtectedRoute>} />
              <Route path="/admin/team/:id" element={<ProtectedRoute requiredRoles={["super_admin", "admin"]}><AdminTeamEdit /></ProtectedRoute>} />
              <Route path="/admin/reviews" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminReviews /></ProtectedRoute>} />
              <Route path="/admin/leads" element={<ProtectedRoute requiredRoles={["super_admin", "admin"]}><AdminLeads /></ProtectedRoute>} />
              <Route path="/admin/stats" element={<ProtectedRoute><AdminStats /></ProtectedRoute>} />
              <Route path="/admin/cities" element={<ProtectedRoute requiredRoles={["super_admin", "admin"]}><AdminCities /></ProtectedRoute>} />
              <Route path="/admin/awards" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminAwards /></ProtectedRoute>} />
              <Route path="/admin/timeline" element={<ProtectedRoute requiredRoles={["super_admin", "admin", "manager", "content"]}><AdminTimeline /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRoles={["super_admin", "admin"]}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/logs" element={<ProtectedRoute requiredRoles={["super_admin", "admin"]}><AdminAuditLogs /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
