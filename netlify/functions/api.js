import serverless from 'serverless-http';
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';

// Import your routes/components (adjust relative paths based on where netlify/functions/ is located)
import wikipedia from "../../components/wikipedia/wikipedia.js";
import unsplash from '../../components/unsplash/unsplash.js';
import geoapify from '../../components/geoapify/geoapify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Point views and static directories relative to the root project folder
app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "../../public")));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// Search route
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

// Export wrapped for Netlify Serverless Functions
export const handler = serverless(app);