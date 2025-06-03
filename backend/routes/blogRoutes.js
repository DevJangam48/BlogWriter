const express = require("express");
const Blog = require("../models/Blog");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Public: Get all blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ date: -1 });
  res.json(blogs);
});

// Public: Get one blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

// Private: Create blog
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const blog = new Blog({
    title,
    content,
    author: req.user.username,
    userId: req.user.userId,
  });
  await blog.save();
  res.status(201).json(blog);
});

// Private: Get user's blogs
router.get("/user/all", auth, async (req, res) => {
  const blogs = await Blog.find({ userId: req.user.userId }).sort({ date: -1 });
  res.json(blogs);
});

// Private: Update blog
router.put("/:id", auth, async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(blog);
});

// Private: Delete blog
router.delete("/:id", auth, async (req, res) => {
  await Blog.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.json({ msg: "Blog deleted" });
});

module.exports = router;
