import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.jikan.moe/v4"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/search", async (req, res) => {
    const { body: { search: anime } } = req;
    const { body: { page: currentPage } } = req;
    try {
        const result = await axios.get(`${API_URL}/anime?q=${anime}&page=${currentPage}`);
        const { data: { data }} = result;
        const { data: { pagination: { last_visible_page: pages } }} = result;
        res.render("index.ejs", { 
            search: data,
            pages: pages,
            anime: anime,
            currentPage: currentPage,
        });
    } catch (error) {
        res.status(400);
        
    };
})

app.post("/random", async (req, res) => {
    try {
        const result = await axios.get(`${API_URL}/random/anime`);
        const { data: { data } } = result;
        res.render("index.ejs", { content: data });
    } catch (error) {
        res.status(400);
    };
})

app.post("/anime", async (req, res) => {
    const { body: { animeID }} = req;
    try {
        const result = await axios.get(`${API_URL}/anime/${animeID}`);
        const { data: { data } } = result;
        res.render("index.ejs", { content: data });
    } catch (error) {
        res.status(400);
    }
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});