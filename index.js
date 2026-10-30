import express from 'express';
import path from "path";
import 'dotenv/config';
import wikipedia from "./components/wikipedia/wikipedia.js";
import unsplash from './components/unsplash/unsplash.js';
import geoapify from './components/geoapify/geoapify.js';

const app = express();
const PORT = process.env.PORT || 8888;

// Use process.cwd() for robust path resolution in both local and serverless environments
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// Search route - fetching 3 APIs in parallel
app.get("/search", async (req, res) => {
    const place = req.query.place;

    if (!place) {
        return res.redirect("/");
    }

    try {
        const [wikiData, photoData, geoData] = await Promise.all([
            wikipedia.getPlaceSummary(place),
            unsplash.getPlacePhoto(place),
            geoapify.getGeocodeAndPlaces(place)
        ]);
        res.render("results", {
            title: place,
            wiki: wikiData,
            photo: photoData,
            geo: geoData
        });
    } catch (error) {
        console.error("Search Handler Error:", error);
        res.render("results", { title: place, wiki: null, photo: null, geo: null });
    }
});

// Only start the listener if running locally (Netlify Serverless handles this via serverless-http)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
}

export default app;