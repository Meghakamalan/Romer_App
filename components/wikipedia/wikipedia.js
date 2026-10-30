async function getPlaceSummary(place) {
    try {
        // Fetch summary and image from Wikipedia API
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(place)}&prop=extracts|pageimages|info&inprop=url&exintro=true&explaintext=true&pithumbsize=800&format=json&origin=*`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Wikipedia API Error: ${response.status}`);
        }
        const data = await response.json();
        // The pages object uses the page ID as its key
        const pages = data.query.pages;
        const page = Object.values(pages)[0];
        // If Wikipedia doesn't find a page
        if (page.missing !== undefined) {
            return null;
        }
        return {
            title: page.title,
            description: page.extract,
            image: page.thumbnail ? page.thumbnail.source : null,
            article: page.fullurl
        };
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export default {
    getPlaceSummary
};