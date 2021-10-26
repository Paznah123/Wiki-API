const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ========================== */

const url = 'mongodb://localhost:27017/wikiDB';

mongoose.connect(url, { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

/* ========================== */

app.route('/articles')
    // get all articles
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) res.send(foundArticles);
            else res.send(err);
        })
    })
    // create new artice
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save((err) => {
            if (!err) res.send("Added article to DB");
            else res.send(err);
        });
    })
    // delete all articles
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) res.send("Deleted all articles from DB");
            else res.send(err);
        });
    });

/* ========================== */

app.route('/articles/:articleTitle')
    // get specific article
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) res.send(foundArticle);
            else res.send("No articles matching that title.");
        })
    })
    // update specific article
    .put((req, res) => {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err, results) => { if (!err) res.send("Updated article."); });
    })
    // update specific article field
    .patch((req, res) => {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err, results) => {
                if (!err) res.send("Updated article."); 
                else res.send(err);
            }
        );
    })
    // delete specific article
    .delete((req, res) => {
        Article.deleteOne(
            { title: req.param.articleTitle },
            (err) => {
                if (!err) res.send("Deleted article.");
                else res.send(err);
            }
        );
    });

/* ========================== */

app.listen(3000, () => { console.log("Server started on port 3000"); });