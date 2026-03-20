export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      apartments: {
        Row: {
          area: number
          building_id: string | null
          complex_id: string
          created_at: string
          floor: number
          id: string
          is_published: boolean | null
          layout_image: string | null
          price: number
          room_type: string
          status: string
          updated_at: string
        }
        Insert: {
          area: number
          building_id?: string | null
          complex_id: string
          created_at?: string
          floor: number
          id?: string
          is_published?: boolean | null
          layout_image?: string | null
          price: number
          room_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          area?: number
          building_id?: string | null
          complex_id?: string
          created_at?: string
          floor?: number
          id?: string
          is_published?: boolean | null
          layout_image?: string | null
          price?: number
          room_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "apartments_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "complex_buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apartments_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "residential_complexes"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      awards: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_published: boolean
          order_position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_published?: boolean
          order_position?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_published?: boolean
          order_position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: Json | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: Json | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: Json | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      broker_apartments: {
        Row: {
          apartment_id: string
          broker_id: string
          created_at: string
          id: string
        }
        Insert: {
          apartment_id: string
          broker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          apartment_id?: string
          broker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_apartments_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_apartments_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_complexes: {
        Row: {
          broker_id: string
          complex_id: string
          created_at: string
          id: string
        }
        Insert: {
          broker_id: string
          complex_id: string
          created_at?: string
          id?: string
        }
        Update: {
          broker_id?: string
          complex_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_complexes_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_complexes_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "residential_complexes"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_reviews: {
        Row: {
          author_name: string
          author_photo: string | null
          author_role: string | null
          broker_id: string
          content: string
          created_at: string | null
          id: string
          is_published: boolean | null
          order_position: number | null
          rating: number | null
        }
        Insert: {
          author_name: string
          author_photo?: string | null
          author_role?: string | null
          broker_id: string
          content: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_position?: number | null
          rating?: number | null
        }
        Update: {
          author_name?: string
          author_photo?: string | null
          author_role?: string | null
          broker_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_position?: number | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_reviews_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string | null
          created_at: string
          hero_image: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          order_position: number | null
          slug: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          order_position?: number | null
          slug: string
        }
        Update: {
          country?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          order_position?: number | null
          slug?: string
        }
        Relationships: []
      }
      company_stats: {
        Row: {
          city_id: string | null
          created_at: string
          icon: string | null
          id: string
          is_published: boolean | null
          label: string
          order_position: number | null
          suffix: string | null
          updated_at: string
          value: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_published?: boolean | null
          label: string
          order_position?: number | null
          suffix?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_published?: boolean | null
          label?: string
          order_position?: number | null
          suffix?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_stats_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      complex_buildings: {
        Row: {
          color: string | null
          complex_id: string
          created_at: string
          floors_count: number | null
          id: string
          is_published: boolean | null
          name: string
          order_position: number | null
          plan_image: string | null
          polygon_points: Json
          updated_at: string
        }
        Insert: {
          color?: string | null
          complex_id: string
          created_at?: string
          floors_count?: number | null
          id?: string
          is_published?: boolean | null
          name: string
          order_position?: number | null
          plan_image?: string | null
          polygon_points?: Json
          updated_at?: string
        }
        Update: {
          color?: string | null
          complex_id?: string
          created_at?: string
          floors_count?: number | null
          id?: string
          is_published?: boolean | null
          name?: string
          order_position?: number | null
          plan_image?: string | null
          polygon_points?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complex_buildings_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "residential_complexes"
            referencedColumns: ["id"]
          },
        ]
      }
      complex_slides: {
        Row: {
          complex_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          order_position: number
          slide_type: string
          title: string
          updated_at: string
        }
        Insert: {
          complex_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          order_position?: number
          slide_type: string
          title: string
          updated_at?: string
        }
        Update: {
          complex_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          order_position?: number
          slide_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complex_slides_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "residential_complexes"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          city_id: string
          coordinates: Json | null
          created_at: string
          email: string | null
          id: string
          phone: string
          phone_secondary: string | null
          telegram: string | null
          updated_at: string
          whatsapp: string | null
          working_hours: string | null
        }
        Insert: {
          address?: string | null
          city_id: string
          coordinates?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          phone: string
          phone_secondary?: string | null
          telegram?: string | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Update: {
          address?: string | null
          city_id?: string
          coordinates?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string
          phone_secondary?: string | null
          telegram?: string | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_content: {
        Row: {
          city_id: string | null
          content: Json
          created_at: string | null
          id: string
          is_published: boolean | null
          section_key: string
          updated_at: string | null
        }
        Insert: {
          city_id?: string | null
          content?: Json
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          section_key: string
          updated_at?: string | null
        }
        Update: {
          city_id?: string | null
          content?: Json
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          section_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homepage_content_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          broker_id: string | null
          created_at: string
          email: string | null
          form_source: string | null
          form_type: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string
          quiz_answers: Json | null
          status: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          broker_id?: string | null
          created_at?: string
          email?: string | null
          form_source?: string | null
          form_type: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          quiz_answers?: Json | null
          status?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          broker_id?: string | null
          created_at?: string
          email?: string | null
          form_source?: string | null
          form_type?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          quiz_answers?: Json | null
          status?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          category: string | null
          complexes: Json | null
          cover_image: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          short_description: string | null
          slug: string
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          complexes?: Json | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          short_description?: string | null
          slug: string
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          complexes?: Json | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          short_description?: string | null
          slug?: string
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      residential_complexes: {
        Row: {
          address: string | null
          apartments_count: number | null
          area_from: number | null
          area_to: number | null
          city: string | null
          city_id: string | null
          completion_date: string | null
          coordinates: Json | null
          created_at: string
          description: string | null
          developer: string | null
          district: string | null
          features: Json | null
          floors_count: number | null
          id: string
          images: Json | null
          infrastructure: Json | null
          is_featured: boolean | null
          is_published: boolean | null
          main_image: string | null
          name: string
          presentation_url: string | null
          price_from: number | null
          price_to: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          apartments_count?: number | null
          area_from?: number | null
          area_to?: number | null
          city?: string | null
          city_id?: string | null
          completion_date?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          developer?: string | null
          district?: string | null
          features?: Json | null
          floors_count?: number | null
          id?: string
          images?: Json | null
          infrastructure?: Json | null
          is_featured?: boolean | null
          is_published?: boolean | null
          main_image?: string | null
          name: string
          presentation_url?: string | null
          price_from?: number | null
          price_to?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          apartments_count?: number | null
          area_from?: number | null
          area_to?: number | null
          city?: string | null
          city_id?: string | null
          completion_date?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          developer?: string | null
          district?: string | null
          features?: Json | null
          floors_count?: number | null
          id?: string
          images?: Json | null
          infrastructure?: Json | null
          is_featured?: boolean | null
          is_published?: boolean | null
          main_image?: string | null
          name?: string
          presentation_url?: string | null
          price_from?: number | null
          price_to?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "residential_complexes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_name: string
          author_photo: string | null
          author_role: string | null
          content: string
          created_at: string
          id: string
          is_published: boolean | null
          order_position: number | null
          rating: number | null
          source: string | null
          source_url: string | null
        }
        Insert: {
          author_name: string
          author_photo?: string | null
          author_role?: string | null
          content: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          order_position?: number | null
          rating?: number | null
          source?: string | null
          source_url?: string | null
        }
        Update: {
          author_name?: string
          author_photo?: string | null
          author_role?: string | null
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          order_position?: number | null
          rating?: number | null
          source?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          advantages: Json | null
          content_blocks: Json | null
          created_at: string
          description: string | null
          featured_text: string | null
          features: Json | null
          hover_text: string | null
          icon: string | null
          id: string
          intro_text: string | null
          is_featured: boolean | null
          is_published: boolean | null
          main_image: string | null
          order_position: number | null
          problem_blocks: Json | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          advantages?: Json | null
          content_blocks?: Json | null
          created_at?: string
          description?: string | null
          featured_text?: string | null
          features?: Json | null
          hover_text?: string | null
          icon?: string | null
          id?: string
          intro_text?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          main_image?: string | null
          order_position?: number | null
          problem_blocks?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          advantages?: Json | null
          content_blocks?: Json | null
          created_at?: string
          description?: string | null
          featured_text?: string | null
          features?: Json | null
          hover_text?: string | null
          icon?: string | null
          id?: string
          intro_text?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          main_image?: string | null
          order_position?: number | null
          problem_blocks?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          city_id: string | null
          content_blocks: Json | null
          created_at: string
          email: string | null
          experience_years: number | null
          id: string
          is_published: boolean | null
          name: string
          order_position: number | null
          phone: string | null
          photo_url: string | null
          role: string
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          specialization: string[] | null
          telegram: string | null
          updated_at: string
          video_url: string | null
          whatsapp: string | null
        }
        Insert: {
          bio?: string | null
          city_id?: string | null
          content_blocks?: Json | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          id?: string
          is_published?: boolean | null
          name: string
          order_position?: number | null
          phone?: string | null
          photo_url?: string | null
          role: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          specialization?: string[] | null
          telegram?: string | null
          updated_at?: string
          video_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          bio?: string | null
          city_id?: string | null
          content_blocks?: Json | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          id?: string
          is_published?: boolean | null
          name?: string
          order_position?: number | null
          phone?: string | null
          photo_url?: string | null
          role?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          specialization?: string[] | null
          telegram?: string | null
          updated_at?: string
          video_url?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          order_position: number
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          order_position?: number
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          order_position?: number
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_delete: { Args: { _user_id: string }; Returns: boolean }
      can_write: { Args: { _user_id: string }; Returns: boolean }
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_any_admin: { Args: { _user_id: string }; Returns: boolean }
      is_content: { Args: { _user_id: string }; Returns: boolean }
      is_manager: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      is_viewer: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "super_admin"
        | "manager"
        | "content"
        | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "super_admin",
        "manager",
        "content",
        "viewer",
      ],
    },
  },
} as const
