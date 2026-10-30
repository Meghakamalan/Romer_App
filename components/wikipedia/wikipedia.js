async function getPlaceSummary(place) {
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(place)}&prop=extracts|pageimages|info&inprop=url&exintro=true&explaintext=true&pithumbsize=800&format=json&origin=*`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Wikipedia API Error: ${response.status}`);
        }
        const data = await response.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0];
        
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

// Change this to a named export:
export { getPlaceSummary };