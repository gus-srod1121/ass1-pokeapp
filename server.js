require("dotenv").config();

const express = require("express");
var session = require("express-session");
const mongoose = require("mongoose");
const mongoDbUrl = process.env.MONGODB_URL;

const favoritesSchema = new mongoose.Schema({
    username: String,
    pokeName: String,
});
const favoritesModel = mongoose.model("favorites", favoritesSchema);
const timelineSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    username: String
});
const timelineModel = mongoose.model('timeline', timelineSchema);

main().catch(err => console.log(err));

const app = express();

app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const PORT = process.env.PORT;

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.use(express.static("public"));

const usersArr = [
    { username: "admin1", password: "admin1" },
    { username: "admin2", password: "admin2" },
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
    { username: "user3", password: "password3" }
];

app.use(express.urlencoded());

app.post("/login", (req, res) => {
    const userFound = usersArr.find(element => element.username === req.body.username && element.password === req.body.password);

    if (userFound) {
        req.session.username = req.body.username;
        addToTimeline("Login", "User logged in", new Date(), req.session.username);
        res.redirect("/home");
    } else {
        res.status(401).send("Bad attempt. No Soup for you!");
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.redirect("/login.html");
    }
}

app.use(isAuthenticated);
app.get("/home", (req, res) => {
    res.render("home.ejs", { username: req.session.username });
})

async function main() {
    await mongoose.connect(mongoDbUrl);
}

app.get("/favorites", async (req, res) => {
    try {
        const favoritesFound = await favoritesModel.find({ username: req.session.username });
        res.json(favoritesFound);
    } catch (error) {
        res.status(403).send("Bad get favorites");
    }
})

app.get("/addToFavorites/:pokemonName", async (req, res) => {
    try {
        const favoritesFound = await favoritesModel.create({ 
            username: req.session.username,
            pokeName: req.params.pokemonName 
        });
        addToTimeline("Added Favorite", req.params.pokemonName, new Date(), req.session.username);
        res.json(favoritesFound);
    } catch (error) {
        console.log(error);
        res.status(403).send("Bad post favorites");
    }
});

app.get('/timeline', async (req, res) => {
    try {
        const timelineFound = await timelineModel.find({ username: req.session.username });
        res.json(timelineFound);
    } catch (error) {
        console.log('db error', error);
    }
});

const addToTimeline = async (title, description, date, username) => {
    try {
        const result = await timelineModel.create({ title, description, date, username });
        return result;
    } catch (error) {
        console.log('db error', error);
    }
}
