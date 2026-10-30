import express from 'express';
import path from "path";
import 'dotenv/config';
import wikipedia from "./components/wikipedia/wikipedia.js";
import unsplash from './components/unsplash/unsplash.js';
import geoapify from './components/geoapify/geoapify.js';


const __dirname = import.meta.dirname;
const app = express();
const PORT = process.env.PORT || 8888;
// Set up view engine and static files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// Search route - fetching 3 APIs in parallel
app.get("/search", async (req, res) => {
    const place = req.query.place;

    if (!place) {
        // If no place is provided, redirect to home
        return res.redirect("/");
    }

    try {
        // Run calls in parallel for optimal speed
        const [wikiData, photoData, geoData] = await Promise.all([
            wikipedia.getPlaceSummary(place),
            unsplash.getPlacePhoto(place),
            geoapify.getGeocodeAndPlaces(place)
        ]);
        // Render the results page with the fetched data
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
// Start the server
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
