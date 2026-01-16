import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
  tags: string[];
  views_count: number | null;
}

export const useBlogPosts = (category?: string) => {
  return useQuery({
    queryKey: ["blog_posts", category],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (category && category !== "Все") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ["blog_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("category")
        .eq("is_published", true);

      if (error) throw error;
      
      const categories = [...new Set(data.map(p => p.category).filter(Boolean))] as string[];
      return ["Все", ...categories];
    },
  });
};

// Normalize category to unified format
export const normalizeCategory = (category: string | null): string => {
  if (!category) return "Статьи";
  const map: Record<string, string> = {
    news: "Новости",
    article: "Статьи",
    analytics: "Аналитика",
    guide: "Гайды",
  };
  return map[category.toLowerCase()] || category;
};

// Check if category is news type
export const isNewsCategory = (category: string | null): boolean => {
  if (!category) return false;
  const newsCategories = ["news", "новости"];
  return newsCategories.includes(category.toLowerCase());
};

// Check if category is article type
export const isArticleCategory = (category: string | null): boolean => {
  if (!category) return true; // default to article
  const articleCategories = ["article", "статьи", "советы", "guide", "гайды", "аналитика", "analytics", "ипотека"];
  return articleCategories.includes(category.toLowerCase());
};

export interface CategoryWithCount {
  name: string;
  count: number;
  slug: string;
}

export const useBlogCategoriesWithCount = () => {
  return useQuery({
    queryKey: ["blog_categories_with_count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("category")
        .eq("is_published", true);

      if (error) throw error;
      
      // Count by normalized category
      const counts = data.reduce((acc, post) => {
        const normalized = normalizeCategory(post.category);
        acc[normalized] = (acc[normalized] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categories: CategoryWithCount[] = Object.entries(counts)
        .map(([name, count]) => ({
          name,
          count,
          slug: name.toLowerCase(),
        }))
        .sort((a, b) => b.count - a.count);

      return categories;
    },
  });
};

export const useBlogPostsByCategory = (categoryName: string) => {
  return useQuery({
    queryKey: ["blog_posts_by_category", categoryName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      // Filter by normalized category
      const filtered = data.filter(post => 
        normalizeCategory(post.category) === categoryName
      );

      return filtered as BlogPost[];
    },
    enabled: !!categoryName,
  });
};
