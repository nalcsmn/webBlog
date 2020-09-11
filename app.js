const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent =
  "More than 2 billion people over 180 countries use Daily Journal to stay in touch with friends and family, anytime and anywhere, see what people are talking about and what they have been doing in their daily lives. Daily Journal brings you closer to people and things you love to do. Daily Journal is a free for everyone. ";
const aboutContent =
  "Daily Journal was founded by Neil Lacsamana and Janelle Iglesias in 2020. Daily Journal continues to work fast and reliably anywhere in the world. We put people first, and value craft and simplicity in our work. Our team inspire creativity around the world by sharing their daily lives to everyone and helping over billions of people to share and to be inspired.";
const contactContent =
  "For all questions related to Daily Journal, contact us with our email address DJoural@gmail.com";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      postId: requestedPostId,
      title: post.title,
      content: post.content,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/delete", function (req, res) {
  res.render("delete");
});

app.post("/delete", function (req, res) {
  const titleToBeDeleted = req.body.postIdDeleted;

  Post.deleteOne({ title: titleToBeDeleted }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/update", function (req, res) {
  res.render("update");
});

app.post("/update", function (req, res) {
  

  const titleID = req.body.titleId;
  const titleUpdated = req.body.titleToBeUpdated;
  const contentUpdated = req.body.contentToBeUpdated;
  Post.updateOne(
    { _id: titleID },
    { title: titleUpdated },
    { content: contentUpdated },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Succesfully updated");

        res.redirect("/");
      }
    }
  );
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
