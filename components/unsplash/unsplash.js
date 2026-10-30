import 'dotenv/config';
async function getPlacePhoto(place) {
    try {
        const apiKey = process.env.UNSPLASH_ACCESS_KEY;
        // Fetch a photo related to the place from Unsplash
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(place)}&per_page=1&orientation=landscape&client_id=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Unsplash API Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const photo = data.results[0];
            return {
                url: photo.urls.regular,
                alt: photo.alt_description || place,
                photographer: photo.user.name,
                photographerUrl: photo.user.links.html
            };
        }
        return null;
    } catch (error) {
        console.error("Unsplash Fetch Error:", error.message);
        return null;
    }
}
export default {
    getPlacePhoto
};