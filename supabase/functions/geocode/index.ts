import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('YANDEX_GEOCODER_API_KEY');
    if (!apiKey) {
      console.error('YANDEX_GEOCODER_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Geocoder API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodedAddress}`;

    console.log('Geocoding address:', address);

    const response = await fetch(geocodeUrl);
    const data = await response.json();

    console.log('Yandex Geocoder response:', JSON.stringify(data));

    const geoObject = data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
    
    if (!geoObject) {
      return new Response(
        JSON.stringify({ error: 'Address not found', coordinates: null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pos = geoObject.Point?.pos;
    if (!pos) {
      return new Response(
        JSON.stringify({ error: 'Coordinates not found', coordinates: null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [lng, lat] = pos.split(' ').map(Number);
    const formattedAddress = geoObject.metaDataProperty?.GeocoderMetaData?.text || address;

    console.log('Geocoded coordinates:', { lat, lng, formattedAddress });

    return new Response(
      JSON.stringify({ 
        coordinates: { lat, lng },
        formattedAddress 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Geocode error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
