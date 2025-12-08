import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Tag, Users, Star, MessageSquare, Briefcase, MapPin } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [complexes, posts, promotions, services, team, reviews, leads, cities] = await Promise.all([
        supabase.from("residential_complexes").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("promotions").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("cities").select("id", { count: "exact", head: true }),
      ]);

      return {
        complexes: complexes.count || 0,
        posts: posts.count || 0,
        promotions: promotions.count || 0,
        services: services.count || 0,
        team: team.count || 0,
        reviews: reviews.count || 0,
        leads: leads.count || 0,
        cities: cities.count || 0,
      };
    },
  });

  const { data: recentLeads } = useQuery({
    queryKey: ["admin-recent-leads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const statCards = [
    { label: "Жилых комплексов", value: stats?.complexes || 0, icon: Building2, color: "text-blue-500" },
    { label: "Статей блога", value: stats?.posts || 0, icon: FileText, color: "text-green-500" },
    { label: "Акций", value: stats?.promotions || 0, icon: Tag, color: "text-orange-500" },
    { label: "Услуг", value: stats?.services || 0, icon: Briefcase, color: "text-purple-500" },
    { label: "Сотрудников", value: stats?.team || 0, icon: Users, color: "text-pink-500" },
    { label: "Отзывов", value: stats?.reviews || 0, icon: Star, color: "text-yellow-500" },
    { label: "Заявок", value: stats?.leads || 0, icon: MessageSquare, color: "text-cyan-500" },
    { label: "Городов", value: stats?.cities || 0, icon: MapPin, color: "text-red-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display mb-2">Панель управления</h1>
          <p className="text-muted-foreground">Общая статистика сайта</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Последние заявки</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{lead.form_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Заявок пока нет
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
