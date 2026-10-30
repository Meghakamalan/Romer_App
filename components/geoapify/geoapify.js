import 'dotenv/config';

async function getGeocodeAndPlaces(place) {
    try {
        const apiKey = process.env.GEOAPIFY_API_KEY;
        // Geocode the place name to get coordinates
        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(place)}&apiKey=${apiKey}`;
        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) {
            throw new Error(`Geoapify Geocoding Error: ${geoRes.status}`);
        }
        const geoData = await geoRes.json();
        if (!geoData.features || geoData.features.length === 0) {
            return null;
        }
        const location = geoData.features[0].properties;
        const lon = location.lon;
        const lat = location.lat;
        // Fetch Points of Interest around these coordinates (catering, tourism, accommodation)
        const categories = 'catering,tourism,entertainment,accommodation';
        const placesUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},5000&limit=12&apiKey=${apiKey}`;

        const placesRes = await fetch(placesUrl);
        if (!placesRes.ok) {
            throw new Error(`Geoapify Places Error: ${placesRes.status}`);
        }
        const placesData = await placesRes.json();

        const poiList = placesData.features.map(item => ({
            name: item.properties.name || "Unnamed Attraction",
            category: item.properties.categories[0]?.replace('.', ' ') || 'Point of Interest',
            address: item.properties.formatted,
            lat: item.properties.lat,
            lon: item.properties.lon
        })).filter(poi => poi.name !== "Unnamed Attraction");
        return {
            coordinates: { lat, lon },
            city: location.city || location.name,
            country: location.country,
            places: poiList
        };
    } catch (error) {
        console.error("Geoapify Fetch Error:", error.message);
        return null;
    }
}

export default { getGeocodeAndPlaces };