/* EXPRESS */
const express = require("express");
var session = require("express-session");

const app = express();
const PORT = 3000;

app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.urlencoded());
const usersArr = [
  { username: "admin1", password: "admin1" },
  { username: "admin2", password: "admin2" },
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
  { username: "user3", password: "password3" }
];

app.post("/login", (req, res) => {
    const userFound = usersArr.find(
        element => element.username == req.body.username 
        && element.password == req.body.password
    );

    if (userFound) {
        req.session.username = req.body.username;
        res.redirect("/home");
    } else {
        res.status(401)
        .send("Bad attempt. You are not going to get any of this soup!");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/* Send a 204 No Content Found when the browser asks for a tab icon */
app.get("/favicon.ico", (req, res) => res.status(204).end());


app.get("/", (req, res) => {
    res.redirect("/home");
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
    res.render("home.ejs", {
        username: req.session.username
    })
})



/* MONGOOSE */
const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
    username: String,
    pokeName: String,
});
const favoritesModel = mongoose.model("favorites", favoritesSchema);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    // await mongoose.connect("mongodb://user:password@127.0.0.1:27017/test"); for auth
}

app.get("/favorites", async (req, res) => {
    try {
        const favoritesFound = await favoritesModel.find({ username: req.session.username })
        res.json(favoritesFound)
    } catch (error) {
        console.log(error)
        res.status(403).send("What favorites?")
    }
});

app.get("/addToFavorites/:pokemonName", async (req, res) => {
    try {
        const favoritesFound = await favoritesModel.create({
            username: req.session.username,
            pokeName: req.params.pokemonName
        });
        res.json(favoritesFound);
    } catch (error) {
        res.status(403).send("Bad post favs");
    }
});
