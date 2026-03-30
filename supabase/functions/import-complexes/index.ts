import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Field mapping configuration - will be updated when feed documentation arrives
const DEFAULT_FIELD_MAPPING = {
  name: "name",
  slug: "slug",
  description: "description",
  address: "address",
  district: "district",
  city: "city",
  price_from: "price_from",
  price_to: "price_to",
  area_from: "area_from",
  area_to: "area_to",
  floors_count: "floors_count",
  apartments_count: "apartments_count",
  developer: "developer",
  status: "status",
  completion_date: "completion_date",
  main_image: "main_image",
  images: "images",
  features: "features",
  infrastructure: "infrastructure",
};

interface ImportConfig {
  feed_url?: string;
  feed_type?: "json" | "xml";
  field_mapping?: Record<string, string>;
  dry_run?: boolean;
}

interface ImportResult {
  success: boolean;
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

// Parse XML to JSON (simple implementation)
function parseXmlToJson(xml: string): any[] {
  // Basic XML parsing - will be enhanced when actual feed format is known
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const item: Record<string, any> = {};
    
    // Extract tags
    const tagRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(itemXml)) !== null) {
      item[tagMatch[1]] = tagMatch[2].trim();
    }
    
    items.push(item);
  }
  
  return items;
}

// Transform feed item to complex data
function transformItem(
  item: Record<string, any>,
  mapping: Record<string, string>
): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [dbField, feedField] of Object.entries(mapping)) {
    if (item[feedField] !== undefined) {
      let value = item[feedField];
      
      // Type conversions
      if (["price_from", "price_to", "area_from", "area_to", "floors_count", "apartments_count"].includes(dbField)) {
        value = parseFloat(value) || null;
      }
      
      // Parse JSON arrays
      if (["images", "features", "infrastructure"].includes(dbField) && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch {
          value = value.split(",").map((s: string) => s.trim()).filter(Boolean);
        }
      }
      
      result[dbField] = value;
    }
  }
  
  // Generate slug if not provided
  if (!result.slug && result.name) {
    result.slug = result.name
      .toLowerCase()
      .replace(/[а-яё]/g, (char: string) => {
        const map: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  return result;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const config: ImportConfig = await req.json();
    
    console.log("Import started with config:", {
      feed_url: config.feed_url,
      feed_type: config.feed_type,
      dry_run: config.dry_run,
    });

    const result: ImportResult = {
      success: false,
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    // Validate config
    if (!config.feed_url) {
      return new Response(
        JSON.stringify({ 
          error: "feed_url is required",
          usage: {
            feed_url: "URL to JSON or XML feed",
            feed_type: "json | xml (default: auto-detect)",
            field_mapping: "Optional custom field mapping",
            dry_run: "If true, don't save to database (default: false)",
          },
          default_mapping: DEFAULT_FIELD_MAPPING,
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch feed
    console.log("Fetching feed from:", config.feed_url);
    const feedResponse = await fetch(config.feed_url);
    
    if (!feedResponse.ok) {
      throw new Error(`Failed to fetch feed: ${feedResponse.status} ${feedResponse.statusText}`);
    }

    const feedText = await feedResponse.text();
    console.log("Feed fetched, size:", feedText.length, "bytes");

    // Determine feed type
    const feedType = config.feed_type || 
      (feedText.trim().startsWith('<') ? 'xml' : 'json');
    
    console.log("Detected feed type:", feedType);

    // Parse feed
    let items: any[];
    if (feedType === 'xml') {
      items = parseXmlToJson(feedText);
    } else {
      const parsed = JSON.parse(feedText);
      items = Array.isArray(parsed) ? parsed : parsed.items || parsed.data || [];
    }

    console.log("Parsed items count:", items.length);
    result.total = items.length;

    // Get field mapping
    const mapping = { ...DEFAULT_FIELD_MAPPING, ...config.field_mapping };

    // Process each item
    for (const item of items) {
      try {
        const complexData = transformItem(item, mapping);
        
        if (!complexData.name || !complexData.slug) {
          result.skipped++;
          result.errors.push(`Skipped item: missing name or slug`);
          continue;
        }

        console.log("Processing complex:", complexData.name);

        if (config.dry_run) {
          console.log("Dry run - would save:", complexData);
          result.created++;
          continue;
        }

        // Check if complex exists
        const { data: existing } = await supabase
          .from('residential_complexes')
          .select('id')
          .eq('slug', complexData.slug)
          .maybeSingle();

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('residential_complexes')
            .update(complexData)
            .eq('id', existing.id);

          if (error) throw error;
          result.updated++;
          console.log("Updated complex:", complexData.name);
        } else {
          // Create new
          const { error } = await supabase
            .from('residential_complexes')
            .insert({
              ...complexData,
              is_published: false, // New imports are unpublished by default
            });

          if (error) throw error;
          result.created++;
          console.log("Created complex:", complexData.name);
        }
      } catch (itemError) {
        const errorMsg = itemError instanceof Error ? itemError.message : String(itemError);
        result.errors.push(`Error processing item: ${errorMsg}`);
        console.error("Error processing item:", itemError);
      }
    }

    result.success = result.errors.length === 0;

    console.log("Import completed:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
