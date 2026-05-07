const express = require("express");
require("dotenv").config();

var session = require("express-session");
const FileStore = require("session-file-store")(session);

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const mongoose = require("mongoose");
const mongoDbUrl = process.env.MONGODB_URL;

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
});
const userModel = mongoose.model("users", userSchema);

const favoritesSchema = new mongoose.Schema({
    username: String,
    pokeName: String,
});
const favoritesModel = mongoose.model("favorites", favoritesSchema);

const timelineSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    username: String,
});
const timelineModel = mongoose.model("timeline", timelineSchema);

main().catch((err) => console.log(err));

const app = express();
const SECRET = process.env.SECRET;

app.use(
    session({
        store: new FileStore(),
        secret: SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
        },
    })
);

app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.redirect("/home");
});

const AUTH_MODES = {
    LOG_IN: "login",
    REGISTER: "register",
};

app.get("/login", (req, res) => {
    res.render("auth.ejs", { mode: AUTH_MODES.LOG_IN });
});

app.get("/register", (req, res) => {
    res.render("auth.ejs", { mode: AUTH_MODES.REGISTER });
});

function handleRememberMe(req) {
    const { rememberMe } = req.body;
    if (rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 100;
    } else {
        req.session.cookie.maxAge = null;
    }
}

/* Account */
app.post("/register", async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await userModel.create({
            username: username,
            password: hashedPassword,
        });
        handleRememberMe(req);
        return res.redirect("/home");
    } catch (error) {
        return res.status(400).send("Registration failed");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username: username });
    if (!user) {
        return res.send("No matching user found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
        req.session.username = user.username;
        handleRememberMe(req);
        await addToTimeline("Login", "User logged in", new Date(), req.session.username);
        return res.redirect("/home");
    } else {
        return res.send("Invalid credentials");
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        return res.redirect("/login");
    }
}
app.use(isAuthenticated);
/* REQUIRES AUTHENTICATION BELOW */

app.get("/home", (req, res) => {
    res.render("home.ejs", { username: req.session.username });
});

async function main() {
    await mongoose.connect(mongoDbUrl);
}

app.get("/favorites", async (req, res) => {
    try {
        const favoritesFound = await favoritesModel.find({
            username: req.session.username,
        });
        res.json(favoritesFound);
    } catch (error) {
        res.status(403).send("Bad get favorites");
    }
});

app.get("/addToFavorites/:pokemonName", async (req, res) => {
    try {
        const favoritesFound = await favoritesModel.create({
            username: req.session.username,
            pokeName: req.params.pokemonName,
        });
        addToTimeline("Added Favorite", req.params.pokemonName, new Date(), req.session.username);
        res.json(favoritesFound);
    } catch (error) {
        console.log(error);
        res.status(403).send("Bad post favorites");
    }
});

app.get("/user-json", async (req, res) => {
    try {
        const user = await userModel.findOne({
            username: req.session.username,
        });
        res.json(user);
    } catch (error) {
        console.log("error", error);
    }
});

app.get("/timeline", async (req, res) => {
    try {
        const timeline = await timelineModel.find({
            username: req.session.username,
        });
        res.json(timeline);
    } catch (error) {
        console.log("error", error);
    }
});

const addToTimeline = async (title, description, date, username) => {
    try {
        const result = await timelineModel.create({
            title,
            description,
            date,
            username,
        });
        return result;
    } catch (error) {
        console.log("db error", error);
    }
};

app.get("/account", (req, res) => {
    res.render("account.ejs", { username: req.session.username });
});

function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error", err);
            return res.redirect("/home");
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
}

app.post("/logout", async (req, res) => {
    logoutUser(req, res);
});

app.post("/delete-account", async (req, res) => {
    try {
        const username = req.session.username;
        const response = await userModel.deleteOne({ username: username });
        if (!response) {
            return res.send("Could not find user in database");
        }

        await favoritesModel.deleteMany({ username: username });
        await timelineModel.deleteMany({ username: username });

        logoutUser(req, res);
    } catch {
        console.error(error);
        return res.status(500).send("Error deleting account");
    }
});
