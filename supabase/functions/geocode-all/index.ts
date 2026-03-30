import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const apiKey = Deno.env.get('YANDEX_GEOCODER_API_KEY');

    if (!apiKey) {
      console.error('YANDEX_GEOCODER_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Geocoder API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get complexes without coordinates
    const { data: complexes, error: fetchError } = await supabase
      .from('residential_complexes')
      .select('id, name, address, city')
      .is('coordinates', null)
      .not('address', 'is', null);

    if (fetchError) {
      console.error('Error fetching complexes:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${complexes?.length || 0} complexes without coordinates`);

    const results: { id: string; name: string; success: boolean; error?: string }[] = [];

    for (const complex of complexes || []) {
      try {
        // Build full address including city
        const fullAddress = complex.city 
          ? `${complex.city}, ${complex.address}` 
          : complex.address;

        console.log(`Geocoding: ${complex.name} - ${fullAddress}`);

        const encodedAddress = encodeURIComponent(fullAddress);
        const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodedAddress}`;

        const response = await fetch(geocodeUrl);
        const data = await response.json();

        const geoObject = data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

        if (!geoObject?.Point?.pos) {
          console.log(`No coordinates found for: ${complex.name}`);
          results.push({ id: complex.id, name: complex.name, success: false, error: 'Address not found' });
          continue;
        }

        const [lng, lat] = geoObject.Point.pos.split(' ').map(Number);
        
        console.log(`Found coordinates for ${complex.name}: ${lat}, ${lng}`);

        // Update complex with coordinates
        const { error: updateError } = await supabase
          .from('residential_complexes')
          .update({ coordinates: { lat, lng } })
          .eq('id', complex.id);

        if (updateError) {
          console.error(`Error updating ${complex.name}:`, updateError);
          results.push({ id: complex.id, name: complex.name, success: false, error: updateError.message });
        } else {
          results.push({ id: complex.id, name: complex.name, success: true });
        }

        // Rate limiting - wait 200ms between requests
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (err) {
        console.error(`Error geocoding ${complex.name}:`, err);
        results.push({ 
          id: complex.id, 
          name: complex.name, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Geocoding complete: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({ 
        message: `Geocoded ${successCount} complexes, ${failCount} failed`,
        total: complexes?.length || 0,
        success: successCount,
        failed: failCount,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Geocode-all error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
