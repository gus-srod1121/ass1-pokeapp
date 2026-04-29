const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));



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
        res.send(`Welcome ${req.body.username}`);
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

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
