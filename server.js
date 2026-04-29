const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/* Send a 204 No Content Found when the browser asks for a tab icon */
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
