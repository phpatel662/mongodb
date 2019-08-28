//Scraping
const cheerio = require("cheerio");
const axios = require("axios");

//request logging
const logger = require("morgan");

//server/db stuff
const express = require("express");
const mongoose = require("mongoose");

//set up server
const app = express();
const PORT = process.env.PORT || 3000;

//set up db
const db = require("./models");

//set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoscraper";
mongoose.connect(MONGODB_URI);



app.get("/", (req, res) => {
    axios.get("https://www.nytimes.com/section/science").then(response => {
        const $ = cheerio.load(response.data);


        $("h2").each((i, element) => {
            const result = {};
            result.title = $(element).children().text();
            result.summary = $(element).next().text();
            result.href = "https://www.nytimes.com/" + $(element).children().attr("href");
            result.imgSrc = $(element).parent().prev().find("img").attr("src");
            console.log(result);
            db.Article.create(result)
                .then(dbArticle => console.log(dbArticle))
                .catch(err => console.log(err));
        });
    });
    res.redirect("/articles");


});

app.get("/articles", (req, res) => {

        db.Article.find({})
            .then(data => {

                const hbarsObj = {
                    article: data
                }
                res.render("index",hbarsObj);
            })
            .catch(err => res.json(err));
});

app.get("/articles/:id", (req, res) =>{
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then( dbArticle => res.json(dbArticle))
        .catch( err => res.json(err));
});

app.post("/articles/:id", (req, res) => {
    console.log("here");
    console.log(req.body);
    db.Note.create(req.body)
        .then( dbNote =>  db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {notes: {note: dbNote.note}} }, { new: true })
        )
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
