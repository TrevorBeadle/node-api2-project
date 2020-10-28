const express = require("express");
const router = express.Router();
const Posts = require("../data/db");

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json({ data: posts });
    })
    .catch(error => {
      res.status(500).json({ message: "Error retrieving posts" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length) {
        console.log(post);
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the post" });
    });
});

router.post("/", (req, res) => {
  Posts.insert(req.body)
    .then(post => {
      console.log(post);
      if (post) {
        res.status(201).json(post);
      } else {
        res
          .status(400)
          .json({ message: "Please provide title and contents for the post." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "There was an error while saving the post to the database",
      });
    });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "Post has been removed" });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(post => {
      if (post) {
        console.log(post);
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The post information could not be modified" });
    });
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  const comments = await Posts.findPostComments(id);
  try {
    if (post.length) {
      comments.length
        ? res.status(200).json(comments)
        : res
            .status(200)
            .json({ message: "There are no comments for this post" });
    } else {
      res.status(404).json({ message: "No post could be found with given ID" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The post information could not be retrieved" });
  }
});

router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  const comment = await Posts.insertComment(req.body);
  try {
    if (post.length) {
      comment
        ? res.status(201).json({ data: comment })
        : res.status(400).json({
            message: "Please provide text and post_id for the comment",
          });
    } else {
      res.status(404).json({ message: "No post could be found with given ID" });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while saving the comment to the database",
    });
  }
});

module.exports = router;
